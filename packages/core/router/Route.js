import ns from '../namespace';
import Controller from '../controller/Controller';
import AbstractDocumentView from '../page/AbstractDocumentView';

ns.namespace('ima.router');

/**
 * Regular expression matching all control characters used in regular
 * expressions. The regular expression is used to match these characters in
 * path expressions and replace them appropriately so the path expression can
 * be compiled to a regular expression.
 *
 * @const
 * @property
 * @type {RegExp}
 */
const CONTROL_CHARACTERS_REGEXP = /[\\.+*?\^$\[\](){}\/\'#]/g;

/**
 * Regular expression used to match and remove the starting and trailing
 * forward slashes from a path expression or a URL path.
 *
 * @const
 * @property
 * @type {RegExp}
 */
const LOOSE_SLASHES_REGEXP = /^\/|\/$/g;

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @property PARAMS_REGEXP
 * @type {RegExp}
 */
const PARAMS_REGEXP_UNIVERSAL = /:\??([a-zA-Z0-9_-]+)/g;

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @property PARAMS_REGEXP
 * @type {RegExp}
 */
const PARAMS_REGEXP = /:([a-zA-Z0-9_-]+)/g;

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @property PARAMS_REGEXP
 * @type {RegExp}
 */
const PARAMS_REGEXP_OPT = /(?:^:\\\?([a-zA-Z0-9_-]+)(\\\/)?)|(?:(\\\/):\\\?([a-zA-Z0-9_-]+))|(?::\\\?([a-zA-Z0-9_-]+))/g;

/**
 * Utility for representing and manipulating a single route in the router's
 * configuration.
 *
 * @class Route
 * @namespace ima.router
 * @module ima
 * @submodule ima.router
 */
export default class Route {

	/**
	 * Initializes the route.
	 *
	 * @constructor
	 * @method constructor
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
		 * @private
		 * @property _name
		 * @type {string}
		 */
		this._name = name;

		/**
		 * The original URL path expression from which this route was created.
		 *
		 * @private
		 * @property _pathExpression
		 * @type {string}
		 */
		this._pathExpression = pathExpression;

		/**
		 * The full name of Object Container alias identifying the controller
		 * associated with this route.
		 *
		 * @private
		 * @property _controller
		 * @type {string}
		 */
		this._controller = controller;

		/**
		 * The full name or Object Container alias identifying the view class
		 * associated with this route.
		 *
		 * @private
		 * @property _view
		 * @type {React.Component}
		 */
		this._view = view;

		/**
		 * The route additional options.
		 *
		 * @private
		 * @property _options
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
		 * @default {
		 *            onlyUpdate: false,
		 *            autoScroll: true,
		 *            allowSPA: true,
		 *            documentView: null,
		 *            managedRootView: null
		 *          }
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
		 * @private
		 * @property _trimmedPathExpression
		 * @type {string}
		 */
		this._trimmedPathExpression = this._getTrimmedPath(pathExpression);

		/**
		 * The names of the parameters in this route.
		 *
		 * @private
		 * @property _parameterNames
		 * @type {string[]}
		 */
		this._parameterNames = this._getParameterNames(pathExpression);

		/**
		 * Set to {@code true} if this route contains parameters in its path.
		 *
		 * @private
		 * @property _hasParameters
		 * @type {boolean}
		 */
		this._hasParameters = !!this._parameterNames.length;

		/**
		 * A regexp used to match URL path against this route and extract the
		 * parameter values from the matched URL paths.
		 *
		 * @private
		 * @property _matcher
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
	 * @method toPath
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
			if (this._isParamInPath(path, paramName)) {
				path = this._substituteParamInPath(
					path,
					paramName,
					params[paramName]
				);
				path = this._substituteOptionalParamInPath(
					path,
					paramName,
					params[paramName]
				);
			} else {
				let pair = [paramName, params[paramName]];
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
	 * @method getName
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
	 * @method getController
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
	 * @method getView
	 * @return {string} The name or alias of the view class.
	 */
	getView() {
		return this._view;
	}

	/**
	 * Return route additional options.
	 *
	 * @method getOptions
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
	 * @method getPathExpression
	 * @return {string} The path expression.
	 */
	getPathExpression() {
		return this._pathExpression;
	}

	/**
	 * Tests whether the provided URL path matches this route. The provided
	 * path may contain the query.
	 *
	 * @method matches
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
	 * @method extractParameters
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
	 *  Replace param placeholder in path with parameter value.
	 *
	 * @private
	 * @method _cleanUnusedOptionalParams
	 * @param {string} path
	 * @param {string} paramName
	 * @param {string} paramValue
	 * @return {string} New path.
	 */
	_substituteParamInPath(path, paramName, paramValue) {
		return path.replace(
			new RegExp(`(^|\/):${paramName}([\/\?]|$)`),
			paramValue ? '$1' + paramValue +  '$2' : ''
		);
	}

	/**
	 * Replace optional param placeholder in path with parameter value.
	 *
	 * @private
	 * @method _cleanUnusedOptionalParams
	 * @param {string} path
	 * @param {string} paramName
	 * @param {string} paramValue
	 * @return {string} New path.
	 */
	_substituteOptionalParamInPath(path, paramName, paramValue) {
		return path.replace(
			new RegExp(`(^|\/):\\\?${paramName}([\/\?]|$)`),
			paramValue ? '$1' + paramValue +  '$2' : ''
		);
	}

	/**
	 * Replace optional param placeholder in path with parameter value.
	 *
	 * @private
	 * @method _cleanUnusedOptionalParams
	 * @param {string} path
	 * @return {string} New path.
	 */
	_cleanUnusedOptionalParams(path) {
		return path.replace(
			/(\/:\?([a-zA-Z0-9_-]+))|(:\?([a-zA-Z0-9_-]+)\/?)/g,
			''
		);
	}

	/**
	 * Returns true, if paramName is placed in path.
	 *
	 * @private
	 * @method _isParamInPath
	 * @param {string} path
	 * @param {string} paramName
	 * @return {boolean}
	 */
	_isParamInPath(path, paramName) {
		let regexp = new RegExp(`:\??${paramName}(?:[\/\?]|$)`);
		return regexp.test(path);
	}

	/**
	 * Compiles the path expression to a regular expression that can be used
	 * for easier matching of URL paths against this route, and extracting the
	 * path parameter values from the URL path.
	 *
	 * @private
	 * @method _compileToRegExp
	 * @param {string} pathExpression The path expression to compile.
	 * @return {RegExp} The compiled regular expression.
	 */
	_compileToRegExp(pathExpression) {
		let pattern = pathExpression
			.replace(LOOSE_SLASHES_REGEXP, '')
			.replace(CONTROL_CHARACTERS_REGEXP, '\\$&');

		// convert parameters to capture sequences
		pattern = pattern.replace(PARAMS_REGEXP_OPT, '(?:$3([^/?]+)$2)?');


		// convert parameters to capture sequences
		pattern = pattern.replace(PARAMS_REGEXP, '([^/?]+)');

		// add path root
		pattern = '^\\\/' + pattern;

		// add query parameters matcher
		let pairPattern = '[^=&;]*(?:=[^&;]*)?';
		pattern += `(?:\\?(?:${pairPattern})(?:[&;]${pairPattern})*)?$`;

		return new RegExp(pattern);
	}

	/**
	 * Parses the provided path and extract the in-path parameters. The method
	 * decodes the parameters and returns them in a hash object.
	 *
	 * @private
	 * @method _getParameters
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
	 * @private
	 * @method _extractParameters
	 * @param {string[]} parameterValues
	 * @return {Object<string, ?string>} Params object.
	 */
	_extractParameters(parameterValues) {
		let parameters = {};

		// Cycle for names and values from last to 0
		for (let i = this._parameterNames.length - 1; i >= 0; i--) {
			let [rawName, rawValue] = [
				this._parameterNames[i],
				parameterValues[i]
			];
			let cleanParamName = this._cleanOptParamName(rawName);

			parameters[cleanParamName] = this._decodeURIParameter(rawValue);
		}

		return parameters;
	}

	/**
	 * Decoding parameters.
	 *
	 * @private
	 * @method _decodeURIParameter
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
	 * @private
	 * @method _cleanOptParamName
	 * @param {string} paramName Full param name with "?"
	 * @return {string} Strict param name without "?"
	 */
	_cleanOptParamName(paramName) {
		return paramName.replace('?', '');
	}

	/**
	 * Checks if parameter is optional or not.
	 *
	 * @private
	 * @method _isParamOptional
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
	 * @private
	 * @method _getQuery
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
	 * @private
	 * @method getLoosesPath
	 * @param {string} path The path to trim.
	 * @return {string} Trimmed path.
	 */
	_getTrimmedPath(path) {
		return `/${path.replace(LOOSE_SLASHES_REGEXP, '')}`;
	}

	/**
	 * Extracts the parameter names from the provided path expression.
	 *
	 * @private
	 * @method _getParameterNames
	 * @param {string} pathExpression The path expression.
	 * @return {string[]} The names of the parameters defined in the provided
	 *         path expression.
	 */
	_getParameterNames(pathExpression) {
		let rawNames = pathExpression.match(PARAMS_REGEXP_UNIVERSAL) || [];

		return rawNames.map((rawParameterName) => {
			return rawParameterName.substring(1).replace('?', '');
		});
	}
}

ns.ima.router.Route = Route;
