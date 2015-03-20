import ns from 'core/namespace/ns.js';

ns.namespace('Core.Error');

/**
 * @class Handler
 * @namespace Core.Error
 * @module Core
 * @submodule Core.Error
 */
class Handler {

	/**
	 * @method contrusctor
	 * @constructor
	 * @param {String} message
	 * @param {Object} [params={}]
	 */
	constructor(message, params = {}) {
		this.constructor.__proto__ = Error.prototype; // jshint ignore:line

		//FIX IE
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.prototype = Error.prototype;
		}

		/**
		 * @property _name
		 * @private
		 * @type {String}
		 * @default 'CoreError'
		 */
		this._name = 'CoreError';

		/**
		 * @property message
		 * @type {String}
		 * @default message
		 */
		this.message = message;

		/**
		 * @property _params
		 * @private
		 * @type {bject}
		 * @default params
		 */
		this._params = params;
	}

	/**
	 * Return http status.
	 *
	 * @method getHttpStatus
	 * @return {Number}
	 */
	getHttpStatus() {
		return this._params.status || 500;
	}

	/**
	 * Return error params.
	 *
	 * @method getParams
	 * @return {Object}
	 */
	getParams() {
		return this._params;
	}

	/**
	 * Return error name.
	 *
	 * @method getName
	 * @return {String}
	 */
	getName() {
		return this._name;
	}

	/**
	 * Convert to string.
	 *
	 * @method toString
	 * @return {String}
	 */
	toString() {
		return `${this._name}: ${this.message}`;
	}

	/**
	 * Convert to source.
	 *
	 * @method toSource
	 * @return {String}
	 */
	toSource() {
		return `${this._name}: ${this.message}`;
	}
}

ns.Core.Error.Handler = Handler;