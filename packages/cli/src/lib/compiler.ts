import chalk from 'chalk';
import { WebpackError, Configuration, MultiCompiler } from 'webpack';

import { CliArgs } from '../types';
import logger from './logger';
import { time } from './time';
import { formatStats } from './formatStats';
import { ImaConfig } from '..';

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
 * @param {ImaConfig} imaConfig loaded ima.config.js.
 * @returns {Promise<Error | MultiStats | undefined>} Stats or error.
 */
async function runCompiler(
  compiler: MultiCompiler,
  args: CliArgs,
  imaConfig: ImaConfig
): Promise<MultiCompiler> {
  const elapsed = time();
  logger.info('Running webpack compiler...', false);

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) =>
      closeCompiler(compiler).then(() => {
        // Print elapsed time
        elapsed && logger.write(chalk.gray(` [${elapsed()}]`));

        if (error) {
          // Call error callback
          imaConfig?.plugins?.forEach(plugin =>
            plugin?.onError?.({ error, args, imaConfig, compiler })
          );

          return reject(compiler);
        }

        // Format stats after plugin done callback
        formatStats(stats, args);

        // Call onDone callback
        imaConfig?.plugins?.forEach(plugin =>
          plugin?.onDone?.({
            args,
            imaConfig,
            compiler
          })
        );

        return resolve(compiler);
      })
    );
  });
}

/**
 * Runs webpack compiler with given configuration.
 *
 * @param {MultiCompiler} compiler Webpack compiler instance
 * @param {CliArgs} args Cli and build args.
 * @param {ImaConfig} imaConfig loaded ima.config.js.
 * @param {Configuration['watchOptions']={}} watchOptions
 *        Additional watch options.
 * @returns {Promise<MultiCompiler>} compiler instance.
 */
async function watchCompiler(
  compiler: MultiCompiler,
  args: CliArgs,
  imaConfig: ImaConfig,
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
        // Call error callback
        imaConfig?.plugins?.forEach(plugin =>
          plugin?.onError?.({ error, args, imaConfig, compiler })
        );

        return reject(compiler);
      }

      // Format stats after plugin done callback
      formatStats(stats, args);

      // Call onDone callback
      imaConfig?.plugins?.forEach(plugin =>
        plugin?.onDone?.({ firstRun, args, imaConfig, compiler })
      );

      return resolve(compiler);
    });
  });
}

export { closeCompiler, runCompiler, watchCompiler, handleError };
