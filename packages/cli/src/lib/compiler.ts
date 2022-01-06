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
 * Cleans output (/build) directory if it exits. Defaults to
 * true for production environments.
 */
function cleanOutputDir(args: CliArgs): void {
  if (!args.clean) {
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
 * Watch and run compiler promise handler. Takes care of formatting
 * and printing output from webpack stats.
 */
function handleCompiler({
  firstRun,
  elapsed,
  error,
  compiler,
  args,
  imaConfig,
  stats,
  reject,
  resolve
}: {
  firstRun: boolean;
  elapsed: ReturnType<typeof time>;
  error: Error | undefined;
  compiler: MultiCompiler;
  args: CliArgs;
  imaConfig: ImaConfig;
  stats: MultiStats | undefined;
  reject: (compiler: MultiCompiler) => void;
  resolve: (compiler: MultiCompiler) => void;
}): void {
  if (firstRun) {
    // Print elapsed time for first run
    elapsed && logger.write(chalk.gray(` [${elapsed()}]`));
  }

  // Reject with compiler
  if (error) {
    return reject(compiler);
  }

  // Format stats after plugin done callback
  formatStats(stats, args);

  // Call onDone callback
  imaConfig?.plugins?.forEach(plugin =>
    plugin?.onDone?.({ firstRun, args, imaConfig, compiler })
  );

  return resolve(compiler);
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
      closeCompiler(compiler).then(() =>
        handleCompiler({
          firstRun: true,
          args,
          compiler,
          elapsed,
          error,
          imaConfig,
          reject,
          resolve,
          stats
        })
      )
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
  let firstRun = true;
  cleanOutputDir(args);

  const elapsed = time();
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
      handleCompiler({
        firstRun,
        args,
        compiler,
        elapsed,
        error,
        imaConfig,
        reject,
        resolve,
        stats
      });

      // Update first run flag
      firstRun = false;
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
