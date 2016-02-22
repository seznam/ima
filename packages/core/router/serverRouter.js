// @server-side

import ns from 'ima/namespace';
import AbstractRouter from 'ima/router/abstractRouter';

ns.namespace('Ima.Router');

/**
 * The server-side implementation of the {@codelink Ima.Router.Router}
 * interface.
 *
 * @class Server
 * @extends Ima.Router.AbstractRouter
 * @namespace Ima.Router
 * @module Ima
 * @submodule Ima.Router
 */
export default class ServerRouter extends AbstractRouter {

	/**
	 * Initializes the router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Ima.Interface.PageRender} pageManager The current page manager.
	 * @param {Ima.Router.RouteFactory} factory The router factory used to create
	 *        routes.
	 * @param {Ima.Event.Dispatcher} dispatcher Dispatcher fires events to
	 *        app.
	 * @param {{ROUTE_NAMES: Object<string, string>, EVENTS: Object<string, string>}} ROUTER_CONSTANTS
	 *        The internal router constants. The {@code ROUTE_NAMES}
	 *        contains internal route names. The {@code EVENTS} contains name
	  *       of events which are fired with {@code Ima.Event.Dispatcher}.
	 * @param {Ima.Router.Request} request The current HTTP request.
	 * @param {Ima.Router.Response} response The current HTTP response.
	 */
	constructor(pageManager, factory, dispatcher, ROUTER_CONSTANTS, request,
			response) {
		super(pageManager, factory, dispatcher, ROUTER_CONSTANTS);

		/**
		 * The current HTTP request.
		 *
		 * @private
		 * @property _request
		 * @type {Ima.Router.Request}
		 */
		this._request = request;

		/**
		 * The current HTTP response.
		 *
		 * @private
		 * @property _response
		 * @type {Ima.Router.Response}
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

ns.Ima.Router.ServerRouter = ServerRouter;
