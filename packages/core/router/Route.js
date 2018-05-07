/**
 * Regular expression matching all control characters used in regular
 * expressions. The regular expression is used to match these characters in
 * path expressions and replace them appropriately so the path expression can
 * be compiled to a regular expression.
 *
 * @const
 * @type {RegExp}
 */
const CONTROL_CHARACTERS_REGEXP = /[\\.+*?^$[\](){}/'#]/g;

/**
 * Regular expression used to match and remove the starting and trailing
 * forward slashes from a path expression or a URL path.
 *
 * @const
 * @type {RegExp}
 */
const LOOSE_SLASHES_REGEXP = /^\/|\/$/g;

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_UNIVERSAL = /:\??([\w-]+)/g;

/**
 * Regular expression used to match the required parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_REQUIRED = /(?:^|\\\/):([a-z0-9]+)(?=\\\/|$)/gi;

/**
 * Regular expression used to separate a camelCase parameter name
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_CORE_NAME = /[a-z0-9]+/i;

/**
 * Regular expression used to match start of parameter names from a path expression.
 *
 * @const
 * @type {String}
 */
const PARAMS_START_PATTERN = '(^|/|[_-])';

/**
 * Regular expression used to match end of parameter names from a path expression.
 *
 * @const
 * @type {String}
 */
const PARAMS_END_PATTERN = '[/?_-]|$';

/**
 * Regular expression used to never match the parameter names from a path expression.
 * It's used for wrong parameters order (optional vs. required ones)
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_NEVER_MATCH_REGEXP = /$a/;

/**
 * Regular expression used to match all main parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_MAIN_REGEXP = /(?:\\\/|^):\\\?([a-z0-9]+)(?=\\\/|$)|(?:^|\\\/):([a-z0-9]+)(?=\\\/|$)/gi;

/**
 * Regular expression used to match the required subparameter names from a path expression.
 * (e.g. for path '/:paramA-:paramB/:nextParam' are subparametres 'paramA' and 'paramB')
 *
 * @const
 * @type {Object<String, RegExp>}
 */
const SUBPARAMS_REQUIRED_REGEXP = {
  LAST: /([_-]{1})((\w-)?:[a-z0-9]+)(?=\\\/|$)/gi,
  OTHERS: /(:[a-z0-9]+)(?=[_-]{1})/gi
};

/**
 * Regular expression used to match the optional parameter names from a path expression.
 *
 * @const
 * @type {Object<String, RegExp>}
 */
const SUBPARAMS_OPT_REGEXP = {
  LAST: /([_-]{1}(\w-)?:\\\?[a-z0-9]+)(?=\\\/|$)/gi,
  OTHERS: /(:\\\?[a-z0-9]+)(?=[_-]{1}(\w-)?)/gi
};

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_OPT = /(?:^:\\\?([a-z0-9]+)(?=\\\/|$))|(?:(\\\/):\\\?([a-z0-9]+)(?=\\\/|$))/gi; // last part: |(?::\\\?([a-z0-9]+)(?=\\\/|$))

/**
 * Utility for representing and manipulating a single route in the router's
 * configuration.
 */
export default class Route {
  /**
   * Initializes the route.
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
     * The original URL path expression from which this route was created.
     *
     * @type {string}
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
     *         managedRootView: ?function(new: React.Component)
     *       }}
     */
    this._options = Object.assign(
      {
        onlyUpdate: false,
        autoScroll: true,
        allowSPA: true,
        documentView: null,
        managedRootView: null
      },
      options
    );

    /**
     * The path expression with the trailing slashes trimmed.
     *
     * @type {string}
     */
    this._trimmedPathExpression = this._getTrimmedPath(pathExpression);

    /**
     * The names of the parameters in this route.
     *
     * @type {string[]}
     */
    this._parameterNames = this._getParameterNames(pathExpression);

    /**
     * Set to {@code true} if this route contains parameters in its path.
     *
     * @type {boolean}
     */
    this._hasParameters = !!this._parameterNames.length;

    /**
     * A regexp used to match URL path against this route and extract the
     * parameter values from the matched URL paths.
     *
     * @type {RegExp}
     */
    this._matcher = this._compileToRegExp(this._trimmedPathExpression);
  }

  /**
   * Creates the URL and query parts of a URL by substituting the route's
   * parameter placeholders by the provided parameter value.
   *
   * The extraneous parameters that do not match any of the route's
   * placeholders will be appended as the query string.
   *
   * @param {Object<string, (number|string)>=} [params={}] The route
   *        parameter values.
   * @return {string} Path and, if necessary, query parts of the URL
   *         representing this route with its parameters replaced by the
   *         provided parameter values.
   */
  toPath(params = {}) {
    let path = this._pathExpression;
    let query = [];

    for (let paramName of Object.keys(params)) {
      if (this._isRequiredParamInPath(path, paramName)) {
        path = this._substituteRequiredParamInPath(
          path,
          paramName,
          params[paramName]
        );
      } else if (this._isOptionalParamInPath(path, paramName)) {
        path = this._substituteOptionalParamInPath(
          path,
          paramName,
          params[paramName]
        );
      } else {
        const pair = [paramName, params[paramName]];
        query.push(pair.map(encodeURIComponent).join('='));
      }
    }
    path = this._cleanUnusedOptionalParams(path);

    path = query.length ? path + '?' + query.join('&') : path;
    path = this._getTrimmedPath(path);
    return path;
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
   *           documentView: ?AbstractDocumentView
   *         }}
   */
  getOptions() {
    return this._options;
  }

  /**
   * Returns the path expression, which is the parametrized pattern matching
   * the URL paths matched by this route.
   *
   * @return {string} The path expression.
   */
  getPathExpression() {
    return this._pathExpression;
  }

  /**
   * Tests whether the provided URL path matches this route. The provided
   * path may contain the query.
   *
   * @param {string} path The URL path.
   * @return {boolean} {@code true} if the provided path matches this route.
   */
  matches(path) {
    let trimmedPath = this._getTrimmedPath(path);
    return this._matcher.test(trimmedPath);
  }

  /**
   * Extracts the parameter values from the provided path. The method
   * extracts both the in-path parameters and parses the query, allowing the
   * query parameters to override the in-path parameters.
   *
   * The method returns an empty hash object if the path does not match this
   * route.
   *
   * @param {string} path
   * @return {Object<string, ?string>} Map of parameter names to parameter
   *         values.
   */
  extractParameters(path) {
    let trimmedPath = this._getTrimmedPath(path);
    let parameters = this._getParameters(trimmedPath);
    let query = this._getQuery(trimmedPath);

    return Object.assign({}, parameters, query);
  }

  /**
   * Replace required parameter placeholder in path with parameter value.
   *
   * @param {string} path
   * @param {string} paramName
   * @param {string} paramValue
   * @return {string} New path.
   */
  _substituteRequiredParamInPath(path, paramName, paramValue) {
    return path.replace(
      new RegExp(`${PARAMS_START_PATTERN}:${paramName}(${PARAMS_END_PATTERN})`),
      paramValue ? '$1' + encodeURIComponent(paramValue) + '$2' : ''
    );
  }

  /**
   * Replace optional param placeholder in path with parameter value.
   *
   * @param {string} path
   * @param {string} paramName
   * @param {string} paramValue
   * @return {string} New path.
   */
  _substituteOptionalParamInPath(path, paramName, paramValue) {
    const paramRegexp = `${PARAMS_START_PATTERN}:\\?${paramName}(${PARAMS_END_PATTERN})`;
    return path.replace(
      new RegExp(paramRegexp),
      paramValue ? '$1' + encodeURIComponent(paramValue) + '$2' : '/'
    );
  }

  /**
   * Remove unused optional param placeholders in path.
   *
   * @param {string} path
   * @return {string} New path.
   */
  _cleanUnusedOptionalParams(path) {
    let replacedPath = path;

    // remove last subparameters
    replacedPath = replacedPath.replace(/([_-])(:\?([a-z0-9]+))(?=\/)/gi, '$1');

    // remove parameters
    replacedPath = replacedPath.replace(
      /(\/:\?([a-z0-9]+))|(:\?([a-z0-9]+)\/?)/gi,
      ''
    );

    return replacedPath;
  }

  /**
   * Returns true, if paramName is placed in path.
   *
   * @param {string} path
   * @param {string} paramName
   * @return {boolean}
   */
  _isOptionalParamInPath(path, paramName) {
    const paramRegexp = `${PARAMS_START_PATTERN}:\\?${paramName}(?:${PARAMS_END_PATTERN})`;
    let regexp = new RegExp(paramRegexp);
    return regexp.test(path);
  }

  /**
   * Returns true, if paramName is placed in path and it's required.
   *
   * @param {string} path
   * @param {string} paramName
   * @return {boolean}
   */
  _isRequiredParamInPath(path, paramName) {
    let regexp = new RegExp(`:${paramName}`);

    return regexp.test(path);
  }

  /**
   * Extract clear parameter name, e.q. '?name' or 'name'
   *
   * @param {string} rawParam
   * @return {string}
   */
  _getClearParamName(rawParam) {
    const regExpr = /\??[a-z0-9]+/i;
    const paramMatches = rawParam.match(regExpr);
    const param = paramMatches ? paramMatches[0] : '';

    return param;
  }

  /**
   * Get pattern for subparameter.
   *
   * @param {string} delimeter Parameters delimeter
   * @return {string}
   */
  _getSubparamPattern(delimeter) {
    const pattern = `([^${delimeter}?]+)`;

    return pattern;
  }

  /**
   * Check if all optional params are below required ones
   *
   * @param {array<string>} allMainParams
   * @return {boolean}
   */
  _checkOptionalParamsOrder(allMainParams) {
    let optionalLastId = -1;

    const count = allMainParams.length;
    for (let idx = 0; idx < count; idx++) {
      const item = allMainParams[idx];

      if (item.substr(0, 1) === '?') {
        optionalLastId = idx;
      } else {
        if (optionalLastId > -1 && idx > optionalLastId) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if main parametres have correct order.
   * It means that required param cannot follow optional one.
   *
   * @param {string} clearedPathExpr The cleared URL path (removed first and last slash, ...).
   * @return {Bool} Returns TRUE if order is correct.
   */
  _checkParametersOrder(clearedPathExpr) {
    const mainParamsMatches = clearedPathExpr.match(PARAMS_MAIN_REGEXP) || [];
    const allMainParamsCleared = mainParamsMatches.map(paramExpr =>
      this._getClearParamName(paramExpr)
    );

    const isCorrectParamOrder = this._checkOptionalParamsOrder(
      allMainParamsCleared
    );
    return isCorrectParamOrder;
  }

  /**
   * Convert main optional parameters to capture sequences
   *
   * @param {string} path The URL path.
   * @param {array<string>} optionalParams List of main optimal parameter expressions
   * @return {string} RegExp pattern.
   */
  _replaceOptionalParametersInPath(path, optionalParams) {
    const pattern = optionalParams.reduce((path, paramExpr, idx, matches) => {
      const lastIdx = matches.length - 1;
      const hasSlash = paramExpr.substr(0, 2) === '\\/';

      let separator = '';

      if (idx === 0) {
        separator = '(?:' + (hasSlash ? '/' : '');
      } else {
        separator = hasSlash ? '/?' : '';
      }

      let regExpr = separator + `([^/?]+)?(?=/|$)?`;

      if (idx === lastIdx) {
        regExpr += ')?';
      }

      return path.replace(paramExpr, regExpr);
    }, path);

    return pattern;
  }

  /**
   * Convert required subparameters to capture sequences
   *
   * @param {string} path The URL path (route definition).
   * @param {string} clearedPathExpr The original cleared URL path.
   * @return {string} RegExp pattern.
   */
  _replaceRequiredSubParametersInPath(path, clearedPathExpr) {
    const requiredSubparamsOthers =
      clearedPathExpr.match(SUBPARAMS_REQUIRED_REGEXP.OTHERS) || [];
    const requiredSubparamsLast =
      clearedPathExpr.match(SUBPARAMS_REQUIRED_REGEXP.LAST) || [];

    path = requiredSubparamsOthers.reduce((pattern, paramExpr) => {
      const paramIdx = pattern.indexOf(paramExpr) + paramExpr.length;
      const delimeter = pattern.substr(paramIdx, 1);

      const regExpr = this._getSubparamPattern(delimeter);

      return pattern.replace(paramExpr, regExpr);
    }, path);

    path = requiredSubparamsLast.reduce((pattern, rawParamExpr) => {
      const paramExpr = rawParamExpr.substr(1);
      const regExpr = '([^/?]+)';

      return pattern.replace(paramExpr, regExpr);
    }, path);

    return path;
  }

  /**
   * Convert optional subparameters to capture sequences
   *
   * @param {string} path The URL path (route definition).
   * @param {array<string>} optionalSubparamsOthers List of all subparam. expressions but last ones
   * @param {array<string>} optionalSubparamsLast List of last subparam. expressions
   * @return {string} RegExp pattern.
   */
  _replaceOptionalSubParametersInPath(
    path,
    optionalSubparamsOthers,
    optionalSubparamsLast
  ) {
    path = optionalSubparamsOthers.reduce((pattern, paramExpr) => {
      const paramIdx = pattern.indexOf(paramExpr) + paramExpr.length;
      const delimeter = pattern.substr(paramIdx, 1);
      const paramPattern = this._getSubparamPattern(delimeter);
      const regExpr = paramPattern + '?';

      return pattern.replace(paramExpr, regExpr);
    }, path);

    path = optionalSubparamsLast.reduce((pattern, rawParamExpr) => {
      const paramExpr = rawParamExpr.substr(1);
      const regExpr = '([^/?]+)?';

      return pattern.replace(paramExpr, regExpr);
    }, path);

    return path;
  }

  /**
   * Compiles the path expression to a regular expression that can be used
   * for easier matching of URL paths against this route, and extracting the
   * path parameter values from the URL path.
   *
   * @param {string} pathExpression The path expression to compile.
   * @return {RegExp} The compiled regular expression.
   */
  _compileToRegExp(pathExpression) {
    const clearedPathExpr = pathExpression
      .replace(LOOSE_SLASHES_REGEXP, '')
      .replace(CONTROL_CHARACTERS_REGEXP, '\\$&');

    const requiredMatches = clearedPathExpr.match(PARAMS_REGEXP_REQUIRED) || [];
    const optionalMatches = clearedPathExpr.match(PARAMS_REGEXP_OPT) || [];

    const optionalSubparamsLast =
      clearedPathExpr.match(SUBPARAMS_OPT_REGEXP.LAST) || [];
    const optionalSubparamsOthers =
      clearedPathExpr.match(SUBPARAMS_OPT_REGEXP.OTHERS) || [];
    const optionalSubparams = [
      ...optionalSubparamsOthers,
      ...optionalSubparamsLast
    ];

    const optionalSubparamsCleanNames = optionalSubparams.map(paramExpr => {
      return this._getClearParamName(paramExpr);
    });

    const optionalParams = optionalMatches.filter(paramExpr => {
      const param = this._getClearParamName(paramExpr);

      return !optionalSubparamsCleanNames.includes(param);
    });

    if (!!requiredMatches.length && !!optionalParams.length) {
      const isCorrectParamOrder = this._checkParametersOrder(clearedPathExpr);

      if (!isCorrectParamOrder) {
        return PARAMS_NEVER_MATCH_REGEXP;
      }
    }

    // convert required parameters to capture sequences
    let pattern = requiredMatches.reduce((pattern, rawParamExpr) => {
      const paramExpr = ':' + this._getClearParamName(rawParamExpr);
      const regExpr = '([^/?]+)';

      return pattern.replace(paramExpr, regExpr);
    }, clearedPathExpr);

    pattern = this._replaceOptionalParametersInPath(pattern, optionalParams);
    pattern = this._replaceRequiredSubParametersInPath(
      pattern,
      clearedPathExpr
    );
    pattern = this._replaceOptionalSubParametersInPath(
      pattern,
      optionalSubparamsOthers,
      optionalSubparamsLast
    );

    // add path root
    pattern = '^\\/' + pattern;

    // add query parameters matcher
    let pairPattern = '[^=&;]*(?:=[^&;]*)?';
    pattern += `(?:\\?(?:${pairPattern})(?:[&;]${pairPattern})*)?$`;

    return new RegExp(pattern);
  }

  /**
   * Parses the provided path and extract the in-path parameters. The method
   * decodes the parameters and returns them in a hash object.
   *
   * @param {string} path The URL path.
   * @return {Object<string, string>} The parsed path parameters.
   */
  _getParameters(path) {
    if (!this._hasParameters) {
      return {};
    }

    let parameterValues = path.match(this._matcher);
    if (!parameterValues) {
      return {};
    }

    parameterValues.shift(); // remove the match on whole path, and other parts

    return this._extractParameters(parameterValues);
  }

  /**
   * Extract parameters from given path.
   *
   * @param {string[]} parameterValues
   * @return {Object<string, ?string>} Params object.
   */
  _extractParameters(parameterValues) {
    let parameters = {};

    const parametersCount = this._parameterNames.length;

    // Cycle for names and values from last to 0
    for (let i = parametersCount - 1; i >= 0; i--) {
      let [rawName, rawValue] = [this._parameterNames[i], parameterValues[i]];
      let cleanParamName = this._cleanOptParamName(rawName);

      const matchesName = cleanParamName.match(PARAMS_REGEXP_CORE_NAME);
      const currentCoreName = matchesName ? matchesName[0] : '';

      if (currentCoreName) {
        const value = this._decodeURIParameter(rawValue);
        parameters[currentCoreName] = value;
      }
    }

    return parameters;
  }

  /**
   * Decoding parameters.
   *
   * @param {string} parameterValue
   * @return {string} decodedValue
   */
  _decodeURIParameter(parameterValue) {
    let decodedValue;
    if (parameterValue) {
      decodedValue = decodeURIComponent(parameterValue);
    }
    return decodedValue;
  }

  /**
   * Returns optional param name without "?"
   *
   * @param {string} paramName Full param name with "?"
   * @return {string} Strict param name without "?"
   */
  _cleanOptParamName(paramName) {
    return paramName.replace('?', '');
  }

  /**
   * Checks if parameter is optional or not.
   *
   * @param {string} paramName
   * @return {boolean} return true if is optional, otherwise false
   */
  _isParamOptional(paramName) {
    return /\?.+/.test(paramName);
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
        let pair = parameterPair.split('=');
        query[decodeURIComponent(pair[0])] =
          pair.length > 1 ? decodeURIComponent(pair[1]) : true;
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

  /**
   * Extracts the parameter names from the provided path expression.
   *
   * @param {string} pathExpression The path expression.
   * @return {string[]} The names of the parameters defined in the provided
   *         path expression.
   */
  _getParameterNames(pathExpression) {
    let rawNames = pathExpression.match(PARAMS_REGEXP_UNIVERSAL) || [];

    return rawNames.map(rawParameterName => {
      return rawParameterName.substring(1).replace('?', '');
    });
  }
}
