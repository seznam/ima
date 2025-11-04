import { spawn } from 'child_process';

import { Arguments, CommandBuilder } from 'yargs';

import { ImaCliArgs, HandlerFn, ImaCliCommand } from '../types';
import { requireImaConfig } from '../webpack/utils/utils';

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
    const [command] = yargs._ || [];

    // Force development env for dev
    process.env.NODE_ENV =
      command === 'dev'
        ? 'development'
        : (process.env.NODE_ENV ?? 'production');

    return await handlerFn({
      ...yargs,
      rootDir: process.cwd(),
      command: command.toString(),
      environment: process.env.NODE_ENV,
    } as unknown as ImaCliArgs);
  };
}

/**
 * Resolves additional cliArgs that can be provided with custom cli plugins
 * defined in the ima.config.js.
 *
 * @param {ImaCliCommand} Current command for which args are loaded.
 * @returns {CommandBuilder} Yargs commands object.
 */
function resolveCliPluginArgs(command: ImaCliCommand): CommandBuilder {
  const imaConfig = requireImaConfig();

  if (!imaConfig || !Array.isArray(imaConfig?.plugins)) {
    return {};
  }

  return imaConfig.plugins
    .filter(
      plugin => plugin?.cliArgs && Object.keys(plugin.cliArgs).length !== 0
    )
    .reduce((acc, cur) => {
      if (cur?.cliArgs && cur.cliArgs[command]) {
        return {
          ...acc,
          ...cur.cliArgs[command],
        };
      }

      return acc;
    }, {});
}

/**
 * Initializes shared args with their default values based
 * on the current CLI command.
 *
 * @param {ImaCliCommand} command Current CLI command identifier.
 * @returns {CommandBuilder} Object with shared args.
 */

function sharedArgsFactory(command: ImaCliCommand): CommandBuilder {
  return {
    clean: {
      desc: 'Clean build folder before building the application',
      type: 'boolean',
      default: true,
    },
    clearCache: {
      desc: 'Deletes node_modules/.cache directory to invalidate loaders cache',
      type: 'boolean',
    },
    verbose: {
      desc: 'Use default webpack CLI output instead of custom one',
      type: 'boolean',
    },
    ignoreWarnings: {
      desc: 'Webpack will no longer print warnings during compilation',
      type: 'boolean',
    },
  };
}

/**
 * Runs a command and waits for it to finish.
 */
function runCommand(command: string, args: string[], env = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

export { handlerFactory, resolveCliPluginArgs, sharedArgsFactory, runCommand };
