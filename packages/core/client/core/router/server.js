import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Router');

/**
 * The server-side implementation of the {@codelink Core.Interface.Router}
 * interface.
 *
 * @class Server
 * @extends Core.Abstract.Router
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
export default class Server extends ns.Core.Abstract.Router {

	/**
	 * Initializes the router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.PageRender} pageManager The current page manager.
	 * @param {Core.Router.Factory} factory The router factory used to create
	 *        routes.
	 * @param {Core.Interface.Dispatcher} dispatcher Dispatcher fires events to
	 *        app.
	 * @param {{ROUTE_NAMES: Object<string, string>, EVENTS: Object<string, string>}} ROUTER_CONSTANTS
	 *        The internal router constants. The {@code ROUTE_NAMES}
	 *        contains internal route names. The {@code EVENTS} contains name
	  *       of events which are fired with {@code Core.Interface.Dispatcher}.
	 * @param {Core.Router.Request} request The current HTTP request.
	 * @param {Core.Router.Response} response The current HTTP response.
	 */
	constructor(pageManager, factory, dispatcher, ROUTER_CONSTANTS, request,
			response) {
		super(pageManager, factory, dispatcher, ROUTER_CONSTANTS);

		/**
		 * The current HTTP request.
		 *
		 * @private
		 * @property _request
		 * @type {Core.Router.Request}
		 */
		this._request = request;

		/**
		 * The current HTTP response.
		 *
		 * @private
		 * @property _response
		 * @type {Core.Router.Response}
		 */
		this._response = response;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return this._extractRoutePath(this._request.getPath());
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method listen
	 * @return {Core.Interface.Router}
	 */
	listen() {
		return this;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method redirect
	 * @param {string} url
	 * @param {{httpStatus: number=, onlyUpdate: boolean=, autoScroll: boolean=}} [options={}]
	 */
	redirect(url = '/', options = {}) {
		this._response.redirect(url, options.httpStatus || 302);
	}
}

ns.Core.Router.Server = Server;
