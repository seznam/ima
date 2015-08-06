import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Abstract');

/**
 * The basic implementation of the {@codelink Core.Interface.Router} interface,
 * providing the common or default functionality for parts of the API.
 *
 * @abstract
 * @class Router
 * @implements Core.Interface.Router
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 */
export default class Router extends ns.Core.Interface.Router {

	/**
	 * Initializes the router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.PageManager} pageManager The page manager handling
	 *        UI rendering, and transitions between pages if at the client side.
	 * @param {Core.Router.Factory} factory Factory for routes.
	 * @param {Core.Interface.Dispatcher} dispatcher Dispatcher fires events to app.
	 * @param {{ROUTE_NAMES: Object<string, string>, EVENTS: Object<string, string>}
	 *        ROUTER_CONSTANTS The internal router constants. The {@code ROUTE_NAMES}
	 *        contains internal route names. The {@code EVENTS} contains name of events
	 *        which are fired with {@code Core.Interface.Dispatcher}.
	 * @example
	 *      router.link('article', {articleId: 1});
	 * @example
	 *      router.redirect('http://www.example.com/web');
	 * @example
	 *      router.add('home', ns.App.Page.Home.Controller, ns.App.Page.Home.View, {onlyUpdate: false, autoScroll: true});
	 */
	constructor(pageManager, factory, dispatcher, ROUTER_CONSTANTS) {
		super();

		/**
		 * The page manager handling UI rendering, and transitions between pages if
		 * at the client side.
		 *
		 * @private
		 * @property _pageManager
		 * @type {Core.Interface.pageManager}
		 */
		this._pageManager = pageManager;

		/**
		 * Factory for routes.
		 *
		 * @private
		 * @property _factory
		 * @type {Core.Router.Factory}
		 */
		this._factory = factory;

		/**
		 * Dispatcher fires events to app.
		 *
		 * @private
		 * @property _dispatcher
		 * @type {Core.Interface.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * The internal route names.
		 *
		 * @const
		 * @private
		 * @property _ROUTE_NAMES
		 * @type {Object<string, string>}
		 */
		this._ROUTE_NAMES = ROUTER_CONSTANTS.ROUTE_NAMES;

		/**
		 * The internal router events.
		 *
		 * @private
		 * @property _EVENTS
		 * @type {Object<string, string>}
		 */
		this._EVENTS = ROUTER_CONSTANTS.EVENTS;

		/**
		 * The current protocol used to access the application, terminated by a
		 * collon (for example {@code https:}).
		 *
		 * @private
		 * @property _protocol
		 * @type {string}
		 * @default ''
		 */
		this._protocol = '';

		/**
		 * The application's host.
		 *
		 * @private
		 * @property _host
		 * @type {string}
		 * @default ''
		 */
		this._host = '';

		/**
		 * The URL path pointing to the application's root.
		 *
		 * @private
		 * @property _root
		 * @type {string}
		 * @default ''
		 */
		this._root = '';

		/**
		 * The URL path fragment used as a suffix to the {@code _root} field that
		 * specifies the current language.
		 *
		 * @private
		 * @property _languagePartPath
		 * @type {string}
		 * @default ''
		 */
		this._languagePartPath = '';

		/**
		 * Storage of all known routes. The key are the route names.
		 *
		 * @private
		 * @property _routes
		 * @type {Map<string, Core.Router.Route>}
		 */
		this._routes = new Map();
	}

	/**
	 * Initializes the router with the provided configuration.
	 *
	 * @inheritDoc
	 * @override
	 * @method init
	 * @param {{$Protocol: string, $Host: string, $Root: string, $LanguagePartPath: string}} config
	 *        Router configuration.
	 *        The {@code $Protocol} field must be the current protocol used to
	 *        access the application, terminated by a collon (for example
	 *        {@code https:}).
	 *        The {@code $Host} field is the application's host.
	 *        The {@code $Root} field must specify the URL path pointing to the
	 *        application's root.
	 *        The {@code $LanguagePartPath} field must be the URL path fragment
	 *        used as a suffix to the {@code $Root} field that specifies the
	 *        current language.
	 */
	init(config) {
		this._protocol = config.$Protocol || '';
		this._root = config.$Root || '';
		this._languagePartPath = config.$LanguagePartPath || '';
		this._host = config.$Host;
	}

	/**
	 * Adds a new route to router.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method add
	 * @param {string} name The unique name of this route, identifying it among
	 *        the rest of the routes in the application.
	 * @param {string} pathExpression A path expression specifying the URL path
	 *        part matching this route (must not contain a query string),
	 *        optionally containing named parameter placeholders specified as
	 *        {@code :parameterName}.
	 * @param {string} controller The full name of Object Container alias
	 *        identifying the controller associated with this route.
	 * @param {string} view The full name or Object Container alias identifying
	 *        the view class associated with this route.
	 * @param {Object<string, *>=} [options] The route additional options.
	 * @return {Core.Interface.Router} This router.
	 * @throws {Core.IMAError} Thrown if a route with the same name is added
	 *         multiple times.
	 */
	add(name, pathExpression, controller, view, options) {
		if (this._routes.has(name)) {
			throw new IMAError(`Core.Abstract.Router.add: The route with name ` +
					`${name} is already defined`);
		}

		var factory = this._factory;
		var route = factory.createRoute(name, pathExpression, controller, view, options);
		this._routes.set(name, route);

		return this;
	}

	/**
	 * Removes the specified route from the router's known routes.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method remove
	 * @param {string} name The route's unique name, identifying the route to
	 *        remove.
	 * @return {Core.Interface.Router} This router.
	 */
	remove(name) {
		this._routes.delete(name);

		return this;
	}

	/**
	 * Ruturns current path part of the current URL, including the query string
	 * (if any).
	 *
	 * @inheritDoc
	 * @override
	 * @method getPath
	 * @return {string} The path and query parts of the current URL.
	 */
	getPath() {
		throw new IMAError('The getPath() method is abstract and must be overridden.');
	}

	/**
	 * Returns the current absolute URL (including protocol, host, query, etc).
	 *
	 * @inheritDoc
	 * @override
	 * @method getUrl
	 * @return {string} The current absolute URL.
	 */
	getUrl() {
		return this._getBaseUrl() + this.getPath();
	}

	/**
	 * Returns the application's domain in the following form
	 * {@code `${protocol}//${host}`}.
	 *
	 * @inheritDoc
	 * @override
	 * @method getDomain
	 * @return {string} The current application's domain.
	 */
	getDomain() {
		return this._protocol + '//' + this._host;
	}

	/**
	 * Returns application's host.
	 *
	 * @inheritDoc
	 * @override
	 * @method getHost
	 * @return {string} The current application's host.
	 */
	getHost() {
		return this._host;
	}

	/**
	 * Returns the current protocol used to access the application, terminated by
	 * a collon (for example {@code https:}).
	 *
	 * @inheritDoc
	 * @override
	 * @method getProtocol
	 * @return {string} The current application protocol used to access the
	 *         application.
	 */
	getProtocol() {
		return this._protocol;
	}

	/**
	 * Generates an absolute URL (including protocol, domain, etc) for the
	 * specified route by substituting the route's parameter placeholders with
	 * the provided parameter values.
	 *
	 * @inheritDoc
	 * @override
	 * @method link
	 * @param {string} routeName The unique name of the route, identifying the
	 *        route to use.
	 * @param {Object<string, string>} params Parameter values for the route's
	 *        parameter placeholders. Extraneous parameters will be added as URL
	 *        query.
	 * @return {string} An absolute URL for the specified route and parameters.
	 */
	link(routeName, params) {
		var route = this._routes.get(routeName);

		if (!route) {
			throw new IMAError(`Core.Router:link has undefined route with name ` +
					`${routeName}. Add new route with that name.`);
		}

		return this._getBaseUrl() + route.toPath(params);
	}

	/**
	 * Routes the application to the route matching the providing path, renders
	 * the route page and sends the result to the client.
	 *
	 * @inheritDoc
	 * @override
	 * @method route
	 * @param {string} path The URL path part received from the client, with
	 *        optional query.
	 * @return {Promise<undefined>} A promise resolved when the error has been
	 *         handled and the response has been sent to the client, or displayed
	 *         if used at the client side.
	 */
	route(path) {
		var routeForPath = this._getRouteByPath(path);
		var params = {path};

		if (!routeForPath) {
			return this.handleNotFound(params);
		}

		params = routeForPath.extractParameters(path);

		return this._handle(routeForPath, params);
	}

	/**
	 * Handles an internal server error by responding with the appropriate
	 * "internal server error" error page.
	 *
	 * @inheritDoc
	 * @override
	 * @method handleError
	 * @param {Object<string, string>} params Parameters extracted from the
	 *        current URL path and query.
	 * @return {Promise<undefined>} A promise resolved when the error has been
	 *         handled and the response has been sent to the client, or displayed
	 *         if used at the client side.
	 */
	handleError(params) {
		var routeError = this._routes.get(this._ROUTE_NAMES.ERROR);

		if (!routeError) {
			var error = new IMAError(`Core.Router:handleError cannot process the ` +
					`error because no error page route has been configured. Add a new ` +
					`route named '${this._ROUTE_NAMES.ERROR}'.`, params);

			return Promise.reject(error);
		}

		return this._handle(routeError, params);
	}

	/**
	 * Handles a "not found" error by responsing with the appropriate "not found"
	 * error page.
	 *
	 * @inheritDoc
	 * @override
	 * @method handleNotFound
	 * @param {Object<string, string>} params Parameters extracted from the
	 *        current URL path and query.
	 * @return {Promise<undefined>} A promise resolved when the error has been
	 *         handled and the response has been sent to the client, or displayed
	 *         if used at the client side.
	 */
	handleNotFound(params) {
		var routeNotFound = this._routes.get(this._ROUTE_NAMES.NOT_FOUND);

		if (!routeNotFound) {
			var error = new IMAError(`Core.Router:handleNotFound cannot processes ` +
					`a non-matching route because no not found page route has been ` +
					`configured. Add new route named '${this._ROUTE_NAMES.NOT_FOUND}'.`,
					params);

			return Promise.reject(error);
		}

		return this._handle(routeNotFound, params);
	}

	/**
	 * Tests, if possible, whether the specified error was caused by the client's
	 * action (for example wrong URL or request encoding) or by a failure at the
	 * server side.
	 *
	 * @inheritDoc
	 * @override
	 * @method isClientError
	 * @param {(Core.IMAError|Error)} error The encountered error.
	 * @return {boolean} {@code true} if the error was caused the action of the
	 *         client.
	 */
	isClientError(error) {
		return (error instanceof IMAError) &&
				(error.getHttpStatus() >= 400) &&
				(error.getHttpStatus() < 500);
	}

	/**
	 * Tests, if possible, whether the specified error lead to redirection.
	 *
	 * @method isRedirection
	 * @param {(Core.IMAError|Error)} error The encountered error.
	 * @return {boolean} {@code true} if the error was caused the action of the
	 *         redirection.
	 */
	isRedirection(error) {
		return (error instanceof IMAError) &&
				(error.getHttpStatus() >= 300) &&
				(error.getHttpStatus() < 400);
	}

	/**
	 * Strips the URL path part that points to the application's root (base URL)
	 * from the provided path.
	 *
	 * @protected
	 * @method _extractRoutePath
	 * @param {string} path Relative or absolute URL path.
	 * @return {string} URL path relative to the application's base URL.
	 */
	_extractRoutePath(path) {
		return path.replace(this._root + this._languagePartPath, '');
	}

	/**
	 * Returns the application's absolute base URL, pointing to the public root
	 * of the application.
	 *
	 * @protected
	 * @method _getBaseUrl
	 * @return {string} The application's base URL.
	 */
	_getBaseUrl() {
		return this.getDomain() + this._root +
			this._languagePartPath;
	}

	/**
	 * Handles the provided route and parameters by initalizing the route's
	 * controller and rendering its state via the route's view.
	 *
	 * The result is then sent to the client if used at the server side, or
	 * displayed if used as the client side.
	 *
	 * @private
	 * @method _handle
	 * @param {Core.Router.Route} route The route that should have its associated
	 *        controller rendered via the associated view.
	 * @param {Object<string, string>} params Parameters extracted from the URL
	 *        path and query.
	 * @return {Promise<undefined>} A promise that resolves when the page is
	 *         rendered and the result is sent to the client, or displayed if
	 *         used at the client side.
	 */
	_handle(route, params) {
		var controller = route.getController();
		var view = route.getView();
		var options = route.getOptions();

		return (
			this._pageManager
				.manage(controller, view, options, params)
				.then((response) => {
					var data = {route, params, response, path: this.getPath()};

					this._dispatcher
						.fire(this._EVENTS.ROUTE_HANDLE, data, true);
				})
		);
	}

	/**
	 * Returns the route matching the provided URL path part. The path may
	 * contain a query.
	 *
	 * @private
	 * @method _getRouteByPath
	 * @param {string} path The URL path.
	 * @return {?Core.Router.Route} The route matching the path, or {@code null}
	 *         if no such route exists.
	 */
	_getRouteByPath(path) {
		for (var route of this._routes.values()) {
			if (route.matches(path)) {
				return route;
			}
		}

		return null;
	}
}

ns.Core.Abstract.Router = Router;
