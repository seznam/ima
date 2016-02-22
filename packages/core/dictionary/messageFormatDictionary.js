import ns from 'ima/namespace';
import IMAError from 'ima/error/genericError';
import DictionaryInterface from 'ima/dictionary/dictionary';

ns.namespace('Ima.Dictionary');

/**
 * Implementation of the {@codelink Ima.Dictionary.Dictionary} interface that
 * relies on compiled MessageFormat localization messages for its dictionary.
 *
 * @class MessageFormatDictionary
 * @implements Ima.Dictionary.Dictionary
 * @namespace Ima.Dictionary
 * @module Ima
 * @submodule Ima.Dictionary
 */
export default class MessageFormatDictionary extends DictionaryInterface {

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
		 * @type {Object<string, Object<string, function(Object<string, (number|string)>): string>>}
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
	 */
	get(key, parameters = {}) {
		var path = key.split('.');
		var scope = this._dictionary;

		for (var scopeKey of path) {
			if (!scope[scopeKey]) {
				throw new IMAError(`Ima.Dictionary.MessageFormatDictionary.get: The ` +
						`localization phrase '${key}' does not exists`,
						{ key, parameters });
			}

			scope = scope[scopeKey];
		}

		return scope(parameters);
	}
}

ns.Ima.Dictionary.MessageFormatDictionary = MessageFormatDictionary;
