import { MultiCompiler } from 'webpack';

import { ImaCliArgs, ImaConfig } from '../types';
import { runImaPluginsHook } from '../webpack/utils';
import {
  formatStats,
  formatWebpackErrors,
  formatWebpackWarnings,
} from './formatStats';
import { logger } from './logger';

/**
 * Cli Error handler.
 *
 * @param {Error | unknown} err
 * @returns {void}
 */
function handleError(error: Error | unknown): void {
  logger.error(
    (error as Error) ?? 'Unexpected error occurred, closing the compiler...'
  );
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
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) =>
      closeCompiler(compiler).then(async () => {
        // Reject when there are any errors
        if (error || stats?.hasErrors()) {
          if (stats) {
            await formatWebpackErrors(stats, args);
          } else if (error) {
            logger.error(error);
          }

          return reject(error);
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
 * Runs webpack watch compiler with given configuration.
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

  return new Promise<MultiCompiler>((resolve, reject) => {
    compiler.watch(imaConfig.watchOptions, async (error, stats) => {
      // Don't continue when there are compile errors on first run
      if (firstRun && stats?.hasErrors()) {
        hadErrorsOnFirstRun = true;
        await formatWebpackErrors(stats, args);
        return;
      }

      if (hadErrorsOnFirstRun) {
        hadErrorsOnFirstRun = false;
        logger.info('Continuing with the compilation...');
      }

      // Reject when there are any compiler errors
      if (error) {
        return reject(error);
      }

      // Format stats after plugin done callback
      if (firstRun) {
        formatStats(stats, args);
      }

      // Print warnings
      formatWebpackWarnings(stats, args);

      // Print errors
      await formatWebpackErrors(stats, args);

      // Update first run flag
      firstRun = false;

      return resolve(compiler);
    });
  });
}

export { closeCompiler, runCompiler, watchCompiler, handleError };
