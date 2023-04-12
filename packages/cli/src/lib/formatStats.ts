import fs from 'fs';
import path from 'path';

import { formatError, parseError } from '@ima/dev-utils/cliUtils';
import { logger } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';
import prettyMs from 'pretty-ms';
import { MultiStats, StatsAsset } from 'webpack';

import { ImaCliArgs } from '../types';

const warningsCache = new Set<string>();

/**
 * Prints formatted webpack errors (stripped from duplicates) into console.
 */
async function formatWebpackErrors(
  stats: MultiStats | undefined,
  args: ImaCliArgs
): Promise<void> {
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

  const uniqueErrorTracker: string[] = [];

  for (const error of errors) {
    // Format error
    try {
      const parsedErrorData = await parseError(error, 'compile');
      const formattedError = await formatError(
        parsedErrorData,
        args.rootDir,
        uniqueErrorTracker
      );

      // Print unique error
      formattedError && logger.error(formattedError);
    } catch {
      // Fallback to original error messsage
      logger.error(
        await formatError(
          {
            name: error?.name,
            message: error?.message,
            fileUri: error?.file,
            stack: error?.stack,
          },
          args.rootDir,
          uniqueErrorTracker
        )
      );
    }
  }
}

/**
 * Prints cleaned up webpack warnings.
 */
function formatWebpackWarnings(
  stats: MultiStats | undefined,
  args: ImaCliArgs
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
    logger.warn(`at ${chalk.blueBright.bold.underline(warning.moduleName)}`);
    const lines = warning.message.split('\n');
    logger.write(chalk.underline(lines.shift()));
    logger.write(lines.join('\n'));
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
    basePath,
  };
}

/**
 * Print formatted info about given asset
 */
function printAssetInfo(
  asset: StatsAsset | undefined,
  outDir: string,
  isLastItem = false
): void {
  let result = '';

  if (!asset || !asset.name) {
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
      result += chalk.gray(isLastItem ? '     ' : ' ǀ   ');
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
 * @param {ImaCliArgs} args Cli and build args.
 * @returns {void}
 */
function formatStats(stats: MultiStats | undefined, args: ImaCliArgs): void {
  if (!stats) {
    return logger.error('Unknown error, stats are empty');
  }

  // Print raw webpack log
  if (args?.verbose) {
    return logger.write(
      stats.toString({
        warnings: !args.ignoreWarnings,
        colors: true,
      })
    );
  }

  const jsonStats = stats.toJson({
    all: false,
    assets: true,
    timings: true,
    version: true,
    outputPath: true,
    chunkGroups: true,
  });

  if (!Array.isArray(jsonStats.children) || jsonStats.children?.length === 0) {
    return;
  }

  let totalAssetCount = 0;
  let chunkAssetsCount = 0;
  const outDir = jsonStats.children[0].outputPath ?? '';

  logger.info(
    `Compilation was ${chalk.green(
      'successful'
    )} using webpack version: ${chalk.magenta(jsonStats.children[0].version)}`
  );
  args.command === 'dev' &&
    logger.info(
      `Client assets are served from ${
        args.writeToDisk
          ? chalk.blueBright('disk')
          : chalk.yellowBright('memory')
      }`
    );
  logger.info(`Output folder ${chalk.magenta(outDir)}, produced:\n`);

  // Print info about emitted assets
  jsonStats.children?.forEach(child => {
    logger.write(
      `${chalk.underline.bold(child.name)} ${chalk.gray(
        `[${prettyMs(child.time ?? 0)}]`
      )}`
    );

    // Count total number of generated assets
    totalAssetCount +=
      child?.assets?.reduce((acc, cur) => {
        acc += cur?.filteredRelated ?? 0 + 1;

        return acc;
      }, 0) ?? 0;

    if (!(child.name && child.namedChunkGroups?.[child.name])) {
      return;
    }

    // Child assets
    const filteredAssets =
      child.namedChunkGroups?.[child.name]?.assets?.map(({ name }) =>
        child?.assets?.find(childAsset => childAsset.name === name)
      ) ?? [];

    // Print chunk assets
    filteredAssets?.forEach((asset, index) => {
      // Count also related (plugin generated) files
      chunkAssetsCount += asset?.filteredRelated ?? 0;
      printAssetInfo(asset, outDir, index === filteredAssets?.length - 1);
    });

    logger.write('');
  });

  // Total number of additional assets
  const additionalAssetsCount = totalAssetCount - chunkAssetsCount;

  // Print more information for build task
  logger.write(
    `The compilation generated ${chalk.green.bold(
      additionalAssetsCount
    )} additional assets.\n`
  );
}

export { formatWebpackErrors, formatWebpackWarnings, formatStats };
