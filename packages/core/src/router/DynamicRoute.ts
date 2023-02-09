import Controller, { IController } from '../controller/Controller';
import GenericError from '../error/GenericError';
import AbstractRoute, { RouteParams } from './AbstractRoute';
import { RouteOptions } from './Router';

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
  matcher: RegExp;
  toPath: (params: RouteParams) => string;
  extractParameters: ExtractPathFunction;
};

export type ExtractPathFunction = (path?: string) => Record<string, string>;

/**
 * Utility for representing and manipulating a single dynamic route in the
 * router's configuration. Dynamic route is defined by regExp used for route
 * matching and overrides for toPath and extractParameters functions to generate
 * and put together valid path.
 *
 * @extends AbstractRoute
 */
export default class DynamicRoute extends AbstractRoute {
  protected _matcher: RegExp;
  protected _toPath: (params: RouteParams) => string;
  protected _extractParameters: (path?: string) => RouteParams;

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
    options?: Partial<RouteOptions>
  ) {
    super(name, pathExpression, controller, view, options);

    if (!pathExpression || typeof pathExpression !== 'object') {
      throw new GenericError(
        `The pathExpression must be object, '${typeof pathExpression}' was given.`
      );
    }

    const { matcher, toPath, extractParameters } = pathExpression;

    if (!matcher || !(matcher instanceof RegExp)) {
      throw new GenericError(`The pathExpression.matcher must be a RegExp.`, {
        matcher,
      });
    }

    /**
     * RegExp use in router for path matching to current route.
     */
    this._matcher = matcher;

    if (!toPath || typeof toPath !== 'function') {
      throw new GenericError(
        `The pathExpression.toPath is not a function, '${typeof toPath}' was given.`
      );
    }

    /**
     * Function that generates valid path from current route and passed route params.
     */
    this._toPath = toPath;

    if (!extractParameters || typeof extractParameters !== 'function') {
      throw new GenericError(
        `The pathExpression.extractParameters is not a function, '${typeof extractParameters}' was given.`
      );
    }

    /**
     * Function which takes care of parsing url params from given path.
     * It returns object of key/value pairs which correspond to expected path url
     * params and their values.
     */
    this._extractParameters = extractParameters;
  }

  /**
   * @inheritDoc
   */
  toPath(params = {}) {
    return AbstractRoute.getTrimmedPath(this._toPath(params));
  }

  /**
   * @inheritDoc
   */
  matches(path: string) {
    const trimmedPath = AbstractRoute.getTrimmedPath(path);

    return this._matcher.test(trimmedPath);
  }

  /**
   * @inheritDoc
   */
  extractParameters(path?: string) {
    const trimmedPath = AbstractRoute.getTrimmedPath(path as string);
    const parameters = this._extractParameters(trimmedPath.split('?').shift());
    const query = AbstractRoute.getQuery(trimmedPath);

    return Object.assign({}, parameters, query);
  }
}
