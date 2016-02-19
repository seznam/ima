import ns from 'ima/core/namespace';
import IMAError from 'ima/core/imaError';
import Dictionary from 'ima/core/interface/dictionary';

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
export default class MessageFormat extends Dictionary {

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
	 * @inheritdoc
	 * @method init
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
	 */
	get(key, parameters = {}) {
		var path = key.split('.');
		var scope = this._dictionary;

		for (var scopeKey of path) {
			if (!scope[scopeKey]) {
				throw new IMAError(`Core.Dictionary.MessageFormat.get: The ` +
						`localization phrase '${key}' does not exists`,
						{ key, parameters });
			}

			scope = scope[scopeKey];
		}

		return scope(parameters);
	}
}

ns.Core.Dictionary.MessageFormat = MessageFormat;
