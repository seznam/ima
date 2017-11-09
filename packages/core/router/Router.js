/**
 * The router manages the application's routing configuration and dispatches
 * controllers and views according to the current URL and the route it matches.
 *
 * @interface
 */
export default class Router {
  /**
	 * Initializes the router with the provided configuration.
	 *
	 * @param {{
	 *          $Protocol: string,
	 *          $Root: string,
	 *          $LanguagePartPath: string,
	 *          $Host: string
	 *        }} config Router configuration.
	 *        The {@code $Protocol} field must be the current protocol used to
	 *        access the application, terminated by a collon (for example
	 *        {@code https:}).
	 *        The {@code $Root} field must specify the URL path pointing to the
	 *        application's root.
	 *        The {@code $LanguagePartPath} field must be the URL path fragment
	 *        used as a suffix to the {@code $Root} field that specifies the
	 *        current language.
	 *        The {@code $Host} field must be the application's domain (and the
	 *        port number if other than the default is used) in the following
	 *        form: {@code `${protocol}//${host}`}.
	 */
  init(config) {}

  /**
	 * Adds a new route to router.
	 *
	 * @param {string} name The unique name of this route, identifying it among
	 *        the rest of the routes in the application.
	 * @param {string} pathExpression A path expression specifying the URL path
	 *        part matching this route (must not contain a query string),
	 *        optionally containing named parameter placeholders specified as
	 *        {@code :parameterName}. The name of the parameter is terminated
	 *        by a forward slash ({@code /}) or the end of the path expression
	 *        string.
	 *        The path expression may also contain optional parameters, which
	 *        are specified as {@code :?parameterName}. It is recommended to
	 *        specify the optional parameters at the end of the path
	 *        expression.
	 * @param {string} controller The full name of Object Container alias
	 *        identifying the controller associated with this route.
	 * @param {string} view The full name or Object Container alias identifying
	 *        the view class associated with this route.
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
	 *          documentView: ?function(new: AbstractDocumentView)=,
	 *          managedRootView: ?function(new: React.Component)=
	 *        }=} options
	 *        Additional route options, specified how the navigation to the
	 *        route will be handled.
	 *        The {@code onlyUpdate} can be either a flag signalling whether
	 *        the current controller and view instances should be kept if they
	 *        match the ones used by the previous route; or a callback function
	 *        that will receive the previous controller and view identifiers
	 *        used in the previously matching route, and returns a
	 *        {@code boolean} representing the value of the flag. This flag is
	 *        disabled by default.
	 *        The {@code autoScroll} flag signals whether the page should be
	 *        scrolled to the top when the navigation takes place. This flag is
	 *        enabled by default.
	 *        The {@code allowSPA} flag can be used to make the route
	 *        always served from the server and never using the SPA page even
	 *        if the server is overloaded. This is useful for routes that use
	 *        different document views (specified by the {@code documentView}
	 *        option), for example for rendering the content of iframes.
	 * @return {Router} This router.
	 * @throws {ImaError} Thrown if a route with the same name already exists.
	 */
  add(name, pathExpression, controller, view, options = undefined) {}

  /**
	 * Removes the specified route from the router's known routes.
	 *
	 * @param {string} name The route's unique name, identifying the route to
	 *        remove.
	 * @return {Router} This router.
	 */
  remove(name) {}

  /**
	 * Returns the current path part of the current URL, including the query
	 * string (if any).
	 *
	 * @return {string} The path and query parts of the current URL.
	 */
  getPath() {}

  /**
	 * Returns the current absolute URL (including protocol, host, query, etc).
	 *
	 * @return {string} The current absolute URL.
	 */
  getUrl() {}

  /**
	 * Returns the application's absolute base URL, pointing to the public root
	 * of the application.
	 *
	 * @return {string} The application's base URL.
	 */
  getBaseUrl() {}

  /**
	 * Returns the application's domain in the following form
	 * {@code `${protocol}//${host}`}.
	 *
	 * @return {string} The current application's domain.
	 */
  getDomain() {}

  /**
	 * Returns application's host (domain and, if necessary, the port number).
	 *
	 * @return {string} The current application's host.
	 */
  getHost() {}

  /**
	 * Returns the current protocol used to access the application, terminated
	 * by a colon (for example {@code https:}).
	 *
	 * @return {string} The current application protocol used to access the
	 *         application.
	 */
  getProtocol() {}

  /**
	 * Returns the information about the currently active route.
	 *
	 * @return {{
	 *           route: Route,
	 *           params: Object<string, string>,
	 *           path: string
	 *         }} The information about the current route.
	 * @throws {ImaError} Thrown if a route is not define for current path.
	 */
  getCurrentRouteInfo() {}

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
	 * The effects of this method cannot be reverted. This method has no effect
	 * at the server side.
	 *
	 * @return {Router} This router.
	 */
  listen() {}

  /**
	 * Redirects the client to the specified location.
	 *
	 * At the server side the method results in responding to the client with a
	 * redirect HTTP status code and the {@code Location} header.
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
	 * @param {string} url The URL to which the client should be redirected.
	 * @param {{
	 *          httpStatus: number=,
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
	 *        }} [options={}] The options overrides route options defined in
	 *        the {@code routes.js} configuration file.
	 */
  redirect(url, options = {}) {}

  /**
	 * Generates an absolute URL (including protocol, domain, etc) for the
	 * specified route by substituting the route's parameter placeholders with
	 * the provided parameter values.
	 *
	 * @param {string} routeName The unique name of the route, identifying the
	 *        route to use.
	 * @param {Object<string, string>} params Parameter values for the route's
	 *        parameter placeholders. Extraneous parameters will be added as
	 *        URL query.
	 * @return {string} An absolute URL for the specified route and parameters.
	 */
  link(routeName, params) {}

  /**
	 * Routes the application to the route matching the providing path, renders
	 * the route page and sends the result to the client.
	 *
	 * @param {string} path The URL path part received from the client, with
	 *        optional query.
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
	 *        }} [options={}] The options overrides route options defined in
	 *        the {@code routes.js} configuration file.
	 * @return {Promise<Object<string, *>>} A promise resolved
	 *         when the error has been handled and the response has been sent
	 *         to the client, or displayed if used at the client side.
	 */
  route(path, options = {}) {}

  /**
	 * Handles an internal server error by responding with the appropriate
	 * "internal server error" error page.
	 *
	 * @param {Object<string, (Error|string)>} params Parameters extracted from
	 *        the current URL path and query.
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
	 *          serverSPA: boolean=,
	 *          documentView: ?AbstractDocumentView=
	 *        }} [options={}] The options overrides route options defined in
	 *        the {@code routes.js} configuration file.
	 * @return {Promise<Object<string, *>>} A promise resolved when the error
	 *         has been handled and the response has been sent to the client,
	 *         or displayed if used at the client side.
	 */
  handleError(params, options = {}) {}

  /**
	 * Handles a "not found" error by responding with the appropriate "not
	 * found" error page.
	 *
	 * @param {Object<string, (Error|string)>} params Parameters extracted from
	 *        the current URL path and query.
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
	 *        }} [options={}] The options overrides route options defined in
	 *        the {@code routes.js} configuration file.
	 * @return {Promise<Object<string, *>>} A promise resolved
	 *         when the error has been handled and the response has been sent
	 *         to the client, or displayed if used at the client side.
	 */
  handleNotFound(params, options = {}) {}

  /**
	 * Tests, if possible, whether the specified error was caused by the
	 * client's action (for example wrong URL or request encoding) or by a
	 * failure at the server side.
	 *
	 * @param {(ImaError|Error)} reason The encountered error.
	 * @return {boolean} {@code true} if the error was caused the action of the
	 *         client.
	 */
  isClientError(reason) {}

  /**
	 * Tests, if possible, whether the specified error lead to redirection.
	 *
	 * @param {(ImaError|Error)} reason The encountered error.
	 * @return {boolean} {@code true} if the error was caused the action of the
	 *         redirection.
	 */
  isRedirection(reason) {}
}
