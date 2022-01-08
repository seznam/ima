import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
  WebpackError,
  Configuration,
  MultiCompiler,
  MultiStats
} from 'webpack';

import { CliArgs } from '../types';
import logger from './logger';
import { time } from './time';
import {
  formatStats,
  formatWebpackErrors,
  formatWebpackWarnings
} from './formatStats';
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
 * Cleans output (/build) directory if it exits. Defaults to
 * true for production environments.
 */
function cleanOutputDir(args: CliArgs): void {
  if (!args.clean) {
    // Clean at least hot directory silently
    fs.rmSync(path.join(args.rootDir, 'build/hot'), {
      recursive: true,
      force: true
    });

    return;
  }

  const outputDir = path.join(args.rootDir, 'build');

  if (!fs.existsSync(outputDir)) {
    return;
  }

  const elapsedClean = time();
  logger.info('Cleaning the build directory...', false);
  fs.rmSync(outputDir, { recursive: true });
  logger.write(chalk.gray(` [${elapsedClean()}]`));
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
  cleanOutputDir(args);

  const elapsed = time();
  logger.info('Running webpack compiler...', false);

  return new Promise((resolve, reject) => {
    compiler.run((error, stats) =>
      closeCompiler(compiler).then(() => {
        // Print elapsed time for first run
        logger.write(chalk.gray(` [${elapsed()}]`));

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

        // Call onDone callback
        imaConfig?.plugins?.forEach(plugin =>
          plugin?.onDone?.({ args, imaConfig, compiler })
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
  let elapsed: ReturnType<typeof time> | null = null;
  let firstStats: MultiStats | undefined | null;
  let firstRun = true;
  let hadFirstRunErrors = false;

  cleanOutputDir(args);
  elapsed = time();

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
      // Print elapsed time for first run
      if (elapsed) {
        elapsed && logger.write(chalk.gray(` [${elapsed()}]`));
        elapsed = null;

        // Save first stats object for later use in summary
        firstStats = stats;
      }

      // Don't continue when there are compile errors on first run
      if (firstRun && stats?.hasErrors()) {
        hadFirstRunErrors = true;
        formatWebpackErrors(stats, args);
        return;
      }

      if (hadFirstRunErrors) {
        hadFirstRunErrors = false;
        logger.info('Continuing with the compilation...');
      }

      // Reject with compiler when there are any errors
      if (error) {
        return reject(compiler);
      }

      // Format stats after plugin done callback
      if (firstStats) {
        formatStats(firstStats, args);
        firstStats = null;
      }

      // Print warnings
      formatWebpackWarnings(stats, args);

      // Print errors
      formatWebpackErrors(stats, args);

      // Call onDone callback
      imaConfig?.plugins?.forEach(plugin =>
        plugin?.onDone?.({ isFirstRun: firstRun, args, imaConfig, compiler })
      );

      // Update first run flag
      firstRun = false;

      return resolve(compiler);
    });
  });
}

export {
  closeCompiler,
  runCompiler,
  watchCompiler,
  handleError,
  cleanOutputDir
};
