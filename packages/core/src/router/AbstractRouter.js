import AbstractRoute from './AbstractRoute';
import ActionTypes from './ActionTypes';
import Events from './Events';
import Router from './Router';
import RouteNames from './RouteNames';
import GenericError from '../error/GenericError';
import RouterMiddleware from './RouterMiddleware';

/**
 * The basic implementation of the {@link Router} interface, providing the
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
   *          documentView: null,
   *          managedRootView: null,
   *          viewAdapter: null
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
     * colon (for example `https:`).
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
     * The URL path fragment used as a suffix to the `_root` field
     * that specifies the current language.
     *
     * @type {string}
     */
    this._languagePartPath = '';

    /**
     * Storage of all known routes and middlewares. The key are their names.
     *
     * @type {Map<string, AbstractRoute>}
     */
    this._routeHandlers = new Map();

    /**
     * Middleware ID counter which is used to auto-generate unique middleware
     * names when adding them to routeHandlers map.
     */
    this._currentMiddlewareId = 0;
  }

  /**
   * @inheritdoc
   */
  init(config) {
    this._protocol = config.$Protocol || '';
    this._root = config.$Root || '';
    this._languagePartPath = config.$LanguagePartPath || '';
    this._host = config.$Host;
    this._currentlyRoutedPath = this.getPath();
  }

  /**
   * @inheritdoc
   */
  add(name, pathExpression, controller, view, options = undefined) {
    if (this._routeHandlers.has(name)) {
      throw new GenericError(
        `ima.core.router.AbstractRouter.add: The route with name ${name} ` +
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

    this._routeHandlers.set(name, route);

    return this;
  }

  /**
   * @inheritdoc
   */
  use(middleware) {
    this._routeHandlers.set(
      `middleware-${this._currentMiddlewareId++}`,
      new RouterMiddleware(middleware)
    );

    return this;
  }

  /**
   * @inheritdoc
   */
  remove(name) {
    this._routeHandlers.delete(name);

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
    let { route } = this._getRouteHandlersByPath(path);

    if (!route) {
      route = this._routeHandlers.get(RouteNames.NOT_FOUND);

      if (!route) {
        throw new GenericError(
          `ima.core.router.AbstractRouter.getCurrentRouteInfo: The route ` +
            `for path ${path} is not defined.`
        );
      }
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
  unlisten() {
    throw new GenericError(
      'The unlisten() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   * @abstract
   */
  redirect() {
    throw new GenericError(
      'The redirect() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  link(routeName, params) {
    let route = this._routeHandlers.get(routeName);

    if (!route) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:link has undefined route with ` +
          `name ${routeName}. Add new route with that name.`
      );
    }

    return this.getBaseUrl() + route.toPath(params);
  }

  /**
   * @inheritdoc
   */
  async route(path, options = {}, action = {}, locals = {}) {
    this._currentlyRoutedPath = path;

    let params = {};
    let { route, middlewares } = this._getRouteHandlersByPath(path);

    if (!route) {
      params.error = new GenericError(
        `Route for path '${path}' is not configured.`,
        { status: 404 }
      );

      return this.handleNotFound(params, {}, locals);
    }

    locals.action = action;
    locals.route = route;

    await this._runMiddlewares(middlewares, params, locals);
    params = Object.assign(params, route.extractParameters(path));
    await this._runMiddlewares(route.getOptions().middlewares, params, locals);

    return this._handle(route, params, options, action);
  }

  /**
   * @inheritdoc
   */
  async handleError(params, options = {}, locals = {}) {
    let errorRoute = this._routeHandlers.get(RouteNames.ERROR);

    if (!errorRoute) {
      let error = new GenericError(
        `ima.core.router.AbstractRouter:handleError cannot process the ` +
          `error because no error page route has been configured. Add ` +
          `a new route named '${RouteNames.ERROR}'.`,
        params
      );

      return Promise.reject(error);
    }

    params = this._addParamsFromOriginalRoute(params);

    const action = {
      url: this.getUrl(),
      type: ActionTypes.ERROR,
    };

    locals.action = action;
    locals.route = errorRoute;

    await this._runMiddlewares(
      [
        ...this._getMiddlewaresForRoute(RouteNames.ERROR),
        ...errorRoute.getOptions().middlewares,
      ],
      params,
      locals
    );

    return this._handle(errorRoute, params, options, action);
  }

  /**
   * @inheritdoc
   */
  async handleNotFound(params, options = {}, locals = {}) {
    let notFoundRoute = this._routeHandlers.get(RouteNames.NOT_FOUND);

    if (!notFoundRoute) {
      let error = new GenericError(
        `ima.core.router.AbstractRouter:handleNotFound cannot processes ` +
          `a non-matching route because no not found page route has ` +
          `been configured. Add new route named ` +
          `'${RouteNames.NOT_FOUND}'.`,
        params
      );

      return Promise.reject(error);
    }

    params = this._addParamsFromOriginalRoute(params);

    const action = {
      url: this.getUrl(),
      type: ActionTypes.ERROR,
    };

    locals.action = action;
    locals.route = notFoundRoute;

    await this._runMiddlewares(
      [
        ...this._getMiddlewaresForRoute(RouteNames.NOT_FOUND),
        ...notFoundRoute.getOptions().middlewares,
      ],
      params,
      locals
    );

    return this._handle(notFoundRoute, params, options, action);
  }

  /**
   * @inheritdoc
   */
  isClientError(reason) {
    return (
      reason instanceof GenericError &&
      reason.getHttpStatus() >= 400 &&
      reason.getHttpStatus() < 500
    );
  }

  /**
   * @inheritdoc
   */
  isRedirection(reason) {
    return (
      reason instanceof GenericError &&
      reason.getHttpStatus() >= 300 &&
      reason.getHttpStatus() < 400
    );
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
   * @param {AbstractRoute} route The route that should have its
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
   *          documentView: ?React.Component=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=,
   *          middlewares: ?Array<Promise<function(Object<string, string>, function)>>=
   *        }} options The options overrides route options defined in the
   *        `routes.js` configuration file.
   * @param {{ type: string, event: Event, url: string }} [action] An action
   *        object describing what triggered this routing.
   * @return {Promise<Object<string, *>>} A promise that resolves when the
   *         page is rendered and the result is sent to the client, or
   *         displayed if used at the client side.
   */
  _handle(route, params, options, action = {}) {
    options = Object.assign({}, route.getOptions(), options);
    const eventData = {
      route,
      params,
      path: this._getCurrentlyRoutedPath(),
      options,
      action,
    };

    this._dispatcher.fire(Events.BEFORE_HANDLE_ROUTE, eventData, true);

    return this._pageManager
      .manage(route, options, params, action)
      .then(response => {
        response = response || {};

        if (params.error && params.error instanceof Error) {
          response.error = params.error;
        }

        eventData.response = response;

        this._dispatcher.fire(Events.AFTER_HANDLE_ROUTE, eventData, true);

        return response;
      });
  }

  /**
   * Returns the route matching the provided URL path part (the path may
   * contain a query) and all middlewares preceding this route definition.
   *
   * @param {string} path The URL path.
   * @return {{route: ?AbstractRoute, middlewares: Array<Promise<RouterMiddleware>>}} The route
   *         matching the path and middlewares preceding it or `{}`
   *         (empty object) if no such route exists.
   */
  _getRouteHandlersByPath(path) {
    let middlewares = [];

    for (let routeHandler of this._routeHandlers.values()) {
      if (routeHandler instanceof RouterMiddleware) {
        middlewares.push(routeHandler);

        continue;
      }

      if (routeHandler.matches(path)) {
        return {
          route: routeHandler,
          middlewares,
        };
      }
    }

    return { middlewares };
  }

  /**
   * Returns middlewares preceding given route name.
   *
   * @param {string} routeName
   * @returns {Array<RouterMiddleware>=}
   */
  _getMiddlewaresForRoute(routeName) {
    let middlewares = [];

    for (let routeHandler of this._routeHandlers.values()) {
      if (routeHandler instanceof RouterMiddleware) {
        middlewares.push(routeHandler);

        continue;
      }

      if (routeHandler.getName() === routeName) {
        return middlewares;
      }
    }

    return middlewares;
  }

  /**
   * Returns path that is stored in private property when a `route`
   * method is called.
   *
   * @returns {string}
   */
  _getCurrentlyRoutedPath() {
    return this._currentlyRoutedPath;
  }

  /**
   * Runs provided middlewares in sequence.
   *
   * @param {Array<Promise<RouterMiddleware>>} middlewares Array of middlewares.
   * @param {Object<string, string>} params Router params that can be
   *        mutated by middlewares.
   * @param {object} locals The locals param is used to pass local data
   *        between middlewares.
   */
  async _runMiddlewares(middlewares, params, locals) {
    if (!Array.isArray(middlewares)) {
      return;
    }

    for (const middleware of middlewares) {
      await middleware.run(params, locals);
    }
  }

  /**
   * Obtains original route that was handled before not-found / error route
   * and assigns its params to current params
   *
   * @param {Object<string, string>} params Route params for not-found or
   *        error page
   * @returns {Object<string, string>} Provided params merged with params
   *        from original route
   */
  _addParamsFromOriginalRoute(params) {
    const originalPath = this._getCurrentlyRoutedPath();
    const { route } = this._getRouteHandlersByPath(originalPath);

    if (!route) {
      // try to at least extract query string params from path
      const queryParams = AbstractRoute.getQuery(
        AbstractRoute.getTrimmedPath(originalPath)
      );

      return Object.assign({}, queryParams, params);
    }

    return Object.assign({}, route.extractParameters(originalPath), params);
  }
}
