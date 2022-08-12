import DynamicRoute from './DynamicRoute';
import StaticRoute from './StaticRoute';

/**
 * Utility factory used by router to create routes.
 */
export default class RouteFactory {
  static get $dependencies() {
    return [];
  }

  /**
   * Create new instance of ima.core.router.AbstractRoute.
   *
   * @param {string} name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param {string|Route~PathExpression} pathExpression A path expression
   *        specifying either the URL path part matching this route (must not\
   *        contain a query string) with optionally containing named parameter
   *        placeholders specified as `:parameterName`. Or object defining
   *        matcher in form of regular expression and toPath and extractParameters
   *        function overrides.
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
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=,
   *          middlewares: ?Array<Promise<function(Object<string, string>, function)>>=
   *        }} options The route additional options.
   * @return {AbstractRoute} The constructed route.
   */
  createRoute(name, pathExpression, controller, view, options) {
    return Reflect.construct(
      typeof pathExpression === 'string' ? StaticRoute : DynamicRoute,
      [name, pathExpression, controller, view, options]
    );
  }
}
