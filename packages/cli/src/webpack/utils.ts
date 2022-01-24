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
  AdditionalDataContentFn,
  AdditionalDataFactoryFn,
  AdditionalDataFn,
  ConfigurationContext,
  ImaEnvironment,
  ConfigurationTypes,
  ImaConfig,
  CliArgs,
} from '../types';
import webpackConfig from './config';

const POSTCSS_CONF_FILENAMES = [
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.json',
  '.postcssrc.js',
  '.postcssrc.cjs',
  '.postcssrc.json',
  '.postcssrc',
];

const BABEL_CONF_FILENAMES = [
  'babel.config.js',
  'babel.config.cjs',
  'babel.config.json',
  '.babelrc.js',
  '.babelrc.cjs',
  '.babelrc.json',
  '.babelrc',
];

const BABEL_CONF_ES_FILENAMES = [
  'babel.config.es.js',
  'babel.config.es.cjs',
  'babel.config.es.json',
  '.babelrc.es.js',
  '.babelrc.es.cjs',
  '.babelrc.es.json',
  '.babelrc.es',
];

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
 * Utility function to load any JS configuration file, used
 * to setup multiple tools (babel, postcss...). From multiple
 * file locations or directly fromm package.json.
 *
 * @param {object} params
 * @param {ConfigurationContext} params.ctx current config context.
 * @param {string[]} params.fileNames Options of configuration file names.
 * @param {Record<string, unknown> | null} params.packageJson package.json
 * @param {string} params.packageJsonKey Key identifying config in package.json
 * @param {Record<string, unknown>} params.defaultConfig Default config
 *        which is used if no configuration is found.
 * @returns {Record<string, unknown>} Loaded configuration object.
 */
function requireConfig({
  ctx,
  fileNames,
  packageJsonKey = '',
  defaultConfig = {},
}: {
  ctx: ConfigurationContext;
  fileNames: string[];
  packageJsonKey: string;
  defaultConfig: Record<string, unknown>;
}): Record<string, unknown> {
  if (!Array.isArray(fileNames) || fileNames.length === 0) {
    return defaultConfig;
  }

  const { fullPath: configPath, fileName: configFileName } =
    fileNames
      .map(fileName => ({
        fileName,
        fullPath: path.join(ctx.rootDir, fileName),
      }))
      .find(({ fullPath }) => fs.existsSync(fullPath)) || {};

  const packageJsonPath = path.resolve(ctx.rootDir, './package.json');
  const packageJson = packageJsonPath ? require(packageJsonPath) : {};

  if (
    !configPath &&
    !(packageJson && packageJsonKey && packageJson[packageJsonKey])
  ) {
    return defaultConfig;
  }

  try {
    if (configPath && configFileName) {
      const extension = configFileName.split('.').pop();

      return extension && ~['js', 'cjs', 'json'].indexOf(extension)
        ? require(configPath)
        : JSON.parse(fs.readFileSync(configPath).toString());
    } else {
      return (packageJson && packageJson[packageJsonKey]) || defaultConfig;
    }
  } catch (err) {
    logger.error(`Error occurred while loading ${configPath} file`);

    if (err instanceof Error) {
      logger.error(err.message);
      err.stack && logger.error(err.stack);
    }

    return defaultConfig;
  }
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
 * Less-loader additional data factory function. Utility to
 * easily prepped/append custom content into the less-loader.
 *
 * @param {AdditionalDataContentFn[]} contentFunctions Data content functions.
 * @returns {AdditionalDataFn} Less-loader compatible additional data fn.
 */
function additionalDataFactory(
  contentFunctions: AdditionalDataContentFn[]
): AdditionalDataFn {
  const prefixes: string[] = [];
  const postfixes: string[] = [];

  const prefix: AdditionalDataFactoryFn = content => prefixes.push(content);
  const postfix: AdditionalDataFactoryFn = content => postfixes.push(content);

  contentFunctions.forEach(fn => {
    if (typeof fn !== 'function') {
      return;
    }

    return fn(prefix, postfix);
  });

  return content => [...prefixes, content, ...postfixes].join('\n\n');
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
 * Resolves ima.config.js from rootDir base path with defaults.
 *
 * @param {CliArgs} args CLI args.
 * @returns {Promise<ImaConfig>} Ima config or empty object.
 */
async function resolveImaConfig(args: CliArgs): Promise<ImaConfig> {
  const defaultImaConfig: ImaConfig = {
    publicPath: '',
    compression: ['brotliCompress', 'gzip'],
    languages: {
      cs: ['./app/**/*CS.json'],
      en: ['./app/**/*EN.json'],
    },
    imageInlineSizeLimit: 8192,
  };

  return {
    ...defaultImaConfig,
    ...requireImaConfig(args.rootDir),
  };
}

/**
 * Creates webpack configurations for defined types using provided args.
 * Additionally it applies all existing configuration overrides from cli plugins
 * and app overrides in this order cli -> plugins -> app.
 *
 * @param {ConfigurationTypes} configurations Configuration types.
 * @param {CliArgs} args Parsed CLI and build arguments.
 * @returns {Promise<{config: Configuration[], imaConfig: ImaConfig>}
 */
async function createWebpackConfig(
  configurations: ConfigurationTypes = ['client', 'server'],
  args?: CliArgs
): Promise<{ config: Configuration[]; imaConfig: ImaConfig }> {
  const isFirstPass = !args && process.env.IMA_CLI_WEBPACK_CONFIG_ARGS;
  let elapsed: ReturnType<typeof time> | null = null;

  // No need to continue without any configuration
  if (!configurations.length) {
    throw new Error(
      'The configurations array is empty, at least one configuration needs to be defined.'
    );
  }

  if (!args && process.env.IMA_CLI_WEBPACK_CONFIG_ARGS) {
    try {
      // Load config args from env variable
      args = JSON.parse(process.env.IMA_CLI_WEBPACK_CONFIG_ARGS) as CliArgs;
    } catch (err) {
      logger.error('Error occurred while parsing env webpack config args.');
      throw err;
    }
  } else {
    // Used explicitly, print message
    elapsed = time();
    logger.info(
      `Parsing config files for ${chalk.magenta(process.env.NODE_ENV)}...`,
      false
    );

    // Cache config args to env variable
    process.env.IMA_CLI_WEBPACK_CONFIG_ARGS = JSON.stringify(args);
  }

  // We are unable to continue without valid configArgs
  if (!args) {
    throw new Error(
      'Unable to load config args used to initialize a webpack config.'
    );
  }

  // Load ima.config.js with defaults and init configuration contexts.
  const imaConfig = await resolveImaConfig(args);
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
    if (!isFirstPass && loadedPlugins.size > 0) {
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
  requireConfig,
  additionalDataFactory,
  createCacheKey,
  createWebpackConfig,
  requireImaConfig,
  resolveImaConfig,
  extractLanguages,
  createPolyfillEntry,
  IMA_CONF_FILENAME,
  BABEL_CONF_ES_FILENAMES,
  BABEL_CONF_FILENAMES,
  POSTCSS_CONF_FILENAMES,
};
