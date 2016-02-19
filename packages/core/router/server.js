import ns from 'ima/core/namespace';
import AbstractRouter from 'ima/core/abstract/router';

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
export default class Server extends AbstractRouter {

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
	 * @inheritdoc
	 * @method getPath
	 */
	getPath() {
		return this._extractRoutePath(this._request.getPath());
	}

	/**
	 * @inheritdoc
	 * @method listen
	 */
	listen() {
		return this;
	}

	/**
	 * @inheritdoc
	 * @method redirect
	 */
	redirect(url = '/', options = {}) {
		this._response.redirect(url, options.httpStatus || 302);
	}
}

ns.Core.Router.Server = Server;
