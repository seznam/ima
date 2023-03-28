import { Constructor } from 'type-fest';

import { DynamicRoute, RoutePathExpression } from './DynamicRoute';
import { RouteFactoryOptions } from './Router';
import { StaticRoute } from './StaticRoute';
import { OCAliasMap } from '..';
import { Controller } from '../controller/Controller';

/**
 * Utility factory used by router to create routes.
 */
export class RouteFactory {
  static get $dependencies() {
    return [];
  }

  /**
   * Create new instance of ima.core.router.AbstractRoute.
   *
   * @param name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param pathExpression A path expression
   *        specifying either the URL path part matching this route (must not\
   *        contain a query string) with optionally containing named parameter
   *        placeholders specified as `:parameterName`. Or object defining
   *        matcher in form of regular expression and toPath and extractParameters
   *        function overrides.
   * @param controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param options The route additional options.
   * @return The constructed route.
   */
  createRoute<
    C extends Constructor<Controller> | keyof OCAliasMap,
    V extends keyof OCAliasMap | Constructor<any> | ((...args: any[]) => any)
  >(
    name: string,
    pathExpression: string | RoutePathExpression,
    controller: C,
    view: V,
    options?: Partial<RouteFactoryOptions>
  ): StaticRoute | DynamicRoute {
    return Reflect.construct(
      typeof pathExpression === 'string' ? StaticRoute : DynamicRoute,
      [name, pathExpression, controller, view, options]
    );
  }
}
