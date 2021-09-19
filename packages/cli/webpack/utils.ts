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
  ESVersions,
  ImaConfig
} from '../types';

/**
 * Loads application IMA.js environment from app/environment.js
 *
 * @param {Args['rootDir']} rootDir Application root directory
 * @returns {ImaEnvironment} Loaded environment
 */
function resolveEnvironment(rootDir: Args['rootDir']): ImaEnvironment {
  const envSourcePath = path.resolve(rootDir, './app/environment.js');
  const envConfigPath = path.resolve(
    rootDir,
    './node_modules/@ima/server/lib/environment.js'
  );

  const envSource = envSourcePath && require(envSourcePath);
  const envConfig = envConfigPath && require(envConfigPath);

  return (envSource && envConfig ? envConfig(envSource) : {}) as ImaEnvironment;
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
 * Loads ima.config.js from rootDir base path with defaults.
 *
 * @param {Args} args CLI args.
 * @returns {Promise<ImaConfig>} Ima config or empty object.
 */
async function loadImaConfig(args: Args): Promise<ImaConfig> {
  const defaultImaConfig: ImaConfig = {
    publicPath: '',
    esVersions: [ESVersions.es5, ESVersions.es11],
    compression: ['brotliCompress', 'gzip'],
    scrambleCss: args.isProduction,
    imageInlineSizeLimit: 8192
  };

  if (!args.rootDir) {
    return defaultImaConfig;
  }

  const imaConfigPath = path.join(args.rootDir, IMA_CONF_FILENAME);

  return {
    ...defaultImaConfig,
    ...(fs.existsSync(imaConfigPath) ? require(imaConfigPath) : {})
  };
}

/**
 * Creates webpack configurations for received configuration types, while
 * using provided parsed CLI arguments adn build, with optional ima.config.js
 * configuration file.
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
  const imaConfig = await loadImaConfig(args);
  const finalConfigContexts: ConfigurationContext[] = [];

  // Push server configuration if available
  if (configurations.includes('server')) {
    finalConfigContexts.push({
      isServer: true,
      name: 'server',
      ecma: {
        isMain: true,
        version: ESVersions.es11
      },
      ...args
    });
  }

  // Push client configurations if available
  if (configurations.includes('client')) {
    const latestEsVersion = findLatestEsVersion(imaConfig.esVersions);

    // Push default client configuration
    finalConfigContexts.push({
      isServer: false,
      name: 'client',
      ecma: {
        isMain: true,
        version: latestEsVersion
      },
      ...args
    });

    if (!args?.isWatch) {
      // Push other defined ES client configurations if defined
      imaConfig?.esVersions
        ?.filter(esVersion => esVersion !== latestEsVersion)
        .forEach(esVersion => {
          finalConfigContexts.push({
            isServer: false,
            name: `client-${esVersion}`,
            ecma: {
              isMain: false,
              suffix: `.${esVersion}`,
              version: esVersion
            },
            ...args
          });
        });
    }
  }

  return Promise.all(
    finalConfigContexts.map(async ctx =>
      typeof imaConfig?.webpack === 'function'
        ? imaConfig?.webpack(
            await webpackConfig(ctx, imaConfig),
            ctx,
            imaConfig
          )
        : webpackConfig(ctx, imaConfig)
    )
  );
}

/**
 * Resolves esVersion to browserslist targets object, that can be
 * passed into babel/preset-env.
 *
 * @param {ESVersions} esVersion ESVersion to parse.
 * @returns {object} Targets object.
 */
function resolveEsVersionTargets(
  esVersion?: ESVersions
): Record<string, number> {
  switch (esVersion) {
    case ESVersions.es5:
      return { ie: 11 };

    case ESVersions.ES2015:
    case ESVersions.es6:
      return { edge: 15 };

    case ESVersions.ES2016:
    case ESVersions.es7:
      return { node: 8 };

    case ESVersions.ES2017:
    case ESVersions.es8:
      return { node: 10 };

    case ESVersions.ES2018:
    case ESVersions.es9:
    case ESVersions.ES2019:
    case ESVersions.es10:
      return { node: 12 };

    case ESVersions.ES2020:
    case ESVersions.es11:
      return { node: 14 };

    case ESVersions.ES2021:
    case ESVersions.es12:
      return { node: 15 };

    default:
      return { ie: 11 };
  }
}

/**
 * Returns latest (newest) es version from provided array.
 *
 * @param {ESVersions[]} esVersions ESVersions array.
 * @param {ESVersions} [defEsVersion='es11'] Default ES version,
 *        which is returned if no match was found.
 * @returns {ESVersions}
 */
function findLatestEsVersion(
  esVersions: ESVersions[],
  defEsVersion = ESVersions.es11
): ESVersions {
  let latestEsVersion: ESVersions = defEsVersion;

  if (esVersions?.length) {
    Object.values(ESVersions).forEach(esVersion => {
      if (esVersions.includes(esVersion)) {
        latestEsVersion = esVersion;
      }
    });
  }

  return latestEsVersion;
}

export {
  resolveEnvironment,
  requireConfig,
  additionalDataFactory,
  createCacheKey,
  createWebpackConfig,
  loadImaConfig,
  resolveEsVersionTargets,
  IMA_CONF_FILENAME
};
