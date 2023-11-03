import memoizeOne from 'memoize-one';

import { Storage } from './Storage';
import { GenericError } from '../error/GenericError';
import { Dependencies } from '../oc/ObjectContainer';
import { Request } from '../router/Request';
import { Response } from '../router/Response';
import { Window } from '../window/Window';

/**
 * Implementation note: This is the largest possible safe value that has been
 * tested, used to represent "infinity".
 */
const MAX_EXPIRE_DATE = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

/**
 * Separator used to separate cookie declarations in the `Cookie` HTTP
 * header or the return value of the `document.cookie` property.
 */
const COOKIE_SEPARATOR = '; ';

export type CookieOptions = {
  domain?: string;
  expires?: number | Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: string;
  secure?: boolean;
  partitioned?: boolean;
};

export type Cookie = {
  options: CookieOptions;
  value: string | number | boolean | Date | undefined;
};

/**
 * Storage of cookies, mirroring the cookies to the current request / response
 * at the server side and the `document.cookie` property at the client
 * side. The storage caches the cookies internally.
 */
export class CookieStorage extends Storage<Cookie['value']> {
  /**
   * The window utility used to determine whether the IMA is being run
   * at the client or at the server.
   */
  private _window: Window;

  /**
   * The current HTTP request. This field is used at the server side.
   */
  private _request: Request;

  /**
   * The current HTTP response. This field is used at the server side.
   */
  private _response: Response;

  /**
   * The internal storage of entries.
   */
  private _storage: Map<string, Cookie> = new Map();

  /**
   * The overriding cookie attribute values.
   */
  private _options: CookieOptions = {
    path: '/',
    expires: undefined,
    maxAge: undefined,
    secure: false,
    partitioned: false,
    httpOnly: false,
    domain: '',
    sameSite: 'Lax',
  };

  /**
   * Transform encode and decode functions for cookie value.
   */
  private _transformFunction: {
    encode: (value: string) => string;
    decode: (value: string) => string;
  } = {
    encode: value => value,
    decode: value => value,
  };

  /**
   * Memoized function of private parseRawCookies function
   */
  #memoParseRawCookies = memoizeOne(this.#parseRawCookies);

  static get $dependencies(): Dependencies {
    return [Window, Request, Response];
  }

  /**
   * Initializes the cookie storage.
   *
   * @param window The window utility.
   * @param request The current HTTP request.
   * @param response The current HTTP response.
   * @example
   *      cookie.set('cookie', 'value', { expires: 10 }); // cookie expires
   *                                                      // after 10s
   *      cookie.set('cookie'); // delete cookie
   *
   */
  constructor(window: Window, request: Request, response: Response) {
    super();

    this._window = window;
    this._request = request;
    this._response = response;
  }

  /**
   * @inheritDoc
   */
  init(options: CookieOptions = {}, transformFunction = {}): this {
    this._transformFunction = Object.assign(
      this._transformFunction,
      transformFunction
    );
    this._options = Object.assign(this._options, options);
    this.parse();

    return this;
  }

  /**
   * @inheritDoc
   */
  has(name: string): boolean {
    this.parse();

    return this._storage.has(name);
  }

  /**
   * @inheritDoc
   */
  get(name: string): Cookie['value'] {
    this.parse();

    return this._storage.has(name) ? this._storage.get(name)!.value : undefined;
  }

  /**
   * @inheritDoc
   * @param name The key identifying the storage entry.
   * @param value The storage entry value.
   * @param options The cookie options. The `maxAge` is the maximum
   *        age in seconds of the cookie before it will be deleted, the
   *        `expires` is an alternative to that, specifying the moment
   *        at which the cookie will be discarded. The `domain` and
   *        `path` specify the cookie's domain and path. The
   *        `httpOnly` and `secure` flags set the flags of the
   *        same name of the cookie.
   */
  set(name: string, value: Cookie['value'], options: CookieOptions = {}): this {
    options = Object.assign({}, this._options, options);

    if (value === undefined) {
      // Deletes the cookie
      options.maxAge = 0;
      options.expires = this.getExpirationAsDate(-1);
    } else {
      this.recomputeCookieMaxAgeAndExpires(options);
    }

    value = this.sanitizeCookieValue(value + '');

    if (this._window.isClient()) {
      document.cookie = this.#generateCookieString(name, value, options);
    } else {
      this._response.setCookie(name, value, options);
    }

    this._storage.set(name, { value, options });

    return this;
  }

  /**
   * Deletes the cookie identified by the specified name.
   *
   * @param name Name identifying the cookie.
   * @param options The cookie options. The `domain` and
   *        `path` specify the cookie's domain and path. The
   *        `httpOnly` and `secure` flags set the flags of the
   *        same name of the cookie.
   * @return This storage.
   */
  delete(name: string, options: CookieOptions = {}): this {
    if (this._storage.has(name)) {
      this.set(name, undefined, options);
      this._storage.delete(name);
    }

    return this;
  }

  /**
   * @inheritDoc
   */
  clear(): this {
    for (const cookieName of this._storage.keys()) {
      this.delete(cookieName);
    }

    this._storage.clear();

    return this;
  }

  /**
   * @inheritDoc
   */
  keys(): Iterable<string> {
    this.parse();

    return this._storage.keys();
  }

  /**
   * @inheritDoc
   */
  size(): number {
    this.parse();

    return this._storage.size;
  }

  /**
   * Returns all cookies in this storage serialized to a string compatible
   * with the `Cookie` HTTP header.
   *
   * @return All cookies in this storage serialized to a string
   *         compatible with the `Cookie` HTTP header.
   */
  getCookiesStringForCookieHeader(): string {
    const cookieStrings = [];

    for (const cookieName of this._storage.keys()) {
      const cookieItem = this._storage.get(cookieName);

      cookieStrings.push(
        this.#generateCookieString(cookieName, cookieItem!.value, {})
      );
    }

    return cookieStrings.join(COOKIE_SEPARATOR);
  }

  /**
   * Parses cookies from the provided `Set-Cookie` HTTP header value.
   *
   * The parsed cookies will be set to the internal storage, and the current
   * HTTP response (via the `Set-Cookie` HTTP header) if at the server
   * side, or the browser (via the `document.cookie` property).
   *
   * @param setCookieHeader The value of the `Set-Cookie` HTTP
   *        header.
   */
  parseFromSetCookieHeader(setCookieHeader: string): void {
    const cookie = this.#extractCookie(setCookieHeader);

    if (typeof cookie.name === 'string') {
      this.set(cookie.name, cookie.value, cookie.options);
    }
  }

  /**
   * Parses cookies from a cookie string and sets the parsed cookies to the
   * internal storage.
   *
   * The method obtains the cookie string from the request's `Cookie`
   * HTTP header when used at the server side, and the `document.cookie`
   * property at the client side.
   */
  parse(): void {
    const cookiesNames = this.#memoParseRawCookies(
      this._window.isClient()
        ? document.cookie
        : this._request.getCookieHeader()
    );

    // remove cookies from storage, which were not parsed
    for (const storageCookieName of this._storage.keys()) {
      const index = cookiesNames.indexOf(storageCookieName);
      if (index === -1) {
        this._storage.delete(storageCookieName);
      }
    }
  }

  /**
   * Sanitize cookie value by rules in
   * (@see http://tools.ietf.org/html/rfc6265#section-4r.1.1). Erase all
   * invalid characters from cookie value.
   *
   * @param value Cookie value
   * @return Sanitized value
   */
  sanitizeCookieValue(value: Cookie['value']): string {
    let sanitizedValue = '';

    if (typeof value !== 'string') {
      return sanitizedValue;
    }

    for (let keyChar = 0; keyChar < value.length; keyChar++) {
      const charCode = value.charCodeAt(keyChar);
      const char = value[keyChar];

      const isValid =
        charCode >= 33 &&
        charCode <= 126 &&
        char !== '"' &&
        char !== ';' &&
        char !== '\\';
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
   * @param options Cookie attributes. Only the attributes listed in the
   *        type annotation of this field are supported. For documentation
   *        and full list of cookie attributes see
   *        http://tools.ietf.org/html/rfc2965#page-5
   */
  recomputeCookieMaxAgeAndExpires(options: CookieOptions): void {
    if (options.maxAge || options.expires) {
      options.expires = this.getExpirationAsDate(
        (options.maxAge || options.expires) as number | string | Date
      );
    }

    if (!options.maxAge && options.expires) {
      options.maxAge = Math.floor(
        (options.expires.valueOf() - Date.now()) / 1000
      );
    }
  }

  /**
   * Converts the provided cookie expiration to a `Date` instance.
   *
   * @param expiration Cookie expiration in seconds
   *        from now, or as a string compatible with the `Date`
   *        constructor.
   * @return Cookie expiration as a `Date` instance.
   */
  getExpirationAsDate(expiration: number | string | Date): Date {
    if (expiration instanceof Date) {
      return expiration;
    }

    if (typeof expiration === 'number') {
      return expiration === Infinity
        ? MAX_EXPIRE_DATE
        : new Date(Date.now() + expiration * 1000);
    }

    return expiration ? new Date(expiration) : MAX_EXPIRE_DATE;
  }

  #parseRawCookies(rawCookies: string | undefined): string[] {
    const cookiesArray = rawCookies ? rawCookies.split(COOKIE_SEPARATOR) : [];
    const cookiesNames: string[] = [];

    for (let i = 0; i < cookiesArray.length; i++) {
      const cookie = this.#extractCookie(cookiesArray[i]);

      if (typeof cookie.name === 'string') {
        // if cookie already exists in storage get its old options
        let oldCookieOptions = {};

        if (this._storage.has(cookie.name)) {
          oldCookieOptions = this._storage.get(cookie.name)!.options;
        }

        cookie.options = Object.assign(
          {},
          this._options, // default options
          oldCookieOptions, // old cookie options (if any)
          cookie.options // new cookie options (if any)
        );

        cookiesNames.push(cookie.name);

        // add new cookie or update existing one
        this._storage.set(cookie.name, {
          value: this.sanitizeCookieValue(cookie.value),
          options: cookie.options,
        });
      }
    }

    return cookiesNames;
  }

  /**
   * Creates a copy of the provided word (or text) that has its first
   * character converted to lower case.
   *
   * @param word The word (or any text) that should have its first
   *        character converted to lower case.
   * @return A copy of the provided string with its first character
   *         converted to lower case.
   */
  #firstLetterToLowerCase(word: string): string {
    return word.charAt(0).toLowerCase() + word.substring(1);
  }

  /**
   * Generates a string representing the specified cookie, usable either
   * with the `document.cookie` property or the `Set-Cookie` HTTP
   * header.
   *
   * (Note that the `Cookie` HTTP header uses a slightly different
   * syntax.)
   *
   * @param name The cookie name.
   * @param value The cookie value, will be
   *        converted to string.
   * @param options Cookie attributes. Only the attributes listed in the
   *        type annotation of this field are supported. For documentation
   *        and full list of cookie attributes see
   *        http://tools.ietf.org/html/rfc2965#page-5
   * @return A string representing the cookie. Setting this string
   *         to the `document.cookie` property will set the cookie to
   *         the browser's cookie storage.
   */
  #generateCookieString(
    name: string,
    value: Cookie['value'],
    options: CookieOptions
  ): string {
    let cookieString =
      name + '=' + this._transformFunction.encode(value as string);

    cookieString += options.domain ? ';Domain=' + options.domain : '';
    cookieString += options.path ? ';Path=' + options.path : '';
    cookieString += options.expires
      ? ';Expires=' + (options.expires as Date).toUTCString()
      : '';
    cookieString += options.maxAge ? ';Max-Age=' + options.maxAge : '';
    cookieString += options.httpOnly ? ';HttpOnly' : '';
    cookieString += options.secure ? ';Secure' : '';
    cookieString += options.partitioned ? ';Partitioned' : '';
    cookieString += options.sameSite ? ';SameSite=' + options.sameSite : '';

    return cookieString;
  }

  /**
   * Extract cookie name, value and options from cookie string.
   *
   * @param cookieString The value of the `Set-Cookie` HTTP
   *        header.
   */
  #extractCookie(cookieString: string): Cookie & { name?: string } {
    const cookieOptions: CookieOptions = {};
    let cookieName;
    let cookieValue;

    cookieString.split(COOKIE_SEPARATOR.trim()).forEach((pair, index) => {
      const [name, value] = this.#extractNameAndValue(pair, index);

      if (!name) {
        return;
      }

      if (index === 0) {
        cookieName = name;
        cookieValue = value;
      } else {
        Object.assign(cookieOptions, { [name]: value });
      }
    });

    return {
      name: cookieName,
      value: cookieValue,
      options: cookieOptions,
    };
  }

  /**
   * Extract name and value for defined pair and pair index.
   */
  #extractNameAndValue(
    pair: string,
    pairIndex: number
  ): [string | null, Cookie['value'] | null] {
    const separatorIndexEqual = pair.indexOf('=');
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
        value = this.getExpirationAsDate(value);
      }

      if (name === 'Max-Age') {
        name = 'maxAge';
        value = parseInt(value as string, 10);
      }
    }

    if (pairIndex !== 0) {
      name = this.#firstLetterToLowerCase(name);
    }

    return [name, value];
  }
}
