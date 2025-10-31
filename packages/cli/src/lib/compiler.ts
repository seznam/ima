import { logger } from '@ima/dev-utils/logger';
import { MultiCompiler } from 'webpack';

import {
  formatStats,
  formatWebpackErrors,
  formatWebpackWarnings,
} from './formatStats';
import { ImaCliArgs, ImaConfig } from '../types';
import { getProgress } from '../webpack/plugins/ProgressPlugin';
import { runImaPluginsHook } from '../webpack/utils/utils';

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
        // Stop CLI progress bar
        getProgress().stop();

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

  return new Promise<MultiCompiler>(resolve => {
    compiler.watch(imaConfig.watchOptions, async (error, stats) => {
      // Stop CLI progress bar
      getProgress().stop();

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
