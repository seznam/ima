import ns from 'core/namespace/ns.js';

ns.namespace('Core.Router');

/**
 * @class ServerHandler
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class ServerHandler extends ns.Core.Abstract.Router {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Promise} Promise
	 * @param {Core.Router.Request} request
	 */
	constructor(pageRender, Promise, request) {
		super(pageRender, Promise);

		/**
		 * @property _request
		 * @private
		 * @type {Core.Router.Request}
		 * @default request
		 */
		this._request = request;
	}

	/**
	 * Initialization router.
	 *
	 * @method init
	 * @chainable
	 * @param {Object} [config={}]
	 * @return {this}
	 */
	init(config = {}) {
		this._mode = this.MODE_SERVER;
		this._domain = config.domain;

		return this;
	}

	/**
	 * Get current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		var path = this._request.isEnabled() ? this._request.getPath() : '';

		return path;
	}

	/**
	 * Attach event to window.
	 *
	 * @method listen
	 * @chainable
	 * @return {this}
	 */
	listen() {
		return this;
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 * @param {string} url
	 */
	redirect(url) {
		this._respond.redirect(url);
	}
}

ns.Core.Router.ServerHandler = ServerHandler;
