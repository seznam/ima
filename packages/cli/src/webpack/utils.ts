import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { Configuration } from 'webpack';
import chalk from 'chalk';

import webpackConfig from './config';
import {
  AdditionalDataContentFn,
  AdditionalDataFactoryFn,
  AdditionalDataFn,
  ConfigurationContext,
  ImaEnvironment,
  ConfigurationTypes,
  ImaConfig,
  CliArgs
} from '../types';

import envResolver from '@ima/server/lib/environment.js';
import logger from '../lib/logger';
import { time } from '../lib/time';

const BABEL_CONF_FILENAMES = [
  'babel.config.js',
  'babel.config.cjs',
  'babel.config.json',
  '.babelrc.js',
  '.babelrc.cjs',
  '.babelrc.json',
  '.babelrc'
];

const BABEL_CONF_ES_FILENAMES = [
  'babel.config.es.js',
  'babel.config.es.cjs',
  'babel.config.es.json',
  '.babelrc.es.js',
  '.babelrc.es.cjs',
  '.babelrc.es.json',
  '.babelrc.es'
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
  defaultConfig = {}
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
        fullPath: path.join(ctx.rootDir, fileName)
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
 * Utility to load custom (with default fallback) config for es and non-es versions.
 *
 * @param {object} params
 * @param {ConfigurationContext} params.ctx current config context.
 * @param {Record<string, unknown>} params.defaultConfig Default config
 *        which is used if no configuration is found.
 * @returns {Record<string, unknown>} Loaded configuration object.
 */
function requireBabelConfig({
  ctx,
  defaultConfig = {}
}: {
  ctx: ConfigurationContext;
  defaultConfig: Record<string, unknown>;
}): Record<string, unknown> {
  const { isEsVersion, isServer } = ctx;
  const useEsConfig = isEsVersion || isServer;

  const config = requireConfig({
    ctx,
    fileNames: useEsConfig ? BABEL_CONF_ES_FILENAMES : BABEL_CONF_FILENAMES,
    packageJsonKey: useEsConfig ? 'babel.es' : 'babel',
    defaultConfig
  });

  if (config === defaultConfig) {
    return config;
  }

  /**
   * In case of babel config, we merge few keys, that are loader specific,
   *  into the custom config from the default one.
   */
  const { presets = [], plugins = [] } = config;

  return {
    defaultConfig,
    presets,
    plugins
  };
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
 * Mainly used for filesystem caching.
 *
 * @param {ConfigurationContext} ctx Current configuration context.
 * @param {ImaConfig} imaConfig Current ima configuration.
 * @returns {string}
 */
function createCacheKey(
  ctx: ConfigurationContext,
  imaConfig: ImaConfig
): string {
  const hash = createHash('md5');
  hash.update(
    [ctx, imaConfig]
      .filter(Object.keys)
      .map(value => JSON.stringify(value))
      .join('')
  );

  return hash.digest('hex');
}

const IMA_CONF_FILENAME = 'ima.config.js';

/**
 * Requires imaConfig from given root directory (default to cwd).
 *
 * @param {string} rootDir App root directory.
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
    imageInlineSizeLimit: 8192
  };

  if (!args.rootDir) {
    return defaultImaConfig;
  }

  return {
    ...defaultImaConfig,
    ...requireImaConfig(args.rootDir)
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
    logger.info('Parsing webpack configuration file...', false);

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
      ...args
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
        ...args
      });
    }

    // SPA mode only supports es5 versions
    if (!args.forceSPA) {
      finalConfigContexts.push({
        name: 'client.es',
        isServer: false,
        isEsVersion: true,
        ...args
      });
    }
  }

  return Promise.all(
    finalConfigContexts.map(async ctx => {
      let config = await webpackConfig(ctx, imaConfig);

      if (Array.isArray(imaConfig?.plugins)) {
        for (const plugin of imaConfig?.plugins) {
          try {
            config = await plugin?.webpack(config, ctx, imaConfig);
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

    return { config, imaConfig };
  });
}

export {
  resolveEnvironment,
  requireConfig,
  requireBabelConfig,
  additionalDataFactory,
  createCacheKey,
  createWebpackConfig,
  requireImaConfig,
  resolveImaConfig,
  IMA_CONF_FILENAME
};
