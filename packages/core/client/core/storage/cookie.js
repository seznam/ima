import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Storage');

/**
 * Cookie storage.
 *
 * @class Cookie
 * @extends Core.Interface.Storage
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Core.Router.Request
 * @requires Core.Router.Respond
 */
class Cookie extends ns.Core.Interface.Storage{

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Router.Request} request
	 * @param {Core.Router.Response} response
	 * @param {Boolean} secure - flag for secure cookie
	 * @example
	 *      cookie.set('cookie', 'value', {expires: 10}); //cookie expires for 10s
	 *      cookie.set('cookie'); //unset cookie
	 *
	 */
	constructor(request, response, secure) {
		super();

		/**
		 * @property _response
		 * @private
		 * @type {Core.Router.Response}
		 * @default response
		 */
		this._response = response;

		/**
		 * @property _request
		 * @private
		 * @type {Core.Router.Request}
		 * @default request
		 */
		this._request = request;

		/**
		 * @property _cookie
		 * @private
		 * @type {Map}
		 * @default new Map()
		 */
		this._cookie = new Map();

		/**
		 * Array of cookies string.
		 *
		 * @property _arrayCookiesString
		 * @private
		 * @type {Array}
		 * @default []
		 */
		this._arrayCookiesString = [];

		/**
		 * @property _cookieSeparotor
		 * @private
		 * @type {String}
		 * @default '; '
		 */
		this._cookieSeparotor = '; ';

		/**
		 * @property MAX_EXPIRE_DATE
		 * @type {Date}
		 * @const
		 * @default new Date('Fri, 31 Dec 9999 23:59:59 UTC')
		 */
		this.MAX_EXPIRE_DATE = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

		/**
		 * @property options
		 * @private
		 * @type {Object}
		 */
		this._options = {
			path: '/',
			secure: secure
		};
	}

	/**
	 * Initialization cookie.
	 *
	 * @method init
	 */
	init() {
		this._parse();
	}

	/**
	 * Clear all cookies.
	 *
	 * @method clear
	 * @chainable
	 */
	clear() {
		for (var cookieName of this._cookie.keys()) {
			this.delete(cookieName);
		}

		this._cookie.clear();

		return this;
	}

	/**
	 * Return true if cookie exist.
	 *
	 * @method has
	 * @param {String} name
	 * @return {Boolean}
	 */
	has(name) {
		return this._cookie.has(name);
	}

	/**
	 * Return value from storage for name.
	 *
	 * @method get
	 * @param {String} name
	 * @return {*}
	 */
	get(name) {
		return this._cookie.get(name);
	}

	/**
	 * Set cookie for name.
	 *
	 * @method set
	 * @chainable
	 * @param {String} name
	 * @param {*} value
	 * @param {Object} [options={}] possibility options keys {path, secure, domain, expires}
	 */
	set(name, value, options = {}) {
		options = Object.assign(options, this._options);
		options.expires = this._getExpiresDate(value === undefined ? -1 : options.expires);

		var cookieString = this._generateCookieString(name, value, options);

		this._arrayCookiesString.push(cookieString);

		if (this._response.isEnabled()) {
			this._response.setCookie(name, value, options);
		} else {
			document.cookie = cookieString;
		}
		this._cookie.set(name, value);
		return this;
	}

	/**
	 * Delete cookie for name.
	 *
	 * @method delete
	 * @chainable
	 * @param {String} name
	 */
	delete(name) {
		if (this.has(name)) {
			this.set(name);
			this._cookie.delete(name);
		}

		return this;
	}

	/**
	 * Return all defined cookie keys.
	 *
	 * @method keys
	 * return {Iterable}
	 */
	keys() {
		return this._cookie.keys();
	}

	/**
	 * Get cookies string.
	 *
	 * @method getCookiesString
	 * @return {String}
	 */
	getCookiesString() {
		return this._arrayCookiesString.join(this._cookieSeparotor);
	}

	/**
	 * Parse cookie from source.
	 *
	 * @method _parse
	 * @private
	 */
	_parse() {
		var cookiesString = this._request.isEnabled() ? this._request.getCookie() : document.cookie;
		var cookiesArray = cookiesString ? cookiesString.split(this._cookieSeparotor) : [];

		this._arrayCookiesString = cookiesArray;

		for (var i = 0; i < cookiesArray.length; i++) {
			this._parseKeyValueFromCookieString(cookiesArray[i]);
		}
	}

	/**
	 * Parse key and value from cookie string.
	 *
	 * @method _parseKeyValueFromCookieString
	 * @private
	 * @param {String} cookieString
	 */
	_parseKeyValueFromCookieString(cookieString) {
		var separatorIndexEqual = cookieString.indexOf('=');
		var separatorIndexSemicolon = cookieString.indexOf(';');

		separatorIndexSemicolon = separatorIndexSemicolon < 0 ? (cookieString.length - separatorIndexEqual - 1) : (separatorIndexSemicolon - separatorIndexEqual -1);

		if (separatorIndexEqual > 0) {
			var name = decodeURIComponent(cookieString.substr(0, separatorIndexEqual));
			var value = decodeURIComponent(cookieString.substr(separatorIndexEqual + 1, separatorIndexSemicolon));

			this._cookie.set(name, value);
		}
	}

	/**
	 * Parse cookie from header Set-Cookie.
	 *
	 * @method parseFromSetCookieHeader
	 * @param {String} setCookieHeader
	 */
	parseFromSetCookieHeader(setCookieHeader) {
		var cookieOptions = this._options;
		cookieOptions.expires = this.MAX_EXPIRE_DATE;
		cookieOptions.httpOnly = false;

		var cookiePairs = setCookieHeader.split('; ');
		var cookieName = null;
		var cookieValue = null;

		cookiePairs.forEach((pair) => {
			var separatorIndexEqual =  pair.indexOf('=');
			var name = decodeURIComponent(this._firstLetterToLowerCase(pair.substr(0, separatorIndexEqual)));
			var value = decodeURIComponent(pair.substr(separatorIndexEqual + 1));

			if (cookieOptions[name]) {
				var cookieExpires = new Date(value);

				if (isNaN(cookieExpires.getTime())) {
					cookieOptions[name] = value;
				} else {
					cookieOptions[name] = cookieExpires;
				}

			} else {
				cookieName = name;
				cookieValue = value;
			}
		});

		this.set(cookieName, cookieValue, cookieOptions);
	}

	/**
	 * Return string with first letter lower case.
	 *
	 * @method _firstLetterToLowerCase
	 * @private
	 * @param {String} world
	 */
	_firstLetterToLowerCase(world) {
		return world.charAt(0).toLowerCase() + world.slice(1);
	}

	/**
	 * Return cookie string.
	 *
	 * @method _generateCookieString
	 * @private
	 * @param {String} name
	 * @param {*} value
	 * @param {Object} options
	 * @return {String}
	 */
	_generateCookieString(name, value, options) {
		name = name.replace(/[^#$&+\^`|]/g, encodeURIComponent);
		name = name.replace(/\(/g, '%28').replace(/\)/g, '%29');
		value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);

		var cookieString = name + '=' + value;
		cookieString += options.path ? ';path=' + options.path : '';
		cookieString += options.domain ? ';domain=' + options.domain : '';
		cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
		cookieString += options.secure ? ';secure' : '';

		return cookieString;
	}
	
	/**
	 * Return expires date for cookie.
	 *
	 * @method _getExpiresDate
	 * @private
	 * @param {Number} expires - in seconds
	 * @return {Date}
	 */
	_getExpiresDate(expires) {
		var now = new Date();

		if (typeof expires === 'number') {
			expires = expires === Infinity ? this.MAX_EXPIRE_DATE : new Date(now.getTime() + expires * 1000);
		} else {
			expires = expires ? new Date(expires) : this.MAX_EXPIRE_DATE;
		}

		return expires;
	}
}

ns.Core.Storage.Cookie = Cookie;