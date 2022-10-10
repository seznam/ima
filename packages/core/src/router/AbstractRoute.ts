import RouterMiddleware, { MiddleWareFunction } from './RouterMiddleware';
import { RouteOptions } from './Router';
import { RoutePathExpression } from './DynamicRoute';

export type ParamValue = string | number | boolean;

export type RouteParams = {
  [key: string]: ParamValue | Error;
};

/**
 * Regular expression used to match and remove the starting and trailing
 * forward slashes from a path expression or a URL path.
 *
 * @const
 * @type {RegExp}
 */
export const LOOSE_SLASHES_REGEXP = /^\/|\/$/g;

/**
 * Utility for representing and manipulating a single route in the router's
 * configuration.
 */
export default abstract class AbstractRoute {
  /**
   * The unique name of this route, identifying it among the rest of the
   * routes in the application.
   */
  protected _name: string;
  /**
   * Path expression used in route matching, to generate valid path with
   * provided params and parsing params from current path.
   */
  protected _pathExpression: RoutePathExpression | string;
  /**
   * The full name of Object Container alias identifying the controller
   * associated with this route.
   */
  protected _controller: object | string | (() => unknown);
  /**
   * The full name or Object Container alias identifying the view class
   * associated with this route.
   */
  protected _view: object | string | (() => unknown);
  /**
   * The route additional options.
   */
  protected _options: RouteOptions;
  protected _cachedController: unknown;
  protected _cachedView: unknown;

  /**
   * TODO IMA@18 remove static method
   *
   * Converts array of pairs (tuples) into valid URI query component.
   * Filters out invalid inputs (undefined, null, object, array, non-pair).
   *
   * @example
   * let pairs = [['a', true], ['hello world', 123]];
   * pairsToQuery(pairs); // => "?a=true&hello%20world=123"
   *
   * @param [pairs=[]] Array of arrays where the first
   *         element must be string|number and the second element can be any.
   * @return Valid URI query component or empty string if
   *         there are no valid pairs provided.
   */
  static pairsToQuery(pairs: Array<Array<unknown>> = []) {
    if (!pairs || !pairs.length) {
      return '';
    }

    const query = pairs
      .filter(
        pair =>
          Array.isArray(pair) &&
          pair.length === 2 &&
          pair.every(v => ['boolean', 'string', 'number'].includes(typeof v))
      )
      .map(pair =>
        (pair as (string | number | boolean)[])
          .map(encodeURIComponent)
          .join('=')
      )
      .join('&');

    return query.length ? `?${query}` : '';
  }

  /**
   * TODO IMA@18 remove static method
   *
   * Converts object of key/value pairs to URI query,
   * which can be appended to url.
   */
  static paramsToQuery(params: RouteParams = {}) {
    if (
      !params ||
      typeof params !== 'object' ||
      Object.keys(params).length === 0
    ) {
      return '';
    }

    return AbstractRoute.pairsToQuery(
      Object.keys(params).map(param => [param, params[param]])
    );
  }

  /**
   * TODO IMA@18 remove static method
   *
   * Extracts and decodes the query parameters from the provided URL path and
   * query.
   *
   * @param path The URL path, including the optional query string
   *        (if any).
   * @return Parsed query parameters.
   */
  static getQuery(path: string) {
    const query: RouteParams = {};
    const queryStart = path.indexOf('?');

    if (queryStart > -1 && queryStart !== path.length - 1) {
      const pairs = path.substring(queryStart + 1).split(/[&;]/);

      for (const parameterPair of pairs) {
        const delimiterIndex = parameterPair.indexOf('=');

        const pair = [];

        if (delimiterIndex !== -1) {
          pair.push(parameterPair.slice(0, delimiterIndex));
          pair.push(parameterPair.slice(delimiterIndex + 1)); //+ 1 to exclude equal sign
        } else {
          pair.push(parameterPair);
        }

        if (pair.length > 1) {
          const hashIndex = pair[1].indexOf('#');

          if (hashIndex !== -1) {
            pair[1] = pair[1].slice(0, hashIndex);
          }
        }

        query[AbstractRoute.decodeURIParameter(pair[0]) as string] =
          pair.length > 1
            ? AbstractRoute.decodeURIParameter(pair[1]) || ''
            : true;
      }
    }

    return query;
  }

  /**
   * TODO IMA@18 remove static method
   *
   * Decoding parameters.
   *
   * @param parameterValue
   * @return decodedValue
   */
  static decodeURIParameter(parameterValue: string) {
    try {
      return decodeURIComponent(parameterValue);
    } catch (_) {
      return '';
    }
  }

  /**
   * TODO IMA@18 remove static method
   *
   * Trims the trailing forward slash from the provided URL path.
   *
   * @param path The path to trim.
   * @return Trimmed path.
   */
  static getTrimmedPath(path: string) {
    return `/${path.replace(LOOSE_SLASHES_REGEXP, '')}`;
  }

  /**
   * Initializes the route.
   *
   * @param name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param pathExpression Path expression used in route matching, to generate
   *        valid path with provided params and parsing params from current path.
   * @param controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param options The route additional options.
   */
  constructor(
    name: string,
    pathExpression: RoutePathExpression | string,
    controller: object | string | (() => unknown),
    view: object | string | (() => unknown),
    options: RouteOptions
  ) {
    this._name = name;

    this._pathExpression = pathExpression;

    this._controller = controller;

    this._view = view;

    this._options = Object.assign(
      {
        onlyUpdate: false,
        autoScroll: true,
        documentView: null,
        managedRootView: null,
        viewAdapter: null,
        middlewares: [],
      },
      options
    );

    // Initialize router middlewares
    this._options.middlewares = this._options?.middlewares?.map(
      middleware => new RouterMiddleware(middleware as MiddleWareFunction)
    );
  }

  /**
   * Returns the unique identifying name of this route.
   *
   * @return The name of the route, identifying it.
   */
  getName() {
    return this._name;
  }

  /**
   * Returns Controller class/alias/constant associated with this route.
   * Internally caches async calls for dynamically imported controllers,
   * meaning that once they're loaded, you get the same promise for
   * subsequent calls.
   *
   * @return The Controller class/alias/constant.
   */
  async getController() {
    if (!this._cachedController) {
      this._cachedController = this._getAsyncModule(this._controller);
    }

    return this._cachedController;
  }

  /**
   * Returns View class/alias/constant associated with this route.
   * Internally caches async calls for dynamically imported views,
   * meaning that once they're loaded, you get the same promise for
   * subsequent calls.
   *
   * @return The View class/alias/constant.
   */
  async getView() {
    if (!this._cachedView) {
      this._cachedView = this._getAsyncModule(this._view);
    }

    return this._cachedView;
  }

  /**
   * Return route additional options.
   */
  getOptions() {
    return this._options;
  }

  /**
   * Path expression used in route matching, to generate valid path with
   * provided params and parsing params from current path.
   *
   * @return The path expression.
   */
  getPathExpression() {
    return this._pathExpression;
  }

  /**
   * Preloads dynamically imported view and controller.
   *
   * @return Promise.All resolving to [view, controller] tuple.
   */
  async preload() {
    return Promise.all([this.getController(), this.getView()]);
  }

  /**
   * Creates the URL and query parts of a URL by substituting the route's
   * parameter placeholders by the provided parameter value.
   *
   * The extraneous parameters that do not match any of the route's
   * placeholders will be appended as the query string.
   *
   * @abstract
   * @param [params={}] The route
   *        parameter values.
   * @return Path and, if necessary, query parts of the URL
   *         representing this route with its parameters replaced by the
   *         provided parameter values.
   */
  abstract toPath(params: RouteParams): string;

  /**
   * Tests whether the provided URL path matches this route. The provided
   * path may contain the query.
   *
   * @abstract
   * @param path The URL path.
   * @return `true` if the provided path matches this route.
   */
  abstract matches(path: string): boolean;

  /**
   * Extracts the parameter values from the provided path. The method
   * extracts both the in-path parameters and parses the query, allowing the
   * query parameters to override the in-path parameters.
   *
   * The method returns an empty hash object if the path does not match this
   * route.
   *
   * @abstract
   * @param path
   * @return Map of parameter names to parameter
   *         values.
   */
  abstract extractParameters(path?: string): RouteParams;

  /**
   * Helper method to pre-process view and controller which can be
   * async functions in order to support dynamic async routing.
   *
   * @param module The module class/alias/constant.
   * @return Promise resolving to the actual view or controller
   *  constructor function/class.
   */
  async _getAsyncModule(module: object | string | (() => unknown)) {
    return module.constructor.name === 'AsyncFunction'
      ? (module as () => Promise<Record<string, unknown>>)().then(
          module => module.default ?? module
        )
      : module;
  }
}
