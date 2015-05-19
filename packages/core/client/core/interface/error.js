import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * The IMA.js application error extends the native {@code Error} with
 * additional details that lead to the error and the HTTP status code to send
 * to the client.
 *
 * @interface Error
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Error {

	/**
	 * Returns the HTTP status to send to the client.
	 *
	 * This method is a shorthand for the following code snippet:
	 * {@code this.getParams().status || 500}.
	 *
	 * @method getHttpStatus
	 * @return {number} The HTTP status to send to the client.
	 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 */
	getHttpStatus() {}

	/**
	 * Returns the error parameters providing additional details about the error.
	 * The structure of the returned object is always situation dependent, but
	 * the returned object usually contains the {@code status: number} field
	 * which represents the HTTP status to send to the client.
	 *
	 * @method getParams
	 * @return {Object<string, *>} The route parameters of the route at which the
	 *         error has occurred.
	 */
	getParams() {}

	/**
	 * Returns the name of this error. The name briefly describes this error.
	 *
	 * @method getName
	 * @return {string} The name of this error.
	 */
	getName() {}

	/**
	 * Returns a string representing this error. The string will consist of the
	 * error name and message.
	 *
	 * @override
	 * @method toString
	 * @return {string} A string representing this error.
	 */
	toString() {}
}

ns.Core.Interface.Error = Error;
