import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

import envResolver from '@ima/server/lib/environment.js';
import chalk from 'chalk';
import { ObjectPattern } from 'copy-webpack-plugin';
import MessageFormat from 'messageformat';
import { Configuration } from 'webpack';

import logger from '../lib/logger';
import { time } from '../lib/time';
import {
  ImaConfigurationContext,
  ImaEnvironment,
  ImaConfig,
  ImaCliArgs,
} from '../types';
import webpackConfig from './config';

/**
 * Loads application IMA.js environment from server/config/environment.js
 *
 * @param {ImaCliArgs['rootDir']} rootDir Application root directory
 * @returns {ImaEnvironment} Loaded environment
 */
function resolveEnvironment(rootDir: ImaCliArgs['rootDir']): ImaEnvironment {
  const envSourcePath = path.resolve(rootDir, './server/config/environment.js');
  const envSource = envSourcePath && require(envSourcePath);

  return (envSource && envResolver(envSource)) || {};
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
  const { isEsVersion, rootDir } = ctx;

  const fileName = `polyfill${isEsVersion ? '.es' : ''}.js`;
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
  public: string;
} {
  const port = args?.port ?? ctx?.port ?? imaConfig?.devServer?.port ?? 3101;
  const hostname =
    args?.hostname ??
    ctx?.hostname ??
    imaConfig?.devServer?.hostname ??
    'localhost';
  const publ = args?.public ?? ctx?.public ?? imaConfig?.devServer?.public;

  return {
    port,
    hostname,
    public: publ ?? `${hostname}:${port}`,
  };
}

/**
 * Returns records for CopyPlugin to extract locales to one file by locale
 *
 * @param {ImaConfig} imaConfig Current ima configuration.
 * @returns {ObjectPattern[]} ObjectPattern array for copy plugin
 */
function extractLanguages(imaConfig: ImaConfig): ObjectPattern[] {
  const resultCopyRecords: ObjectPattern[] = [];
  const tempLocales: Record<string, any> = {};

  Object.entries(imaConfig.languages).forEach(([locale, languageGlobs]) => {
    tempLocales[locale] = {};
    const mf = new MessageFormat(locale);

    languageGlobs.forEach(languageGlob =>
      resultCopyRecords.push({
        from: languageGlob,
        to: 'static/locale/' + locale + '.js',
        force: true,
        noErrorOnMissing: true,
        transformAll: (assets: any[]) => {
          tempLocales[locale] = assets.reduce((accumulator, asset) => {
            const fileContent = JSON.parse(asset.data.toString());
            const scopeFromFilename = (
              asset.sourceFilename.split('/').pop() || 'none'
            ).replace(locale.toUpperCase() + '.json', '');

            return Object.assign(accumulator, {
              [scopeFromFilename]: fileContent,
            });
          }, tempLocales[locale]);

          return `(function () {var $IMA = {}; if ((typeof window !== "undefined") && (window !== null)) { window.$IMA = window.$IMA || {}; $IMA = window.$IMA; }
                                        ${mf
                                          .compile(tempLocales[locale])
                                          .toString('$IMA.i18n')}
                                          ;if (typeof module !== "undefined" && module.exports) {module.exports = $IMA.i18n;} })();`;
        },
      })
    );
  });

  return resultCopyRecords;
}

/**
 * Creates hash representing current webpack environment.
 *
 * @param {ImaConfigurationContext} ctx Current configuration context.
 * @returns {string}
 */
function createCacheKey(ctx: ImaConfigurationContext): string {
  const hash = createHash('md5');

  /**
   * Explicitly use only the context variables which somehow change
   * how the config is generated (since not all context values
   * are used in config generation).
   */
  hash.update(
    [
      ctx.command,
      ctx.forceSPA,
      ctx.forceSPAWithHMR,
      ctx.profile,
      ctx.publicPath,
      ctx.rootDir,
      ctx.environment,
    ]
      .map(value => JSON.stringify(value))
      .join('')
  );

  return hash.digest('hex');
}

const IMA_CONF_FILENAME = 'ima.config.js';

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
    compression: ['brotliCompress', 'gzip'],
    languages: {
      cs: ['./app/**/*CS.json'],
      en: ['./app/**/*EN.json'],
    },
    imageInlineSizeLimit: 8192,
    watchOptions: {
      ignored: ['**/.git/**', '**/node_modules/**', '**/build/**'],
      followSymlinks: true,
      aggregateTimeout: 5,
    },
    babel: async config => config,
    postcss: async config => config,
  };

  const imaConfig = requireImaConfig(args.rootDir);

  return {
    ...defaultImaConfig,
    ...imaConfig,
    watchOptions: {
      ...defaultImaConfig.watchOptions,
      ...imaConfig?.watchOptions,
    },
  };
}

/**
 * Deletes ./node_modules/.cache directory, where webpack, babel and
 * many other packages store cache tmp files.
 *
 * @param {ImaCliArgs['rootDir']} rootDir
 */
function clearCache(rootDir: ImaCliArgs['rootDir']): void {
  const cacheDir = path.join(rootDir, '/node_modules/.cache');
  const elapsedClearCache = time();

  logger.info(`Clearing cache at ${chalk.magenta(cacheDir)}...`, false);
  fs.rmSync(cacheDir, { force: true, recursive: true });
  logger.write(chalk.gray(` [${elapsedClearCache()}]`));
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

  logger.info(`Running ${hook} on ima plugins...`);

  // Run plugin hook
  for (const plugin of filteredPlugins) {
    await plugin?.[hook]?.(args, imaConfig);
  }
}

/**
 * Creates webpack configurations for defined types using provided args.
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
  // Clear cache before doing anything else
  if (args.clearCache) {
    clearCache(args.rootDir);
  }

  // Create configuration contexts
  const elapsed = time();
  logger.info(
    `Parsing config files for ${chalk.magenta(process.env.NODE_ENV)}...`,
    false
  );

  // Create configuration contexts (server is always present)
  const contexts: ImaConfigurationContext[] = [
    {
      name: 'server',
      isServer: true,
      ...args,
    },
    // Process es5 in build and legacy contexts
    (args.command === 'build' || args.legacy) && {
      name: 'client',
      isServer: false,
      isEsVersion: false,
      ...args,
    },
    // SPA mode only supports es5 versions
    !args.forceSPA &&
      !args.forceSPAWithHMR && {
        name: 'client.es',
        isServer: false,
        isEsVersion: true,
        ...args,
      },
  ].filter(Boolean) as ImaConfigurationContext[];

  /**
   * Process configuration contexts with optional webpack function extensions
   * from ima plugins and imaConfig.
   */
  return Promise.all(
    contexts.map(async ctx => {
      // Create webpack config for given configuration context
      let config = await webpackConfig(ctx, imaConfig);

      // Run webpack function overrides from ima plugins
      if (Array.isArray(imaConfig?.plugins)) {
        for (const plugin of imaConfig.plugins) {
          try {
            config = await plugin?.webpack(config, ctx, imaConfig);
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
      if (typeof imaConfig?.webpack === 'function') {
        config = await imaConfig?.webpack(config, ctx, imaConfig);
      }

      return config;
    })
  ).then(config => {
    // Print elapsed time
    elapsed && logger.write(chalk.gray(` [${elapsed()}]`));

    // Print loaded plugins info
    if (Array.isArray(imaConfig.plugins) && imaConfig.plugins.length) {
      const pluginNames: string[] = [];
      logger.info(`CLI plugins in use: `, false);

      for (const plugin of imaConfig.plugins) {
        pluginNames.push(chalk.blue(plugin.name));
      }

      logger.write(pluginNames.join(', '));
    }

    return config;
  });
}

export {
  resolveEnvironment,
  clearCache,
  createCacheKey,
  createWebpackConfig,
  createDevServerConfig,
  requireImaConfig,
  resolveImaConfig,
  runImaPluginsHook,
  extractLanguages,
  createPolyfillEntry,
  IMA_CONF_FILENAME,
};
