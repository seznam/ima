import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * Wrapper for the ExpressJS response, exposing only the neccessary minimum.
 *
 * @class Response
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class Response {

	/**
	 * Initializes the response.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {

		/**
		 * The ExpressJS response object, or {@code null} if running at the client
		 * side.
		 *
		 * @private
		 * @property _response
		 * @type {?Express.Response}
		 * @default null
		 */
		this._response = null;
	}

	/**
	 * Initializes this response wrapper with the provided ExpressJS response
	 * object.
	 *
	 * @method init
	 * @chainable
	 * @param {?Express.Response} response The ExpressJS response, or
	 *        {@code null} if the code is running at the client side.
	 * @return {Core.Router.Response} This response.
	 */
	init(response) {
		this._response = response;
		return this;
	}

	/**
	 * Redirects the client to the specified location, with the specified
	 * redirect HTTP response code.
	 *
	 * For full list of HTTP response status codes see
	 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 *
	 * Use this method only at the server side.
	 *
	 * @method redirect
	 * @param {string} url The URL to which the client should be redirected.
	 * @param {number=} [status=303] The HTTP status code to send to the client.
	 */
	redirect(url ,status = 303) {
		this._response.redirect(url, status);
	}

	/**
	 * Sets the HTTP status code that will be sent to the client when the
	 * response is sent.
	 *
	 * For full list of available response codes see
	 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 *
	 * Use this method only at the server side.
	 *
	 * @chainable
	 * @method status
	 * @param {number} httpStatus HTTP response status code to send to the
	 *        client.
	 * @return {Core.Router.Response} This response.
	 */
	status(httpStatus) {
		this._response.status(httpStatus);
		return this;
	}

	/**
	 * Sends the response to the client with the provided content. Use this
	 * method only at the server side.
	 *
	 * @chainable
	 * @method send
	 * @param {string} content The response body.
	 * @return {Core.Router.Response} This response.
	 */
	send(content) {
		this._response.send(content);
		return this;
	}

	/**
	 * Sets a cookie, which will be sent to the client with the response.
	 *
	 * @chainable
	 * @method setCookie
	 * @param {string} name The cookie name.
	 * @param {(boolean|number|string)} value The cookie value, will be converted
	 *        to string.
	 * @param {{domain: string=, expires: (number|string)=}} options Cookie
	 *        attributes. Only the attributes listed in the type annotation of
	 *        this field are supported. For documentation and full list of cookie
	 *        attributes see http://tools.ietf.org/html/rfc2965#page-5
	 * @return {Core.Router.Response} This response.
	 */
	setCookie(name, value, options = {}) {
		this._response.cookie(name, value, options);
		return this;
	}
}

ns.Core.Router.Response = Response;
