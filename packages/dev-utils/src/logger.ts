import chalk from 'chalk';
import prettyMs from 'pretty-ms';

export interface LoggerOptions {
  trackTime?: boolean;
  newLine?: boolean;
  elapsed?: ReturnType<typeof time>;
}

/**
 * Returns time utility function, which when called returns
 * formatted elapsed time from it's creation.
 *
 * @returns {() => string} Callback to return formatted elapsed time.
 */
export function time(): () => string {
  const start = process.hrtime.bigint();

  return () =>
    prettyMs(Number((process.hrtime.bigint() - start) / BigInt(1e6)));
}

export class Logger {
  private _identifier?: string;
  private _globalLogger?: Logger;

  innerElapsed?: ReturnType<typeof time>;

  constructor(identifier?: string, globalLogger?: Logger) {
    this._identifier = identifier;
    this._globalLogger = globalLogger;
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
      this.innerElapsed = time();
    }

    // Write prefix (optionally with identifier)
    if (prefix) {
      process.stdout.write(
        chalkFn(
          `${prefix}: ${this._identifier ? `(${this._identifier}) ` : ''}`
        )
      );
    }

    try {
      // Write message
      message = message ?? typeof message;
      process.stdout.write(message);
    } catch (error) {
      console.error(error);
    }

    // Write elapsed time if provided
    if (elapsed) {
      this.writeElapsed(elapsed);
    }

    // Write newline (ignore when some kind of time tracking is enabled)
    if (newLine && !this.innerElapsed && !elapsed) {
      process.stdout.write('\n');
    }
  }

  public endTracking(): void {
    // Write elapsed for previous log
    if (this.innerElapsed) {
      this.writeElapsed(this.innerElapsed);
      this.innerElapsed = undefined;

      return;
    }

    // Write elapsed for previous log
    if (this._globalLogger?.innerElapsed) {
      this.writeElapsed(this._globalLogger.innerElapsed);
      this._globalLogger.innerElapsed = undefined;

      return;
    }
  }

  public info(message: string, options?: LoggerOptions) {
    this._log('info', chalk.bold.cyan, message, options);
  }

  public success(message: string, options?: LoggerOptions) {
    this._log('success', chalk.bold.green, message, options);
  }

  public error(message: string | Error, options?: LoggerOptions) {
    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...stackLines] = message.stack?.split('\n') ?? '';

      // Print error name and message
      this._log(
        'error',
        chalk.bold.red,
        `${chalk.underline(message.name)}: ${message.message.trim()}`,
        options
      );

      // Print stack
      this.write(`\n${chalk.gray(stackLines.join('\n'))}\n`);
    } else {
      this._log('error', chalk.bold.red, message, options);
    }
  }

  public warn(message: string, options?: LoggerOptions) {
    this._log('warn', chalk.bold.yellow, message, options);
  }

  public sync(message: string, options?: LoggerOptions) {
    this._log('sync', chalk.bold.magenta, message, options);
  }

  public plugin(message: string, options?: LoggerOptions) {
    this._log('plugin', chalk.bold.blue, message, options);
  }

  public write(message: string, options?: LoggerOptions) {
    this._log('', chalk.bold.blue, message, options);
  }

  public writeElapsed(elapsed: ReturnType<typeof time>): void {
    process.stdout.write(chalk.gray(` [${elapsed()}]\n`));
  }
}

/**
 * Create global logger instance
 */
const globalLogger = new Logger();
export { globalLogger as logger };

export function createLogger(name: string): Logger {
  return new Logger(name, globalLogger);
}
