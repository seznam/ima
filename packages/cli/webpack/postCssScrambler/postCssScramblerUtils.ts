import path from 'path';
import fg from 'fast-glob';

import { Args } from '../../types';

/**
 * Generates entry points for AMP styles webpack generation.
 *
 * @param {Args['rootDir']} rootDir App root directory.
 * @param {string[]=[]} paths Globs of less amp files.
 * @param {string} [outputPrefix=''] Filename prefix.
 * @returns {Promise<Record<string, string>>} Array of entry
 *          points file paths.
 */
async function generateEntryPoints(
  rootDir: Args['rootDir'],
  paths: string[] = [],
  outputPrefix = ''
): Promise<Record<string, string>> {
  const resolvedPaths = await fg(
    paths.map(globPath => path.join(rootDir, globPath))
  );

  return resolvedPaths.reduce((acc: Record<string, string>, cur) => {
    let entryPoint = path.join(outputPrefix, cur.replace(`${rootDir}/`, ''));

    const extensionIndex = entryPoint.lastIndexOf('.');
    entryPoint = entryPoint.substring(0, extensionIndex);

    acc[entryPoint] = cur;

    return acc;
  }, {});
}

export { generateEntryPoints };
