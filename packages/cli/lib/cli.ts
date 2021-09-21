import path from 'path';
import { Arguments } from 'yargs';
import chalk from 'chalk';

import { BaseArgs, HandlerFn } from '../types';

const IMA_CLI_RUN_SERVER_MESSAGE = 'ima-cli-run-server-message';

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
 * Print utility functions generator
 *
 * @param {string} prefix Logged prefix text.
 * @param {chalk.Chalk} chalkFn Styling chalk function.
 * @returns {(message: string, newLine: false) => void} Log function.
 */
function printFnFactory(prefix: string, chalkFn: chalk.Chalk) {
  return (message: string, newLine = false) => {
    newLine && console.log('');
    console.log(`${chalkFn(`${prefix}:`)} ${message}`);
  };
}

const info = printFnFactory('info', chalk.cyan.bold);
const success = printFnFactory('success', chalk.green.bold);
const error = printFnFactory('error', chalk.red.bold);
const warn = printFnFactory('warn', chalk.yellow.bold);
const update = printFnFactory('update', chalk.magenta.bold);

export {
  IMA_CLI_RUN_SERVER_MESSAGE,
  handlerFactory,
  info,
  success,
  error,
  warn,
  update
};
