import path from 'path';
import fs from 'fs';
import fg from 'fast-glob';
import { createHash } from 'crypto';

import { error } from '../lib/print';
import {
  AdditionalDataContentFn,
  AdditionalDataFactoryFn,
  AdditionalDataFn,
  Args,
  ImaConfig,
  ImaEnvironment,
  WifValue
} from '../types';

/**
 * Loads application IMA.js environment from app/environment.js
 *
 * @param {Args['rootDir']} rootDir Application root directory
 * @returns {ImaEnvironment} Loaded environment
 */
function resolveEnvironment(rootDir: Args['rootDir']): ImaEnvironment {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const envSource = require(path.resolve(rootDir, './app/environment.js'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const envConfig = require(path.resolve(
    rootDir,
    './node_modules/@ima/server/lib/environment.js'
  ))(envSource) as ImaEnvironment;

  return envConfig;
}

/**
 * Utility function to load any JS configuration file, used
 * to setup multiple tools (babel, postcss...). From multiple
 * file locations or directly fromm package.json.
 *
 * @param {object} params
 * @param {string} params.rootDir App root directory.
 * @param {string[]} params.fileNames Options of configuration file names.
 * @param {Record<string, unknown> | null} params.packageJson package.json
 * @param {string} params.packageJsonKey Key identifying config in package.json
 * @param {Record<string, unknown>} params.defaultConfig Default config
 *        which is used if no configuration is found.
 * @returns {Record<string, unknown>} Loaded configuration object.
 */
function requireConfig({
  rootDir,
  fileNames,
  packageJson = null,
  packageJsonKey = '',
  defaultConfig = {}
}: {
  rootDir: Args['rootDir'];
  fileNames: string[];
  packageJson: Record<string, Record<string, unknown>> | null;
  packageJsonKey: string;
  defaultConfig: Record<string, unknown>;
}): Record<string, unknown> {
  if (
    !rootDir ||
    !Array.isArray(fileNames) ||
    fileNames.length === 0 ||
    !fs.existsSync(rootDir)
  ) {
    return defaultConfig;
  }

  const { fullPath: configPath, fileName: configFileName } =
    fileNames
      .map(fileName => ({
        fileName,
        fullPath: path.join(rootDir, fileName)
      }))
      .find(({ fullPath }) => fs.existsSync(fullPath)) || {};

  if (
    !configPath &&
    !(packageJson && packageJsonKey && packageJson[packageJsonKey])
  ) {
    return defaultConfig;
  }

  try {
    if (configPath && configFileName) {
      const extension = configFileName.split('.').pop();

      return extension && ~['js', 'cjs', 'json'].indexOf(extension)
        ? require(configPath)
        : JSON.parse(fs.readFileSync(configPath).toString());
    } else {
      return (packageJson && packageJson[packageJsonKey]) || defaultConfig;
    }
  } catch (err) {
    error(`Error occurred while loading ${configPath} file`);

    if (err instanceof Error) {
      error(err.message);
      err.stack && error(err.stack);
    }

    return defaultConfig;
  }
}

/**
 * Less-loader additional data factory function. Utility to
 * easily prepped/append custom content into the less-loader.
 *
 * @param {AdditionalDataContentFn[]} contentFunctions Data content functions.
 * @returns {AdditionalDataFn} Less-loader compatible additional data fn.
 */
function additionalDataFactory(
  contentFunctions: AdditionalDataContentFn[]
): AdditionalDataFn {
  const prefixes: string[] = [];
  const postfixes: string[] = [];

  const prefix: AdditionalDataFactoryFn = content => prefixes.push(content);
  const postfix: AdditionalDataFactoryFn = content => postfixes.push(content);

  contentFunctions.forEach(fn => {
    if (typeof fn !== 'function') {
      return;
    }

    return fn(prefix, postfix);
  });

  return content => [...prefixes, content, ...postfixes].join('\n\n');
}

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

/**
 * Utility function for conditional config generation.
 * It returns callback function where you can pass value, which
 * is returned if the condition is valid. Otherwise it returns
 * defaults for the given data type.
 *
 * @param {boolean|null|undefined} condition Condition to validate
 * @returns {[]|{}} Value or default value based on the condition result.
 */
function wif(
  condition: boolean | null | undefined
): (value: WifValue, defaultValue: WifValue | null) => WifValue {
  return (value, defaultValue = null) => {
    if (condition) {
      return value;
    }

    if (defaultValue !== null) {
      return defaultValue;
    }

    return Array.isArray(value) ? [] : {};
  };
}

/**
 * Creates hash representing current webpack environment.
 * Mainly used for filesystem caching.
 *
 * @param {Args} args Current CLI and build args.
 * @param {ImaConfig} imaConfig Current ima configuration.
 * @returns {string}
 */
function createCacheKey(args: Args, imaConfig: ImaConfig): string {
  const hash = createHash('md5');
  hash.update(
    [args, imaConfig]
      .filter(Object.keys)
      .map(value => JSON.stringify(value))
      .join('')
  );

  return hash.digest('hex');
}

export {
  wif,
  resolveEnvironment,
  requireConfig,
  additionalDataFactory,
  generateEntryPoints,
  createCacheKey
};
