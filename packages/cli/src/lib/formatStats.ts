import fs from 'fs';
import chalk from 'chalk';
import { MultiStats, StatsAsset, StatsError } from 'webpack';
import { highlight, fromJson } from 'cli-highlight';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';

import { createSourceFragment, parseCompileError } from './compileErrorParser';
import logger from './logger';
import { CliArgs } from '../types';

/**
 * Prints formatted webpack errors (stripped from duplicates) into console.
 */
function formatWebpackErrors(errors: StatsError[] | undefined): void {
  if (!errors) {
    return;
  }

  // Parse errors
  const parsedErrors = [];
  for (const error of errors) {
    const parsedError = parseCompileError(error);

    if (parsedError) {
      parsedErrors.push(parsedError);
    }
  }

  // Filter out duplicates
  let filteredParsedErrors = [];
  for (const parsedError of parsedErrors) {
    if (
      filteredParsedErrors.findIndex(
        error =>
          error.name === parsedError.name &&
          error.message === parsedError.message &&
          error.fileUri === parsedError.fileUri
      ) === -1
    ) {
      filteredParsedErrors.push(parsedError);
    }
  }

  // Print only syntax errors
  if (filteredParsedErrors.some(error => error.name === 'Syntax error')) {
    filteredParsedErrors = filteredParsedErrors.filter(
      error => error.name === 'Syntax error'
    );
  }

  // Print filtered errors
  filteredParsedErrors.forEach(parsedError => {
    // Print message right away, if we don't manage to parse it
    if (!parsedError.fileUri || !parsedError.lineNumber) {
      return logger.error(
        `${chalk.underline(parsedError.name + ':')} ${parsedError.message}\n`
      );
    }

    const file = fs.readFileSync(parsedError.fileUri, 'utf8');
    const fileLines = createSourceFragment(parsedError.lineNumber, file, 4);

    // Print error
    logger.error(`at ${chalk.cyan(parsedError.fileUri)}`);
    console.log(
      `${chalk.underline(parsedError.name + ':')} ${parsedError.message}\n`
    );

    // Print source fragment
    fileLines.forEach(line => {
      console.log(
        chalk.gray(`${line.highlight ? chalk.red('>') : ' '}  ${line.line} | `),
        highlight(line.source, {
          language: parsedError.fileUri?.split('.').pop() ?? 'javascript',
          ignoreIllegals: true,
          theme: fromJson({
            keyword: 'cyan',
            class: 'yellow',
            built_in: 'yellow',
            function: 'magenta',
            string: 'green',
            tag: 'gray',
            attr: 'cyan',
            doctag: 'gray',
            comment: 'gray',
            deletion: ['red', 'strikethrough'],
            regexp: 'yellow',
            literal: 'magenta',
            number: 'magenta',
            attribute: 'red'
          })
        })
      );
    });

    // Empty newline
    console.log('');
  });
}

/**
 * Prints cleaned up webpack warnings.
 */
function formatWebpackWarnings(
  warnings: StatsError[] | undefined,
  rootDir: string
): void {
  if (!Array.isArray(warnings) || !warnings.length) {
    return;
  }

  warnings.forEach(warning => {
    let message = warning.message;

    // Shorten absolute paths to relative
    message = message.replace(new RegExp(rootDir, 'gim'), '.');

    // Cleanup webpack headers
    const lines = message
      .split('\n')
      .filter(line => !line.includes('Module Warning (from'));

    // Print warning
    logger.write('');
    logger.warn(lines.join('\n').trimEnd());
  });

  // Empty newline
  console.log('');
}

/**
 * Print formatted info about given asset
 */
function printAssetInfo(asset: StatsAsset, isLastItem = false): void {
  let result = '';

  if (!asset.name) {
    return;
  }

  result += ` ${chalk.gray(isLastItem ? '└' : '├')} ${asset.name}`;
  result += ` ${chalk.yellow(prettyBytes(asset.size))}`;

  logger.write(result);
}

let isFirstRun = true;
const warningsCache = new Set<string>();

/**
 * Handles stats logging during webpack build and watch tasks.
 *
 * @param {MultiStats|undefined} stats Webpack stats object.
 * @param {CliArgs} args Cli and build args.
 * @returns {void}
 */
function formatStats(stats: MultiStats | undefined, args: CliArgs): void {
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
        warnings: !args.ignoreWarnings,
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

  // Print warnings
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

  // Print errors
  formatWebpackErrors(errors);

  // First run assets info output
  if (isFirstRun && children?.length) {
    logger.info(
      `Compilation was ${chalk.green(
        'successful'
      )} using webpack version: ${chalk.magenta(children[0].version)}`
    );
    logger.info(
      `Output folder ${chalk.magenta(children[0].outputPath)}, produced:\n`
    );

    children?.forEach(child => {
      logger.write(
        `${chalk.underline.bold(child.name)} ${chalk.gray(
          '[' + prettyMs(child.time ?? 0) + ']'
        )}`
      );

      child.assets
        ?.sort((a, b) => a?.name.localeCompare(b?.name))
        .forEach((asset, index) => {
          printAssetInfo(asset, index === (child.assets?.length as number) - 1);
        });

      logger.write('');
    });

    isFirstRun = false;
  }
}

export { formatWebpackErrors, formatWebpackWarnings, formatStats };
