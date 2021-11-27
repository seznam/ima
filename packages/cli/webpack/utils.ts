import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { Configuration } from 'webpack';

import webpackConfig from './config';
import { error } from '../lib/cli';
import {
  AdditionalDataContentFn,
  AdditionalDataFactoryFn,
  AdditionalDataFn,
  Args,
  ConfigurationContext,
  ImaEnvironment,
  ConfigurationTypes,
  ImaConfig
} from '../types';

import envResolver from '@ima/server/lib/environment.js';

/**
 * Loads application IMA.js environment from server/config/environment.js
 *
 * @param {Args['rootDir']} rootDir Application root directory
 * @returns {ImaEnvironment} Loaded environment
 */
function resolveEnvironment(rootDir: Args['rootDir']): ImaEnvironment {
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
 * @param {string} params.rootDir App root directory.
 * @param {string[]} params.fileNames Options of configuration file names.
 * @param {Record<string, unknown> | null} params.packageJson package.json
 * @param {string} params.packageJsonKey Key identifying config in package.json
 * @param {Record<string, unknown>} params.defaultConfig Default config
 *        which is used if no configuration is found.
 * @returns {Record<string, unknown>} Loaded configuration object.
 */
function requireConfig({
  rootDir,
  fileNames,
  packageJson = null,
  packageJsonKey = '',
  defaultConfig = {}
}: {
  rootDir: Args['rootDir'];
  fileNames: string[];
  packageJson: Record<string, Record<string, unknown>> | null;
  packageJsonKey: string;
  defaultConfig: Record<string, unknown>;
}): Record<string, unknown> {
  if (
    !rootDir ||
    !Array.isArray(fileNames) ||
    fileNames.length === 0 ||
    !fs.existsSync(rootDir)
  ) {
    return defaultConfig;
  }

  const { fullPath: configPath, fileName: configFileName } =
    fileNames
      .map(fileName => ({
        fileName,
        fullPath: path.join(rootDir, fileName)
      }))
      .find(({ fullPath }) => fs.existsSync(fullPath)) || {};

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
    error(`Error occurred while loading ${configPath} file`);

    if (err instanceof Error) {
      error(err.message);
      err.stack && error(err.stack);
    }

    return defaultConfig;
  }
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
 * @param {Args} args CLI args.
 * @returns {Promise<ImaConfig>} Ima config or empty object.
 */
async function resolveImaConfig(args: Args): Promise<ImaConfig> {
  const defaultImaConfig: ImaConfig = {
    publicPath: '',
    compression: ['brotliCompress', 'gzip'],
    scrambleCss: args.isProduction,
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
 * @param {Args} args Parsed CLI and build arguments.
 * @returns {Promise<Configuration[]>}
 */
async function createWebpackConfig(
  configurations: ConfigurationTypes = ['client', 'server'],
  args: Args
): Promise<Configuration[]> {
  // No need to continue without any configuration
  if (!configurations.length) {
    throw new Error(
      'The configurations array is empty, at least one configuration needs to be defined.'
    );
  }

  if (!args && process.env.IMA_CLI_WEBPACK_CONFIG_ARGS) {
    try {
      // Load config args from env variable
      args = JSON.parse(process.env.IMA_CLI_WEBPACK_CONFIG_ARGS) as Args;
    } catch (err) {
      error('Error occurred while parsing env webpack config args.');
      throw err;
    }
  } else {
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
    if (!args?.isWatch || args.legacy) {
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
        name: 'client-es',
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
          } catch (_error) {
            error(
              `There was an error while running webpack config for '${plugin.name}' plugin.`
            );
            console.error(_error);
            process.exit(1);
          }
        }
      }

      if (typeof imaConfig?.webpack === 'function') {
        config = await imaConfig?.webpack(config, ctx, imaConfig);
      }

      return config;
    })
  );
}

export {
  resolveEnvironment,
  requireConfig,
  additionalDataFactory,
  createCacheKey,
  createWebpackConfig,
  requireImaConfig,
  resolveImaConfig,
  IMA_CONF_FILENAME
};
