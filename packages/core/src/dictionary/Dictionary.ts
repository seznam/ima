export type Config = {
  $Language: string,
  dictionary: Fields
};

export type Fields = {
  [key: string]: Fields | LocalizationFunction;
};

export type LocalizationFunction = (parameters: Parameters) => string;

export type Parameters = {
  [key: string]: boolean | number | string | Date
};

/**
 * The Dictionary is a manager and preprocessor of localization phrases for a
 * single language. The format of the localization phrases depends on the
 * implementation of this interface.
 */
export default abstract class Dictionary {
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
  abstract init(config: Config): void;

  /**
   * Returns the ISO 639-1 language code of the language this dictionary was
   * initialized with.
   *
   * @return The language code representing the language of the
   *         localization phrases in this dictionary.
   */
  abstract getLanguage(): string;

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
  abstract get(
    key: string,
    parameters: Parameters
  ): string;

  /**
   * Tests whether the specified localization phrase exists in the
   * dictionary.
   *
   * @param key The key identifying the localization phrase.
   * @return`true` if the key exists and denotes a single
   *         localization phrase, otherwise `false`.
   */
  abstract has(key: string): boolean;
}