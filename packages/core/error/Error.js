import ns from '../namespace';
import ExtensibleError from './ExtensibleError';

ns.namespace('ima.error');

/**
 * The IMA application error extends the native {@code Error} with additional
 * details that lead to the error and the HTTP status code to send to the
 * client.
 *
 * Implementation note: This is an interface that extends the abstract class
 * {@linkcode ExtensibleError}, which does not make much sense from the strict
 * OOP standpoint, but is necessary due to limitations of JavaScript, so that
 * IMA errors are instances of both the native errors and of this interface.
 *
 * @interface
 */
export default class Error extends ExtensibleError {

	/**
	 * Returns the HTTP status to send to the client.
	 *
	 * If the error has occurred at the client-side, the status code is used to
	 * determine the error page to show to the user.
	 *
	 * This method is a shorthand for the following code snippet:
	 * {@code this.getParams().status || 500}.
	 *
	 * @return {number} The HTTP status to send to the client.
	 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 */
	getHttpStatus() {}

	/**
	 * Returns the error parameters providing additional details about the
	 * error. The structure of the returned object is always
	 * situation-dependent, but the returned object usually contains the
	 * {@code status: number} field which represents the HTTP status to send to
	 * the client.
	 *
	 * @return {Object<string, *>} The route parameters of the route at which
	 *         the error has occurred.
	 * @see getHttpStatus
	 */
	getParams() {}
}

ns.ima.error.Error = Error;
