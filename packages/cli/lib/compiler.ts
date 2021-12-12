import pc from 'picocolors';
import webpack, {
  WebpackError,
  Configuration,
  MultiCompiler,
  MultiStats
} from 'webpack';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';

import { Args, VerboseOptions } from '../types';
import { error, warn, info } from './cli';

/**
 * Handles script running and webpack compilation error logging.
 *
 * @param {WebpackError | unknown} err
 * @returns {void}
 */
function handleError(err: WebpackError | unknown): void {
  if (err instanceof Error) {
    err?.stack && error(err.stack);
  } else if (err instanceof WebpackError) {
    err?.stack && error(err.stack);
    err?.details && error(err.details);
  } else {
    error('Unexpected error occurred');
  }
}

/**
 * Handles stats logging during webpack build and watch tasks.
 *
 * @param {MultiStats|undefined} stats Webpack stats object.
 * @param {VerboseOptions} verbose Optional level of verbosity.
 * @returns {void}
 */
function handleStats(
  stats: MultiStats | undefined,
  verbose: VerboseOptions = VerboseOptions.DEFAULT
): void {
  if (!stats) {
    return error('Unknown error, stats are empty');
  }

  const statsOptions = {
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
  };

  // Print raw webpack log
  if (verbose === VerboseOptions.RAW) {
    return console.log(stats.toString(statsOptions));
  }

  const { children, errors = [], warnings = [] } = stats.toJson(statsOptions);

  // Print errors
  if (stats.hasErrors()) {
    error('Errors');
    return errors.forEach(({ compilerPath, message, details }) => {
      error(
        `[${compilerPath}]\n${message} ${
          verbose && details ? '\n' + details : ''
        }`,
        true
      );
    });
  }

  // Print warnings
  if (stats.hasWarnings()) {
    warnings.forEach(({ compilerPath, message, details }) => {
      warn(
        `[${compilerPath}]\n${message} ${
          verbose && details ? '\n' + details : ''
        }`,
        true
      );
    });
  }

  // Output
  children?.forEach((child, index) => {
    if (index === 0) {
      info(
        `Compilation was ${pc.green(
          'successful'
        )} using webpack version: ${pc.magenta(child.version)}`,
        stats.hasWarnings() || stats.hasErrors()
      );

      info(`Output folder ${pc.magenta(child.outputPath)}`);
    }

    info(`[${child.name}] Compiled in ${pc.green(prettyMs(child.time ?? 0))}`);

    if (child?.namedChunkGroups) {
      Object.keys(child.namedChunkGroups).forEach(chunkKey => {
        child?.namedChunkGroups?.[chunkKey]?.assets?.forEach(
          ({ name, size }) => {
            console.log(
              ` ${pc.gray('├')} ${name} ${size && pc.yellow(prettyBytes(size))}`
            );
          }
        );
      });
    }
  });
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
 * @param {Configuration[]} config Webpack configurations.
 * @param {Args} args Cli and build args.
 * @returns {Promise<Error | MultiStats | undefined>} Stats or error.
 */
async function runCompiler(
  config: Configuration[],
  args: Args
): Promise<Error | MultiStats | undefined> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.run((error, stats) =>
      closeCompiler(compiler).then(() => {
        if (error) {
          reject(error);
        }

        handleStats(stats, args?.verbose ?? VerboseOptions.DEFAULT);
        resolve(stats);
      })
    );
  });
}

/**
 * Runs webpack compiler with given configuration.
 *
 * @param {Configuration[]} config Webpack configurations.
 * @param {Args} args Cli and build args.
 * @param {Configuration['watchOptions']={}} watchOptions
 *        Additional watch options.
 * @returns {Promise<MultiCompiler>} compiler instance.
 */
async function watchCompiler(
  config: Configuration[],
  args: Args,
  watchOptions: Configuration['watchOptions'] = {}
): Promise<MultiCompiler> {
  let firstRun = true;

  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.watch(watchOptions, (error, stats) => {
      if (error) {
        reject(compiler);
      }

      if (firstRun) {
        firstRun = false;
        handleStats(stats, args?.verbose ?? VerboseOptions.DEFAULT);
      }

      resolve(compiler);
    });
  });
}

export { closeCompiler, runCompiler, watchCompiler, handleError };