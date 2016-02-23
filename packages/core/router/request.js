// @server-side

import ns from 'ima/namespace';

ns.namespace('ima.router');

/**
 * Wrapper for the ExpressJS request, exposing only the neccessary minimum.
 *
 * @class Request
 * @namespace ima.router
 * @module ima
 * @submodule ima.router
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
		 * The current ExpressJS request object, or {@code null} if running at
		 * the client side.
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

	/**
	 * Returns uploaded file to server and meta information.
	 *
	 * @method getFile
	 * @return {?Object<string, *>}
	 */
	getFile() {
		return this._request ? this._request.file : null;
	}

	/**
	 * Returns upaloaded files to server with their meta information.
	 *
	 * @method getFiles
	 * @return {?Object<string, *>}
	 */
	getFiles() {
		return this._request ? this._request.files : null;
	}

	/**
	 * Returns body of request.
	 *
	 * @method getBody
	 * @return {?string}
	 */
	getBody() {
		return this._request ? this._request.body || null : null;
	}

	/**
	 * Returns the specified HTTP request header.
	 *
	 * @method getHeader
	 * @param {string} header
	 * @return {?string}
	 */
	getHeader(header) {
		return this._request ? this._request.get(header) || null : null;
	}

	/**
	 * Returns the remote IP address of the request.
	 *
	 * @method getIP
	 * @return {?string}
	 */
	getIP() {
		return this._request ? this._request.ip : null;
	}

	/**
	 * Returns array of IP addresses specified in the “X-Forwarded-For”
	 * request header.
	 *
	 * @method getIPs
	 * @return {Array<string>}
	 */
	getIPs() {
		return this._request ? this._request.ips || [] : [];
	}
}

ns.ima.router.Request = Request;
