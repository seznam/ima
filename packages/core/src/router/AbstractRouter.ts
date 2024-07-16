import { autoYield } from '@esmj/task';

import {
  AbstractRoute,
  AsyncRouteController,
  AsyncRouteView,
  RouteParams,
} from './AbstractRoute';
import { ActionTypes } from './ActionTypes';
import { RouteFactory } from './RouteFactory';
import { RouteNames } from './RouteNames';
import {
  Router,
  RouteOptions,
  RouterMiddleware,
  RouteAction,
  RouteLocals,
} from './Router';
import { RouterEvents } from './RouterEvents';
import { Settings } from '../boot';
import { IMAError } from '../error/Error';
import { GenericError } from '../error/GenericError';
import { Dispatcher } from '../event/Dispatcher';
import { HttpStatusCode } from '../http/HttpStatusCode';
import { PageManager } from '../page/manager/PageManager';
import { StringParameters, UnknownParameters } from '../types';

type BeforeHandleRouteEventData = {
  route: InstanceType<typeof AbstractRoute>;
  path: string;
  params?: RouteParams;
  options?: Partial<RouteOptions>;
  action?: RouteAction;
};

type AfterHandleRouteEventData = BeforeHandleRouteEventData & {
  response?: any;
};

export type SPARoutedHandler = NonNullable<Settings['$Router']>['isSPARouted'];
export interface RouterDispatcherEvents {
  [RouterEvents.AFTER_HANDLE_ROUTE]: AfterHandleRouteEventData;
  [RouterEvents.BEFORE_HANDLE_ROUTE]: BeforeHandleRouteEventData;
}

/**
 * The basic implementation of the {@link Router} interface, providing the
 * common or default functionality for parts of the API.
 */
export abstract class AbstractRouter extends Router {
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
  protected _routeHandlers: Map<
    string,
    InstanceType<typeof AbstractRoute> | RouterMiddleware
  > = new Map();
  /**
   * Middleware ID counter which is used to auto-generate unique middleware
   * names when adding them to routeHandlers map.
   */
  protected _currentMiddlewareId = 0;
  protected _currentlyRoutedPath = '';
  protected _middlewareTimeout: number;
  protected _isSPARouted: SPARoutedHandler | undefined;

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
    dispatcher: Dispatcher,
    middlewareTimeout: number | undefined,
    isSPARouted: SPARoutedHandler | undefined
  ) {
    super();

    this._pageManager = pageManager;
    this._factory = factory;
    this._dispatcher = dispatcher;
    this._middlewareTimeout = middlewareTimeout ?? 30000;
    this._isSPARouted = isSPARouted;
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  add(
    name: string,
    pathExpression: string,
    controller: AsyncRouteController,
    view: AsyncRouteView,
    options?: Partial<RouteOptions>
  ) {
    if (this._routeHandlers.has(name)) {
      throw new GenericError(
        `ima.core.router.AbstractRouter.add: The route with name ${name} ` +
          `is already defined`,
        { name, pathExpression, options }
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
   * @inheritDoc
   */
  use(middleware: RouterMiddleware) {
    this._routeHandlers.set(
      `middleware-${this._currentMiddlewareId++}`,
      middleware
    );

    return this;
  }

  /**
   * @inheritDoc
   */
  remove(name: string) {
    this._routeHandlers.delete(name);

    return this;
  }

  /**
   * @inheritDoc
   */
  getRouteHandler(name: string) {
    return this._routeHandlers.get(name);
  }

  /**
   * @inheritDoc
   */
  getPath(): string {
    throw new GenericError(
      'The getPath() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritDoc
   */
  getUrl() {
    return this.getBaseUrl() + this.getPath();
  }

  /**
   * @inheritDoc
   */
  getBaseUrl() {
    return this.getDomain() + this._root + this._languagePartPath;
  }

  /**
   * @inheritDoc
   */
  getDomain() {
    return this._protocol + '//' + this._host;
  }

  /**
   * @inheritDoc
   */
  getHost() {
    return this._host;
  }

  /**
   * @inheritDoc
   */
  getProtocol() {
    return this._protocol;
  }

  /**
   * @inheritDoc
   */
  getCurrentRouteInfo() {
    const path = this.getPath();
    let { route } = this.getRouteHandlersByPath(path);

    if (!route) {
      const notFoundRoute = this._routeHandlers.get(RouteNames.NOT_FOUND);

      if (!notFoundRoute || !(notFoundRoute instanceof AbstractRoute)) {
        throw new GenericError(
          `ima.core.router.AbstractRouter.getCurrentRouteInfo: The route ` +
            `for path ${path} is not defined, or it's not instance of AbstractRoute.`,
          { route: notFoundRoute, path }
        );
      }

      route = notFoundRoute;
    }

    const params = route.extractParameters(path, this.getBaseUrl());

    return { route, params, path };
  }

  /**
   * @inheritDoc
   */
  getRouteHandlers() {
    return this._routeHandlers;
  }

  /**
   * @inheritDoc
   * @abstract
   */
  listen(): this {
    throw new GenericError(
      'The listen() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritDoc
   */
  unlisten(): this {
    throw new GenericError(
      'The unlisten() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritDoc
   */
  redirect(
    url: string,
    options?: Partial<RouteOptions>,
    action?: RouteAction,
    locals?: RouteLocals
  ): void {
    throw new GenericError(
      'The redirect() method is abstract and must be overridden.',
      { url, options, action, locals }
    );
  }

  /**
   * @inheritDoc
   */
  link(routeName: string, params: RouteParams) {
    const route = this._routeHandlers.get(routeName);

    if (!route) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:link has undefined route with ` +
          `name ${routeName}. Add new route with that name.`,
        { routeName, params }
      );
    }

    if (!(route instanceof AbstractRoute)) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:link Unable to create link to ${routeName}, ` +
          `since it's likely a middleware.`,
        { routeName, params, route }
      );
    }

    return this.getBaseUrl() + route.toPath(params);
  }

  /**
   * @inheritDoc
   */
  async route(
    path: string,
    options?: Partial<RouteOptions>,
    action?: RouteAction,
    locals?: RouteLocals
  ): Promise<void | UnknownParameters> {
    this._currentlyRoutedPath = path;

    let params: RouteParams = {};
    const { route, middlewares } = this.getRouteHandlersByPath(path);

    locals = {
      ...locals,
      action,
      route,
    };

    if (!route) {
      params.error = new GenericError(
        `Route for path '${path}' is not configured.`,
        { status: 404 }
      );

      return this.handleNotFound(params, {}, locals);
    }

    await this._runMiddlewares(middlewares, params, locals);
    params = {
      ...params,
      ...route.extractParameters(path, this.getBaseUrl()),
    };
    await this._runMiddlewares(route.getOptions().middlewares, params, locals);

    return this._handle(route, params, options, action);
  }

  /**
   * @inheritDoc
   */
  async handleError(
    params: RouteParams,
    options?: Partial<RouteOptions>,
    locals?: RouteLocals
  ): Promise<void | UnknownParameters> {
    const errorRoute = this._routeHandlers.get(RouteNames.ERROR);

    if (!errorRoute) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:handleError cannot process the ` +
          `error because no error page route has been configured. Add ` +
          `a new route named '${RouteNames.ERROR}'.`,
        params
      );
    }

    if (!(errorRoute instanceof AbstractRoute)) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:handleError '${RouteNames.ERROR}' is,` +
          ` not instance of AbstractRoute, please check your configuration.`,
        { errorRoute, params, options, locals }
      );
    }

    params = this.#addParamsFromOriginalRoute(params);

    const action = {
      url: this.getUrl(),
      type: ActionTypes.ERROR,
    };

    locals = {
      ...locals,
      action,
      route: errorRoute,
    };

    await this._runMiddlewares(
      [
        ...this._getMiddlewaresForRoute(RouteNames.ERROR),
        ...(errorRoute.getOptions().middlewares as RouterMiddleware[]),
      ],
      params,
      locals
    );

    return this._handle(errorRoute, params, options, action);
  }

  /**
   * @inheritDoc
   */
  async handleNotFound(
    params: RouteParams,
    options?: Partial<RouteOptions>,
    locals?: RouteLocals
  ): Promise<void | UnknownParameters> {
    const notFoundRoute = this._routeHandlers.get(RouteNames.NOT_FOUND);

    if (!notFoundRoute) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:handleNotFound cannot processes ` +
          `a non-matching route because no not found page route has ` +
          `been configured. Add new route named ` +
          `'${RouteNames.NOT_FOUND}'.`,
        { ...params, status: HttpStatusCode.TIMEOUT }
      );
    }

    if (!(notFoundRoute instanceof AbstractRoute)) {
      throw new GenericError(
        `ima.core.router.AbstractRouter:handleNotFound '${RouteNames.NOT_FOUND}' is,` +
          ` not instance of AbstractRoute, please check your configuration.`,
        { notFoundRoute, params, options, locals }
      );
    }

    params = this.#addParamsFromOriginalRoute(params);

    const action = {
      url: this.getBaseUrl() + this._getCurrentlyRoutedPath(),
      type: ActionTypes.ERROR,
    };

    locals = {
      ...locals,
      action,
      route: notFoundRoute,
    };

    await this._runMiddlewares(
      [
        ...this._getMiddlewaresForRoute(RouteNames.NOT_FOUND),
        ...(notFoundRoute.getOptions().middlewares as RouterMiddleware[]),
      ],
      params,
      locals
    );

    return this._handle(notFoundRoute, params, options, action);
  }

  /**
   * @inheritDoc
   */
  isClientError(reason: IMAError | Error) {
    return reason instanceof IMAError && reason.isClientError();
  }

  /**
   * @inheritDoc
   */
  isRedirection(reason: IMAError | Error) {
    return reason instanceof IMAError && reason.isRedirection();
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
    route: InstanceType<typeof AbstractRoute>,
    params: RouteParams,
    options?: Partial<RouteOptions>,
    action?: RouteAction
  ): Promise<void | UnknownParameters> {
    const routeOptions = Object.assign(
      {},
      route.getOptions(),
      options
    ) as RouteOptions;

    const eventData: BeforeHandleRouteEventData = {
      route,
      params,
      path: this._getCurrentlyRoutedPath(),
      options: routeOptions,
      action,
    };

    await autoYield();
    /**
     * Call pre-manage to cancel/property kill previously managed
     * route handler.
     */
    await this._pageManager.preManage();

    this._dispatcher.fire(RouterEvents.BEFORE_HANDLE_ROUTE, eventData, true);

    return this._pageManager
      .manage({
        route,
        options: routeOptions,
        params,
        action,
      })
      .then(async response => {
        response = response || {};

        if (params?.error instanceof Error) {
          (response as Record<string, unknown>).error = params.error;
        }

        await autoYield();
        this._dispatcher.fire(
          RouterEvents.AFTER_HANDLE_ROUTE,
          {
            ...eventData,
            response,
          },
          true
        );

        return response as void | StringParameters;
      })
      .finally(async () => {
        await autoYield();
        return this._pageManager.postManage();
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
  getRouteHandlersByPath(path: string): {
    route?: InstanceType<typeof AbstractRoute>;
    middlewares: RouterMiddleware[];
  } {
    const middlewares = [];

    for (const routeHandler of this._routeHandlers.values()) {
      if (!(routeHandler instanceof AbstractRoute)) {
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
      if (!(routeHandler instanceof AbstractRoute)) {
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
    middlewares: RouterMiddleware[] | undefined,
    params: RouteParams,
    locals: RouteLocals
  ): Promise<void> {
    if (!Array.isArray(middlewares)) {
      return;
    }

    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      const rejectTimeout = setTimeout(() => {
        reject(
          new GenericError(
            'Middleware execution timeout, check your middlewares for any unresolved time consuming promises.' +
              ` All middlewares should finish execution within ${this._middlewareTimeout}ms timeframe.`
          )
        );
      }, this._middlewareTimeout);
      for (const middleware of middlewares) {
        try {
          await autoYield();
          /**
           * When middleware uses next() function we await in indefinitely
           * until the function is called. Otherwise we just await the middleware
           * async function.
           */
          const result = await (middleware.length === 3
            ? new Promise<ReturnType<RouterMiddleware>>(resolve =>
                middleware(params, locals, resolve)
              )
            : middleware(params, locals));

          locals = {
            ...locals,
            ...result,
          };
        } catch (error) {
          reject(error);
        }
      }

      clearTimeout(rejectTimeout);
      resolve();
    });
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
  #addParamsFromOriginalRoute(params: RouteParams) {
    const originalPath = this._getCurrentlyRoutedPath();
    const { route } = this.getRouteHandlersByPath(originalPath);

    if (!route) {
      // try to at least extract query string params from path
      return {
        ...Object.fromEntries(new URL(this.getUrl()).searchParams),
        ...params,
      };
    }

    return {
      ...route.extractParameters(originalPath, this.getBaseUrl()),
      ...params,
    };
  }
}
