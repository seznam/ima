import path from 'path';
import { Arguments } from 'yargs';
import pc from 'picocolors';

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
 * @param {picocolors} picoColorsFn Styling function.
 * @returns {(message: string, newLine: false) => void} Log function.
 */
function printFnFactory(
  prefix: string,
  picoColorsFn: {
    (input: string | number | null | undefined): string;
  }
) {
  return (message: string, newLine = false) => {
    newLine && console.log('');
    console.log(`${picoColorsFn(`${prefix}:`)} ${message}`);
  };
}

const info = printFnFactory('info', pc.cyan);
const success = printFnFactory('success', pc.green);
const error = printFnFactory('error', pc.red);
const warn = printFnFactory('warn', pc.yellow);
const update = printFnFactory('update', pc.magenta);

export {
  IMA_CLI_RUN_SERVER_MESSAGE,
  handlerFactory,
  info,
  success,
  error,
  warn,
  update
};
