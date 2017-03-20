import ns from '../namespace';
import MapStorage from './MapStorage';
import Storage from './Storage';
import GenericError from '../error/GenericError';
import Request from '../router/Request';
import Response from '../router/Response';
import Window from '../window/Window';

ns.namespace('ima.storage');

/**
 * Implementation note: This is the largest possible safe value that has been
 * tested, used to represent "infinity".
 *
 * @const
 * @type {Date}
 */
const MAX_EXPIRE_DATE = new Date('Sat Sep 13 275760 00:00:00 GMT+0000 (UTC)');

/**
 * Separator used to separate cookie declarations in the {@code Cookie} HTTP
 * header or the return value of the {@code document.cookie} property.
 *
 * @const
 * @type {string}
 */
const COOKIE_SEPARATOR = '; ';

/**
 * Storage of cookies, mirroring the cookies to the current request / response
 * at the server side and the {@code document.cookie} property at the client
 * side. The storage caches the cookies internally.
 */
export default class CookieStorage extends MapStorage {

	static get $dependencies() {
		return [Window, Request, Response];
	}

	/**
	 * Initializes the cookie storage.
	 *
	 * @param {Window} window The window utility.
	 * @param {Request} request The current HTTP request.
	 * @param {Response} response The current HTTP response.
	 * @example
	 *      cookie.set('cookie', 'value', { expires: 10 }); // cookie expires
	 *                                                      // after 10s
	 *      cookie.set('cookie'); // delete cookie
	 *
	 */
	constructor(window, request, response) {
		super();

		/**
		 * The window utility used to determine whether the IMA is being run
		 * at the client or at the server.
		 *
		 * @type {Window}
		 */
		this._window = window;

		/**
		 * The current HTTP request. This field is used at the server side.
		 *
		 * @type {Request}
		 */
		this._request = request;

		/**
		 * The current HTTP response. This field is used at the server side.
		 *
		 * @type {Response}
		 */
		this._response = response;

		/**
		 * The overriding cookie attribute values.
		 *
		 * @type {{
		 *         path: string,
		 *         secure: boolean,
		 *         httpOnly: boolean,
		 *         domain: string,
		 *         expires: ?(number|Date),
		 *         maxAge: ?number
		 *       }}
		 */
		this._options = {
			path: '/',
			expires: null,
			maxAge: null,
			secure: false,
			httpOnly: false,
			domain: ''
		};

		/**
		 * Transform encode and decode functions for cookie value.
		 *
		 * @type {{
		 *         encode: function(string): string,
		 *         decode: function(string): string
		 *       }}
		 */
		this._transformFunction = {
			encode: (value) => value,
			decode: (value) => value
		};
	}

	/**
	 * @inheritdoc
	 * @param {{
	 *          path: string=,
	 *          secure: boolean=,
	 *          httpOnly: boolean=,
	 *          domain: string=,
	 *          expires: ?(number|Date)=,
	 *          maxAge: ?number=
	 *        }} options
	 * @param {{
	 *          encode: function(string): string=,
	 *          decode: function(string): string=
	 *        }} transformFunction
	 */
	init(options = {}, transformFunction = {}) {
		this._transformFunction = Object.assign(
			this._transformFunction,
			transformFunction
		);
		this._options = Object.assign(this._options, options);
		this._parse();

		return this;
	}

	/**
	 * @inheritdoc
	 */
	has(name) {
		return super.has(name);
	}

	/**
	 * @inheritdoc
	 */
	get(name) {
		if (super.has(name)) {
			return super.get(name).value;
		} else {
			return undefined;
		}
	}

	/**
	 * @inheritdoc
	 * @param {string} name The key identifying the storage entry.
	 * @param {*} value The storage entry value.
	 * @param {{
	 *          maxAge: number=,
	 *          expires: (string|Date)=,
	 *          domain: string=,
	 *          path: string=,
	 *          httpOnly: boolean=,
	 *          secure: boolean=
	 *        }=} options The cookie options. The {@code maxAge} is the maximum
	 *        age in seconds of the cookie before it will be deleted, the
	 *        {@code expires} is an alternative to that, specifying the moment
	 *        at which the cookie will be discarded. The {@code domain} and
	 *        {@code path} specify the cookie's domain and path. The
	 *        {@code httpOnly} and {@code secure} flags set the flags of the
	 *        same name of the cookie.
	 */
	set(name, value, options = {}) {
		options = Object.assign({}, this._options, options);

		if (value === undefined) {
			// Deletes the cookie
			options.maxAge = 0;
			options.expires = this._getExpirationAsDate(-1);
		} else {
			this._recomputeCookieMaxAgeAndExpires(options);
		}

		value = this._sanitizeCookieValue(value + '');

		if (this._window.isClient()) {
			document.cookie = this._generateCookieString(name, value, options);
		} else {
			this._response.setCookie(name, value, options);
		}
		super.set(name, { value, options });

		return this;
	}

	/**
	 * Deletes the cookie identified by the specified name.
	 *
	 * @param {string} name Name identifying the cookie.
	 * @param {{
	 *          domain: string=,
	 *          path: string=,
	 *          httpOnly: boolean=,
	 *          secure: boolean=
	 *        }=} options The cookie options. The {@code domain} and
	 *        {@code path} specify the cookie's domain and path. The
	 *        {@code httpOnly} and {@code secure} flags set the flags of the
	 *        same name of the cookie.
	 * @return {Storage} This storage.
	 */
	delete(name, options = {}) {
		if (this.has(name)) {
			this.set(name, undefined, options);
			super.delete(name);
		}

		return this;
	}

	/**
	 * @inheritdoc
	 */
	clear() {
		for (let cookieName of super.keys()) {
			this.delete(cookieName);
		}

		return super.clear();
	}

	/**
	 * @inheritdoc
	 */
	keys() {
		return super.keys();
	}

	/**
	 * @inheritdoc
	 */
	size() {
		return super.size();
	}

	/**
	 * Returns all cookies in this storage serialized to a string compatible
	 * with the {@code Cookie} HTTP header.
	 *
	 * @return {string} All cookies in this storage serialized to a string
	 *         compatible with the {@code Cookie} HTTP header.
	 */
	getCookiesStringForCookieHeader() {
		let cookieStrings = [];

		for (let cookieName of super.keys()) {
			let cookieItem = super.get(cookieName);

			cookieStrings.push(this._generateCookieString(
				cookieName,
				cookieItem.value,
				{}
			));
		}

		return cookieStrings.join(COOKIE_SEPARATOR);
	}

	/**
	 * Parses cookies from the provided {@code Set-Cookie} HTTP header value.
	 *
	 * The parsed cookies will be set to the internal storage, and the current
	 * HTTP response (via the {@code Set-Cookie} HTTP header) if at the server
	 * side, or the browser (via the {@code document.cookie} property).
	 *
	 * @param {string} setCookieHeader The value of the {@code Set-Cookie} HTTP
	 *        header.
	 */
	parseFromSetCookieHeader(setCookieHeader) {
		let cookie = this._extractCookie(setCookieHeader);

		if (cookie.name !== null) {
			this.set(cookie.name, cookie.value, cookie.options);
		}
	}

	/**
	 * Parses cookies from a cookie string and sets the parsed cookies to the
	 * internal storage.
	 *
	 * The method obtains the cookie string from the request's {@code Cookie}
	 * HTTP header when used at the server side, and the {@code document.cookie}
	 * property at the client side.
	 */
	_parse() {
		let cookiesString = this._window.isClient() ?
			document.cookie : this._request.getCookieHeader();
		let cookiesArray = cookiesString ?
			cookiesString.split(COOKIE_SEPARATOR) : [];

		for (let i = 0; i < cookiesArray.length; i++) {
			let cookie = this._extractCookie(cookiesArray[i]);

			if (cookie.name !== null) {
				cookie.options = Object.assign(
					{},
					this._options,
					cookie.options
				);

				super.set(cookie.name, {
					value: this._sanitizeCookieValue(cookie.value),
					options: cookie.options
				});
			}
		}
	}

	/**
	 * Creates a copy of the provided word (or text) that has its first
	 * character converted to lower case.
	 *
	 * @param {string} word The word (or any text) that should have its first
	 *        character converted to lower case.
	 * @return {string} A copy of the provided string with its first character
	 *         converted to lower case.
	 */
	_firstLetterToLowerCase(word) {
		return word.charAt(0).toLowerCase() + word.substring(1);
	}

	/**
	 * Generates a string representing the specified cookied, usable either
	 * with the {@code document.cookie} property or the {@code Set-Cookie} HTTP
	 * header.
	 *
	 * (Note that the {@code Cookie} HTTP header uses a slightly different
	 * syntax.)
	 *
	 * @param {string} name The cookie name.
	 * @param {(boolean|number|string)} value The cookie value, will be
	 *        converted to string.
	 * @param {{
	 *          path: string=,
	 *          domain: string=,
	 *          expires: Date=,
	 *          maxAge: Number=,
	 *          secure: boolean=
	 *        }} options Cookie attributes. Only the attributes listed in the
	 *        type annotation of this field are supported. For documentation
	 *        and full list of cookie attributes see
	 *        http://tools.ietf.org/html/rfc2965#page-5
	 * @return {string} A string representing the cookie. Setting this string
	 *         to the {@code document.cookie} property will set the cookie to
	 *         the browser's cookie storage.
	 */
	_generateCookieString(name, value, options) {
		let cookieString = name + '=' + this._transformFunction.encode(value);

		cookieString += options.domain ? ';Domain=' + options.domain : '';
		cookieString += options.path ? ';Path=' + options.path : '';
		cookieString += options.expires ?
				';Expires=' + options.expires.toUTCString() : '';
		cookieString += options.maxAge ? ';Max-Age=' + options.maxAge : '';
		cookieString += options.httpOnly ? ';HttpOnly' : '';
		cookieString += options.secure ? ';Secure' : '';

		return cookieString;
	}

	/**
	 * Converts the provided cookie expiration to a {@code Date} instance.
	 *
	 * @param {(number|string|Date)} expiration Cookie expiration in seconds
	 *        from now, or as a string compatible with the {@code Date}
	 *        constructor.
	 * @return {Date} Cookie expiration as a {@code Date} instance.
	 */
	_getExpirationAsDate(expiration) {
		if (expiration instanceof Date) {
			return expiration;
		}

		if (typeof expiration === 'number') {
			return expiration === Infinity ?
				MAX_EXPIRE_DATE : new Date(Date.now() + expiration * 1000);
		}

		return expiration ? new Date(expiration) : MAX_EXPIRE_DATE;
	}

	/**
	 * Extract cookie name, value and options from cookie string.
	 *
	 * @param {string} cookieString The value of the {@code Set-Cookie} HTTP
	 *        header.
	 * @return {{
	 *           name: ?string,
	 *           value: ?string,
	 *           options: Object<string, (boolean|Date)>
	 *         }}
	 */
	_extractCookie(cookieString) {
		let cookieOptions = {};
		let cookieName = null;
		let cookieValue = null;

		let cookiePairs = cookieString.split(COOKIE_SEPARATOR.trim());

		cookiePairs.forEach((pair, index) => {
			let [name, value] = this._extractNameAndValue(pair, index);

			if (index === 0) {
				cookieName = name;
				cookieValue = value;
			} else {
				cookieOptions[name] = value;
			}
		});

		return {
			name: cookieName,
			value: cookieValue,
			options: cookieOptions
		};
	}

	/**
	 * Extract name and value for defined pair and pair index.
	 *
	 * @param {string} pair
	 * @param {number} pairIndex
	 * @return {Array<?(boolean|string|Date)>}
	 */
	_extractNameAndValue(pair, pairIndex) {
		let separatorIndexEqual = pair.indexOf('=');
		let name = '';
		let value = null;

		if (pairIndex === 0 && separatorIndexEqual < 0) {
			return [null, null];
		}

		if (separatorIndexEqual < 0) {
			name = pair.trim();
			value = true;
		} else {
			name = pair.substring(0, separatorIndexEqual).trim();

			value = this._transformFunction.decode(
				pair.substring(separatorIndexEqual + 1).trim()
			);

			// erase quoted values
			if ('"' === value[0]) {
				value = value.slice(1, -1);
			}

			if (name === 'Expires') {
				value = this._getExpirationAsDate(value);
			}

			if (name === 'Max-Age') {
				name = 'maxAge';
				value = parseInt(value, 10);
			}
		}

		if (pairIndex !== 0) {
			name = this._firstLetterToLowerCase(name);
		}

		return [
			name,
			value
		];
	}

	/**
	 * Sanitize cookie value by rules in
	 * (@see http://tools.ietf.org/html/rfc6265#section-4r.1.1). Erase all
	 * invalid characters from cookie value.
	 *
	 * @param {string} value Cookie value
	 * @return {string} Sanitized value
	 */
	_sanitizeCookieValue(value) {
		let sanitizedValue = '';

		for (let keyChar = 0; keyChar < value.length; keyChar++) {
			let charCode = value.charCodeAt(keyChar);
			let char = value[keyChar];

			let isValid =
					(charCode >= 33) &&
					(charCode <= 126) &&
					(char !== '"') &&
					(char !== ';') &&
					(char !== '\\');
			if (isValid) {
				sanitizedValue += char;
			} else {
				if ($Debug) {
					throw new GenericError(
						`Invalid char ${char} code ${charCode} in ${value}. ` +
						`Dropping the invalid character from the cookie's ` +
						`value.`,
						{ value, charCode, char }
					);
				}
			}
		}

		return sanitizedValue;
	}

	/**
	 * Recomputes cookie's attributes maxAge and expires between each other.
	 *
	 * @param {{
	 *          path: string=,
	 *          domain: string=,
	 *          expires: Date=,
	 *          maxAge: Number=,
	 *          secure: boolean=
	 *        }} options Cookie attributes. Only the attributes listed in the
	 *        type annotation of this field are supported. For documentation
	 *        and full list of cookie attributes see
	 *        http://tools.ietf.org/html/rfc2965#page-5
	 */
	_recomputeCookieMaxAgeAndExpires(options) {
		if (options.maxAge || options.expires) {
			options.expires = this._getExpirationAsDate(
				options.maxAge || options.expires);
		}

		if (!options.maxAge && options.expires) {
			options.maxAge = Math.floor(
				(options.expires.valueOf() - Date.now()) / 1000);
		}
	}
}

ns.ima.storage.CookieStorage = CookieStorage;
