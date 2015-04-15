import ns from 'imajs/client/core/namespace.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('Core.Dictionary');

/**
 * @class MessageFormat
 * @extends Core.Interface.Dictionary
 * @namespace Core.Dictionary
 * @module Core
 * @submodule Core.Dictionary
 */
class MessageFormat extends ns.Core.Interface.Dictionary{

	/**
	 * @method constructor
	 * @constructor
	 * @example
	 * 		dictionary.get('home.hello', {GENDER: 'MALE'});
	 */
	constructor() {
		super();

		/**
		 * Application language.
		 *
		 * @property _language
		 * @private
		 * @type {String}
		 * @default null
		 */
		this._language = null;

		/**
		 * Stored dictionary.
		 *
		 * @property _dictionary
		 * @private
		 * @type {Object}
		 * @default null
		 */
		this._dictionary = null;
	}

	/**
	 * Initialization dictionary class. Set language and dictionary.
	 *
	 * @method init
	 * @param {Object} config
	 */
	init(config = {language: 'cs', dictionary: {}}) {
		this._language = config.language;
		this._dictionary = config.dictionary;
	}

	/**
	 * Return application language.
	 *
	 * @method getLanguage
	 * @return {String}
	 */
	getLanguage() {
		return this._language;
	}

	/**
	 * Translate vocabulary key with params and return localization string.
	 *
	 * @method get
	 * @param {String} vocabularyKey - key for dictionary
	 * @param {Object} [vocabularyParams={}]
	 * @return {String}
	 */
	get(vocabularyKey, vocabularyParams = {}) {
		var pathToVocabulary = vocabularyKey.split('.');
		var vocabulary = this._dictionary;

		for (var i = 0; i < pathToVocabulary.length; i++) {

			if (typeof(vocabulary[pathToVocabulary[i]]) === 'undefined') {
				throw new CoreError(`Core.Dictionary.MessageFormat:get hasnt vocabulary '${pathToVocabulary[i]}' in path '${vocabularyKey}'`, {vocabularyKey, vocabularyParams});
			} else {
				vocabulary = vocabulary[pathToVocabulary[i]];
			}

		}

		return vocabulary(vocabularyParams);
	}
}

ns.Core.Dictionary.MessageFormat = MessageFormat;