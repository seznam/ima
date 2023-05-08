import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

import { Environment } from '@ima/core';
import { logger } from '@ima/dev-utils/logger';
import { environmentFactory } from '@ima/server';
import chalk from 'chalk';
import { Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';

import webpackConfig from './config';
import { ImaConfigurationContext, ImaConfig, ImaCliArgs } from '../types';

const IMA_CONF_FILENAME = 'ima.config.js';

/**
 * Helper for finding rules with given loader in webpack config.
 */
export function findRules(
  config: Configuration,
  testString: string,
  loader?: string
): RuleSetRule[] | RuleSetUseItem[] {
  const foundRules = [];
  const rules = config.module?.rules;

  if (!rules) {
    return [];
  }

  (function recurseFindRules(rule: RuleSetRule | RuleSetRule[]): void {
    if (Array.isArray(rule)) {
      for (const r of rule) {
        recurseFindRules(r);
      }

      return;
    }

    if (rule.oneOf) {
      return recurseFindRules(rule.oneOf);
    }

    if (
      rule.test &&
      ((typeof rule.test === 'function' && rule.test(testString)) ||
        (rule.test instanceof RegExp && rule.test.test(testString)) ||
        (typeof rule.test === 'string' && rule.test === testString))
    ) {
      foundRules.push(rule);
    }
  })(rules as RuleSetRule[]);

  if (!loader) {
    return foundRules;
  }

  return foundRules.reduce<RuleSetUseItem[]>((acc, cur) => {
    if (
      (cur.loader && cur.loader.includes(loader)) ||
      (typeof cur.use === 'string' && cur.use.includes(loader))
    ) {
      acc.push(cur);
    }

    cur;

    if (Array.isArray(cur.use)) {
      cur.use.forEach(r => {
        if (
          (typeof r === 'string' && r.includes(loader)) ||
          (typeof r === 'object' && r.loader && r.loader.includes(loader))
        ) {
          acc.push(r);
        }
      });
    }

    return acc;
  }, []);
}

/**
 * Loads application IMA.js environment from server/config/environment.js
 *
 * @param {ImaCliArgs['rootDir']} rootDir Application root directory
 * @returns {Environment} Loaded environment
 */
function resolveEnvironment(
  rootDir: ImaCliArgs['rootDir'] = process.cwd()
): Environment {
  return environmentFactory({ applicationFolder: rootDir });
}

/**
 * Returns polyfill entry point for current es version if the file exists.
 * The function looks for app/polyfill.js and app/polyfill.es.js files.
 *
 * @param {ImaConfigurationContext} ctx Current configuration context.
 * @returns {Record<string, string>} Entry object or empty object.
 */
function createPolyfillEntry(
  ctx: ImaConfigurationContext
): Record<string, string> {
  const { isClientES, rootDir } = ctx;

  const fileName = `polyfill${isClientES ? '.es' : ''}.js`;
  const polyfillPath = path.join(rootDir, 'app', fileName);

  if (!fs.existsSync(polyfillPath)) {
    return {};
  }

  return { polyfill: `app/${fileName}` };
}

/**
 * Creates hmr dev server configuration from provided contexts
 * and arguments with this priority args -> ctx -> imaConfig -> [defaults].
 */
function createDevServerConfig({
  args,
  ctx,
  imaConfig,
}: {
  args?: ImaCliArgs;
  ctx?: ImaConfigurationContext;
  imaConfig: ImaConfig;
}): {
  port: number;
  hostname: string;
  publicUrl: string;
} {
  const port = args?.port ?? ctx?.port ?? imaConfig?.devServer?.port ?? 3101;
  const hostname =
    args?.hostname ??
    ctx?.hostname ??
    imaConfig?.devServer?.hostname ??
    'localhost';
  let publicUrl =
    args?.publicUrl ?? ctx?.publicUrl ?? imaConfig?.devServer?.publicUrl;

  // Clean public url (remove last slash)
  publicUrl = publicUrl ?? `${hostname}:${port}`;
  publicUrl = publicUrl?.replace(/\/$/, '');

  // Preppend http
  if (!publicUrl?.startsWith('http')) {
    publicUrl = `http://${publicUrl}`;
  }

  return {
    port,
    hostname,
    publicUrl,
  };
}

/**
 * Creates hash representing current webpack environment.
 *
 * @param {ImaConfigurationContext} ctx Current configuration context.
 * @param {ImaConfig} imaConfig ima configuration
 * @returns {string}
 */
function createCacheKey(
  ctx: ImaConfigurationContext,
  imaConfig: ImaConfig,
  additionalData = {}
): string {
  const hash = createHash('md5');

  // Get Plugins CLI args
  const pluginsEnv: Record<string, unknown> = {};
  const pluginsCtxArgs = imaConfig?.plugins
    ?.map(plugin => Object.keys(plugin?.cliArgs?.[ctx.command] || {}))
    .flat();

  // Generate additional env cache dependencies from plugin cli args
  if (pluginsCtxArgs) {
    for (const pluginArgName of pluginsCtxArgs) {
      // @ts-expect-error these args are not in interface
      pluginsEnv[pluginArgName] = ctx[pluginArgName];
    }
  }

  /**
   * Use only variables that don't change webpack config in any way
   * but require clean cache state. Variables that change webpack config
   * are handled by webpack itself sine it caches the config file.
   */
  hash.update(
    JSON.stringify({
      command: ctx.command,
      legacy: ctx.legacy,
      forceLegacy: ctx.forceLegacy,
      profile: ctx.profile,
      rootDir: ctx.rootDir,
      environment: ctx.environment,
      reactRefresh: ctx.reactRefresh,
      verbose: ctx.verbose,
      ...additionalData,
      ...pluginsEnv,
    })
  );

  return hash.digest('hex');
}

/**
 * Requires imaConfig from given root directory (default to cwd).
 *
 * @param {string} [rootDir=process.cwd()] App root directory.
 * @returns {ImaConfig | null} Config or null in case the config file doesn't exits.
 */
function requireImaConfig(rootDir = process.cwd()): ImaConfig | null {
  const imaConfigPath = path.join(rootDir, IMA_CONF_FILENAME);

  return fs.existsSync(imaConfigPath) ? require(imaConfigPath) : null;
}

/**
 * Resolves ima.config.js from rootDir base path with DEFAULTS.
 *
 * @param {ImaCliArgs} args CLI args.
 * @returns {Promise<ImaConfig>} Ima config or empty object.
 */
async function resolveImaConfig(args: ImaCliArgs): Promise<ImaConfig> {
  const defaultImaConfig: ImaConfig = {
    publicPath: '/',
    compress: true,
    languages: {
      cs: ['./app/**/*CS.json'],
      en: ['./app/**/*EN.json'],
    },
    imageInlineSizeLimit: 8192,
    watchOptions: {
      ignored: ['**/node_modules'],
      aggregateTimeout: 5,
    },
    swc: async config => config,
    swcVendor: async config => config,
    postcss: async config => config,
    cssBrowsersTarget: '>0.3%, not dead, not op_mini all',
  };

  const imaConfig = requireImaConfig(args.rootDir);
  const imaConfigWithDefaults = {
    ...defaultImaConfig,
    ...imaConfig,
    watchOptions: {
      ...defaultImaConfig.watchOptions,
      ...imaConfig?.watchOptions,
    },
    experiments: {
      ...defaultImaConfig.experiments,
      ...imaConfig?.experiments,
    },
  };

  // Print loaded plugins info
  if (
    Array.isArray(imaConfigWithDefaults.plugins) &&
    imaConfigWithDefaults.plugins.length
  ) {
    const pluginNames: string[] = [];
    logger.info(`Loaded CLI plugins: `, { newLine: false });

    for (const plugin of imaConfigWithDefaults.plugins) {
      pluginNames.push(chalk.blue(plugin.name));
    }

    logger.write(pluginNames.join(', '));
  }

  // Normalize publicPath
  imaConfigWithDefaults.publicPath +=
    !imaConfigWithDefaults.publicPath.endsWith('/') ? '/' : '';

  return imaConfigWithDefaults;
}

/**
 * Takes care of cleaning build directory and node_modules/.cache
 * directory based on passed cli arguments.
 */
async function cleanup(args: ImaCliArgs): Promise<void> {
  // Clear cache before doing anything else
  if (args.clearCache) {
    const cacheDir = path.join(args.rootDir, '/node_modules/.cache');

    logger.info(
      `Clearing cache at ${chalk.magenta(
        cacheDir.replace(args.rootDir, '.')
      )}...`,
      { trackTime: true }
    );
    await fs.promises.rm(cacheDir, { force: true, recursive: true });
    logger.endTracking();
  }

  // Clear output directory
  if (args.clean) {
    logger.info('Cleaning the build directory...', { trackTime: true });
    const outputDir = path.join(args.rootDir, 'build');

    if (!fs.existsSync(outputDir)) {
      logger.info('The build directory is already empty');
      return;
    }

    await fs.promises.rm(outputDir, { recursive: true });
    logger.endTracking();
  } else {
    // Clean at least hot directory silently
    await fs.promises.rm(path.join(args.rootDir, 'build/hot'), {
      recursive: true,
      force: true,
    });
  }
}

/**
 * Runs one of optional ima plugin hooks defined on existing plugins.
 *
 * @param {ImaCliArgs} args Parsed CLI and build arguments.
 * @param {ImaConfig} imaConfig Loaded ima config.
 * @param hook
 */
async function runImaPluginsHook(
  args: ImaCliArgs,
  imaConfig: ImaConfig,
  hook: 'preProcess' | 'postProcess'
): Promise<void> {
  if (!Array.isArray(imaConfig.plugins) || !imaConfig.plugins.length) {
    return;
  }

  // Filter plugins with given hook
  const filteredPlugins = imaConfig.plugins.filter(
    plugin => typeof plugin[hook] === 'function'
  );

  if (!filteredPlugins.length) {
    return;
  }

  logger.info(`Running ${chalk.magenta(hook)} hook on ima plugins...`);

  // Run plugin hook
  for (const plugin of filteredPlugins) {
    await plugin?.[hook]?.(args, imaConfig);
  }
}

/**
 * Generate configuration contexts for given array of configuration names.
 * Contexts are generated based on ima.config.js file and CLI arguments.
 *
 * @param {ImaConfigurationContext['name'][]} configurationNames
 * @param {ImaCliArgs} args
 * @param {ImaConfig} imaConfig
 * @returns {ImaConfigurationContext[]}
 */
function createContexts(
  configurationNames: ImaConfigurationContext['name'][],
  args: ImaCliArgs,
  imaConfig: ImaConfig
): ImaConfigurationContext[] {
  const { rootDir, environment, command } = args;
  const useSourceMaps =
    !!imaConfig.sourceMaps || args.environment === 'development';
  const imaEnvironment = resolveEnvironment(rootDir);
  const appDir = path.join(rootDir, 'app');
  const useTypescript = fs.existsSync(path.join(rootDir, './tsconfig.json'));
  const lessGlobalsPath = path.join(rootDir, 'app/less/globals.less');
  const isDevEnv = environment === 'development';
  const mode = environment === 'production' ? 'production' : 'development';
  const devtool = useSourceMaps
    ? typeof imaConfig.sourceMaps === 'string'
      ? imaConfig.sourceMaps
      : 'source-map'
    : false;

  // es2018 targets (taken from 'browserslist-generator')
  const targets = [
    'and_chr >= 63',
    'chrome >= 63',
    'and_ff >= 58',
    'android >= 103',
    'edge >= 79',
    'samsung >= 8.2',
    'safari >= 11.1',
    'ios_saf >= 11.4',
    'opera >= 50',
    'firefox >= 58',
  ];

  return configurationNames.map(name => ({
    ...args,
    name,
    isServer: name === 'server',
    isClient: name === 'client',
    isClientES: name === 'client.es',
    processCss: name === 'client.es',
    outputFolders: {
      hot: 'static/hot',
      public: 'static/public',
      media: 'static/media',
      css: 'static/css',
      js:
        name === 'server'
          ? 'server'
          : name === 'client'
          ? 'static/js'
          : 'static/js.es',
    },
    useTypescript,
    imaEnvironment,
    appDir,
    useHMR: command === 'dev' && name === 'client.es',
    mode,
    isDevEnv,
    lessGlobalsPath,
    useSourceMaps,
    devtool,
    targets: name === 'client' ? targets : [],
  }));
}

/**
 * Creates webpack configurations contexts from current config and cli args.
 * Additionally it applies all existing configuration overrides from cli plugins
 * and app overrides in this order cli -> plugins -> app.
 *
 * @param {ImaCliArgs} args Parsed CLI and build arguments.
 * @param {ImaConfig} imaConfig Loaded ima config.
 * @returns {Promise<Configuration[]>}
 */
async function createWebpackConfig(
  args: ImaCliArgs,
  imaConfig: ImaConfig
): Promise<Configuration[]> {
  // Create configuration contexts
  logger.info(
    `Parsing config files for ${chalk.magenta(process.env.NODE_ENV)}...`,
    { trackTime: true }
  );

  // Create array of webpack build configurations based on current context.
  const configurationNames = [
    'server',
    (args.command === 'build' || args.legacy) &&
      !imaConfig.disableLegacyBuild &&
      'client',
    'client.es',
  ].filter(Boolean) as ImaConfigurationContext['name'][];

  // Create configuration contexts
  let contexts = createContexts(configurationNames, args, imaConfig);

  // Call configuration overrides on plugins
  if (Array.isArray(imaConfig.plugins)) {
    for (const plugin of imaConfig.plugins) {
      if (!plugin.prepareConfigurations) {
        continue;
      }

      contexts = await plugin.prepareConfigurations(contexts, imaConfig, args);
    }
  }

  // Call configuration overrides on ima.config.js
  if (imaConfig.prepareConfigurations) {
    contexts = await imaConfig.prepareConfigurations(contexts, imaConfig, args);
  }

  /**
   * Process configuration contexts with optional webpack function extensions
   * from ima plugins and imaConfig.
   */
  return Promise.all(
    contexts.map(async ctx => {
      // Create webpack config for given configuration context
      let config = await webpackConfig(ctx, imaConfig);

      // Run webpack function overrides from ima plugins
      if (Array.isArray(imaConfig.plugins)) {
        for (const plugin of imaConfig.plugins) {
          if (typeof plugin?.webpack !== 'function') {
            continue;
          }

          try {
            config = await plugin.webpack(config, ctx, imaConfig);
          } catch (error) {
            logger.error(
              `There was an error while running webpack config for '${plugin.name}' plugin.`
            );
            console.error(error);
            process.exit(1);
          }
        }
      }

      // Run webpack function overrides from imaConfig
      if (typeof imaConfig.webpack === 'function') {
        config = await imaConfig.webpack(config, ctx, imaConfig);
      }

      return config;
    })
  ).then(config => {
    // Print elapsed time
    logger.endTracking();

    return config;
  });
}

/**
 * Extracts major.minor version string of currently resolved
 * core-js from node_modules.
 */
async function getCurrentCoreJsVersion() {
  return JSON.parse(
    (
      await fs.promises.readFile(
        path.resolve(require.resolve('core-js'), '../package.json')
      )
    ).toString()
  )
    .version.split('.')
    .slice(0, 2)
    .join('.');
}

export {
  resolveEnvironment,
  cleanup,
  createCacheKey,
  createWebpackConfig,
  createDevServerConfig,
  requireImaConfig,
  resolveImaConfig,
  runImaPluginsHook,
  createPolyfillEntry,
  getCurrentCoreJsVersion,
  IMA_CONF_FILENAME,
};
