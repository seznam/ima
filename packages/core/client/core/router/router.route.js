import ns from 'core/namespace/ns.js';

ns.namespace('Core.Router');

/**
 * @class Route
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class Route{

	/**
	 * @method constructor
	 * @constructor
	 * @param {String} name
	 * @param {String} pathExpression
	 * @param {String} controller
	 */
	constructor(name, pathExpression, controller) {
		/**
		 * @property ESCAPED_CHARS_REGEXP
		 * @const
		 * @type {RegExp}
		 * @default new RegExp('[\\.+*?\^$\[\](){}\/'#]','g')
		 */
		this.ESCAPED_CHARS_REGEXP = new RegExp('[\\.+*?\^$\[\](){}\/\'#]','g');

		/**
		 * @property LOOSE_SLASHES_REGEXP
		 * @const
		 * @type {RegExp}
		 * @default new RegExp('^\/|\/$','g')
		 */
		this.LOOSE_SLASHES_REGEXP = new RegExp('^\/|\/$','g');

		/**
		 * @property PARAMS_REGEXP
		 * @const
		 * @type {RegExp}
		 * @default new RegExp(':([a-zA-Z0-9_-]*)', 'g')
		 */
		this.PARAMS_REGEXP = new RegExp(':([a-zA-Z0-9_-]*)', 'g');

		/**
		 * @property _name
		 * @private
		 * @type {String}
		 * @default name
		 */
		this._name = name;

		/**
		 * @property _pathExpression
		 * @private
		 * @type {String}
		 * @default pathExpression
		 */
		this._pathExpression = pathExpression;

		/**
		 * @property _loosesPathExpression
		 * @private
		 * @type {String}
		 * @default this._getLoosesPath(this._pathExpression)
		 */
		this._loosesPathExpression = this._getLoosesPath(this._pathExpression);


		/**
		 * @property _controller
		 * @private
		 * @type {String}
		 * @default controller
		 */
		this._controller = controller;


		/**
		 * @property _isParamsInPathExpression
		 * @private
		 * @type {Boolean}
		 */
		this._isParamsInPathExpression = !!this._pathExpression.match(this.PARAMS_REGEXP);

		/**
		 * @property _regular
		 * @private
		 * @type {String}
		 * @default ''
		 */
		this._regular = '';

		this._createRegularExpression();
	}

	/**
	 * Create path for params.
	 *
	 * @method createPathForParams
	 * @param {Object} [params=[]]
	 */
	createPathForParams(params = {}) {
		var path = this._pathExpression;
		var paramKeys = Object.keys(params);
		var query = [];

		for (var paramKey of paramKeys) {
			var reg = new RegExp(`:${paramKey}`, 'g');

			if (reg.test(path)) {
				path = path.replace(reg, params[paramKey]);
			} else {
				query.push(`${[encodeURIComponent(paramKey)]}=${encodeURIComponent(params[paramKey])}`);
			}
		}

		path = query.length === 0 ? path : path + '?' + query.join('&');

		return path;
	}

	/**
	 * Return controller name.
	 *
	 * @method getName
	 * @return {String}
	 */
	getName() {
		return this._name;
	}

	/**
	 * Create new instance of controller and return it.
	 *
	 * @method getController
	 * @return {Core.Interface.Controller}
	 */
	getController() {
		return ns.oc.make(this._controller);
	}

	/**
	 * Return defined path expression.
	 *
	 * @method getPathExpression
	 * @return {String}
	 */
	getPathExpression() {
		return this._pathExpression;
	}

	/**
	 * Return regular expression for path.
	 *
	 * @method getRegular
	 * @return {String}
	 */
	getRegular() {
		return this._regular;
	}

	/**
	 * Return true if path is matched with regular expression.
	 *
	 * @method isMatch
	 * @return {Boolean}
	 */
	isMatch(path) {
		path = this._getLoosesPath(path);
		return !!path.match(this._regular);
	}

	/**
	 * Return params for path.
	 *
	 * @method getParamsForPath
	 * @return {Object}
	 */
	getParamsForPath(path) {
		var params = {};

		var loosesPath = this._getLoosesPath(path);
		this._parseArguments(loosesPath, params);
		this._parseQuery(loosesPath, params);

		return params;
	}

	/**
	 * Create regular expression for path.
	 *
	 * @method _createRegularExpression
	 * @private
	 */
	_createRegularExpression() {
		this._regular  = this._pathExpression.replace(this.LOOSE_SLASHES_REGEXP, '');
		this._regular = this._regular.replace(this.ESCAPED_CHARS_REGEXP, '\\$&');

		// replace params in path expression
		this._regular = `^/${this._regular.replace(this.PARAMS_REGEXP, '([^/?]+)')}`;

		//adjust / => \/
		this._regular = this._regular.replace(/\//g, '\\\/');

		this._regular += '(?:\\?(?:.+=.+)(?:&.+=.+)*)?$';
	}

	/**
	 * Parse path and set params arguments from path.
	 *
	 * @method _parseArguments
	 * @private
	 * @param {String} path
	 * @param {Object} params
	 */
	_parseArguments(path, params) {
		var paramsValue = path.match(this._regular);
		var paramsKey = this._loosesPathExpression.match(this._regular);

		if (this._isParamsInPathExpression && paramsValue && paramsKey) {

			for (var i = 0; i < paramsKey.length; i++) {

				if (paramsKey[i] && paramsKey[i] !== this._loosesPathExpression) {
					var key = paramsKey[i].replace(':', '');
					var value = decodeURIComponent(paramsValue[i]);
					params[key] = value;
				}

			}
		}
	}

	/**
	 * Parse path and set params query from path.
	 *
	 * @method _parseQuery
	 * @private
	 * @param {String} path
	 * @param {Object} params
	 */
	_parseQuery(path, params) {
		var queryMatched = path.match(/\?(.*)$/);

		if (queryMatched && queryMatched[1]) {
			var queryPairs = queryMatched[1].split('&');

			for (var query of queryPairs) {
				var pair = query.split('=');
				params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
			}
		}
	}

	/**
	 * Return looses path for last one slash.
	 *
	 * @method getLoosesPath
	 * @private
	 * @param {String} path
	 * @return {String}
	 */
	_getLoosesPath(path) {
		return `/${path.replace(this.LOOSE_SLASHES_REGEXP, '')}`;
	}

}

ns.Core.Router.Route = Route;