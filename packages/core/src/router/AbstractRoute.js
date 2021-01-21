import GenericError from '../error/GenericError';

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
export default class AbstractRoute {
  /**
   * Converts array of pairs (tuples) into valid URI query component.
   *
   * @example
   * let pairs = [['a', true], ['hello world', 123]];
   * pairsToQuery(pairs); // => "?a=true&hello%20world=123"
   *
   * @param {[[string|number, any]]} pairs
   * @return {string} Valid URI query component or empty string if
   *         there are no valid pairs provided.
   */
  static pairsToQuery(pairs) {
    if (!pairs) {
      return '';
    }

    const query = pairs
      .map(pair => pair.map(encodeURIComponent).join('='))
      .join('&');

    return query.length ? `?${query}` : '';
  }

  /**
   * Initializes the route.
   *
   * @param {string} name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param {any} pathExpression Path expression used in route matching, to generate
   *        valid path with provided params and parsing params from current path.
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
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }} options The route additional options.
   */
  constructor(name, pathExpression, controller, view, options) {
    /**
     * The unique name of this route, identifying it among the rest of the
     * routes in the application.
     *
     * @type {string}
     */
    this._name = name;

    /**
     * Path expression used in route matching, to generate valid path with
     * provided params and parsing params from current path.
     *
     * @type {any}
     */
    this._pathExpression = pathExpression;

    /**
     * The full name of Object Container alias identifying the controller
     * associated with this route.
     *
     * @type {string}
     */
    this._controller = controller;

    /**
     * The full name or Object Container alias identifying the view class
     * associated with this route.
     *
     * @type {React.Component}
     */
    this._view = view;

    /**
     * The route additional options.
     *
     * @type {{
     *         onlyUpdate: (
     *           boolean|
     *           function(
     *             (string|function(new: Controller, ...*)),
     *             (string|function(
     *               new: React.Component,
     *               Object<string, *>,
     *               ?Object<string, *>
     *             ))
     *           ): boolean
     *         ),
     *         autoScroll: boolean,
     *         allowSPA: boolean,
     *         documentView: ?function(new: AbstractDocumentView),
     *         managedRootView: ?function(new: React.Component),
     *         viewAdapter: ?function(new: React.Component)
     *       }}
     */
    this._options = Object.assign(
      {
        onlyUpdate: false,
        autoScroll: true,
        allowSPA: true,
        documentView: null,
        managedRootView: null,
        viewAdapter: null
      },
      options
    );
  }

  /**
   * Returns the unique identifying name of this route.
   *
   * @return {string} The name of the route, identifying it.
   */
  getName() {
    return this._name;
  }

  /**
   * Returns the full name of the controller to use when this route is
   * matched by the current URL, or an Object Container-registered alias of
   * the controller.
   *
   * @return {string} The name of alias of the controller.
   */
  getController() {
    return this._controller;
  }

  /**
   * Returns the full name of the view class or an Object
   * Container-registered alias for the view class, representing the view to
   * use when this route is matched by the current URL.
   *
   * @return {string} The name or alias of the view class.
   */
  getView() {
    return this._view;
  }

  /**
   * Return route additional options.
   *
   * @return {{
   *           onlyUpdate: (
   *             boolean|
   *             function(
   *               (string|function(new: Controller, ...*)),
   *               (string|function(
   *                 new: React.Component,
   *                 Object<string, *>,
   *                 ?Object<string, *>
   *               ))
   *             ): boolean
   *           ),
   *           autoScroll: boolean,
   *           allowSPA: boolean,
   *           documentView: ?AbstractDocumentView,
   *           managedRootView: ?function(new: React.Component),
   *           viewAdapter: ?function(new: React.Component)
   *         }}
   */
  getOptions() {
    return this._options;
  }

  /**
   * Path expression used in route matching, to generate valid path with
   * provided params and parsing params from current path.
   *
   * @return {any} The path expression.
   */
  getPathExpression() {
    return this._pathExpression;
  }

  /**
   * Creates the URL and query parts of a URL by substituting the route's
   * parameter placeholders by the provided parameter value.
   *
   * The extraneous parameters that do not match any of the route's
   * placeholders will be appended as the query string.
   *
   * @abstract
   * @param {Object<string, (number|string)>=} [params={}] The route
   *        parameter values.
   * @return {string} Path and, if necessary, query parts of the URL
   *         representing this route with its parameters replaced by the
   *         provided parameter values.
   */
  toPath() {
    throw new GenericError(
      'The ima.core.router.AbstractRoute.toPath method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * Tests whether the provided URL path matches this route. The provided
   * path may contain the query.
   *
   * @abstract
   * @param {string} path The URL path.
   * @return {boolean} {@code true} if the provided path matches this route.
   */
  matches() {
    throw new GenericError(
      'The ima.core.router.AbstractRoute.matches method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * Extracts the parameter values from the provided path. The method
   * extracts both the in-path parameters and parses the query, allowing the
   * query parameters to override the in-path parameters.
   *
   * The method returns an empty hash object if the path does not match this
   * route.
   *
   * @abstract
   * @param {string} path
   * @return {Object<string, ?string>} Map of parameter names to parameter
   *         values.
   */
  extractParameters() {
    throw new GenericError(
      'The ima.core.router.AbstractRoute.extractParameters method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * Extracts and decodes the query parameters from the provided URL path and
   * query.
   *
   * @param {string} path The URL path, including the optional query string
   *        (if any).
   * @return {Object<string, ?string>} Parsed query parameters.
   */
  _getQuery(path) {
    let query = {};
    let queryStart = path.indexOf('?');
    let hasQuery = queryStart > -1 && queryStart !== path.length - 1;

    if (hasQuery) {
      let pairs = path.substring(queryStart + 1).split(/[&;]/);

      for (let parameterPair of pairs) {
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

        query[this._decodeURIParameter(pair[0])] =
          pair.length > 1 ? this._decodeURIParameter(pair[1]) || '' : true;
      }
    }

    return query;
  }

  /**
   * Trims the trailing forward slash from the provided URL path.
   *
   * @param {string} path The path to trim.
   * @return {string} Trimmed path.
   */
  _getTrimmedPath(path) {
    return `/${path.replace(LOOSE_SLASHES_REGEXP, '')}`;
  }
}
