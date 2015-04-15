import ns from 'imajs/client/core/namespace.js';
import CoreError from 'imajs/client/core/coreError.js';

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
	 * @param {Core.Router.Factory} factory
	 * @param {Promise} Promise
	 * @example
	 *      router.link('article', {articleId: 1});
	 * @example
	 *      router.redirect('http://www.example.com/web');
	 */
	constructor(pageRender, factory, Promise) {
		super();

		/**
		 * @property _pageRender
		 * @protected
		 * @type {Core.Base.PageRender}
		 * @default pageRender
		 */
		this._pageRender = pageRender;

		/**
		 * @property _factory
		 * @protected
		 * @type {Core.Router.Factory}
		 * @default factory
		 */
		this._factory = factory;

		/**
		 * @property _Promise
		 * @protected
		 * @type {Promise}
		 * @default Promise
		 */
		this._Promise = Promise;

		/**
		 * Keep all routes.
		 *
		 * @property _routes
		 * @protected
		 * @type {Array}
		 * @default []
		 */
 		this._routes = [];

		/**
		 * Current mode - one of MODE_*.
		 *
		 * @property mode
		 * @protected
		 * @type {string}
		 * @default null
		 */
		this._mode = null;

		/**
		 * Web protocol.
		 *
		 * @property _protocol
		 * @type {string}
		 * @default null
		 */
		this._protocol = null;

		/**
		 * Current domain.
		 *
		 * @property _domain
		 * @protected
		 * @type {string}
		 * @default ''
		 */
		this._domain = '';

		/**
		 * Root folder.
		 *
		 * @property _root
		 * @type {string}
		 * @default ''
		 */
		this._root = '';

		/**
		 * Defined language part in path.
		 *
		 * @property _languagePartPath
		 * @type {string}
		 * @default ''
		 */
		this._languagePartPath = '';

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
		this._protocol = config.protocol || '';
		this._root = config.root || '';
		this._languagePartPath = config.languagePartPath || '';
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
		this._protocol = '';
		this._domain = '';
		this._root = '';
		this._languagePartPath = '';

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
		this._routes.push(this._factory.createRoute(name, pathExpression, controller));

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
	 * Returns current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
	}

	/**
	 * Returns current all url.
	 *
	 * @method getUrl
	 */
	getUrl() {
		return this._getBaseUrl() + this.getPath();
	}

	/**
	 * Returns domain
	 *
	 * @method getDomain
	 * @return {string}
	 */
	getDomain() {
		return this._domain;
	}

	/**
	 * Returns root path.
	 *
	 * @method getRoot
	 * @return {string}
	 */
	getRoot() {
		return this._root;
	}

	/**
	 * Returns language part path.
	 *
	 * @method getLanguagePartPath
	 * @return {string}
	 */
	getLanguagePartPath() {
		return this._languagePartPath;
	}

	/**
	 * Returns web protocol.
	 *
	 * @method getProtocol
	 * @return {string}
	 */
	getProtocol() {
		return this._protocol;
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
	 * @param {string} url
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
			throw new CoreError(`Core.Router:link has undefined route with name ${routeName}. Add new route with that name.`);
		}

		return this._getBaseUrl() + route.createPathForParams(params);
	}

	/**
	 * Handle path by router.
	 *
	 * @method route
	 * @param {string} path
	 * @return {Promise}
	 */
	route(path) {
		var routeForPath = this._getRouteByPath(path);
		var params = {path};

		if (!routeForPath) {
			return this.handleNotFound(params);
		}

		params = routeForPath.getParamsForPath(path);

		return this._handle(routeForPath, params);
	}

	/**
	 * Handle Error that call 'error' controller with params.
	 *
	 * @method handleError
	 * @param {Object} params
	 * @return {Promise}
	 */
	handleError(params) {
		var routeError = this._getRouteByName(this.ROUTE_NAME_ERROR);

		if (!routeError) {
			var error = new CoreError(`Core.Router:handleError has undefined route. Add new route with name '${this.ROUTE_NAME_ERROR}'.`, params);

			return this._Promise.reject(error);
		}

		return this._handle(routeError, params);
	}

	/**
	 * Handle Not Found path that call 'notFound' controller with params.
	 *
	 * @method handleNotFound
	 * @param {Object} params
	 * @return {Promise}
	 */
	handleNotFound(params) {
		var routeNotFound = this._getRouteByName(this.ROUTE_NAME_NOT_FOUND);

		if (!routeNotFound) {
			var error = new CoreError('$Error', `Core.Router:handleNotFound has undefined route. Add new route with name '${this.ROUTE_NAME_NOT_FOUND}'.`, params);

			return this._Promise.reject(error);
		}

		return this._handle(routeNotFound, params);
	}

	/**
	 * Return true if error is client error and return http status 4**.
	 *
	 * @method isClientError
	 * @param {Error} error
	 * @return {boolean}
	 */
	isClientError(error) {
		return error instanceof CoreError && (error.getHttpStatus() >= 400 && error.getHttpStatus() < 500);
	}

	/**
	 * Handle route's name with params.
	 *
	 * @method _handle
	 * @private
	 * @param {Core.Router.Route} route - route
	 * @param {Object} params
	 * @return {Promise}
	 */
	_handle(route, params) {
		var controller = this._factory.createController(route.getController(), this);

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

	/**
	 * Extract route path from original url path.
	 *
	 * @method _extractRoutePath
	 * @protected
	 * @param {string} path
	 * @return {string}
	 */
	_extractRoutePath(path) {
		return path.replace(this._root + this._languagePartPath, '');
	}

	/**
	 * Returns base url.
	 *
	 * @method _getBaseUrl
	 * @return {string}
	 */
	_getBaseUrl() {
		return this._protocol + '//' + this._domain + this._root + this._languagePartPath;
	}

}

ns.Core.Abstract.Router = Router;
