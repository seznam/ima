import fs from 'fs';
import path from 'path';

import MessageFormat from '@messageformat/core';
import compileModule, {
  StringStructure,
} from '@messageformat/core/lib/compile-module';
import globby from 'globby';
import { LoaderDefinitionFunction } from 'webpack';

import { ImaConfig } from '../../types';

export interface LocaleLoaderOptions {
  imaConfig?: ImaConfig;
  rootDir?: string;
}

/**
 * This loader load locale files of app and merged them to one compiled by messageFormat
 *
 * @param {string} locale Module source.
 * @returns {string}
 */
const LocaleLoader: LoaderDefinitionFunction<LocaleLoaderOptions> = function (
  locale
) {
  const { imaConfig, rootDir } = this.getOptions();

  if (!imaConfig?.languages) {
    return '';
  }

  const languageGlobPaths = imaConfig.languages[locale];

  const paths = globby.sync(languageGlobPaths, {
    cwd: rootDir,
    absolute: true,
  });

  const messages: StringStructure = {};
  for (const languagePath of paths) {
    try {
      const dictionaryKey = path
        .parse(languagePath)
        .name.replace(locale.toUpperCase(), '');

      const filecontent = fs.readFileSync(languagePath);

      messages[dictionaryKey] = JSON.parse(filecontent.toString());
    } catch (error) {
      console.error(error);
    }
  }

  const messageFormat = new MessageFormat(locale);
  return compileModule(messageFormat, messages);
};

export default LocaleLoader;
