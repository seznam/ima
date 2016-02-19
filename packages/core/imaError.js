import ns from 'ima/namespace';
import * as errorImplementation from 'ima/abstract/imaError';
//import ErrorInterface from 'ima/interface/error'; //eslint-disable-line

/*

 This file exists only because babel dropped the support for extending native
 classes :-/

 */

ns.namespace('Ima');

// extend the Error class
IMAError.prototype = Object.create(Error.prototype);
IMAError.prototype.constructor = IMAError;

/**
 * Implementation of the Ima.Interface.Error interface, providing more
 * advanced error API.
 *
 * @class IMAError
 * @extends Error
 * @implements Ima.Interface.Error
 * @namespace Ima
 * @module Ima
 *
 * @param {string} message The message describing the cause of the error.
 * @param {Object<string, *>} [params={}] A data map providing additional
 *        details related to the error. It is recommended to set the
 *        {@code status} field to the HTTP response code that should be sent
 *        to the client.
 * @param {boolean=} dropInternalStackFrames Whether or not the call stack
 *        frames referring to the constructors of the {@codelink IMAError}
 *        and overriding class(es) should be included in the stack of this
 *        error.
 */
export default function IMAError(message, params = {},
		dropInternalStackFrames = true) {
	Error.call(this, message); // super-call

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
Object.defineProperty(IMAError.prototype, 'stack', {
	configurable: false,
	enumerable: true,
	get: function() {
		return errorImplementation.getStack.call(this, IMAError);
	}
});

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
IMAError.prototype.getHttpStatus = function() {
	return errorImplementation.getHttpStatus.call(this);
};

/**
 * Returns the error parameters providing additional details about the error.
 * The structure of the returned object is always situation dependent, but
 * the returned object usually contains the {@code status: number} field
 * which represents the HTTP status to send to the client.
 *
 * @override
 * @method getParams
 * @return {Object<string, *>} The error parameters providing additional
 *         details about the error.
 */
IMAError.prototype.getParams = function() {
	return errorImplementation.getParams.call(this);
};

/**
 * Returns the name of this error. The name briefly describes this error.
 *
 * @override
 * @method getName
 * @return {string} The name of this error.
 */
IMAError.prototype.getName = function() {
	return errorImplementation.getName.call(this);
};

/**
 * Returns a string representing this error. The string will consist of the
 * error name and message.
 *
 * @override
 * @method toString
 * @return {string} A string representing this error.
 */
IMAError.prototype.toString = function() {
	return errorImplementation.toString.call(this);
};

ns.Ima.IMAError = IMAError;
