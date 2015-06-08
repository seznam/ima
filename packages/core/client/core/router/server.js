import ns from 'imajs/client/core/namespace.js';

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
	 * @param {Object<string, string>} ROUTE_NAMES The internal route names.
	 * @param {Core.Router.Request} request The current HTTP request.
	 * @param {Core.Router.Response} response The current HTTP response.
	 */
	constructor(pageManager, factory, ROUTE_NAMES, request, response) {
		super(pageManager, factory, ROUTE_NAMES);

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
	 * Ruturns current path part of the current URL, including the query string
	 * (if any).
	 *
	 * @method getPath
	 * @return {string} The path and query parts of the current URL.
	 */
	getPath() {
		return this._extractRoutePath(this._request.getPath());
	}

	/**
	 * Registers event listeners at the client side window object allowing the
	 * router to capture user's history (history pop state - going "back") and
	 * page (clicking links) navigation.
	 *
	 * The router will start processing the navigation internally, handling the
	 * user's navigation to display the page related to the URL resulting from
	 * the user's action.
	 *
	 * Note that the router will not prevent forms from being submitted to the
	 * server.
	 *
	 * The effects of this method cannot be reverted. This method has no effect
	 * at the server side.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method listen
	 * @return {Core.Interface.Router} This router.
	 */
	listen() {
		return this;
	}

	/**
	 * Redirects the client to the specified location.
	 *
	 * At the server side the method results in responsing to the client with a
	 * redirect HTTP status code and the {@code Location} header.
	 *
	 * At the client side the method updates the current URL by manipulating the
	 * browser history (if the target URL is at the same domain and protocol as
	 * the current one) or performs a hard redirect (if the target URL points to
	 * a different protocol or domain).
	 *
	 * The method will result in the router handling the new URL and routing the
	 * client to the related page if the URL is set at the client side and points
	 * to the same domain and protocol.
	 *
	 * @inheritDoc
	 * @override
	 * @method redirect
	 * @param {string} url The URL to which the client should be redirected.
	 */
	redirect(url) {
		this._response.redirect(url);
	}
}

ns.Core.Router.Server = Server;
