import ns from 'ima/core/namespace';
import * as errorImplementation from 'ima/core/abstract/imaError';
import ErrorInterface from 'ima/core/interface/error';

ns.namespace('Core');

/**
 * Implementation of the Core.Interface.Error interface, providing more
 * advanced error API.
 *
 * @class IMAErrorES6
 * @extends Error
 * @implements Core.Interface.Error
 * @namespace Core
 * @module Core
 */
export default class IMAErrorES6 extends Error {

	/**
	 * Initializes the error.
	 *
	 * @method constructor
	 * @constructor
	 * @param {string} message The message describing the cause of the error.
	 * @param {Object<string, *>=} [params={}] A data map providing additional
	 *        details related to the error. It is recommended to set the
	 *        {@code status} field to the HTTP response code that should be
	 *        sent to the client.
	 * @param {boolean=} dropInternalStackFrames Whether or not the call stack
	 *        frames referring to the constructors of the {@codelink IMAError}
	 *        and overriding class(es) should be included in the stack of this
	 *        error.
	 */
	constructor(message, params = {}, dropInternalStackFrames = true) {
		super(message);

		errorImplementation.constructor.call(
			this,
			message,
			params,
			dropInternalStackFrames
		);
	}

	/**
	 * The call stack captured at the moment of creation of this error. The
	 * formatting of the stack is browser-dependant.
	 *
	 * @override
	 * @public
	 * @property stack
	 * @type {string}
	 */
	get stack() {
		return errorImplementation.getStack.call(this, IMAErrorES6);
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
		return errorImplementation.getHttpStatus.call(this);
	}

	/**
	 * Returns the error parameters providing additional details about the
	 * error. The structure of the returned object is always situation
	 * dependent, but the returned object usually contains the
	 * {@code status: number} field which represents the HTTP status to send to
	 * the client.
	 *
	 * @override
	 * @method getParams
	 * @return {Object<string, *>} The error parameters providing additional
	 *         details about the error.
	 */
	getParams() {
		return errorImplementation.getParams.call(this);
	}

	/**
	 * Returns the name of this error. The name briefly describes this error.
	 *
	 * @override
	 * @method getName
	 * @return {string} The name of this error.
	 */
	getName() {
		return errorImplementation.getName.call(this);
	}

	/**
	 * Returns a string representing this error. The string will consist of the
	 * error name and message.
	 *
	 * @override
	 * @method toString
	 * @return {string} A string representing this error.
	 */
	toString() {
		return errorImplementation.toString.call(this);
	}
}

ns.Core.IMAErrorES6 = IMAErrorES6;
