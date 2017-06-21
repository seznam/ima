import ns from '../namespace';
import RouteFactory from './RouteFactory';
import Events from './Events';
import Route from './Route';
import Router from './Router';
import RouteNames from './RouteNames';
import Controller from '../controller/Controller';
import GenericError from '../error/GenericError';
import Dispatcher from '../event/Dispatcher';
import AbstractDocumentView from '../page/AbstractDocumentView';
import PageManager from '../page/manager/PageManager';

ns.namespace('ima.router');

/**
 * The basic implementation of the {@codelink Router} interface, providing the
 * common or default functionality for parts of the API.
 *
 * @abstract
 */
export default class AbstractRouter extends Router {

	/**
	 * Initializes the router.
	 *
	 * @param {PageManager} pageManager The page manager handling UI rendering,
	 *        and transitions between pages if at the client side.
	 * @param {RouteFactory} factory Factory for routes.
	 * @param {Dispatcher} dispatcher Dispatcher fires events to app.
	 * @example
	 *      router.link('article', {articleId: 1});
	 * @example
	 *      router.redirect('http://www.example.com/web');
	 * @example
	 *      router.add(
	 *        'home',
	 *        '/',
	 *        ns.app.page.home.Controller,
	 *        ns.app.page.home.View,
	 *        {
	 *          onlyUpdate: false,
	 *          autoScroll: true,
	 *          allowSPA: true,
	 *          documentView: null
	 *        }
	 *      );
	 */
	constructor(pageManager, factory, dispatcher) {
		super();

		/**
		 * The page manager handling UI rendering, and transitions between
		 * pages if at the client side.
		 *
		 * @type {PageManager}
		 */
		this._pageManager = pageManager;

		/**
		 * Factory for routes.
		 *
		 * @type {RouteFactory}
		 */
		this._factory = factory;

		/**
		 * Dispatcher fires events to app.
		 *
		 * @type {Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * The current protocol used to access the application, terminated by a
		 * colon (for example {@code https:}).
		 *
		 * @type {string}
		 */
		this._protocol = '';

		/**
		 * The application's host.
		 *
		 * @type {string}
		 */
		this._host = '';

		/**
		 * The URL path pointing to the application's root.
		 *
		 * @type {string}
		 */
		this._root = '';

		/**
		 * The URL path fragment used as a suffix to the {@code _root} field
		 * that specifies the current language.
		 *
		 * @type {string}
		 */
		this._languagePartPath = '';

		/**
		 * Storage of all known routes. The key are the route names.
		 *
		 * @type {Map<string, Route>}
		 */
		this._routes = new Map();
	}

	/**
	 * @inheritdoc
	 */
	init(config) {
		this._protocol = config.$Protocol || '';
		this._root = config.$Root || '';
		this._languagePartPath = config.$LanguagePartPath || '';
		this._host = config.$Host;
	}

	/**
	 * @inheritdoc
	 */
	add(name, pathExpression, controller, view, options = undefined) {
		if (this._routes.has(name)) {
			throw new GenericError(
				`ima.router.AbstractRouter.add: The route with name ${name} ` +
				`is already defined`
			);
		}

		let factory = this._factory;
		let route = factory.createRoute(
			name,
			pathExpression,
			controller,
			view,
			options
		);
		this._routes.set(name, route);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	remove(name) {
		this._routes.delete(name);

		return this;
	}

	/**
	 * @inheritdoc
	 */
	getPath() {
		throw new GenericError(
			'The getPath() method is abstract and must be overridden.'
		);
	}

	/**
	 * @inheritdoc
	 */
	getUrl() {
		return this.getBaseUrl() + this.getPath();
	}

	/**
	 * @inheritdoc
	 */
	getBaseUrl() {
		return this.getDomain() + this._root + this._languagePartPath;
	}

	/**
	 * @inheritdoc
	 */
	getDomain() {
		return this._protocol + '//' + this._host;
	}

	/**
	 * @inheritdoc
	 */
	getHost() {
		return this._host;
	}

	/**
	 * @inheritdoc
	 */
	getProtocol() {
		return this._protocol;
	}

	/**
	 * @inheritdoc
	 */
	getCurrentRouteInfo() {
		let path = this.getPath();
		let route = this._getRouteByPath(path);

		if (!route) {
			throw new GenericError(
				`ima.router.AbstractRouter.getCurrentRouteInfo: The route ` +
				`for path ${path} is not defined.`
			);
		}

		let params = route.extractParameters(path);

		return { route, params, path };
	}

	/**
	 * @inheritdoc
	 * @abstract
	 */
	listen() {
		throw new GenericError(
			'The listen() method is abstract and must be overridden.'
		);
	}

	/**
	 * @inheritdoc
	 * @abstract
	 */
	redirect(url, options) {
		throw new GenericError(
			'The redirect() method is abstract and must be overridden.'
		);
	}

	/**
	 * @inheritdoc
	 */
	link(routeName, params) {
		let route = this._routes.get(routeName);

		if (!route) {
			throw new GenericError(
				`ima.router.AbstractRouter:link has undefined route with ` +
				`name ${routeName}. Add new route with that name.`
			);
		}

		return this.getBaseUrl() + route.toPath(params);
	}

	/**
	 * @inheritdoc
	 */
	route(path, options = {}) {
		let routeForPath = this._getRouteByPath(path);
		let params = {};

		if (!routeForPath) {
			params.error = new GenericError(
				`Route for path '${path}' is not configured.`,
				{ status: 404 }
			);

			return this.handleNotFound(params);
		}

		params = routeForPath.extractParameters(path);

		return this._handle(routeForPath, params, options);
	}

	/**
	 * @inheritdoc
	 */
	handleError(params, options = {}) {
		let routeError = this._routes.get(RouteNames.ERROR);

		if (!routeError) {
			let error = new GenericError(
				`ima.router.AbstractRouter:handleError cannot process the ` +
				`error because no error page route has been configured. Add ` +
				`a new route named '${RouteNames.ERROR}'.`,
				params
			);

			return Promise.reject(error);
		}

		return this._handle(routeError, params, options);
	}

	/**
	 * @inheritdoc
	 */
	handleNotFound(params, options = {}) {
		let routeNotFound = this._routes.get(RouteNames.NOT_FOUND);

		if (!routeNotFound) {
			let error = new GenericError(
				`ima.router.AbstractRouter:handleNotFound cannot processes ` +
				`a non-matching route because no not found page route has ` +
				`been configured. Add new route named ` +
				`'${RouteNames.NOT_FOUND}'.`,
				params
			);

			return Promise.reject(error);
		}

		return this._handle(routeNotFound, params, options);
	}

	/**
	 * @inheritdoc
	 */
	isClientError(reason) {
		return reason instanceof GenericError &&
				reason.getHttpStatus() >= 400 &&
				reason.getHttpStatus() < 500;
	}

	/**
	 * @inheritdoc
	 */
	isRedirection(reason) {
		return reason instanceof GenericError &&
				reason.getHttpStatus() >= 300 &&
				reason.getHttpStatus() < 400;
	}

	/**
	 * Strips the URL path part that points to the application's root (base
	 * URL) from the provided path.
	 *
	 * @protected
	 * @param {string} path Relative or absolute URL path.
	 * @return {string} URL path relative to the application's base URL.
	 */
	_extractRoutePath(path) {
		return path.replace(this._root + this._languagePartPath, '');
	}

	/**
	 * Handles the provided route and parameters by initializing the route's
	 * controller and rendering its state via the route's view.
	 *
	 * The result is then sent to the client if used at the server side, or
	 * displayed if used as the client side.
	 *
	 * @param {Route} route The route that should have its
	 *        associated controller rendered via the associated view.
	 * @param {Object<string, (Error|string)>} params Parameters extracted from
	 *        the URL path and query.
	 * @param {{
	 *          onlyUpdate: (
	 *            boolean|
	 *            function(
	 *              (string|function(new: Controller, ...*)),
	 *              (string|function(
	 *                new: React.Component,
	 *                Object<string, *>,
	 *                ?Object<string, *>
	 *              ))
	 *            ): boolean
	 *          )=,
	 *          autoScroll: boolean=,
	 *          allowSPA: boolean=,
 	 *          documentView: ?AbstractDocumentView=
 	 *        }} options The options overrides route options defined in the
	 *        {@code routes.js} configuration file.
	 * @return {Promise<Object<string, *>>} A promise that resolves when the
	 *         page is rendered and the result is sent to the client, or
	 *         displayed if used at the client side.
	 */
	_handle(route, params, options) {
		let controller = route.getController();
		let view = route.getView();
		options = Object.assign({}, route.getOptions(), options);
		let data = { route, params, path: this.getPath(), options };

		this._dispatcher
			.fire(Events.BEFORE_HANDLE_ROUTE, data, true);

		return (
			this._pageManager
				.manage(controller, view, options, params)
				.then((response) => {
					response = response || {};

					if (params.error && params.error instanceof Error) {
						response.error = params.error;
					}

					data.response = response;

					this._dispatcher
						.fire(Events.AFTER_HANDLE_ROUTE, data, true);

					return response;
				})
		);
	}

	/**
	 * Returns the route matching the provided URL path part. The path may
	 * contain a query.
	 *
	 * @param {string} path The URL path.
	 * @return {?Route} The route matching the path, or {@code null} if no such
	 *         route exists.
	 */
	_getRouteByPath(path) {
		for (let route of this._routes.values()) {
			if (route.matches(path)) {
				return route;
			}
		}

		return null;
	}
}

ns.ima.router.AbstractRouter = AbstractRouter;
