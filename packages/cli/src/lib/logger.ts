import chalk from 'chalk';

import { ImaCliPlugin } from '../types';
import { time } from './time';

/**
 * Print utility functions generator
 *
 * @param {string} prefix Logged prefix text.
 * @param {chalk} chalkFn Styling function.
 * @returns {(message: string, newLine: false) => void} Log function.
 */
function printFnFactory(
  prefix?: string,
  chalkFn?: {
    (input: string | number | null | undefined): string;
  }
) {
  return (message: string, newLine = true) => {
    if (chalkFn && prefix) {
      process.stdout.write(`${chalkFn(`${prefix}:`)} `);
    }

    process.stdout.write(message);
    newLine && process.stdout.write('\n');
  };
}

// Define logger factory functions
const write = printFnFactory();
const info = printFnFactory('info', chalk.bold.cyan);
const success = printFnFactory('success', chalk.bold.green);
const error = printFnFactory('error', chalk.bold.red);
const warn = printFnFactory('warn', chalk.bold.yellow);
const update = printFnFactory('update', chalk.bold.magenta);
const plugin = printFnFactory('plugin', chalk.bold.blue);

export interface LoggerOptions {
  trackTime?: boolean;
  newLine?: boolean;
  elapsed?: ReturnType<typeof time>;
}

class Logger {
  private _innerElapsed?: ReturnType<typeof time>;
  private _identifier?: string;

  constructor(identifier?: string) {
    this._identifier = identifier;
  }

  private _log(
    prefix: string,
    chalkFn: (input: string | number | null | undefined) => string,
    message: string,
    { newLine = true, trackTime = false, elapsed }: LoggerOptions = {}
  ) {
    // Write elapsed for previous log
    if (this._innerElapsed) {
      process.stdout.write(chalk.gray(` [${this._innerElapsed()}]\n`));
      this._innerElapsed = undefined;
    }

    // Track time
    if (trackTime) {
      this._innerElapsed = time();
    }

    // Write prefix (optionally with identifier)
    if (prefix) {
      process.stdout.write(
        chalkFn(
          `${prefix}: ${this._identifier ? `(${this._identifier}) ` : ''}`
        )
      );
    }

    // Write message
    process.stdout.write(message);

    // Write elapsed time if provided
    if (elapsed) {
      process.stdout.write(chalk.gray(` [${elapsed()}]`));
    }

    // Write newline
    if (newLine && !this._innerElapsed) {
      process.stdout.write('\n');
    }
  }

  public info(message: string, options?: LoggerOptions) {
    this._log('info', chalk.bold.cyan, message, options);
  }

  public success(message: string, options?: LoggerOptions) {
    this._log('succ', chalk.bold.green, message, options);
  }

  public error(message: string, options?: LoggerOptions) {
    this._log(' err', chalk.bold.red, message, options);
  }

  public warn(message: string, options?: LoggerOptions) {
    this._log('warn', chalk.bold.yellow, message, options);
  }

  public update(message: string, options?: LoggerOptions) {
    this._log('updt', chalk.bold.magenta, message, options);
  }

  public plugin(message: string, options?: LoggerOptions) {
    this._log('plug', chalk.bold.blue, message, options);
  }

  public write(message: string, options?: LoggerOptions) {
    this._log('', chalk.bold.blue, message, options);
  }
}

function createLogger(imaPlugin: ImaCliPlugin): Logger {
  return new Logger(imaPlugin.name);
}

export { write, info, success, error, warn, update, plugin, createLogger };
