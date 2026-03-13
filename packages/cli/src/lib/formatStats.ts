import fs from 'fs';
import path from 'path';

import { logger } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';
import prettyMs from 'pretty-ms';

import { ImaBuildOutput, ViteBuildOutput } from '../types';

/**
 * Extracts a flat list of file names from a Vite build result
 */
function collectViteChunkFileNames(output: ViteBuildOutput): string[] {
  if (Array.isArray(output)) {
    return output.flatMap(o => collectViteChunkFileNames(o));
  }

  // Handle RolldownWatcher
  // @TODO: Remove this with vite v8
  if (!('output' in output)) {
    return [];
  }

  return output.output.map(chunk => chunk.fileName);
}

/**
 * Prints a formatted summary of Vite build outputs
 *
 * @param outputs  Array of per-environment build results, including timing.
 * @param rootDir  Project root directory (used to resolve the build/ folder).
 */
export function formatViteStats(
  outputs: ImaBuildOutput[],
  rootDir: string
): void {
  const outDir = path.join(rootDir, 'build');

  // Maps internal Vite environment names to the labels shown in the log
  const envDisplayNames: Record<string, string> = {
    server: 'server',
    modern: 'client.es',
    legacy: 'client',
  };

  const RELATED_EXTENSIONS = ['.map', '.br', '.gz'];

  // Canonical display order: server → legacy (client) → modern (client.es)
  const ENV_ORDER = ['server', 'legacy', 'modern'];
  const sortedOutputs = [...outputs].sort(
    (a, b) => ENV_ORDER.indexOf(a.env) - ENV_ORDER.indexOf(b.env)
  );

  let additionalAssetCount = 0;

  logger.info(`Output folder ${chalk.magenta(outDir)}, produced:\n`);

  for (const { env: envName, output, time } of sortedOutputs) {
    const displayName = envDisplayNames[envName] ?? envName;
    const allFileNames = collectViteChunkFileNames(output);

    if (allFileNames.length === 0) {
      continue;
    }

    // Split into primary files (JS/CSS/assets) and secondary (maps, compressed)
    // Static assets (images, fonts, etc.) are emitted by every environment, so
    // only show them for the modern build to avoid duplicates.
    const primaryFiles = allFileNames.filter(name => {
      if (RELATED_EXTENSIONS.some(ext => name.endsWith(ext))) {
        return false;
      }
      if (!name.endsWith('.js') && !name.endsWith('.mjs') && !name.endsWith('.css')) {
        return envName === 'modern';
      }
      return true;
    });
    const relatedFiles = new Set(
      allFileNames.filter(name =>
        RELATED_EXTENSIONS.some(ext => name.endsWith(ext))
      )
    );

    additionalAssetCount += relatedFiles.size;

    logger.write(
      `${chalk.underline.bold(displayName)} ${chalk.gray(`[${prettyMs(time)}]`)}`
    );

    primaryFiles.forEach((fileName, index) => {
      const isLast = index === primaryFiles.length - 1;
      const fullPath = path.join(outDir, fileName);
      const lastSlash = fileName.lastIndexOf('/');
      const basePath = lastSlash >= 0 ? '/' + fileName.substring(0, lastSlash + 1) : '/';
      const shortName = lastSlash >= 0 ? fileName.substring(lastSlash + 1) : fileName;
      const size = fs.statSync(fullPath).size;
      const sizeStr = ` ${chalk.green.bold(prettyBytes(size))}`;

      let line = chalk.gray(isLast ? ' └ ' : ' ├ ');
      line += chalk.gray(basePath);
      line += chalk.bold.cyan(shortName);
      line += sizeStr;
      logger.write(line);

      // Print related files (.map, .br, .gz) as indented sub-items
      const indent = chalk.gray(isLast ? '     ' : ' ǀ   ');
      RELATED_EXTENSIONS.forEach(ext => {
        const relatedName = fileName + ext;
        if (!relatedFiles.has(relatedName)) {
          return;
        }

        const relatedPath = path.join(outDir, relatedName);
        const relatedShortName = shortName + ext;
        const size = fs.statSync(relatedPath).size;
        const relatedSizeStr = chalk.yellow(` ${prettyBytes(size)}`);

        logger.write(`${indent}${relatedShortName}${relatedSizeStr}`);
      });
    });

    logger.write('');
  }

  logger.write(
    `The compilation generated ${chalk.green.bold(additionalAssetCount)} additional assets.\n`
  );
}
