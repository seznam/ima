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
class Router extends ns.Core.Interface.Router {

	/**
	 * Initializes the router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.PageManager} pageManager The page manager handling
	 *        UI rendering, and transitions between pages if at the client side.
	 * @param {Core.Router.Factory} factory Factory for routes.
	 * @param {Object<string, string>} ROUTE_NAMES The internal route names.
	 * @example
	 *      router.link('article', {articleId: 1});
	 * @example
	 *      router.redirect('http://www.example.com/web');
	 */
	constructor(pageManager, factory, ROUTE_NAMES) {
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
		 * The internal route names.
		 *
		 * @const
		 * @private
		 * @property _ROUTE_NAMES
		 * @type {Object<string, string>}
		 */
		this._ROUTE_NAMES = ROUTE_NAMES;

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
		 * The application's domain in the following form:
		 * {@code `${protocol}//${host}`}.
		 *
		 * @private
		 * @property _domain
		 * @type {string}
		 * @default ''
		 */
		this._domain = '';

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
		 * The URL path fragment used as a suffix to the {@code $Root} field that
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
	 * @inheritdoc
	 * @override
	 * @method init
	 * @param {{$Protocol: string, $Domain: string, $Root: string, $LanguagePartPath: string}} config
	 *        Router configuration.
	 *        The {@code $Protocol} field must be the current protocol used to
	 *        access the application, terminated by a collon (for example
	 *        {@code https:}).
	 *        The {@code $Domain} field must be the application's domain in the
	 *        following form: {@code `${protocol}//${host}`}.
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
		this._domain = config.$Domain;
	}

	/**
	 * Adds a new route to router.
	 *
	 * @inheritdoc
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
	 * @return {Core.Interface.Router} This router.
	 * @throws {Core.IMAError} Thrown if a route with the same name is added
	 *         multiple times.
	 */
	add(name, pathExpression, controller, view) {
		if (this._routes.has(name)) {
			throw new IMAError(`Core.Abstract.Router.add: The path with name ${name}` +
			'is already defined');
		}

		var factory = this._factory;
		var route = factory.createRoute(name, pathExpression, controller, view);
		this._routes.set(name, route);

		return this;
	}

	/**
	 * Removes the specified route from the router's known routes.
	 *
	 * @inheritdoc
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
	 * Returns the current absolute URL (including protocol, host, query, etc).
	 *
	 * @inheritdoc
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
	 * @inheritdoc
	 * @override
	 * @method getDomain
	 * @return {string} The current application's domain.
	 */
	getDomain() {
		return this._domain;
	}

	/**
	 * Returns the current protocol used to access the application, terminated by
	 * a collon (for example {@code https:}).
	 *
	 * @inheritdoc
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
	 * @inheritdoc
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
	 * @inheritdoc
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
	 * @inheritdoc
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
			var error = new IMAError(`Core.Router:handleError has undefined ` +
				`route. Add new route with name '${this._ROUTE_NAMES.ERROR}'.`,
				params);

			return Promise.reject(error);
		}

		return this._handle(routeError, params);
	}

	/**
	 * Handles a "not found" error by responsing with the appropriate "not found"
	 * error page.
	 *
	 * @inheritdoc
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
			var error = new IMAError(`Core.Router:handleNotFound has undefined ` +
				`route. Add new route with name '${this._ROUTE_NAMES.NOT_FOUND}'.`,
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
	 * @inheritdoc
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
		return this._protocol + '//' + this._domain + this._root +
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

		return this._pageManager.manage(controller, view, params);
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
