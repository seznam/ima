// @server-side

import ns from '../namespace';
import AbstractRouter from './AbstractRouter';
import Request from './Request';
import Response from './Response';
import RouteFactory from './RouteFactory';
import Router from './Router';
import Dispatcher from '../event/Dispatcher';
import PageRenderer from '../page/renderer/PageRenderer';

ns.namespace('ima.router');

/**
 * The server-side implementation of the {@codelink Router} interface.
 *
 * @class Server
 * @extends AbstractRouter
 * @implements Router
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
	 * @param {PageRenderer} pageManager The current page manager.
	 * @param {RouteFactory} factory The router factory used to create routes.
	 * @param {Dispatcher} dispatcher Dispatcher fires events to app.
	 * @param {Request} request The current HTTP request.
	 * @param {Response} response The current HTTP response.
	 */
	constructor(pageManager, factory, dispatcher, request, response) {
		super(pageManager, factory, dispatcher);

		/**
		 * The current HTTP request.
		 *
		 * @private
		 * @property _request
		 * @type {Request}
		 */
		this._request = request;

		/**
		 * The current HTTP response.
		 *
		 * @private
		 * @property _response
		 * @type {Response}
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
