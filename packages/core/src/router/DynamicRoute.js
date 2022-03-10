import GenericError from '../error/GenericError';
import AbstractRoute from './AbstractRoute';

/**
 * Path expression type used for router routes definition.
 * @typedef {Object} Route~PathExpression
 * @property {RegExp} matcher Regular expression used to match current path
 *           to the specific route.
 * @property {function(Object<string, (number|string)>)} toPath Override
 *           for the default toPath which generates valid path from current route
 *           and passed route params.
 * @property {function(path)} extractParameters Override for default method, which
 *           takes care of parsing url params from given path. It should return
 *           object of key/value pairs which correspond to expected path url
 *           params and their values.
 */

/**
 * Utility for representing and manipulating a single dynamic route in the
 * router's configuration. Dynamic route is defined by regExp used for route
 * matching and overrides for toPath and extractParameters functions to generate
 * and put together valid path.
 *
 * @extends AbstractRoute
 */
export default class DynamicRoute extends AbstractRoute {
  /**
   * Initializes the route.
   *
   * @inheritdoc
   * @param {Route~PathExpression} pathExpression Path expression used in route matching,
   *        to generate valid path with provided params and parsing params from current path.
   */
  constructor(name, pathExpression, controller, view, options) {
    super(name, pathExpression, controller, view, options);

    if (!pathExpression || typeof pathExpression !== 'object') {
      throw new GenericError(
        `The pathExpression must be object, '${typeof pathExpression}' was given.`
      );
    }

    const { matcher, toPath, extractParameters } = pathExpression;

    if (!matcher || !(matcher instanceof RegExp)) {
      throw new GenericError(`The pathExpression.matcher must be a RegExp.`);
    }

    /**
     * RegExp use in router for path matching to current route.
     *
     * @type {RegExp}
     */
    this._matcher = matcher;

    if (!toPath || typeof toPath !== 'function') {
      throw new GenericError(
        `The pathExpression.toPath is not a function, '${typeof toPath}' was given.`
      );
    }

    /**
     * Function that generates valid path from current route and passed route params.
     *
     * @type {function(Object<string, (number|string)>)}
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
     *
     * @type {function(path)}
     */
    this._extractParameters = extractParameters;
  }

  /**
   * @inheritdoc
   */
  toPath(params = {}) {
    return AbstractRoute.getTrimmedPath(this._toPath(params));
  }

  /**
   * @inheritdoc
   */
  matches(path) {
    let trimmedPath = AbstractRoute.getTrimmedPath(path);

    return this._matcher.test(trimmedPath);
  }

  /**
   * @inheritdoc
   */
  extractParameters(path) {
    let trimmedPath = AbstractRoute.getTrimmedPath(path);
    let parameters = this._extractParameters(trimmedPath.split('?').shift());
    let query = AbstractRoute.getQuery(trimmedPath);

    return Object.assign({}, parameters, query);
  }
}
