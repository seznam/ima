import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';
import { Arguments } from 'yargs';

import {
  Args,
  BaseArgs,
  ConfigurationTypes,
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
 * @returns {Promise<ImaConfig | {}>} Ima config or empty object.
 */
async function loadImaConfig(
  rootDir: string
): Promise<ImaConfig | Record<string, unknown>> {
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
 * @param {Args} configArgs Parsed CLI and build arguments.
 * @returns {Promise<Configuration[]>}
 */
async function createWebpackConfig(
  configurations: ConfigurationTypes = ['client', 'server'],
  configArgs: Args
): Promise<Configuration[]> {
  if (!configArgs && process.env.IMA_CLI_WEBPACK_CON) {
    try {
      // Load config args from env variable
      configArgs = JSON.parse(process.env.IMA_CLI_WEBPACK_CONFIG_ARGS);
    } catch (err) {
      error('Error occurred while parsing env webpack config args.');
      throw err;
    }
  } else {
    // Cache config args to env variable
    process.env.IMA_CLI_WEBPACK_CONFIG_ARGS = JSON.stringify(configArgs);
  }

  // We are unable to continue without valid configArgs
  if (!configArgs) {
    throw new Error(
      'Unable to load config args used to initialize a webpack config.'
    );
  }

  // Load optional ima.config.js
  const imaConfig = await loadImaConfig(configArgs.rootDir);

  // Adjust config args for client and server configurations
  const finalConfigArgs: Args[] = configurations.map(currentConfiguration => ({
    ...configArgs,
    isServer: currentConfiguration === 'server'
  }));

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

    return await handlerFn({
      rootDir,
      isProduction,
      command: command.toString()
    } as T);
  };
}

export { handlerFactory, createWebpackConfig, loadImaConfig };
