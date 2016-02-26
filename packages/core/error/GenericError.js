import ns from 'ima/namespace';
import Error from './Error';

ns.namespace('ima.error');

/**
 * Implementation of the ima.error.Error interface, providing more advanced
 * error API.
 *
 * @class GenericError
 * @extends ExtensibleError
 * @implements ima.error.Error
 * @namespace ima.error
 * @module ima
 * @submodule ima.error
 */
export default class GenericError extends Error {
	/**
	 * Initializes the generic IMA error.
	 *
	 * @constructor
	 * @method constructor
	 * @param {string} message The message describing the cause of the error.
	 * @param {Object<string, *>=} [params={}] A data map providing additional
	 *        details related to the error. It is recommended to set the
	 *        {@code status} field to the HTTP response code that should be sent
	 *        to the client.
	 * @param {boolean=} dropInternalStackFrames Whether or not the call stack
	 *        frames referring to the constructors of the custom errors should
	 *        be excluded from the stack of this error (just like the native
	 *        platform call stack frames are dropped by the JS engine).
	 *        This flag is enabled by default.
	 */
	constructor(message, params = {}, dropInternalStackFrames = true) {
		super(message, dropInternalStackFrames);

		/**
		 * The data providing additional details related to this error.
		 *
		 * @private
		 * @property _params
		 * @type {Object<string, *>}
		 */
		this._params = params;
	}

	/**
	 * @inheritdoc
	 * @override
	 * @method getHttpStatus
	 */
	getHttpStatus() {
		return this._params.status || 500;
	}

	/**
	 * @inheritdoc
	 * @override
	 * @method getParams
	 */
	getParams() {
		return this._params;
	}
}

ns.ima.error.GenericError = GenericError;
