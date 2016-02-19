import ns from 'ima/namespace';

ns.namespace('Ima.Interface');

/**
 * The Dictionary is a manager and preprocessor of localization phrases for a
 * single language. The format of the localization phrases depends on the
 * implementation of this interface.
 *
 * @interface Dictionary
 * @namespace Ima.Interface
 * @module Ima
 * @submodule Ima.Interface
 */
export default class Dictionary {
	/**
	 * Initializes this dictionary with the provided language and localization
	 * phrases.
	 *
	 * @method init
	 * @param {{language: string, dictionary: *}} config
	 *        The dictionary configuration.
	 *        The language field is an ISO 639-1 language code specifying the
	 *        language of the provided phrases.
	 *        The dictionary field contains the localization phrases organized
	 *        in an implementation-specific way.
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
	 * evaluates the phrase's placeholder expressions using the provided
	 * parameters and returns the result.
	 *
	 * @method get
	 * @param {string} key The key identifying the localization phrase.
	 * @param {Object<string, (boolean|number|string|Date)>=} parameters The
	 *        map of parameter names to the parameter values to use.
	 *        Defaults to an empty plain object.
	 * @return {string} The specified localization phrase with its placeholders
	 *         evaluated using the provided parameters.
	 */
	get(key, parameters = {}) {}
}

ns.Ima.Interface.Dictionary = Dictionary;
