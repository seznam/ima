import GenericError from '../error/GenericError';
import Dictionary from '../dictionary/Dictionary';

/**
 * Implementation of the {@link Dictionary} interface that relies on
 * compiled MessageFormat localization messages for its dictionary.
 *
 * @extends Dictionary
 */
export default class MessageFormatDictionary extends Dictionary {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the dictionary.
   *
   * @example
   * dictionary.get('home.hello', {GENDER: 'UNSPECIFIED'});
   */
  constructor() {
    super();

    /**
     * The language of the phrases in the dictionary, represented as a
     * ISO 639-1 language code.
     *
     * @type {string}
     */
    this._language = null;

    /**
     * Stored dictionary.
     *
     * @type {Object<
     *         string,
     *         Object<
     *           string,
     *           function(Object<string, (number|string)>): string
     *         >
     *       >}
     */
    this._dictionary = null;
  }

  /**
   * Initializes this dictionary with the provided language and localization
   * phrases.
   *
   * @param {Object.<string, *>} config The dictionary configuration.
   * @param {string} config.language The language property is an ISO 639-1
   *        language code specifying the language of the provided phrases.
   * @param {Object<string, Object<string, function(Object<string, (number|string)>): string>>}
   *        config.dictionary
   *        The dictionary field contains the localization phrases organized
   *        in a deep plain object map. The top-level key is the name of the
   *        phrase group, the bottom-level key is the phrase key. The
   *        bottom-level value is the localization phrase generator that
   *        takes the phrase placeholder values map as an argument and
   *        produces the localization phrase with its placeholders evaluated
   *        using the provided placeholder values.
   * @inheritdoc
   */
  init(config) {
    this._language = config.language;
    this._dictionary = config.dictionary;
  }

  /**
   * @inheritdoc
   */
  getLanguage() {
    return this._language;
  }

  /**
   * Retrieves the localization phrase identified by the specified key,
   * evaluates the phrase's placeholder expressions using the provided
   * parameters and returns the result.
   *
   * @param {string} key The key identifying the localization phrase. The key
   *        consists of at least two parts separated by dots. The first part
   *        denotes the name of the source JSON localization file, while the
   *        rest denote a field path within the localization object within
   *        the given localization file.
   * @param {Object<string, (boolean|number|string|Date)>=} parameters The
   *        map of parameter names to the parameter values to use.
   *        Defaults to an empty plain object.
   * @return {string} The specified localization phrase with its placeholders
   *         evaluated using the provided parameters.
   */
  get(key, parameters = {}) {
    const scope = this._getScope(key);

    if (!scope) {
      throw new GenericError(
        `ima.dictionary.MessageFormatDictionary.get: The ` +
          `localization phrase '${key}' does not exists`,
        { key, parameters }
      );
    }

    return scope(parameters);
  }

  /**
   * Tests whether the specified localization phrase exists in the
   * dictionary.
   *
   * @param {string} key The key identifying the localization phrase. The key
   *        consists of at least two parts separated by dots. The first part
   *        denotes the name of the source JSON localization file, while the
   *        rest denote a field path within the localization object within
   *        the given localization file.
   * @return {boolean} `true` if the key exists and denotes a single
   *                   localization phrase, otherwise `false`.
   */
  has(key) {
    if (!/^[^.]+\.[^.]+$/.test(key)) {
      throw new Error(
        `The provided key (${key}) is not a valid localization ` +
          `phrase key, expecting a "file_name.identifier" notation`
      );
    }

    return !!this._getScope(key);
  }

  /**
   * Retrieves the localization scope denoted by the provided partial key.
   * This may be either an object representing a sub-group of location phrase
   * generators, or a single generator if the provided keys denotes a single
   * localization phrase
   *
   * @private
   * @param {string} key The key identifying the localization phrase. The key
   *        consists of at least two parts separated by dots. The first part
   *        denotes the name of the source JSON localization file, while the
   *        rest denote a field path within the localization object within
   *        the given localization file.
   * @return {?(
   *             function(
   *                 Object<string, (boolean|number|string|Date)>
   *             ): string|
   *             Object<
   *               string,
   *               function(
   *                   Object<string, (boolean|number|string|Date)>
   *               ): string
   *             >
   *         )} The requested localization scope, or `null` if the specified
   *         scope does not exist.
   */
  _getScope(key) {
    let path = key.split('.');
    let scope = this._dictionary;

    for (let scopeKey of path) {
      if (!scope[scopeKey]) {
        return null;
      }

      scope = scope[scopeKey];
    }

    return scope;
  }
}
