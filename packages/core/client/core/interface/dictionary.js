import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Interface');

/**
 * The Dictionary is a manager and preprocessor of localization phrases for a
 * single language.
 *
 * @interface Dictionary
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class Dictionary {
	/**
	 * Initializes this dictionary with the provided language and localization
	 * phrases.
	 *
	 * The localization phrases may contain parameter placeholders wrapped in
	 * curly braces, for example the phrase
	 * {@code "Hello, there, {NAME}, it's {VERB} to see you!"} contains the
	 * {@code NAME} and {@code VERB} parameter placeholders. The parameter
	 * placeholder names should be in uppercase.
	 *
	 * @method init
	 * @param {{language: string, dictionary: Object<string, Object<string, function(Object<string, (number|string)>): string>>}} config
	 *        The dictionary configuration.
	 *        The language field is an ISO 639-1 language code specifying the
	 *        language of the provided phrases.
	 *        The dictionary field are the localization phrases organited in a
	 *        deep plain object map. The top-level key is the name of the phrase
	 *        group, the bottom-level key is the phrase key. The bottom-level
	 *        value is the localization phrase generator that takes the phrase
	 *        placeholder values map as an argument and produces the localization
	 *        phrase with its placeholders replaced by the provided placeholder
	 *        values.
	 */
	init(config) {}

	/**
	 * Returns the ISO 639-1 language code of the language this dictionary was
	 * initialized with.
	 *
	 * @method getLanguage
	 * @return {string} The language code representing the language of the
	 *         localization phrases in this dictionary.
	 */
	getLanguage() {}

	/**
	 * Retrieves the localization phrase identified by the specified key,
	 * replaces the parameter placeholder with the provided parameters and
	 * returns the result.
	 *
	 * @method get
	 * @param {string} key The key identifying the localization phrase, following
	 *        the `${phraseGroup}.${phraseKey}` syntax.
	 * @param {Object<string, (number|string)>=} parameters The map of parameter
	 *        placeholder names to the parameter values to use. Defaults to an
	 *        empty plain object.
	 * @return {string} The specified localization phrase with its placeholders
	 *         replaced with the provided parameters.
	 */
	get(key, parameters = {}) {}
}

ns.Core.Interface.Dictionary = Dictionary;
