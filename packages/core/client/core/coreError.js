import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core');

/**
 * Implementation of the Core.Interface.Error interface, providing more
 * advanced error API.
 *
 * @class CoreError
 * @extends Error
 * @implements Core.Interface.Error
 * @namespace Core
 * @module Core
 */
class CoreError {

	/**
	 * Initializes the error.
	 *
	 * @method constructor
	 * @constructor
	 * @param {string} message The message describing the cause of the error.
	 * @param {Object<string, *>} [params={}] A data map providing additional
	 *        details related to the error. It is recommended to set the
	 *        {@code status} field to the HTTP response code that should be sent
	 *        to the client.
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
		 * The name of this error, used in the generated stack.
		 *
		 * @property name
		 * @public
		 * @type {string}
		 * @default 'CoreError'
		 */
		this.name = 'CoreError';

		/**
		 * The message describing the cause of the error.
		 *
		 * @property message
		 * @type {string}
		 */
		this.message = message;

		/**
		 * A data map providing additional details related to this error.
		 *
		 * @property _params
		 * @private
		 * @type {Object<string, *>}
		 */
		this._params = params;
	}

	/**
	 * Returns the HTTP status to send to the client.
	 *
	 * This method is a shorthand for the following code snippet:
	 * {@code this.getParams().status || 500}.
	 *
	 * @inheritdoc
	 * @override
	 * @method getHttpStatus
	 * @return {number}
	 */
	getHttpStatus() {
		return this._params.status || 500;
	}

	/**
	 * Returns the error parameters providing additional details about the error.
	 * The structure of the returned object is always situation dependent, but
	 * the returned object usually contains the {@code status: number} field
	 * which represents the HTTP status to send to the client.
	 *
	 * @override
	 * @method getParams
	 * @return {Object<string, *>}
	 */
	getParams() {
		return this._params;
	}

	/**
	 * Returns the name of this error. The name briefly describes this error.
	 *
	 * @override
	 * @method getName
	 * @return {string}
	 */
	getName() {
		return this.name;
	}

	/**
	 * Returns a string representing this error. The string will consist of the
	 * error name and message.
	 *
	 * @override
	 * @method toString
	 * @return {string}
	 */
	toString() {
		return `${this.name}: ${this.message}`;
	}
}

ns.Core.CoreError = CoreError;

export default CoreError;