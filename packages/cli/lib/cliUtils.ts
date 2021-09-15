import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';
import { Arguments } from 'yargs';

import {
  Args,
  BaseArgs,
  ConfigurationArgs,
  ConfigurationTypes,
  ESVersions,
  HandlerFn,
  ImaConfig,
  IMA_CONF_FILENAME
} from '../types';
import webpackConfig from '../webpack/config';
import { error } from './print';

/**
 * Loads ima.config.js from rootDir base path. If no custom
 * configuration was found it returns empty object.
 *
 * @param {string} rootDir Base app directory.
 * @returns {Promise<ImaConfig>} Ima config or empty object.
 */
async function loadImaConfig(rootDir: string): Promise<ImaConfig> {
  if (!rootDir) {
    return {};
  }

  const imaConfigPath = path.join(rootDir, IMA_CONF_FILENAME);

  return fs.existsSync(imaConfigPath) ? require(imaConfigPath) : {};
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

  // Load optional ima.config.js
  const imaConfig = await loadImaConfig(args.rootDir);
  const finalConfigArgs: ConfigurationArgs[] = [];

  // Push server configuration if available
  if (configurations.includes('server')) {
    finalConfigArgs.push({
      isServer: true,
      name: 'server',
      ...args
    });
  }

  // Push client configurations if available
  if (configurations.includes('client')) {
    const latestEsVersion = findLatestEsVersion(
      imaConfig?.esVersions,
      ESVersions.es11
    );

    // Push default client configuration
    finalConfigArgs.push({
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
          finalConfigArgs.push({
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
    finalConfigArgs.map(async args =>
      typeof imaConfig?.webpack === 'function'
        ? imaConfig?.webpack(
            await webpackConfig(args, imaConfig),
            args,
            imaConfig
          )
        : webpackConfig(args, imaConfig)
    )
  );
}

/**
 * Initializes cli script handler function, which takes cli arguments,
 * parses them and defines defaults. Should be used to initialize any
 * cli command script, since it takes care of parsing mandatory arguments.
 *
 * @param {HandlerFn<T>} handlerFn Cli script command handler.
 * @returns {void}
 */
function handlerFactory<T extends BaseArgs>(handlerFn: HandlerFn<T>) {
  return async (yargs: Arguments): Promise<void> => {
    const [command, dir = ''] = yargs._ || [];
    const isProduction = process.env.NODE_ENV === 'production';

    const dirStr = dir.toString();
    const rootDir = dirStr
      ? path.isAbsolute(dirStr)
        ? dirStr
        : path.resolve(process.cwd(), dirStr)
      : process.cwd();

    return await handlerFn(({
      ...yargs,
      rootDir,
      isProduction,
      command: command.toString()
    } as unknown) as T);
  };
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
 * @param {ESVersions[]} esVersions? ESVersions array.
 * @param {ESVersions} [defEsVersion='es11'] Default ES version,
 *        which is returned if no match was found.
 * @returns {ESVersions}
 */
function findLatestEsVersion(
  esVersions?: ESVersions[],
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
  handlerFactory,
  createWebpackConfig,
  loadImaConfig,
  resolveEsVersionTargets
};
