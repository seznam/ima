import { AbstractRoute, RouteParams } from './AbstractRoute';
import { RouteFactoryOptions } from './Router';
import { Controller, IController } from '../controller/Controller';
import { GenericError } from '../error/GenericError';

/**
 * Path expression type used for router routes definition.
 * @typedef Route~PathExpression
 * @property matcher Regular expression used to match current path
 *           to the specific route.
 * @property toPath Override
 *           for the default toPath which generates valid path from current route
 *           and passed route params.
 * @property extractParameters Override for default method, which
 *           takes care of parsing url params from given path. It should return
 *           object of key/value pairs which correspond to expected path url
 *           params and their values.
 */
export type RoutePathExpression = {
  /**
   * RegExp use in router for path matching to current route.
   */
  matcher: RegExp;
  /**
   * Function that generates valid path from given route params.
   */
  toPath: (params: RouteParams) => string;
  /**
   * Function which takes care of parsing url params from given path.
   * It returns object of key/value pairs which correspond to expected path url
   * params and their values.
   */
  extractParameters: (
    trimmedPath: string,
    additionalData: { query: RouteParams; path: string }
  ) => RouteParams;
};

/**
 * Utility for representing and manipulating a single dynamic route in the
 * router's configuration. Dynamic route is defined by regExp used for route
 * matching and overrides for toPath and extractParameters functions to generate
 * and put together valid path.
 *
 * @extends AbstractRoute
 */
export class DynamicRoute extends AbstractRoute<RoutePathExpression> {
  /**
   * Initializes the route.
   *
   * @param pathExpression Path expression used in route matching,
   *        to generate valid path with provided params and parsing params from current path.
   */
  constructor(
    name: string,
    pathExpression: RoutePathExpression,
    controller: string | typeof Controller | (() => IController),
    view: string | unknown | (() => unknown),
    options?: Partial<RouteFactoryOptions>
  ) {
    super(name, pathExpression, controller, view, options);

    if (!pathExpression || typeof pathExpression !== 'object') {
      throw new GenericError(
        `The pathExpression must be object, '${typeof pathExpression}' was given.`
      );
    }

    this._pathExpression = pathExpression;
    const { matcher, toPath, extractParameters } = this._pathExpression;

    if (!matcher || !(matcher instanceof RegExp)) {
      throw new GenericError(`The pathExpression.matcher must be a RegExp.`, {
        matcher,
      });
    }

    if (!toPath || typeof toPath !== 'function') {
      throw new GenericError(
        `The pathExpression.toPath is not a function, '${typeof toPath}' was given.`
      );
    }

    if (!extractParameters || typeof extractParameters !== 'function') {
      throw new GenericError(
        `The pathExpression.extractParameters is not a function, '${typeof extractParameters}' was given.`
      );
    }
  }

  /**
   * @inheritDoc
   */
  toPath(params = {}) {
    return AbstractRoute.getTrimmedPath(this._pathExpression.toPath(params));
  }

  /**
   * @inheritDoc
   */
  matches(path: string) {
    const trimmedPath = AbstractRoute.getTrimmedPath(path);

    return this._pathExpression.matcher.test(trimmedPath);
  }

  /**
   * @inheritDoc
   */
  extractParameters(path: string) {
    const trimmedPath = AbstractRoute.getTrimmedPath(path as string);
    const query = AbstractRoute.getQuery(trimmedPath);

    return this._pathExpression.extractParameters(
      trimmedPath.split('?').shift() ?? '',
      { path, query }
    );
  }
}
