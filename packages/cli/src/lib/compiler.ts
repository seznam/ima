import chalk from 'chalk';
import { WebpackError, Configuration, MultiCompiler } from 'webpack';

import { CliArgs } from '../types';
import logger from './logger';
import { time } from './time';
import { formatStats } from './formatStats';

/**
 * Handles webpack compile errors.
 *
 * @param {WebpackError | unknown} err
 * @returns {void}
 */
function handleError(err: WebpackError | unknown): void {
  if (err instanceof Error) {
    err?.stack && logger.error(err.stack);
  } else if (err instanceof WebpackError) {
    err?.stack && logger.error(err.stack);
    err?.details && logger.error(err.details);
  } else {
    logger.error('Unexpected error occurred');
  }
}

/**
 * Promise based helper to close running webpack compiler.
 *
 * @param {MultiCompiler} compiler Compiler instance to close
 * @returns {Promise<Error | void>} Any unexpected rejection error or nothing.
 */
async function closeCompiler(compiler: MultiCompiler): Promise<Error | void> {
  return new Promise((resolve, reject) =>
    compiler.close(closeError => (closeError ? reject(closeError) : resolve()))
  );
}

/**
 * Runs webpack compiler with given configuration.
 *
 * @param {MultiCompiler} compiler Webpack compiler instance
 * @param {CliArgs} args Cli and build args.
 * @returns {Promise<Error | MultiStats | undefined>} Stats or error.
 */
async function runCompiler(
  compiler: MultiCompiler,
  args: CliArgs
): Promise<MultiCompiler> {
  const elapsed = time();
  logger.info('Running webpack compiler...', false);

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) =>
      closeCompiler(compiler).then(() => {
        // Print elapsed time
        elapsed && logger.write(chalk.gray(` [${elapsed()}]`));

        if (error) {
          reject(compiler);
        }

        formatStats(stats, args);
        resolve(compiler);
      })
    );
  });
}

/**
 * Runs webpack compiler with given configuration.
 *
 * @param {MultiCompiler} compiler Webpack compiler instance
 * @param {CliArgs} args Cli and build args.
 * @param {Configuration['watchOptions']={}} watchOptions
 *        Additional watch options.
 * @returns {Promise<MultiCompiler>} compiler instance.
 */
async function watchCompiler(
  compiler: MultiCompiler,
  args: CliArgs,
  watchOptions: Configuration['watchOptions'] = {}
): Promise<MultiCompiler> {
  const elapsed = time();
  let firstRun = true;

  logger.info(
    `Running webpack watch compiler${
      args.legacy
        ? ` ${chalk.black.bgCyan('in legacy (es5 compatible) mode')}`
        : ''
    }...`,
    false
  );

  return new Promise<MultiCompiler>((resolve, reject) => {
    compiler.watch(watchOptions, (error, stats) => {
      if (firstRun) {
        // Print elapsed time
        elapsed && logger.write(chalk.gray(` [${elapsed()}]`));
        firstRun = false;
      }

      if (error) {
        reject(compiler);
      }

      formatStats(stats, args);
      resolve(compiler);
    });
  });
}

export { closeCompiler, runCompiler, watchCompiler, handleError };
