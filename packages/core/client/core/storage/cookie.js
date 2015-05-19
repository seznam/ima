import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Storage');

/**
 * Implementation note: while this is not the largest possible value for a
 * {@code Date} instance, it is considered "safe enough", because we don't
 * expect this code to be around by the year 10 000. For those whom it might be
 * of intereset, the largest value we know of is
 * {@code new Date('Sat Sep 13 275760 00:00:00 GMT+0000 (UTC)')}.
 *
 * @const
 * @property MAX_EXPIRE_DATE
 * @type {Date}
 */
const MAX_EXPIRE_DATE = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

/**
 * Separator used to separate cookie declarations in the {@code Cookie} HTTP
 * header or the return value of the {@code document.cookie} property.
 *
 * @const
 * @property COOKIE_SEPARATOR
 * @type {string}
 */
const COOKIE_SEPARATOR = '; ';

/**
 * Storage of cookies, mirroring the cookies to the current request / response
 * at the server side and the {@code document.cookie} property at the client
 * side. The storage caches the cookies internally.
 *
 * @class Cookie
 * @extends Core.Storage.Map
 * @namespace Core.Storage
 * @module Core
 * @submodule Core.Storage
 *
 * @requires Core.Router.Request
 * @requires Core.Router.Respond
 */
class Cookie extends ns.Core.Storage.Map {
	/**
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.Window} window The window utility.
	 * @param {Core.Router.Request} request The current HTTP request.
	 * @param {Core.Router.Response} response The current HTTP response.
	 * @example
	 *      cookie.set('cookie', 'value', {expires: 10}); // cookie expires after 10s
	 *      cookie.set('cookie'); // delete cookie
	 *
	 */
	constructor(window, request, response) {
		super();

		/**
		 * The window utility used to determine whether the core is being run at
		 * the client or at the server.
		 *
		 * @private
		 * @property _window
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * The current HTTP request. This field is used at the server side.
		 *
		 * @private
		 * @property _request
		 * @type {Core.Router.Request}
		 */
		this._request = request;

		/**
		 * The current HTTP response. This field is used at the server side.
		 *
		 * @private
		 * @property _response
		 * @type {Core.Router.Response}
		 */
		this._response = response;

		/**
		 * Cookies in this storage serialized into string compatible with the
		 * {@code Set-Cookie} HTTP header (each string contains only one cookie),
		 * and "deletion" cookie strings for cookies that were deleted from this
		 * storage.
		 *
		 * @private
		 * @property _arrayCookiesString
		 * @type {string[]}
		 */
		this._arrayCookiesString = [];

		/**
		 * The overriding cookie attribute values.
		 *
		 * @private
		 * @property options
		 * @type {{path: string, secure: boolean}}
		 */
		this._options = {
			path: '/',
			secure: false
		};
	}

	/**
	 * This method is used to finalize the initialization of the storage after
	 * the dependencies provided through the constructor are ready to be used.
	 *
	 * This method must be invoked only once and it must be the first method
	 * invoked on this instance.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method init
	 * @param {{path: string=, secure: boolean=}} [options={}]
	 * @return {Core.Interface.Storage}
	 */
	init(options = {}) {
		this._options = Object.assign(this._options, options);
		this._parse();

		return this;
	}

	/**
	 * Returns {@code true} if the specified cookie exists in this storage.
	 *
	 * Note that the method checks only for cookies known to this storage, it
	 * does not check for cookies set using other means (for example by
	 * manipulating the {@code document.cookie} property).
	 *
	 * @override
	 * @method has
	 * @param {string} name The name of the cookie to test for existence.
	 * @return {boolean} {@code true} if the specified cookie exists in this
	 *         storage.
	 */
	has(name) {
		return super.has(name);
	}

	/**
	 * Returns the value of the specified cookie from the storage. The method
	 * returns {@code undefined} if the cookie does not exist.
	 *
	 * @override
	 * @method get
	 * @param {string} name The cookie name.
	 * @return {(undefined|string)} The value of the cookie, or {@code undefined}
	 *         if the cookie does not exist.
	 */
	get(name) {
		return super.get(name);
	}

	/**
	 * Set cookie for name.
	 *
	 * @override
	 * @chainable
	 * @method set
	 * @param {string} name The cookie name.
	 * @param {(boolean|number|string)} value The cookie value, will be converted
	 *        to string.
	 * @param {{domain: string=, expires: (number|string)=}} [options={}]
	 *        Cookie attributes. Only the attributes listed in the type
	 *        annotation of this field are supported. For documentation and full
	 *        list of cookie attributes see
	 *        http://tools.ietf.org/html/rfc2965#page-5
	 * @return {Core.Storage.Cookie} This storage.
	 */
	set(name, value, options = {}) {
		options = Object.assign(options, this._options);
		var expiration = value === undefined ? -1 : options.expires;
		options.expires = this._getExpirationAsDate(expiration);

		var cookieString = this._generateCookieString(name, value, options);

		this._arrayCookiesString.push(cookieString);

		if (this._window.isClient()) {
			document.cookie = cookieString;
		} else {
			this._response.setCookie(name, value, options);
		}
		super.set(name, value + '');

		return this;
	}

	/**
	 * Deletes the the specified cookie from this storage, the current response
	 * and / or the browser.
	 *
	 * @override
	 * @chainable
	 * @method delete
	 * @param {string} name The name of the cookie to delete.
	 * @return {Core.Storage.Cookie} This storage.
	 */
	delete(name) {
		if (this.has(name)) {
			this.set(name);
			super.delete(name);
		}

		return this;
	}

	/**
	 * Deletes all cookies from this storage, the current response and / or the
	 * browser.
	 *
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Storage.Cookie} This storage.
	 */
	clear() {
		for (var cookieName of super.keys()) {
			this.delete(cookieName);
		}

		return super.clear();
	}

	/**
	 * Returns the names of all cookies in this storage.
	 *
	 * @override
	 * @method keys
	 * @return {Iterator<string>} An iterator for traversing the keys in this
	 *         storage. The iterator also implements the iterable protocol,
	 *         returning itself as its own iterator, allowing it to be used in a
	 *         {@code for..of} loop.
	 */
	keys() {
		return super.keys();
	}

	/**
	 * Returns all cookies in this storage serialized to a string compatible with
	 * the {@code Set-Cookie} HTTP header and the setter of the
	 * {@code document.cookie} property.
	 *
	 * @method getCookiesString
	 * @return {string} All cookies in this storage serialized to a string
	 *         compatible with the {@code Set-Cookie} HTTP header.
	 */
	getCookiesString() {
		return this._arrayCookiesString.join(COOKIE_SEPARATOR);
	}

	/**
	 * Parses cookies from the provided {@code Set-Cookie} HTTP header value.
	 *
	 * The parsed cookies will be set to the internal storage, and the current
	 * HTTP response (via the {@code Set-Cookie} HTTP header) if at the server
	 * side, or the browser (via the {@code document.cookie} property).
	 *
	 * @method parseFromSetCookieHeader
	 * @param {string} setCookieHeader The value of the {@code Set-Cookie} HTTP
	 *        header.
	 */
	parseFromSetCookieHeader(setCookieHeader) {
		var cookieOptions = this._options;
		cookieOptions.expires = MAX_EXPIRE_DATE;
		cookieOptions.httpOnly = false;

		var cookiePairs = setCookieHeader.split('; ');
		var cookieName = null;
		var cookieValue = null;

		cookiePairs.forEach((pair) => {
			var separatorIndexEqual = pair.indexOf('=');

			var parts = [
				this._firstLetterToLowerCase(pair.substring(0, separatorIndexEqual)),
				pair.substring(separatorIndexEqual + 1)
			];

			var [name, value] = parts.map(decodeURIComponent);

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
	 * Parses cookies from a cookie string and sets the parsed cookies to the
	 * internal storage.
	 *
	 * The method obtains the cookie string from the request's {@code Cookie}
	 * HTTP header when used at the server side, and the {@code document.cookie}
	 * property at the client side.
	 *
	 * @private
	 * @method _parse
	 */
	_parse() {
		var cookiesString = this._window.isClient() ?
			document.cookie : this._request.getCookieHeader();
		var cookiesArray = cookiesString ?
			cookiesString.split(COOKIE_SEPARATOR) : [];

		this._arrayCookiesString = cookiesArray;

		for (var i = 0; i < cookiesArray.length; i++) {
			this._parseKeyValueFromCookieString(cookiesArray[i]);
		}
	}

	/**
	 * Parses the string representing a single cookie and sets the cookie to the
	 * internal cookie storage.
	 *
	 * @private
	 * @method _parseKeyValueFromCookieString
	 * @param {string} cookieString A string containing the definintion of a
	 *        single cookie, as used in the {@code Cookie} HTTP header or the
	 *        value returned by the {@code document.cookie} property.
	 */
	_parseKeyValueFromCookieString(cookieString) {
		var assignIndex = cookieString.indexOf('=');
		var semicolonIndex = cookieString.indexOf(';');

		semicolonIndex = semicolonIndex < 0 ?
			cookieString.length : semicolonIndex;

		if (assignIndex > 0) {
			var parts = [
				cookieString.substring(0, assignIndex),
				cookieString.substring(assignIndex + 1, semicolonIndex)
			];

			var [name, value] = parts.map(decodeURIComponent);

			super.set(name, value);
		}
	}

	/**
	 * Creates a copy of the provided word (or text) that has its first character
	 * converted to lower case.
	 *
	 * @private
	 * @method _firstLetterToLowerCase
	 * @param {string} word The word (or any text) that should have its first
	 *        character converted to lower case.
	 * @return {string} A copy of the provided string with its first character
	 *         converted to lower case.
	 */
	_firstLetterToLowerCase(word) {
		return word.charAt(0).toLowerCase() + word.substring(1);
	}

	/**
	 * Generates a string representing the specified cookied, usable either with
	 * the {@code document.cookie} property or the {@code Set-Cookie} HTTP
	 * header.
	 *
	 * (Note that the {@code Cookie} HTTP header uses a slightly different
	 * syntax.)
	 *
	 * @private
	 * @method _generateCookieString
	 * @param {string} name The cookie name.
	 * @param {(boolean|number|string)} value The cookie value, will be converted
	 *        to string.
	 * @param {{path: string=, domain: string=, expires: (number|string)=, secure: boolean=}} options
	 *        Cookie attributes. Only the attributes listed in the type
	 *        annotation of this field are supported. For documentation and full
	 *        list of cookie attributes see
	 *        http://tools.ietf.org/html/rfc2965#page-5
	 * @return {string} A string representing the cookie. Setting this string to
	 *         the {@code document.cookie} property will set the cookie to the
	 *         browser's cookie storage.
	 */
	_generateCookieString(name, value, options) {
		name = name.replace(/[^#$&+\^`|]/g, encodeURIComponent);
		name = name.replace(/\(/g, '%28').replace(/\)/g, '%29');
		value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);

		var cookieString = name + '=' + value;
		cookieString += options.path ? ';path=' + options.path : '';
		cookieString += options.domain ? ';domain=' + options.domain : '';
		cookieString += options.expires ?
		';expires=' + options.expires.toUTCString() : '';
		cookieString += options.secure ? ';secure' : '';

		return cookieString;
	}

	/**
	 * Converts the provided cookie expiration to a {@code Date} instance.
	 *
	 * @private
	 * @method _getExpirationAsDate
	 * @param {(number|string)} expiration Cookie expiration in seconds from now,
	 *        or as a string compatible with the {@code Date} constructor.
	 * @return {Date} Cookie expiration as a {@code Date} instance.
	 */
	_getExpirationAsDate(expiration) {
		if (typeof expiration === 'number') {
			return expiration === Infinity ?
				MAX_EXPIRE_DATE : new Date(Date.now() + (expiration * 1000));
		}

		return expiration ? new Date(expiration) : MAX_EXPIRE_DATE;
	}
}

ns.Core.Storage.Cookie = Cookie;
