/* eslint-disable @typescript-eslint/no-unused-vars */

import RouterMiddleware, { MiddleWareFunction } from './RouterMiddleware';
import Controller, { IController } from '../controller/Controller';
import AbstractRoute, { RouteParams } from './AbstractRoute';
import GenericError from '../error/GenericError';
import { IExtension } from '../extension/Extension';
import { UnknownParameters } from '../CommonTypes';

export type RouteOptions = {
  autoScroll?: boolean;
  documentView?: unknown;
  extensions?: IExtension[];
  headers?: UnknownParameters;
  httpStatus?: number;
  managedRootView?: unknown;
  middlewares?:
    | Promise<RouterMiddleware>[]
    | RouterMiddleware[]
    | MiddleWareFunction[];
  onlyUpdate?: boolean | ((controller: IController, view: unknown) => boolean);
  viewAdapter?: unknown;
};

/**
 * The router manages the application's routing configuration and dispatches
 * controllers and views according to the current URL and the route it matches.
 */
export default abstract class Router {
  /**
   * Initializes the router with the provided configuration.
   *
   * @param config Router configuration.
   *        The `$Protocol` field must be the current protocol used to
   *        access the application, terminated by a colon (for example
   *        `https:`).
   *        The `$Root` field must specify the URL path pointing to the
   *        application's root.
   *        The `$LanguagePartPath` field must be the URL path fragment
   *        used as a suffix to the `$Root` field that specifies the
   *        current language.
   *        The `$Host` field must be the application's domain (and the
   *        port number if other than the default is used) in the following
   *        form: ``${protocol}//${host}``.
   */
  init(config: {
    $Protocol: string;
    $Root: string;
    $LanguagePartPath: string;
    $Host: string;
  }) {
    return;
  }

  /**
   * Adds a new route to router.
   *
   * @param name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param pathExpression A path expression specifying the URL path
   *        part matching this route (must not contain a query string),
   *        optionally containing named parameter placeholders specified as
   *        `:parameterName`. The name of the parameter is terminated
   *        by a forward slash (`/`) or the end of the path expression
   *        string.
   *        The path expression may also contain optional parameters, which
   *        are specified as `:?parameterName`. It is recommended to
   *        specify the optional parameters at the end of the path
   *        expression.
   * @param controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param options
   *        Additional route options, specified how the navigation to the
   *        route will be handled.
   *        The `onlyUpdate` can be either a flag signalling whether
   *        the current controller and view instances should be kept if they
   *        match the ones used by the previous route; or a callback function
   *        that will receive the previous controller and view identifiers
   *        used in the previously matching route, and returns a
   *        `boolean` representing the value of the flag. This flag is
   *        disabled by default.
   *        The `autoScroll` flag signals whether the page should be
   *        scrolled to the top when the navigation takes place. This flag is
   *        enabled by default.
   *        The `allowSPA` flag can be used to make the route
   *        always served from the server and never using the SPA page even
   *        if the server is overloaded. This is useful for routes that use
   *        different document views (specified by the `documentView`
   *        option), for example for rendering the content of iframes.
   *        The route specific `middlewares` which are run after
   *        extracting parameters before route handling.
   * @return This router.
   * @throws Thrown if a route with the same name already exists.
   */
  add(
    name: string,
    pathExpression: string,
    controller: string | typeof Controller | (() => IController),
    view: string | unknown | (() => unknown),
    options: RouteOptions | undefined
  ) {
    return this;
  }

  /**
   * Adds a new middleware to router.
   *
   * @param middleware Middleware
   *        function accepting routeParams as a first argument, which can be mutated
   *        and `locals` object as second argument. This can be used to pass data
   *        between middlewares.
   * @return This router.
   * @throws Thrown if a middleware with the same name already exists.
   */
  use(middleware: (routeParams: RouteParams, locals: object) => unknown) {
    return this;
  }

  /**
   * Removes the specified route from the router's known routes.
   *
   * @param name The route's unique name, identifying the route to remove.
   * @return This router.
   */
  remove(name: string) {
    return this;
  }

  /**
   * Returns specified handler from registered route handlers.
   *
   * @param name The route's unique name.
   * @return Route with given name or undefined.
   */
  getRouteHandler(name: string): undefined | AbstractRoute | RouterMiddleware {
    return undefined;
  }

  /**
   * Returns the current path part of the current URL, including the query
   * string (if any).
   *
   * @return The path and query parts of the current URL.
   */
  getPath() {
    return '';
  }

  /**
   * Returns the current absolute URL (including protocol, host, query, etc).
   *
   * @return The current absolute URL.
   */
  getUrl() {
    return '';
  }

  /**
   * Returns the application's absolute base URL, pointing to the public root
   * of the application.
   *
   * @return The application's base URL.
   */
  getBaseUrl() {
    return '';
  }

  /**
   * Returns the application's domain in the following form
   * ``${protocol}//${host}``.
   *
   * @return The current application's domain.
   */
  getDomain() {
    return '';
  }

  /**
   * Returns application's host (domain and, if necessary, the port number).
   *
   * @return The current application's host.
   */
  getHost() {
    return '';
  }

  /**
   * Returns the current protocol used to access the application, terminated
   * by a colon (for example `https:`).
   *
   * @return The current application protocol used to access the
   *         application.
   */
  getProtocol() {
    return '';
  }

  /**
   * Returns the information about the currently active route.
   * @throws Thrown if a route is not define for current path.
   */
  getCurrentRouteInfo(): {
    route: AbstractRoute;
    params: RouteParams;
    path: string;
  } {
    throw new GenericError(
      'ima.core.router.Router.getCurrentRouteInfo: Method is not implemented.'
    );
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
   * The effects of this method can be reverted with `unlisten`. This
   * method has no effect at the server side.
   *
   * @return This router.
   */
  listen() {
    return this;
  }

  /**
   * Unregisters event listeners at the client side window object allowing the
   * router to capture user's history (history pop state - going "back") and
   * page (clicking links) navigation.
   *
   * The router will stop processing the navigation internally, handling the
   * user's navigation to display the page related to the URL resulting from
   * the user's action.
   *
   * Note that the router will not prevent forms from being submitted to the
   * server.
   *
   * The effects of this method can be reverted with `unlisten`. This method has no effect
   * at the server side.
   *
   * @return This router.
   */
  unlisten() {
    return this;
  }

  /**
   * Redirects the client to the specified location.
   *
   * At the server side the method results in responding to the client with a
   * redirect HTTP status code and the `Location` header.
   *
   * At the client side the method updates the current URL by manipulating
   * the browser history (if the target URL is at the same domain and
   * protocol as the current one) or performs a hard redirect (if the target
   * URL points to a different protocol or domain).
   *
   * The method will result in the router handling the new URL and routing
   * the client to the related page if the URL is set at the client side and
   * points to the same domain and protocol.
   *
   * @param url The URL to which the client should be redirected.
   * @param options The options overrides route options defined in
   *        the `routes.js` configuration file.
   * @param action An action object describing what triggered this routing.
   * @param locals The locals param is used to pass local data
   *        between middlewares.
   */
  redirect(
    url: string,
    options?: RouteOptions,
    action?: Record<string, unknown>,
    locals?: Record<string, unknown>
  ) {
    return;
  }

  /**
   * Generates an absolute URL (including protocol, domain, etc) for the
   * specified route by substituting the route's parameter placeholders with
   * the provided parameter values.
   *
   * @param routeName The unique name of the route, identifying the
   *        route to use.
   * @param params Parameter values for the route's
   *        parameter placeholders. Extraneous parameters will be added as
   *        URL query.
   * @return An absolute URL for the specified route and parameters.
   */
  link(routeName: string, params: RouteParams) {
    return '';
  }

  /**
   * Routes the application to the route matching the providing path, renders
   * the route page and sends the result to the client.
   *
   * @param path The URL path part received from the client, with
   *        optional query.
   * @param options The options overrides route options defined in
   *        the `routes.js` configuration file.
   * @param action An action object describing what triggered this routing.
   * @param locals The locals param is used to pass local data
   *        between middlewares.
   * @return A promise resolved
   *         when the error has been handled and the response has been sent
   *         to the client, or displayed if used at the client side.
   */
  route(
    path: string,
    options?: RouteOptions,
    action?: Record<string, unknown>,
    locals?: Record<string, unknown>
  ): Promise<void | UnknownParameters> {
    return Promise.reject();
  }

  /**
   * Handles an internal server error by responding with the appropriate
   * "internal server error" error page.
   *
   * @param params Parameters extracted from
   *        the current URL path and query.
   * @param options The options overrides route options defined in
   *        the `routes.js` configuration file.
   * @param locals The locals param is used to pass local data
   *        between middlewares.
   * @return A promise resolved when the error
   *         has been handled and the response has been sent to the client,
   *         or displayed if used at the client side.
   */
  handleError(
    params: RouteParams,
    options?: RouteOptions,
    locals?: Record<string, unknown>
  ): Promise<void | UnknownParameters> {
    return Promise.reject();
  }

  /**
   * Handles a "not found" error by responding with the appropriate "not
   * found" error page.
   *
   * @param params Parameters extracted from
   *        the current URL path and query.
   * @param options The options overrides route options defined in
   *        the `routes.js` configuration file.
   * @param locals The locals param is used to pass local data
   *        between middlewares.
   * @return A promise resolved
   *         when the error has been handled and the response has been sent
   *         to the client, or displayed if used at the client side.
   */
  handleNotFound(
    params: RouteParams,
    options?: RouteOptions,
    locals?: Record<string, unknown>
  ): Promise<void | UnknownParameters> {
    return Promise.reject();
  }

  /**
   * Tests, if possible, whether the specified error was caused by the
   * client's action (for example wrong URL or request encoding) or by a
   * failure at the server side.
   *
   * @param reason The encountered error.
   * @return `true` if the error was caused the action of the
   *         client.
   */
  isClientError(reason: GenericError | Error) {
    return false;
  }

  /**
   * Tests, if possible, whether the specified error lead to redirection.
   *
   * @param reason The encountered error.
   * @return `true` if the error was caused the action of the
   *         redirection.
   */
  isRedirection(reason: GenericError | Error) {
    return false;
  }
}
