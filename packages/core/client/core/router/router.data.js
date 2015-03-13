import ns from 'core/namespace/ns.js';

ns.namespace('Core.Router');

/**
 * @class Data
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 * */
class Data{

	/**
	 * @method constructor
	 * @constructor
	 * @param {String} name
	 * @param {String} path
	 * @param {String} controller
	 * */
	constructor(name, path, controller) {
		/**
		 * @property ESCAPED_CHARS_REGEXP
		 * @const
		 * @type {RegExp}
		 * @default new RegExp('[\\.+*?\^$\[\](){}\/'#]','g')
		 * */
		this.ESCAPED_CHARS_REGEXP = new RegExp('[\\.+*?\^$\[\](){}\/\'#]','g');

		/**
		 * @property LOOSE_SLASHES_REGEXP
		 * @const
		 * @type {RegExp}
		 * @default new RegExp('^\/|\/$','g')
		 * */
		this.LOOSE_SLASHES_REGEXP = new RegExp('^\/|\/$','g');

		/**
		 * @property PARAMS_REGEXP
		 * @const
		 * @type {RegExp}
		 * @default new RegExp(':([a-zA-Z0-9_-]*)', 'g')
		 * */
		this.PARAMS_REGEXP = new RegExp(':([a-zA-Z0-9_-]*)', 'g');

		/**
		 * @property _name
		 * @private
		 * @type {String}
		 * @default name
		 * */
		this._name = name;

		/**
		 * @property _path
		 * @private
		 * @type {String}
		 * @default path
		 * */
		this._path = path;

		/**
		 * @property _loosesPath
		 * @private
		 * @type {String}
		 * @default this._path.replace(this.LOOSE_SLASHES_REGEXP, '')
		 * */
		this._loosesPath = this._getLoosesPath(this._path);


		/**
		 * @property _controller
		 * @private
		 * @type {String}
		 * @default controller
		 * */
		this._controller = controller;


		/**
		 * @property _isParamsInpath
		 * @private
		 * @type {Boolean}
		 * */
		this._isParamsInPath = !!this._path.match(this.PARAMS_REGEXP);

		/**
		 * @property _regular
		 * @private
		 * @type {String}
		 * @default ''
		 * */
		this._regular = '';


		this._createRegularForPath();
	}

	/**
	 * Create path for params.
	 *
	 * @method createPath
	 * @param {Object} [params=[]]
	 * */
	createPath(params = {}) {
		var path = this._path;
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
	 * */
	getName() {
		return this._name;
	}

	/**
	 * Create new instance of controller and return it.
	 *
	 * @method getController
	 * @return {Mixed}
	 * */
	getController() {
		return ns.oc.make(this._controller);
	}

	/**
	 * Return defined path.
	 *
	 * @method getPath
	 * @return {String}
	 * */
	getPath() {
		return this._path;
	}

	/**
	 * Return regular for path.
	 *
	 * @method getRegular
	 * @return {String}
	 * */
	getRegular() {
		return this._regular;
	}

	/**
	 * Return true if path is matched with regular.
	 *
	 * @method isMatch
	 * @return {Boolean}
	 * */
	isMatch(path) {
		path = this._getLoosesPath(path);
		return !!path.match(this._regular);
	}

	/**
	 * Return params from path.
	 *
	 * @method getParams
	 * @return {Object}
	 * */
	getParams(path) {
		var params = {};

		var loosesPath = this._getLoosesPath(path);
		this._parseArguments(loosesPath, params);
		this._parseQuery(loosesPath, params);

		return params;
	}

	/**
	 * Create regular expression for path.
	 *
	 * @method createRegularForPath
	 * @private
	 * */
	_createRegularForPath() {
		this._regular  = this._path.replace(this.LOOSE_SLASHES_REGEXP, '');
		this._regular = this._regular.replace(this.ESCAPED_CHARS_REGEXP, '\\$&');

		// replace params in path
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
	 * */
	_parseArguments(path, params) {
		var paramsValue = path.match(this._regular);
		var paramsKey = this._loosesPath.match(this._regular);

		if (this._isParamsInPath && paramsValue && paramsKey) {

			for (var i = 0; i < paramsKey.length; i++) {

				if (paramsKey[i] && paramsKey[i] !== this._loosesPath) {
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
	 * */
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
	 * */
	_getLoosesPath(path) {
		return `/${path.replace(this.LOOSE_SLASHES_REGEXP, '')}`;
	}

}

ns.Core.Router.Data = Data;