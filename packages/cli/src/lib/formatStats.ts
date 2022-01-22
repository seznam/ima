import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { MultiStats, StatsAsset } from 'webpack';
import { highlight, fromJson } from 'cli-highlight';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';

import { createSourceFragment, parseCompileError } from './compileErrorParser';
import logger from './logger';
import { CliArgs } from '../types';

const warningsCache = new Set<string>();

/**
 * Prints formatted webpack errors (stripped from duplicates) into console.
 */
function formatWebpackErrors(
  stats: MultiStats | undefined,
  args: CliArgs
): void {
  if (!stats?.hasErrors()) {
    return;
  }

  // Raw verbose
  if (args.verbose) {
    return logger.write(stats.toString({ all: false, errors: true }));
  }

  const { errors } = stats.toJson({ all: false, errors: true });

  if (!Array.isArray(errors)) {
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
    if (
      !parsedError.lineNumber ||
      !(parsedError.fileUri && fs.existsSync(parsedError.fileUri))
    ) {
      return logger.error(
        `${chalk.underline(parsedError.name + ':')} ${parsedError.message}\n`
      );
    }

    const file = fs.readFileSync(parsedError.fileUri, 'utf8');
    const fileLines = createSourceFragment(parsedError.lineNumber, file, 4);

    // Print error
    logger.error(`at ${chalk.cyan(parsedError.fileUri)}`);
    logger.write(
      `${chalk.underline(parsedError.name + ':')} ${parsedError.message}\n`
    );

    // Print source fragment
    fileLines.forEach(line => {
      logger.write(
        chalk.gray(
          `${line.highlight ? chalk.red('>') : ' '}  ${line.line} | `
        ) +
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
    logger.write('');
  });
}

/**
 * Prints cleaned up webpack warnings.
 */
function formatWebpackWarnings(
  stats: MultiStats | undefined,
  args: CliArgs
): void {
  if (args.ignoreWarnings) {
    return;
  }

  if (!stats?.hasWarnings()) {
    return;
  }

  const { warnings } = stats.toJson({ all: false, warnings: true });
  const newWarnings = [];

  // Cache unique warnings
  if (Array.isArray(warnings)) {
    for (const warning of warnings) {
      // Ignore source-map-loader warnings
      if (warning.message.includes('Failed to parse source map')) {
        continue;
      }

      if (!warningsCache.has(warning.message)) {
        warningsCache.add(warning.message);
        newWarnings.push(warning);
      }
    }
  }

  if (newWarnings.length === 0) {
    return;
  }

  // Minimal (default) verbose
  newWarnings?.forEach(warning => {
    logger.warn(`at ${chalk.cyan(warning.moduleName)}`);
    const lines = warning.message.split('\n');
    logger.write(chalk.underline(lines.shift()));
    logger.write(lines.join('\n'));
    logger.write('');
  });
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
      result += chalk.gray(isLastItem ? '     ' : ' |   ');
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
    return logger.write(
      stats.toString({
        warnings: !args.ignoreWarnings,
        colors: true
      })
    );
  }

  const jsonStats = stats.toJson({
    all: false,
    assets: true,
    timings: true,
    version: true,
    outputPath: true,
    chunkGroups: true
  });

  if (!Array.isArray(jsonStats.children) || jsonStats.children?.length === 0) {
    return;
  }

  // Minimal (default) output
  let totalCount = 0;
  const outDir = jsonStats.children[0].outputPath ?? '';

  logger.info(
    `Compilation was ${chalk.green(
      'successful'
    )} using webpack version: ${chalk.magenta(jsonStats.children[0].version)}`
  );
  logger.info(`Output folder ${chalk.magenta(outDir)}, produced:\n`);

  // Print info about emitted assets
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
      .filter(asset => !asset.name.endsWith('hot-update.js'))
      .sort((a, b) => a?.name.localeCompare(b?.name));
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
      )} assets generated inside the output folder.`
    );
  }
}

export { formatWebpackErrors, formatWebpackWarnings, formatStats };
