/* eslint-disable @typescript-eslint/no-unused-vars */

import { ObjectParameters } from '../types';

export type DictionaryConfig = {
  $Language: string;
  dictionary: DictionaryData;
};

export type DictionaryData = {
  [key: string]: DictionaryData | LocalizationFunction;
};

export type LocalizationFunction = (parameters: ObjectParameters) => string;

/**
 * The Dictionary is a manager and preprocessor of localization phrases for a
 * single language. The format of the localization phrases depends on the
 * implementation of this interface.
 */
export abstract class Dictionary {
  /**
   * Initializes this dictionary with the provided language and localization
   * phrases.
   *
   * @param config The dictionary configuration.
   * @param config.$Language The language property is an ISO 639-1
   *        language code specifying the language of the provided phrases.
   * @param config.dictionary The dictionary property contains the
   *        localization phrases organized in an implementation-specific way.
   */
  init(config: DictionaryConfig) {
    return;
  }

  /**
   * Returns the ISO 639-1 language code of the language this dictionary was
   * initialized with.
   *
   * @return The language code representing the language of the
   *         localization phrases in this dictionary.
   */
  getLanguage() {
    return '';
  }

  /**
   * Retrieves the localization phrase identified by the specified key,
   * evaluates the phrase's placeholder expressions using the provided
   * parameters and returns the result.
   *
   * @param key The key identifying the localization phrase.
   * @param parameters The
   *        map of parameter names to the parameter values to use.
   *        Defaults to an empty plain object.
   * @return The specified localization phrase with its placeholders
   *         evaluated using the provided parameters.
   */
  get(key: string, parameters?: ObjectParameters): string {
    return '';
  }

  /**
   * Tests whether the specified localization phrase exists in the
   * dictionary.
   *
   * @param key The key identifying the localization phrase.
   * @return`true` if the key exists and denotes a single
   *         localization phrase, otherwise `false`.
   */
  has(key: string) {
    return false;
  }
}
