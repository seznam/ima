/**
 * The Dictionary is a manager and preprocessor of localization phrases for a
 * single language. The format of the localization phrases depends on the
 * implementation of this interface.
 *
 * @interface
 */
export default class Dictionary {
  /**
   * Initializes this dictionary with the provided language and localization
   * phrases.
   *
   * @param {Object.<string, *>} config The dictionary configuration.
   * @param {string} config.$Language The language property is an ISO 639-1
   *        language code specifying the language of the provided phrases.
   * @param {*} config.dictionary The dictionary property contains the
   *        localization phrases organized in an implementation-specific way.
   */
  init() {}

  /**
   * Returns the ISO 639-1 language code of the language this dictionary was
   * initialized with.
   *
   * @return {string} The language code representing the language of the
   *         localization phrases in this dictionary.
   */
  getLanguage() {}

  /**
   * Retrieves the localization phrase identified by the specified key,
   * evaluates the phrase's placeholder expressions using the provided
   * parameters and returns the result.
   *
   * @param {string} key The key identifying the localization phrase.
   * @param {Object<string, (boolean|number|string|Date)>=} parameters The
   *        map of parameter names to the parameter values to use.
   *        Defaults to an empty plain object.
   * @return {string} The specified localization phrase with its placeholders
   *         evaluated using the provided parameters.
   */
  get() {}

  /**
   * Tests whether the specified localization phrase exists in the
   * dictionary.
   *
   * @param {string} key The key identifying the localization phrase.
   * @return {boolean} `true` if the key exists and denotes a single
   *                   localization phrase, otherwise `false`.
   */
  has() {}
}
