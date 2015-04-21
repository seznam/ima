import ns from 'imajs/client/core/namespace.js';

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
	 * @param {Core.Interface.PageRender} pageManager
	 * @param {Core.Router.Factory} factory
	 * @param {Promise} Promise
	 * @param {Core.Router.Request} request
	 * @param {Core.Router.Response} response
	 */
	constructor(pageManager, factory, Promise, request, response) {
		super(pageManager, factory, Promise);

		/**
		 * @property _request
		 * @private
		 * @type {Core.Router.Request}
		 * @default request
		 */
		this._request = request;

		/**
		 * @property _response
		 * @private
		 * @type {Core.Router.Response}
		 * @default response
		 */
		this._response = response;
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
		super.init(config);
		this._mode = this.MODE_SERVER;
		this._domain = config.$Domain;

		return this;
	}

	/**
	 * Get current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return this._extractRoutePath(this._request.getPath());
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
		this._response.redirect(url);
	}
}

ns.Core.Router.ServerHandler = ServerHandler;
