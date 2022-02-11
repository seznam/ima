import chalk from 'chalk';
import { WebpackError, MultiCompiler } from 'webpack';

import { ImaCliArgs, ImaConfig } from '../types';
import { runImaPluginsHook } from '../webpack/utils';
import {
  formatStats,
  formatWebpackErrors,
  formatWebpackWarnings,
} from './formatStats';
import { logger } from './logger';

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
    logger.write(chalk.red('Unexpected error occurred, closing compiler...'));
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
 * @param {ImaCliArgs} args Cli and build args.
 * @param {ImaConfig} imaConfig loaded ima.config.js.
 * @returns {Promise<Error | MultiStats | undefined>} Stats or error.
 */
async function runCompiler(
  compiler: MultiCompiler,
  args: ImaCliArgs,
  imaConfig: ImaConfig
): Promise<MultiCompiler> {
  logger.info('Running webpack compiler...', { trackTime: true });

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) =>
      closeCompiler(compiler).then(async () => {
        // Print elapsed time for first run
        logger.endTracking();

        // Reject with compiler when there are any errors
        if (error || stats?.hasErrors()) {
          if (stats) {
            formatWebpackErrors(stats, args);
          } else if (error) {
            logger.error(error.toString());
          }

          return reject(compiler);
        }

        // Format stats after plugin done callback
        formatStats(stats, args);

        // Print warnings
        formatWebpackWarnings(stats, args);

        // Run postProcess hook
        await runImaPluginsHook(args, imaConfig, 'postProcess');

        return resolve(compiler);
      })
    );
  });
}

/**
 * Runs webpack compiler with given configuration.
 *
 * @param {MultiCompiler} compiler Webpack compiler instance
 * @param {ImaCliArgs} args Cli and build args.
 * @param {ImaConfig} imaConfig loaded ima.config.js.
 * @param {Configuration['watchOptions']={}} watchOptions
 *        Additional watch options.
 * @returns {Promise<MultiCompiler>} compiler instance.
 */
async function watchCompiler(
  compiler: MultiCompiler,
  args: ImaCliArgs,
  imaConfig: ImaConfig
): Promise<MultiCompiler> {
  let firstRun = true;
  let hadErrorsOnFirstRun = false;

  logger.info(
    `Running webpack watch compiler${
      args.legacy
        ? ` ${chalk.black.bgCyan('in legacy (es5 compatible) mode')}`
        : ''
    }...`,
    { trackTime: true }
  );

  return new Promise<MultiCompiler>((resolve, reject) => {
    compiler.watch(imaConfig.watchOptions, async (error, stats) => {
      // Print elapsed time for first run
      logger.endTracking();

      // Don't continue when there are compile errors on first run
      if (firstRun && stats?.hasErrors()) {
        hadErrorsOnFirstRun = true;
        formatWebpackErrors(stats, args);
        return;
      }

      if (hadErrorsOnFirstRun) {
        hadErrorsOnFirstRun = false;
        logger.info('Continuing with the compilation...');
      }

      // Reject with compiler when there are any errors
      if (error) {
        return reject(compiler);
      }

      // Format stats after plugin done callback
      if (firstRun) {
        formatStats(stats, args);
      }

      // Print warnings
      formatWebpackWarnings(stats, args);

      // Print errors
      formatWebpackErrors(stats, args);

      // Run postProcess hook
      await runImaPluginsHook(args, imaConfig, 'postProcess', firstRun);

      // Update first run flag
      firstRun = false;

      return resolve(compiler);
    });
  });
}

export { closeCompiler, runCompiler, watchCompiler, handleError };
