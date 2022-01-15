import path from 'path';
import fs from 'fs';
import { Arguments, CommandBuilder } from 'yargs';

import { CliArgs, HandlerFn, ImaCliCommand } from '../types';
import { requireImaConfig } from '../webpack/utils';

const IMA_CLI_RUN_SERVER_MESSAGE = 'ima-cli-run-server-message';

/**
 * Resolves input dir path to absolute existing directory.
 * Falls back to cwd inc ase the parameter is null or empty string.
 *
 * @param {string | null | undefined} Optional custom working dir path.
 * @returns {string} CLI rootDir.
 */
function resolveRootDir(dir?: string | null | undefined): string {
  if (!dir) {
    return process.cwd();
  }

  const rootDir = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);

  if (!fs.existsSync(rootDir)) {
    throw new Error(
      `Provided root directory doesn't exist: ${rootDir}.` +
        'Make sure to point the @ima/cli to the root directory of existing IMA.js application.'
    );
  }

  return rootDir;
}

/**
 * Initializes cli script handler function, which takes cli arguments,
 * parses them and defines defaults. Should be used to initialize any
 * cli command script, since it takes care of parsing mandatory arguments.
 *
 * @param {HandlerFn} handlerFn Cli script command handler.
 * @returns {void}
 */
function handlerFactory(handlerFn: HandlerFn) {
  return async (yargs: Arguments): Promise<void> => {
    const [command, dir = ''] = yargs._ || [];

    return await handlerFn(({
      ...yargs,
      rootDir: resolveRootDir(dir.toString()),
      command: command.toString()
    } as unknown) as CliArgs);
  };
}

/**
 * Resolves additional cliArgs that can be provided with custom cli plugins
 * defined in the optional ima.config.js.
 *
 * @param {ImaCliCommand} Current command for which args are loaded.
 * @returns {CommandBuilder} Yargs commands object.
 */
function resolveCliPluginArgs(command: ImaCliCommand): CommandBuilder {
  // Crude way of filtering root dir
  let rootDir = null;
  if (process.argv.length > 3) {
    rootDir = process.argv
      .slice(3)
      .filter(arg => !arg.startsWith('-') && !arg.startsWith('--'))
      .pop()
      ?.toString();
  }

  const imaConfig = requireImaConfig(resolveRootDir(rootDir));

  if (!imaConfig || !Array.isArray(imaConfig?.plugins)) {
    return {};
  }

  return imaConfig.plugins
    .filter(
      plugin => plugin?.cliArgs && Object.keys(plugin.cliArgs).length !== 0
    )
    .reduce((acc, cur) => {
      if (cur?.cliArgs && cur.cliArgs[command]) {
        acc = {
          ...acc,
          ...cur.cliArgs[command]
        };
      }

      return acc;
    }, {});
}

/**
 * Initializes shared args with their default values based
 * current CLI command.
 *
 * @param {ImaCliCommand} command Current CLI command identifier.
 * @returns {CommandBuilder} Object with shared args.
 */
function sharedArgsFactory(command: ImaCliCommand): CommandBuilder {
  return {
    clean: {
      desc: 'Clean build folder before building the application',
      type: 'boolean',
      default: command === 'build'
    },
    verbose: {
      desc: 'Use default webpack CLI output instead of custom one',
      type: 'boolean'
    },
    publicPath: {
      desc: 'Webpack public path to specify base for all assets in the app',
      type: 'string'
    },
    ignoreWarnings: {
      desc: 'Webpack will no longer print warnings during compilation',
      type: 'boolean'
    }
  };
}

export {
  IMA_CLI_RUN_SERVER_MESSAGE,
  handlerFactory,
  resolveCliPluginArgs,
  sharedArgsFactory
};
