import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Dictionary');

/**
 * Implementation of the {@codelink COre.Interface.Dictionary} interface that
 * relies on the MessageFormat localization messages for its dictionary.
 *
 * @class MessageFormat
 * @implements Core.Interface.Dictionary
 * @namespace Core.Dictionary
 * @module Core
 * @submodule Core.Dictionary
 */
class MessageFormat extends ns.Core.Interface.Dictionary {

	/**
	 * Initializes the dictionary.
	 *
	 * @constructor
	 * @method constructor
	 * @example
	 * 		dictionary.get('home.hello', {GENDER: 'MALE'});
	 */
	constructor() {
		super();

		/**
		 * Application language.
		 *
		 * @private
		 * @property _language
		 * @type {string}
		 */
		this._language = null;

		/**
		 * Stored dictionary.
		 *
		 * @private
		 * @property _dictionary
		 * @type {Object<string, Object<string, function(Object<string, (number|string)>): string>>}
		 */
		this._dictionary = null;
	}

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
	 * @inheritdoc
	 * @override
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
	init(config) {
		this._language = config.language;
		this._dictionary = config.dictionary;
	}

	/**
	 * Returns the ISO 639-1 language code of the language this dictionary was
	 * initialized with.
	 *
	 * @inheritdoc
	 * @override
	 * @method getLanguage
	 * @return {string} The language code representing the language of the
	 *         localization phrases in this dictionary.
	 */
	getLanguage() {
		return this._language;
	}

	/**
	 * Retrieves the localization phrase identified by the specified key,
	 * replaces the parameter placeholder with the provided parameters and
	 * returns the result.
	 *
	 * @inheritdoc
	 * @override
	 * @method get
	 * @param {string} key The key identifying the localization phrase, following
	 *        the `${phraseGroup}.${phraseKey}` syntax.
	 * @param {Object<string, (number|string)>=} parameters The map of parameter
	 *        placeholder names to the parameter values to use. Defaults to an
	 *        empty plain object.
	 * @return {string} The specified localization phrase with its placeholders
	 *         replaced with the provided parameters.
	 */
	get(key, parameters = {}) {
		var path = key.split('.');
		var scope = this._dictionary;

		for (var scopeKey of path) {
			if (!scope[scopeKey]) {
				throw new IMAError(`Core.Dictionary.MessageFormat.get: The ` +
					`localization phrase '${key}' does not exists`,
					{key, parameters});
			}

			scope = scope[scopeKey];
		}

		return scope(parameters);
	}
}

ns.Core.Dictionary.MessageFormat = MessageFormat;
