import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';
import { Arguments, CommandBuilder } from 'yargs';

import {
  Args,
  BaseArgs,
  ConfigurationTypes,
  HandlerFunction,
  ImaConfig,
  VerboseOptions
} from '../types';
import webpackConfig from '../webpack/config';
import { error } from './print';

const IMA_CONF_FILENAME = 'ima.config.js';

const SharedArgs: CommandBuilder = {
  verbose: {
    alias: 'v',
    desc: 'Choose between different number of logging options',
    type: 'string',
    choices: Object.values(VerboseOptions),
    default: VerboseOptions.DEFAULT
  },
  amp: {
    desc: 'Builds separate CSS files for use in AMP mode',
    type: 'boolean'
  },
  scrambleCss: {
    desc: 'Scrambles class names and generates hashtable',
    type: 'boolean'
  },
  publicPath: {
    desc: 'Webpack public path to specify base for all assets in the app',
    type: 'string'
  }
};

/**
 * Loads ima.config.js from rootDir base path. If no custom
 * configuration was found it returns empty object.
 *
 * @param {string} rootDir Base app directory.
 * @returns {Promise<ImaConfig | {}>} Ima config or empty object.
 */
async function loadImaConfig(rootDir: string): Promise<ImaConfig | {}> {
  if (!rootDir) {
    return {};
  }

  const imaConfigPath = path.join(rootDir, IMA_CONF_FILENAME);

  return fs.existsSync(imaConfigPath) ? require(imaConfigPath) : {};
}

/**
 * Initializes cli script handler function, with parsed argument and defaults.
 */
function handlerFactory<T extends BaseArgs>(handlerFn: HandlerFunction<T>) {
  return async (yargs: Arguments) => {
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
    } as T); // FIXME
  };
}

async function createWebpackConfig(
  configurations: ConfigurationTypes = ['client', 'server'],
  configArgs: Args
): Promise<Configuration[]> {
  if (!configArgs) {
    // Load config args from env variable
    try {
      configArgs = JSON.parse(process.env.IMA_CLI_WEBPACK_CONFIG_ARGS);
    } catch (err) {
      error('Error occurred while parsing env webpack config.');
      throw err;
    }
  } else {
    // Cache config args to env variable
    process.env.IMA_CLI_WEBPACK_CONFIG_ARGS = JSON.stringify(configArgs);
  }

  if (!configArgs) {
    throw new Error(
      'Unable to load config args used to create initialize webpack config.'
    );
  }

  // Load imaConfig
  const imaConfig = await loadImaConfig(configArgs.rootDir);
  const finalConfigArgs = [];

  if (~configurations.indexOf('client')) {
    finalConfigArgs.push({
      ...configArgs,
      isServer: false
    });
  }

  if (~configurations.indexOf('server')) {
    finalConfigArgs.push({
      ...configArgs,
      isServer: true
    });
  }

  return Promise.all(
    finalConfigArgs.map(async args => {
      if (typeof imaConfig?.webpack === 'function') {
        return await imaConfig?.webpack(
          await webpackConfig(args, imaConfig),
          args,
          imaConfig
        );
      } else {
        return await webpackConfig(args, imaConfig);
      }
    })
  );
}

export { SharedArgs, handlerFactory, createWebpackConfig, loadImaConfig };
