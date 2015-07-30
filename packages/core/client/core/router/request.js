import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * Wrapper for the ExpressJS request, exposing only the neccessary minimum.
 *
 * @class Request
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
export default class Request {

	/**
	 * Initializes the request.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {

		/**
		 * The current ExpressJS request object, or {@code null} if running at the
		 * client side.
		 *
		 * @private
		 * @property _request
		 * @type {?Express.Request}
		 * @default null
		 */
		this._request = null;
	}

	/**
	 * Initializes the request using the provided ExpressJS request object.
	 *
	 * @method init
	 * @param {?Express.Request} request The ExpressJS request object
	 *        representing the current request. Use {@code null} at the client
	 *        side.
	 */
	init(request) {
		this._request = request;
	}

	/**
	 * Returns the path part of the URL to which the request was made.
	 *
	 * @method getPath
	 * @return {string} The path to which the request was made.
	 */
	getPath() {
		return this._request ? this._request.originalUrl : '';
	}

	/**
	 * Returns the {@code Cookie} HTTP header value.
	 *
	 * @method getCookieHeader
	 * @return {string} The value of the {@code Cookie} header.
	 */
	getCookieHeader() {
		return this._request ? this._request.get('Cookie') : '';
	}
}

ns.Core.Router.Request = Request;
