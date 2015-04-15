import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * @class Respond
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class Respond {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {

		/**
		 * @property _res
		 * @private
		 * @type {Express.Respond}
		 * @default null
		 */
		this._res = null;
	}

	/**
	 * Initialization class with server respond.
	 *
	 * @method init
	 * @chainable
	 * @param {Express.Respond} res
	 * @return {this}
	 */
	init(res) {
		this._res = res;
		return this;
	}

	/**
	 * Redirect respond for url with status.
	 * 
	 * @method redirect
	 * @param {String} url
	 * @param {Number} status
	 */
	redirect(url ,status = 303) {
		this._res.redirect(url, status);
	}

	/**
	 * Return true for defined property res.
	 * 
	 * @method isEnabled
	 * @return {Boolean}
	 */
	isEnabled() {
		return !!this._res;
	}

	/**
	 * Set http status for respond.
	 * 
	 * @method status
	 * @chainable
	 * @param {Number} httpStatus
	 * @return {Number}
	 */
	status(httpStatus) {
		this._res.status(httpStatus);
		return this;
	}

	/**
	 * Send respond to client.
	 * 
	 * @method send
	 * @chainable
	 * @param {String} content
	 * @@return {this}
	 */
	send(content) {
		this._res.send(content);
		return this;
	}

	/**
	 * Set cookie to respond.
	 *
	 * @method setCookie
	 * @chainable
	 * @param {String} name
	 * @param {*} value
	 * @param {Object} options
	 */
	setCookie(name, value, options) {
		this._res.cookie(name, value, options);
		return this;
	}
 }

ns.Core.Router.Respond = Respond;