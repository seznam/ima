import AbstractRoute, { LOOSE_SLASHES_REGEXP } from './AbstractRoute';

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
 * Utility for representing and manipulating a single static route in the
 * router's configuration using string representation of the path expression
 * with special param fields identified by {@code :paramName} prefix.
 *
 * @extends AbstractRoute
 */
export default class StaticRoute extends AbstractRoute {
  /**
   * @inheritdoc
   * @param {string} pathExpression A path expression specifying the URL path
   *        part matching this route (must not contain a query string),
   *        optionally containing named parameter placeholders specified as
   *        {@code :parameterName}.
   */
  constructor(name, pathExpression, controller, view, options) {
    super(name, pathExpression, controller, view, options);

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
   * @inheritdoc
   */
  toPath(params = {}) {
    let path = this._pathExpression;
    let queryPairs = [];

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
        queryPairs.push([paramName, params[paramName]]);
      }
    }

    path = this._cleanUnusedOptionalParams(path);
    path += AbstractRoute.pairsToQuery(queryPairs);

    return this._getTrimmedPath(path);
  }

  /**
   * @inheritdoc
   */
  matches(path) {
    let trimmedPath = this._getTrimmedPath(path);

    return this._matcher.test(trimmedPath);
  }

  /**
   * @inheritdoc
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
    const pattern = `([^${delimeter}?/]+)`;

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
      const regExpr = '([^/?#]+)';

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
    pattern += `(?:[\\?\\#](?:${pairPattern})(?:[&;]${pairPattern})*)?$`;

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
