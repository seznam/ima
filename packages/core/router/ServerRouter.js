// @server-side

import ns from 'ima/namespace';
import AbstractRouter from 'ima/router/AbstractRouter';

ns.namespace('ima.router');

/**
 * The server-side implementation of the {@codelink ima.router.Router}
 * interface.
 *
 * @class Server
 * @extends ima.router.AbstractRouter
 * @namespace ima.router
 * @module ima
 * @submodule ima.router
 */
export default class ServerRouter extends AbstractRouter {

	/**
	 * Initializes the router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {ima.page.renderer.PageRenderer} pageManager The current page manager.
	 * @param {ima.router.RouteFactory} factory The router factory used to create
	 *        routes.
	 * @param {ima.event.Dispatcher} dispatcher Dispatcher fires events to
	 *        app.
	 * @param {{ROUTE_NAMES: Object<string, string>, EVENTS: Object<string, string>}} ROUTER_CONSTANTS
	 *        The internal router constants. The {@code ROUTE_NAMES}
	 *        contains internal route names. The {@code EVENTS} contains name
	  *       of events which are fired with {@code ima.event.Dispatcher}.
	 * @param {ima.router.Request} request The current HTTP request.
	 * @param {ima.router.Response} response The current HTTP response.
	 */
	constructor(pageManager, factory, dispatcher, ROUTER_CONSTANTS, request,
			response) {
		super(pageManager, factory, dispatcher, ROUTER_CONSTANTS);

		/**
		 * The current HTTP request.
		 *
		 * @private
		 * @property _request
		 * @type {ima.router.Request}
		 */
		this._request = request;

		/**
		 * The current HTTP response.
		 *
		 * @private
		 * @property _response
		 * @type {ima.router.Response}
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

ns.ima.router.ServerRouter = ServerRouter;
