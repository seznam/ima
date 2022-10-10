import AbstractRoute, { RouteParams } from './AbstractRoute';
import ActionTypes from './ActionTypes';
import Events from './Events';
import Router from './Router';
import RouteNames from './RouteNames';
import GenericError from '../error/GenericError';
import RouterMiddleware from './RouterMiddleware';
import PageManager from '../page/manager/PageManager';
import RouteFactory from './RouteFactory';
import Dispatcher from '../event/Dispatcher';
import { RouteOptions } from './Router';
import { IController } from '@/controller/Controller';
import { StringParameters } from '@/CommonTypes';

/**
 * The basic implementation of the {@link Router} interface, providing the
 * common or default functionality for parts of the API.
 */
export default abstract class AbstractRouter extends Router {
  /**
   * The page manager handling UI rendering, and transitions between
   * pages if at the client side.
   */
  protected _pageManager: PageManager;
  /**
   * Factory for routes.
   */
  protected _factory: RouteFactory;
  /**
   * Dispatcher fires events to app.
   */
  protected _dispatcher: Dispatcher;
  /**
   * The current protocol used to access the application, terminated by a
   * colon (for example `https:`).
   */
  protected _protocol = '';
  /**
   * The application's host.
   */
  protected _host = '';
  /**
   * The URL path pointing to the application's root.
   */
  protected _root = '';
  /**
   * The URL path fragment used as a suffix to the `_root` field
   * that specifies the current language.
   */
  protected _languagePartPath = '';
  /**
   * Storage of all known routes and middlewares. The key are their names.
   */
  protected _routeHandlers: Map<string, AbstractRoute | RouterMiddleware> =
    new Map();
  /**
   * Middleware ID counter which is used to auto-generate unique middleware
   * names when adding them to routeHandlers map.
   */
  protected _currentMiddlewareId = 0;
  protected _currentlyRoutedPath = '';

  /**
   * Initializes the router.
   *
   * @param pageManager The page manager handling UI rendering,
   *        and transitions between pages if at the client side.
   * @param factory Factory for routes.
   * @param dispatcher Dispatcher fires events to app.
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
   *          documentView: null,
   *          managedRootView: null,
   *          viewAdapter: null
   *        }
   *      );
   */
  constructor(
    pageManager: PageManager,
    factory: RouteFactory,
    dispatcher: Dispatcher
  ) {
    super();

    this._pageManager = pageManager;

    this._factory = factory;

    this._dispatcher = dispatcher;
  }

  /**
   * @inheritdoc
   */
  init(config: {
    $Protocol?: string;
    $Root?: string;
    $LanguagePartPath?: string;
    $Host: string;
  }) {
    this._protocol = config.$Protocol || '';
    this._root = config.$Root || '';
    this._languagePartPath = config.$LanguagePartPath || '';
    this._host = config.$Host;
    this._currentlyRoutedPath = this.getPath();
  }

  /**
   * @inheritdoc
   */
  add(
    name: string,
    pathExpression: string,
    controller: object | string | (() => unknown),
    view: object | string | (() => unknown),
    options = {} as RouteOptions
  ) {
    if (this._routeHandlers.has(name)) {
      throw new GenericError(
        `ima.core.router.AbstractRouter.add: The route with name ${name} ` +
          `is already defined`
      );
    }

    const factory = this._factory;
    const route = factory.createRoute(
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
  use(middleware: (params: RouteParams, locals: object) => unknown) {
    this._routeHandlers.set(
      `middleware-${this._currentMiddlewareId++}`,
      new RouterMiddleware(middleware)
    );

    return this;
  }

  /**
   * @inheritdoc
   */
  remove(name: string) {
    this._routeHandlers.delete(name);

    return this;
  }

  /**
   * @inheritdoc
   */
  getRouteHandler(name: string) {
    return this._routeHandlers.get(name);
  }

  /**
   * @inheritdoc
   */
  abstract getPath(): string;

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
    const path = this.getPath();
    let { route } = this._getRouteHandlersByPath(path);

    if (!route) {
      route = this._routeHandlers.get(RouteNames.NOT_FOUND) as AbstractRoute;

      if (!route) {
        throw new GenericError(
          `ima.core.router.AbstractRouter.getCurrentRouteInfo: The route ` +
            `for path ${path} is not defined.`
        );
      }
    }

    const params = route.extractParameters(path);

    return { route, params, path };
  }

  /**
   * @inheritdoc
   * @abstract
   */
  abstract listen(): this;

  /**
   * @inheritdoc
   * @abstract
   */
  abstract unlisten(): this;

  /**
   * @inheritdoc
   * @abstract
   */
  abstract redirect(
    url: string,
    options?: RouteOptions,
    action?: { type?: string; payload?: object | Event; event?: Event },
    locals?: Record<string, unknown>
  ): void;

  /**
   * @inheritdoc
   */
  link(routeName: string, params: RouteParams) {
    const route = this._routeHandlers.get(routeName) as AbstractRoute;

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
  async route(
    path: string,
    options: RouteOptions = {},
    action = {} as { type?: string; event?: Event; url?: string },
    locals = {} as { action?: Record<string, unknown>; route?: AbstractRoute }
  ): Promise<void | { [key: string]: unknown }> {
    this._currentlyRoutedPath = path;

    let params: RouteParams = {};
    const { route, middlewares } = this._getRouteHandlersByPath(path);

    if (!route) {
      params.error = new GenericError(
        `Route for path '${path}' is not configured.`,
        { status: 404 }
      );

      return this.handleNotFound(
        params as { [key: string]: string },
        {},
        locals
      );
    }

    locals.action = action;
    locals.route = route;

    await this._runMiddlewares(middlewares, params, locals);
    params = Object.assign(params, route.extractParameters(path));
    await this._runMiddlewares(
      route.getOptions().middlewares as RouterMiddleware[],
      params,
      locals
    );

    return this._handle(route, params, options as RouteOptions, action);
  }

  /**
   * @inheritdoc
   */
  async handleError(
    params: RouteParams,
    options: RouteOptions = {},
    locals: Record<string, unknown> = {}
  ): Promise<void | { [key: string]: unknown }> {
    const errorRoute = this._routeHandlers.get(
      RouteNames.ERROR
    ) as AbstractRoute;

    if (!errorRoute) {
      const error = new GenericError(
        `ima.core.router.AbstractRouter:handleError cannot process the ` +
          `error because no error page route has been configured. Add ` +
          `a new route named '${RouteNames.ERROR}'.`,
        params
      );

      return Promise.reject(error);
    }

    params = this._addParamsFromOriginalRoute(
      params as { [key: string]: string }
    );

    const action = {
      url: this.getUrl(),
      type: ActionTypes.ERROR,
    };

    locals.action = action;
    locals.route = errorRoute;

    await this._runMiddlewares(
      [
        ...this._getMiddlewaresForRoute(RouteNames.ERROR),
        ...(errorRoute.getOptions().middlewares as RouterMiddleware[]),
      ],
      params,
      locals
    );

    return this._handle(errorRoute, params, options as RouteOptions, action);
  }

  /**
   * @inheritdoc
   */
  async handleNotFound(
    params: RouteParams,
    options: RouteOptions = {},
    locals: Record<string, unknown> = {}
  ): Promise<void | { [key: string]: unknown }> {
    const notFoundRoute = this._routeHandlers.get(
      RouteNames.NOT_FOUND
    ) as AbstractRoute;

    if (!notFoundRoute) {
      const error = new GenericError(
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
        ...(notFoundRoute.getOptions().middlewares as RouterMiddleware[]),
      ],
      params,
      locals
    );

    return this._handle(notFoundRoute, params, options as RouteOptions, action);
  }

  /**
   * @inheritdoc
   */
  isClientError(reason: GenericError | Error) {
    return (
      reason instanceof GenericError &&
      reason.getHttpStatus() >= 400 &&
      reason.getHttpStatus() < 500
    );
  }

  /**
   * @inheritdoc
   */
  isRedirection(reason: GenericError | Error) {
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
   * @param path Relative or absolute URL path.
   * @return URL path relative to the application's base URL.
   */
  _extractRoutePath(path: string) {
    return path.replace(this._root + this._languagePartPath, '');
  }

  /**
   * Handles the provided route and parameters by initializing the route's
   * controller and rendering its state via the route's view.
   *
   * The result is then sent to the client if used at the server side, or
   * displayed if used as the client side.
   *
   * @param route The route that should have its
   *        associated controller rendered via the associated view.
   * @param params Parameters extracted from
   *        the URL path and query.
   * @param options The options overrides route options defined in the
   *        `routes.js` configuration file.
   * @param action An action
   *        object describing what triggered this routing.
   * @return A promise that resolves when the
   *         page is rendered and the result is sent to the client, or
   *         displayed if used at the client side.
   */
  async _handle(
    route: AbstractRoute,
    params: RouteParams,
    options: RouteOptions,
    action = {}
  ): Promise<void | { [key: string]: unknown }> {
    options = Object.assign({}, route.getOptions(), options);
    const eventData: Record<string, unknown> = {
      route,
      params,
      path: this._getCurrentlyRoutedPath(),
      options,
      action,
    };

    this._dispatcher.fire(Events.BEFORE_HANDLE_ROUTE, eventData, true);

    // Pre-fetch view and controller which can be async
    const [controller, view] = await Promise.all([
      route.getController(),
      route.getView(),
    ]);

    return this._pageManager
      .manage({
        route,
        controller: controller as IController,
        view,
        options,
        params,
        action,
      })
      .then(response => {
        response = response || {};

        if (params.error && params.error instanceof Error) {
          (response as Record<string, unknown>).error = params.error;
        }

        eventData.response = response;

        this._dispatcher.fire(Events.AFTER_HANDLE_ROUTE, eventData, true);

        return response as void | StringParameters;
      });
  }

  /**
   * Returns the route matching the provided URL path part (the path may
   * contain a query) and all middlewares preceding this route definition.
   *
   * @param path The URL path.
   * @return The route
   *         matching the path and middlewares preceding it or `{}`
   *         (empty object) if no such route exists.
   */
  _getRouteHandlersByPath(path: string): {
    route?: AbstractRoute;
    middlewares: RouterMiddleware[];
  } {
    const middlewares = [];

    for (const routeHandler of this._routeHandlers.values()) {
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
   */
  _getMiddlewaresForRoute(routeName: string) {
    const middlewares = [];

    for (const routeHandler of this._routeHandlers.values()) {
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
   */
  _getCurrentlyRoutedPath() {
    return this._currentlyRoutedPath;
  }

  /**
   * Runs provided middlewares in sequence.
   *
   * @param middlewares Array of middlewares.
   * @param params Router params that can be
   *        mutated by middlewares.
   * @param locals The locals param is used to pass local data
   *        between middlewares.
   */
  async _runMiddlewares(
    middlewares: RouterMiddleware[],
    params: RouteParams,
    locals: Record<string, unknown>
  ) {
    if (!Array.isArray(middlewares)) {
      return;
    }

    for (const middleware of middlewares) {
      await middleware.run(params as StringParameters, locals);
    }
  }

  /**
   * Obtains original route that was handled before not-found / error route
   * and assigns its params to current params
   *
   * @param params Route params for not-found or
   *        error page
   * @returns Provided params merged with params
   *        from original route
   */
  _addParamsFromOriginalRoute(params: RouteParams) {
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
