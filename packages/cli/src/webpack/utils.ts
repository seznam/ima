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
  ConfigurationContext,
  ImaEnvironment,
  ConfigurationTypes,
  ImaConfig,
  CliArgs,
} from '../types';
import webpackConfig from './config';

/**
 * Loads application IMA.js environment from server/config/environment.js
 *
 * @param {CliArgs['rootDir']} rootDir Application root directory
 * @returns {ImaEnvironment} Loaded environment
 */
function resolveEnvironment(rootDir: CliArgs['rootDir']): ImaEnvironment {
  const envSourcePath = path.resolve(rootDir, './server/config/environment.js');
  const envSource = envSourcePath && require(envSourcePath);

  return (envSource && envResolver(envSource)) || {};
}

/**
 * Returns polyfill entry point for current es version if the file exists.
 * The function looks for app/polyfill.js and app/polyfill.es.js files.
 *
 * @param {ConfigurationContext} ctx Current configuration context.
 * @returns {Record<string, string>} Entry object or empty object.
 */
function createPolyfillEntry(
  ctx: ConfigurationContext
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
  args?: CliArgs;
  ctx?: ConfigurationContext;
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
 * @param {ConfigurationContext} ctx Current configuration context.
 * @returns {string}
 */
function createCacheKey(ctx: ConfigurationContext): string {
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
 * @param {CliArgs} args CLI args.
 * @returns {Promise<ImaConfig>} Ima config or empty object.
 */
async function resolveImaConfigWithDefaults(args: CliArgs): Promise<ImaConfig> {
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
 * Creates webpack configurations for defined types using provided args.
 * Additionally it applies all existing configuration overrides from cli plugins
 * and app overrides in this order cli -> plugins -> app.
 *goo
 * @param {ConfigurationTypes} configurations Configuration types.
 * @param {CliArgs} args Parsed CLI and build arguments.
 * @returns {Promise<{config: Configuration[], imaConfig: ImaConfig>}
 */
async function createWebpackConfig(
  configurations: ConfigurationTypes = ['client', 'server'],
  args: CliArgs
): Promise<{ config: Configuration[]; imaConfig: ImaConfig }> {
  // Clear cache before doing anything else
  if (args.clearCache) {
    const cacheDir = path.join(args.rootDir, '/node_modules/.cache');
    const elapsedClearCache = time();

    logger.info(`Clearing cache at ${chalk.magenta(cacheDir)}...`, false);
    fs.rmSync(cacheDir, { force: true, recursive: true });
    logger.write(chalk.gray(` [${elapsedClearCache()}]`));
  }

  // No need to continue without any configuration
  if (!configurations.length) {
    throw new Error(
      'The configurations array is empty, at least one configuration needs to be defined.'
    );
  }

  // Resolve imaConfig and create configuration contexts
  const elapsed = time();
  logger.info(
    `Parsing config files for ${chalk.magenta(process.env.NODE_ENV)}...`,
    false
  );

  // Load ima.config.js with defaults and init configuration contexts.
  const imaConfig = await resolveImaConfigWithDefaults(args);
  const finalConfigContexts: ConfigurationContext[] = [];

  // Push server configuration if available
  if (configurations.includes('server')) {
    finalConfigContexts.push({
      name: 'server',
      isServer: true,
      ...args,
    });
  }

  // Push client configurations if available (es and legacy versions)
  if (configurations.includes('client')) {
    // Build es5 in build and legacy contexts
    if (args.command === 'build' || args.legacy) {
      finalConfigContexts.push({
        name: 'client',
        isServer: false,
        isEsVersion: false,
        ...args,
      });
    }

    // SPA mode only supports es5 versions
    if (!args.forceSPA && !args.forceSPAWithHMR) {
      finalConfigContexts.push({
        name: 'client.es',
        isServer: false,
        isEsVersion: true,
        ...args,
      });
    }
  }

  // Track loaded plugins
  const loadedPlugins = new Set<string>();

  return Promise.all(
    finalConfigContexts.map(async ctx => {
      let config = await webpackConfig(ctx, imaConfig);

      if (Array.isArray(imaConfig?.plugins)) {
        for (const plugin of imaConfig.plugins) {
          try {
            config = await plugin?.webpack(config, ctx, imaConfig);
            loadedPlugins.add(plugin.name);
          } catch (error) {
            logger.error(
              `There was an logger.error while running webpack config for '${plugin.name}' plugin.`
            );
            console.error(error);
            process.exit(1);
          }
        }
      }

      if (typeof imaConfig?.webpack === 'function') {
        config = await imaConfig?.webpack(config, ctx, imaConfig);
      }

      return config;
    })
  ).then(config => {
    // Print elapsed time
    elapsed && logger.write(chalk.gray(` [${elapsed()}]`));

    // Print loaded plugins info
    if (loadedPlugins.size > 0) {
      const pluginNames: string[] = [];
      logger.info(`CLI plugins in use: `, false);

      for (const pluginName of loadedPlugins.values()) {
        pluginNames.push(chalk.blue(pluginName));
      }

      logger.write(pluginNames.join(', '));
    }

    return { config, imaConfig };
  });
}

export {
  resolveEnvironment,
  createCacheKey,
  createWebpackConfig,
  createDevServerConfig,
  requireImaConfig,
  resolveImaConfigWithDefaults,
  extractLanguages,
  createPolyfillEntry,
  IMA_CONF_FILENAME,
};
