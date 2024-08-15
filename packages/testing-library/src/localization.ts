import path from 'path';

import { assignRecursively } from '@ima/helpers';
import MessageFormat from '@messageformat/core';
import globby from 'globby';

import { requireFromProject } from './helpers';

/**
 * @TODO The localization logic should be mostly taken from https://github.com/seznam/ima/blob/master/packages/cli/src/webpack/languages.ts
 * This solution is similar, but not the same and there can be some inconsistencies.
 */

/**
 * Generates IMA formatted dictionary
 *
 * @param {string} locale
 * @returns {object}
 */
function generateDictionary(locale = 'cs') {
  // @TODO: locale should be taken from config and should be en by default
  const { languages } = requireFromProject('./ima.config.js');
  const mf = new MessageFormat(locale);
  const dictionaries: Record<string, any> = {};
  const langFileGlobs = languages[locale];

  globby.sync(langFileGlobs).forEach(file => {
    try {
      const filename = path
        .basename(file)
        .replace(locale.toUpperCase() + path.extname(file), '');

      const dictJson = requireFromProject(file);

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
  });

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

export { generateDictionary };
