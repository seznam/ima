import ns from 'core/namespace/ns.js';

ns.namespace('Core.Abstract');

/**
 * @class Router
 * @extends Core.Interface.Router
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 */
class Router extends ns.Core.Interface.Router {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.PageRender} pageRender
	 * @example
	 *      router.link('article', {articleId: 1});
	 * @example
	 *      router.redirect('http://www.example.com/web');
	 */
	constructor(pageRender) {
		super();

		/**
		 * Keep all routes.
		 *
		 * @property _routes
		 * @private
		 * @type {Array}
		 * @default []
		 */
 		this._routes = [];

		/**
		 * Current mode - one of MODE_*.
		 *
		 * @property mode
		 * @private
		 * @type {string}
		 * @default null
		 */
		this._mode = null;

		/**
		 * Current domain.
		 *
		 * @property _domain
		 * @private
		 * @type {string}
		 * @default null
		 */
		this._domain = null;

		/**
		 * @property _pageRender
		 * @private
		 * @type {Core.Base.PageRender}
		 * @default pageRender
		 */
		this._pageRender = pageRender;

		/**
		 * @property MODE_HISTORY
		 * @const
		 * @type {string}
		 * @default 'history'
		 */
		this.MODE_HISTORY = 'history';

		/**
		 * @property MODE_HASH
		 * @const
		 * @type {string}
		 * @default 'hash'
		 */
		this.MODE_HASH = 'hash';

		/**
		 * @property MODE_SERVER
		 * @const
		 * @type {string}
		 * @default 'server'
		 */
		this.MODE_SERVER = 'server';
		
		/**
		 * @property ROUTE_NAME_NOT_FOUND
		 * @const
		 * @type {string}
		 * @default 'notFound'
		 */
		this.ROUTE_NAME_NOT_FOUND = 'notFound';

		/**
		 * @property ROUTE_NAME_ERROR
		 * @const
		 * @type {string}
		 * @default 'error'
		 */
		this.ROUTE_NAME_ERROR = 'error';

		this.clear();
	}

	/**
	 * Initialization router.
	 *
	 * @method init
	 * @chainable
	 * @param {Object} config
	 * @return {this}
	 */
	init(config = {}) {

	}

	/**
	 * Clear all setting in router.
	 *
	 * @method clear
	 * @chainable
	 * @return {this}
	 */
	clear() {
		this._routes = [];
		this._mode = null;
		this._domain = null;

		return this;
	}

	/**
	 * Add route to router.
	 *
	 * @method add
	 * @chainable
	 * @param {string} name
	 * @param {string} pathExpression
	 * @param {string} controller
	 * @return {this}
	 */
	add(name, pathExpression, controller) {
		this._routes.push(ns.oc.create('$Route', name, pathExpression, controller));

		return this;
	}

	/**
	 * Remove path from router.
	 *
	 * @method remove
	 * @chainable
	 * @param {string} pathExpression
	 * @return {this}
	 */
	remove(pathExpression) {
		for (var i = 0; i < this._routes.length; i++) {

			if (this._routes[i].getPathExpression() === pathExpression) {
				this._routes.splice(i, 1);
				return this;
			}
		}

		return this;
	}

	/**
	 * Get current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {

	}

	/**
	 * Get current all url.
	 *
	 * @method getUrl
	 */
	getUrl() {
		return this._domain + this.getPath();
	}

	/**
	 * Attach event to window.
	 *
	 * @method listen
	 * @chainable
	 * @return {this}
	 */
	listen() {

	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 * @param {string} url -
	 */
	redirect(url) {

	}

	/**
	 * Return link for route's name with params.
	 *
	 * @method link
	 * @param {string} routeName - alias for route
	 * @param {Object} params
	 * @return {string}
	 */
	link(routeName, params) {
		var route = this._getRouteByName(routeName);

		if (!route) {
			throw new Error(`Core.Router:link has undefined route with name ${routeName}. Add new route with that name.`);
		}

		return this._domain + route.createPathForParams(params);
	}

	/**
	 * Handle path by router.
	 *
	 * @method route
	 * @param {string} path
	 */
	route(path) {
		var routeForPath = this._getRouteByPath(path);
		var routeName = this.ROUTE_NAME_NOT_FOUND;
		var params = {path};

		if (routeForPath) {
			routeName = routeForPath.getName();
			params = routeForPath.getParamsForPath(path);
		}

		return this._handle(routeName, params);
	}

	/**
	 * Handle Error that call 'error' controller with params.
	 *
	 * @method handleError
	 * @param {Object} params
	 * @return {Promise}
	 */
	handleError(params) {
		return this._handle(this.ROUTE_NAME_ERROR, params);
	}

	/**
	 * Handle Not Found path that call 'notFound' controller with params.
	 *
	 * @method handleNotFound
	 * @param {Object} params
	 * @return {Promise}
	 */
	handleNotFound(params) {
		return this._handle(this.ROUTE_NAME_NOT_FOUND, params);
	}

	/**
	 * Handle route's name with params.
	 *
	 * @method _handle
	 * @private
	 * @param {string} routeName - route alias
	 * @param {Object} params
	 * @return {Promise}
	 */
	_handle(routeName, params) {
		var handleRoute = this._getRouteByName(routeName);

		if (!handleRoute) {
			throw new Error(`Core.Router:_handle has undefined route. Add new route with name '${routeName}'.`);
		}
		var controller = handleRoute.getController();

		return this._pageRender.render(controller, params);
	}

	/**
	 * Return Route by path.
	 *
	 * @method _getRouteByPath
	 * @param {string} path
	 * @return {Core.Router.Data|null}
	 */
	_getRouteByPath(path) {
		for (var i = this._routes.length - 1; i >= 0; i--) {
			var route = this._routes[i];

			if (route.isMatch(path)) {
				return route;
			}
		}

		return null;
	}

	/**
	 * Get route by name.
	 *
	 * @method _getRouteByName
	 * @param {string} routeName
	 * @return {Core.Router.Data|null}
	 */
	_getRouteByName(routeName) {
		for (var i = 0; i < this._routes.length; i++) {
			var route = this._routes[i];

			if (route.getName() === routeName) {
				return route;
			}
		}

		return null;
	}
}

ns.Core.Abstract.Router = Router;
