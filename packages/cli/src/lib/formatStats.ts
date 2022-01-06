import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { MultiStats, StatsAsset, StatsError } from 'webpack';
import { highlight, fromJson } from 'cli-highlight';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';

import { createSourceFragment, parseCompileError } from './compileErrorParser';
import logger from './logger';
import { CliArgs } from '../types';

let isFirstRun = true;
const warningsCache = new Set<string>();

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
 * Extracts asset paths from it's name (containing basePath)
 * and output directory.
 */
function extractAssetPaths(
  name: string,
  outDir: string
): { fileName: string; fullPath: string; basePath: string } {
  const fullPath = path.join(outDir, name);
  const lastSlashIndex = fullPath.lastIndexOf('/');
  const fileName = fullPath.substring(lastSlashIndex + 1);
  const basePath = fullPath
    .substring(0, lastSlashIndex + 1)
    .replace(outDir, '');

  return {
    fileName,
    fullPath,
    basePath
  };
}

/**
 * Print formatted info about given asset
 */
function printAssetInfo(
  asset: StatsAsset,
  outDir: string,
  isLastItem = false
): void {
  let result = '';

  if (!asset.name) {
    return;
  }

  const assetPaths = extractAssetPaths(asset.name, outDir);

  // Print output
  result += chalk.gray(isLastItem ? ' └ ' : ' ├ ');
  result += chalk.gray(assetPaths.basePath);
  result += chalk.bold.cyan(assetPaths.fileName);
  result += ` ${chalk.green.bold(prettyBytes(asset.size))}`;

  // Prints brotli and gzip sizes
  Object.values(asset?.info?.related ?? {})
    .map(assetName => extractAssetPaths(assetName.toString(), outDir))
    .filter(({ fullPath }) => fs.existsSync(fullPath))
    .forEach(({ fileName, fullPath }) => {
      result += '\n';
      result += chalk.gray(isLastItem ? '      ' : ' |    ');
      result += fileName;
      result += chalk.yellow(
        ` ${prettyBytes(fs.statSync(path.join(fullPath)).size)}`
      );
    });

  logger.write(result);
}

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

  const jsonStats = stats.toJson({
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
    if (Array.isArray(jsonStats.warnings)) {
      for (const warning of jsonStats.warnings) {
        if (!warningsCache.has(warning.message)) {
          warningsCache.add(warning.message);
          newWarnings.push(warning);
        }
      }
    }

    formatWebpackWarnings(newWarnings, args.rootDir);
  }

  // Print errors
  formatWebpackErrors(jsonStats.errors);

  // First run assets info output
  if (isFirstRun && jsonStats.children?.length) {
    let totalCount = 0;
    const outDir = jsonStats.children[0].outputPath ?? '';

    logger.info(
      `Compilation was ${chalk.green(
        'successful'
      )} using webpack version: ${chalk.magenta(jsonStats.children[0].version)}`
    );
    logger.info(`Output folder ${chalk.magenta(outDir)}, produced:\n`);

    jsonStats.children?.forEach(child => {
      logger.write(
        `${chalk.underline.bold(child.name)} ${chalk.gray(
          '[' + prettyMs(child.time ?? 0) + ']'
        )}`
      );

      // Count total number of generated assets
      totalCount += child.assets?.length ?? 0;

      const filteredAssets = child.assets
        ?.filter(asset => /\.(css|js)$/i.test(asset.name))
        ?.sort((a, b) => a?.name.localeCompare(b?.name));
      const filteredAssetsLen = filteredAssets?.length ?? 0;

      filteredAssets?.forEach((asset, index) => {
        // Count also related (plugin generated) files
        totalCount += Object.keys(asset?.info?.related ?? {}).length;

        printAssetInfo(asset, outDir, index === filteredAssetsLen - 1);
      });

      logger.write('');
    });

    // Print more information for build task
    if (args.command === 'build') {
      logger.write(
        `This ^ report covers only ${chalk.bold('.js')} and ${chalk.bold(
          '.css'
        )} files, there were`
      );
      logger.write(
        `total of ${chalk.green.bold(
          totalCount
        )} assets generated inside the output folder.\n`
      );
    }

    isFirstRun = false;
  }
}

export { formatWebpackErrors, formatWebpackWarnings, formatStats };
