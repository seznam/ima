/**
 * @TODO The localization logic should be mostly taken from https://github.com/seznam/ima/blob/master/packages/cli/src/webpack/languages.ts
 * This solution is similar, but not the same and there can be some inconsistencies.
 */
import path from 'node:path';

import { resolveImaConfig } from '@ima/cli';
import type { ImaCliArgs } from '@ima/cli';
import type { DictionaryConfig, DictionaryData } from '@ima/core';
import { assignRecursively } from '@ima/helpers';
import MessageFormat from '@messageformat/core';
import globby from 'globby';

import { getImaTestingLibraryClientConfig } from './client/configuration';
import { importFromProject } from './helpers';

// Some operations take way too long to be executed with each render call,
// so we need to cache these values
const dictionary: Record<string, DictionaryConfig['dictionary']> = {};

/**
 * Generates dictionary object, either fake or real depending on the configuration.
 */
export async function generateDictionary() {
  const config = getImaTestingLibraryClientConfig();

  if (config.useFakeDictionary) {
    $IMA.i18n = generateFakeDictionary();
  } else {
    if (!dictionary[$IMA.$Language]) {
      if (!$IMA.$Language) {
        throw new Error(
          'Variable $IMA.$Language is not defined. The variable should be defined in the jsdom html template, but it is missing. Maybe your SPA template is not setting this variable?'
        );
      }

      dictionary[$IMA.$Language] = await generateRealDictionary($IMA.$Language);
    }

    $IMA.i18n = dictionary[$IMA.$Language];
  }
}

/**
 * Generates infinite object as a fake dictionary, returning string `localize(key)` for every key.
 * This function does not validate, if the key would exist in the real dictionary.
 * Example:
 * ```
 * const dictionary = generateFakeDictionary();
 * dictionary['key1']() === 'localize(key1)';
 * dictionary['key1']['key2']['key3']() === 'localize(key1.key2.key3)';
 * ```
 */
export function generateFakeDictionary(path = ''): DictionaryData {
  return new Proxy(() => `localize(${path})`, {
    get: (target, prop: string) => {
      if (typeof prop === 'string') {
        const newPath = path ? `${path}.${prop}` : prop;
        return generateFakeDictionary(newPath);
      }
      return target[prop];
    },
  }) as unknown as DictionaryData;
}

/**
 * Generates IMA formatted dictionary
 *
 * @param {string} locale
 * @returns {object}
 */
export async function generateRealDictionary(locale: string) {
  const { rootDir } = getImaTestingLibraryClientConfig();
  const { languages } = await resolveImaConfig({ rootDir } as ImaCliArgs);
  const mf = new MessageFormat(locale);
  const dictionaries: Record<string, any> = {};
  const langFileGlobs = languages[locale];

  await Promise.all(
    (
      await globby(langFileGlobs)
    ).map(async file => {
      try {
        const filename = path
          .basename(file)
          .replace(locale.toUpperCase() + path.extname(file), '');

        const dictJson = await importFromProject(file);

        dictionaries[filename] = assignRecursively(
          dictionaries[filename] ?? {},
          _deepMapValues(dictJson, mf.compile.bind(mf))
        );
      } catch (e) {
        console.error(
          `Tried to load dictionary JSON at path "${file}", but recieved following error.`
        );
        console.error(e);
      }
    })
  );

  return dictionaries;
}

/**
 * Apply function through full object or array values
 *
 * @param {object | Array} obj object to be manipulated
 * @param {Function} fn function to run on values
 * @returns {object | Array}
 */
function _deepMapValues(
  obj: object | Array<object>,
  fn: typeof MessageFormat.prototype.compile
):
  | ReturnType<typeof MessageFormat.prototype.compile>
  | Record<string, any>
  | string {
  if (Array.isArray(obj)) {
    return obj.map(val => _deepMapValues(val, fn));
  } else if (typeof obj === 'function') {
    // Skip already mapped values
    return obj;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, current) => {
      // @ts-expect-error I don't know how to type `obj[current]`, help me!
      acc[current] = _deepMapValues(obj[current], fn);
      return acc;
    }, {} as Record<string, any>);
  } else {
    return fn(obj);
  }
}
