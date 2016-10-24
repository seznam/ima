import ns from '../namespace';
import GenericError from '../error/GenericError';
import Dictionary from '../dictionary/Dictionary';

ns.namespace('ima.dictionary');

/**
 * Implementation of the {@codelink Dictionary} interface that relies on
 * compiled MessageFormat localization messages for its dictionary.
 *
 * @class MessageFormatDictionary
 * @implements Dictionary
 * @namespace ima.dictionary
 * @module ima
 * @submodule ima.dictionary
 */
export default class MessageFormatDictionary extends Dictionary {

	static get $dependencies() {
		return [];
	}

	/**
	 * Initializes the dictionary.
	 *
	 * @constructor
	 * @method constructor
	 * @example
	 * 		dictionary.get('home.hello', {GENDER: 'UNSPECIFIED'});
	 */
	constructor() {
		super();

		/**
		 * The language of the phrases in the dictionary, represented as a
		 * ISO 639-1 language code.
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
	 * @inheritdoc
	 * @method init
	 * @param {{language: string, dictionary: Object<string, Object<string, function(Object<string, (number|string)>): string>>}} config
	 *        The dictionary field contains the localization phrases organized
	 *        in a deep plain object map. The top-level key is the name of the
	 *        phrase group, the bottom-level key is the phrase key. The
	 *        bottom-level value is the localization phrase generator that
	 *        takes the phrase placeholder values map as an argument and
	 *        produces the localization phrase with its placeholders evaluated
	 *        using the provided placeholder values.
	 */
	init(config) {
		this._language = config.language;
		this._dictionary = config.dictionary;
	}

	/**
	 * @inheritdoc
	 * @method getLanguage
	 */
	getLanguage() {
		return this._language;
	}

	/**
	 * @inheritdoc
	 * @method get
	 * @param {string} key The key identifying the localization phrase. The key
	 *        consists of at least two parts separated by dots. The first part
	 *        denotes the name of the source JSON localization file, while the
	 *        rest denote a field path within the localization object within
	 *        the given localization file.
	 * @param {Object<string, (boolean|number|string|Date)>=} parameters The
	 *        map of parameter names to the parameter values to use.
	 *        Defaults to an empty plain object.
	 */
	get(key, parameters = {}) {
		let path = key.split('.');
		let scope = this._dictionary;

		for (let scopeKey of path) {
			if (!scope[scopeKey]) {
				throw new GenericError(
					`ima.dictionary.MessageFormatDictionary.get: The ` +
					`localization phrase '${key}' does not exists`,
					{ key, parameters }
				);
			}

			scope = scope[scopeKey];
		}

		return scope(parameters);
	}
}

ns.ima.dictionary.MessageFormatDictionary = MessageFormatDictionary;
