import type { Logger } from '@ima/server';
import chalk from 'chalk';

import { formatError as devFormatError, parseError } from './cliUtils';
import { resolveErrorType } from './compileErrorParser';

/**
 * Dev Server Logger
 * Simple console-based logger for development server with async error parsing
 * Similar to the dev logger from loggerFactory but without Winston dependencies
 */

export interface DevServerLoggerOptions {
  rootDir?: string;
}

export interface LogMetadata {
  error?: Error & { getParams?: () => any };
  [key: string]: any;
}

/**
 * Colorize log level for console output - exact copy from devLogger
 */
function colorizeLevel(level: string): string {
  switch (level) {
    case 'log':
      return chalk.bold.white(`${level}: `);
    case 'info':
      return chalk.bold.cyan(`${level}: `);
    case 'warn':
      return chalk.bold.yellow(`${level}: `);
    case 'error':
      return chalk.bold.red(`${level}: `);
    case 'debug':
      return chalk.bold.green(`${level}: `);
    case 'trace':
      return chalk.bold.magenta(`${level}: `);
    default:
      return chalk.bold.gray(`${level}: `);
  }
}

/**
 * Dev Server Logger Class
 * Perfect copy of devLogger ConsoleAsync transport without Winston
 */
export class DevServerLogger implements Logger {
  public name: string;
  public rootDir: string;

  constructor(options: DevServerLoggerOptions = {}) {
    this.name = 'console-async';
    this.rootDir = options.rootDir || process.cwd();
  }

  /**
   * Main log method - exact copy of ConsoleAsync._log
   */
  private async _log(meta: any): Promise<void> {
    let message = meta.message;

    // Parse error
    if (meta?.error?.message) {
      try {
        const parsedErrorData = await parseError(
          meta.error,
          resolveErrorType(meta.error)
        );
        message = await devFormatError(parsedErrorData, this.rootDir);
      } catch {
        // Fallback to original error message
        message = meta?.error?.message;
      }
    }

    // Output to console
    ((console as any)[meta.level] ?? console.log)(
      `${colorizeLevel(meta.level)}${message}`
    );

    // Log additional error params
    if (meta?.error?.getParams) {
      ((console as any)[meta.level] ?? console.log)(
        chalk.redBright(`Error Params:\n`)
      );
      ((console as any)[meta.level] ?? console.log)(meta?.error?.getParams());
    }
  }

  /**
   * Log message (synchronous version for Logger interface compatibility)
   */
  log(message: string, ...args: any[]): Promise<void> {
    return this._log({
      level: 'log',
      message,
      args,
    });
  }

  /**
   * Log info level message
   */
  info(message: string, metadata?: LogMetadata): Promise<void> {
    return this._log({
      level: 'info',
      message,
      ...metadata,
    });
  }

  /**
   * Log warning level message
   */
  warn(message: string, metadata?: LogMetadata): Promise<void> {
    return this._log({
      level: 'warn',
      message,
      ...metadata,
    });
  }

  /**
   * Log error level message
   */
  error(message: string | Error, metadata?: LogMetadata): Promise<void> {
    return this._log({
      level: 'error',
      message: typeof message === 'string' ? message : message.message,
      error: message instanceof Error ? message : undefined,
      ...metadata,
    });
  }

  /**
   * Log debug level message
   */
  debug(message: string, metadata?: LogMetadata): Promise<void> {
    return this._log({
      level: 'debug',
      message,
      ...metadata,
    });
  }

  /**
   * Log trace level message
   */
  trace(message: string, metadata?: LogMetadata): Promise<void> {
    return this._log({
      level: 'trace',
      message,
      ...metadata,
    });
  }
}

/**
 * Create dev server logger instance - exact equivalent of devLogger
 *
 * @param options - Logger options
 * @returns DevServerLogger instance
 */
export function createDevServerLogger(
  options: DevServerLoggerOptions = {}
): DevServerLogger {
  return new DevServerLogger({
    rootDir: options.rootDir || process.cwd(),
  });
}
