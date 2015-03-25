import ns from 'core/namespace/ns.js';

ns.namespace('Core.Router');

/**
 * @class Request
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class Request {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {

		/**
		 * @property _req
		 * @private
		 * @type {Express.Request}
		 * @default null
		 */
		this._req = null;
	}


	/**
	 * Initialization class with server request.
	 *
	 * @method init
	 * @param {Express.Request|null} req
	 */
	init(req) {
		this._req = req;
	}

	/**
	 * Return true for defined property req.
	 *
	 * @method isEnabled
	 * @return {boolean}
	 */
	isEnabled() {
		return !!this._req;
	}

	/**
	 * Return request original url.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return this._req.originalUrl;
	}

	/**
	 * Return cookie string header.
	 *
	 * @method getCookie
	 * @return {string}
	 */
	getCookie() {
		return this._req.get('Cookie');
	}
}

ns.Core.Router.Request = Request;