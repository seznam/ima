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
	 * @return {Boolean}
	 */
	isEnabled() {
		return !!this._req;
	}

	/**
	 * Return request ooriginal url.
	 *
	 * @method getPath
	 * @return {String|null}
	 */
	getPath() {
		if (this.isEnabled()) {
			return this._req.originalUrl;
		} else {
			return null;
		}
	}

	/**
	 * Return cookie string header.
	 *
	 * @method getCookie
	 * @return {String}
	 */
	getCookie() {
		return this._req.get('Cookie');
	}
}

ns.Core.Router.Request = Request;