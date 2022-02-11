import chalk from 'chalk';

import { ImaCliPlugin } from '../types';
import { time } from './time';

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
  ): void {
    // Print elapsed if previously timed
    this.endTracking();

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
      this.writeElapsed(elapsed);
    }

    // Write newline (ignore when some kind of time tracking is enabled)
    if (newLine && !this._innerElapsed && !elapsed) {
      process.stdout.write('\n');
    }
  }

  public endTracking(): void {
    // Write elapsed for previous log
    if (this._innerElapsed) {
      this.writeElapsed(this._innerElapsed);
      this._innerElapsed = undefined;
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

  public writeElapsed(elapsed: ReturnType<typeof time>): void {
    process.stdout.write(chalk.gray(` [${elapsed()}]\n`));
  }
}

function createLogger(imaPlugin: ImaCliPlugin): Logger {
  return new Logger(imaPlugin.name);
}

const logger = new Logger();

export { createLogger, logger };
