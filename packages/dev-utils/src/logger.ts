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

/**
 * Prints current time in HH:MM:SS format.
 */
export function printTime() {
  const d = new Date(),
    h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
    m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
    s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

  return chalk.gray(`[${h}:${m}:${s}]`);
}

export class Logger {
  #identifier?: string;
  #globalLogger?: Logger;
  #isSilent = false;

  innerElapsed?: ReturnType<typeof time>;

  constructor(identifier?: string, globalLogger?: Logger) {
    this.#identifier = identifier;
    this.#globalLogger = globalLogger;
  }

  #log(
    prefix: string,
    chalkFn: (input: string | number | null | undefined) => string,
    message: string,
    { newLine = true, trackTime = false, elapsed }: LoggerOptions = {}
  ): void {
    // Don't continue if logger is silenced
    if (this.#isSilent) {
      return;
    }

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
          `${prefix}: ${this.#identifier ? `(${this.#identifier}) ` : ''}`
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

  endTracking(): void {
    // Write elapsed for previous log
    if (this.innerElapsed) {
      this.writeElapsed(this.innerElapsed);
      this.innerElapsed = undefined;

      return;
    }

    // Write elapsed for previous log
    if (this.#globalLogger?.innerElapsed) {
      this.writeElapsed(this.#globalLogger.innerElapsed);
      this.#globalLogger.innerElapsed = undefined;

      return;
    }
  }

  info(message: string, options?: LoggerOptions) {
    this.#log('info', chalk.bold.cyan, message, options);
  }

  success(message: string, options?: LoggerOptions) {
    this.#log('success', chalk.bold.green, message, options);
  }

  error(message: string | Error, options?: LoggerOptions) {
    if (message instanceof Error) {
      const [_, ...stackLines] = message.stack?.split('\n') ?? '';

      // Print error name and message
      this.#log(
        'error',
        chalk.bold.red,
        `${chalk.underline(message.name)}: ${message.message.trim()}`,
        options
      );

      // Print stack
      this.write(`\n${chalk.gray(stackLines.join('\n'))}\n`);
    } else {
      this.#log('error', chalk.bold.red, message, options);
    }
  }

  warn(message: string, options?: LoggerOptions) {
    this.#log('warn', chalk.bold.yellow, message, options);
  }

  sync(message: string, options?: LoggerOptions) {
    this.#log('sync', chalk.bold.magenta, message, options);
  }

  plugin(message: string, options?: LoggerOptions) {
    this.#log('plugin', chalk.bold.blue, message, options);
  }

  write(message: string, options?: LoggerOptions) {
    this.#log('', chalk.bold.blue, message, options);
  }

  writeElapsed(elapsed: ReturnType<typeof time>) {
    process.stdout.write(chalk.gray(` [${elapsed()}]\n`));
  }

  setSilent(isSilent: boolean) {
    this.#isSilent = isSilent;
  }

  isSilent() {
    return this.#isSilent;
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
