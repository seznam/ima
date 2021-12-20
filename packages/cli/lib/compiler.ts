import pc from 'picocolors';
import {
  WebpackError,
  Configuration,
  MultiCompiler,
  MultiStats
} from 'webpack';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';

import { CliArgs } from '../types';
import {
  formatWebpackErrors,
  formatWebpackWarnings
} from './formatWebpackStats';
import logger from './logger';

let isFirstRun = true;
const warningsCache = new Set<string>();

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
 * Handles stats logging during webpack build and watch tasks.
 *
 * @param {MultiStats|undefined} stats Webpack stats object.
 * @param {CliArgs} args Cli and build args.
 * @returns {void}
 */
function handleStats(stats: MultiStats | undefined, args: CliArgs): void {
  if (!stats) {
    return logger.error('Unknown error, stats are empty');
  }

  // Print raw webpack log
  if (args?.verbose) {
    return console.log(
      stats.toString({
        assets: true,
        cached: false,
        children: false,
        chunks: false,
        chunkModules: false,
        colors: true,
        hash: true,
        modules: false,
        reasons: false,
        source: false,
        timings: true,
        version: true
      })
    );
  }

  const { children, errors, warnings } = stats.toJson({
    all: false,
    assets: true,
    timings: true,
    version: true,
    errors: true,
    warnings: true,
    outputPath: true,
    chunkGroups: true
  });

  // Print errors and warnings
  if (!args.ignoreWarnings) {
    const newWarnings = [];

    // Cache unique warnings
    if (warnings) {
      for (const warning of warnings) {
        if (!warningsCache.has(warning.message)) {
          warningsCache.add(warning.message);
          newWarnings.push(warning);
        }
      }
    }

    formatWebpackWarnings(newWarnings, args.rootDir);
  }

  formatWebpackErrors(errors);

  // Output
  if (isFirstRun) {
    children?.forEach((child, index) => {
      if (index === 0) {
        logger.info(
          `Compilation was ${pc.green(
            'successful'
          )} using webpack version: ${pc.magenta(child.version)}`
        );

        logger.info(`Output folder ${pc.magenta(child.outputPath)}`);
      }

      logger.info(
        `${pc.underline(child.name)} Compiled in ${pc.green(
          prettyMs(child.time ?? 0)
        )}`
      );

      if (child?.namedChunkGroups) {
        Object.keys(child.namedChunkGroups).forEach(chunkKey => {
          child?.namedChunkGroups?.[chunkKey]?.assets?.forEach(
            ({ name, size }) => {
              console.log(
                ` ${pc.gray('├')} ${name} ${
                  size && pc.yellow(prettyBytes(size))
                }`
              );
            }
          );
        });
      }
    });

    isFirstRun = false;
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
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) =>
      closeCompiler(compiler).then(() => {
        if (error) {
          reject(compiler);
        }

        handleStats(stats, args);
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
  return new Promise<MultiCompiler>((resolve, reject) => {
    compiler.watch(watchOptions, (error, stats) => {
      if (error) {
        reject(compiler);
      }

      handleStats(stats, args);
      resolve(compiler);
    });
  });
}

export { closeCompiler, runCompiler, watchCompiler, handleError };
