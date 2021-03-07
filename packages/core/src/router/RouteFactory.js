import Route from './Route';

/**
 * Utility factory used by router to create routes.
 */
export default class RouteFactory {
  static get $dependencies() {
    return [];
  }

  /**
   * Create new instance of ima.core.router.Route.
   *
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
   *        }} options The route additional options.
   * @param {[function(Object<string, string>, function)]} middlewares
   *        Route specific middlewares which are run after extracting parameters
   *        before route handling.
   * @return {Route} The constructed route.
   */
  createRoute(name, pathExpression, controller, view, options, middlewares) {
    return new Route(
      name,
      pathExpression,
      controller,
      view,
      options,
      middlewares
    );
  }
}
