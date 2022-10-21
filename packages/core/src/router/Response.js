/* @if client **
export default class Response {};
/* @else */
import GenericError from '../error/GenericError';

/**
 * Wrapper for the ExpressJS response, exposing only the necessary minimum.
 */
export default class Response {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the response.
   */
  constructor() {
    /**
     * The ExpressJS response object, or `null` if running at the
     * client side.
     *
     * @type {?Express.Response}
     */
    this._response = null;

    /**
     * Internal cookie storage for Set-Cookie header.
     *
     * @type {Map<string, {
     *         value: string,
     *         options: {domain: string=, expires: (number|string)=}
     *       }>}
     */
    this._internalCookieStorage = new Map();

    /**
     * Internal http storage headers.
     *
     * @type {Object<string, *>}
     */
    this._internalHeadersStorage = {};

    /**
     * Transform function for cookie value.
     *
     * @type {{encode: function, decode: function}}
     */
    this._cookieTransformFunction = {
      encode: value => value,
      decode: value => value,
    };
  }

  /**
   * Initializes this response wrapper with the provided ExpressJS response
   * object.
   *
   * @param {?Express.Response} response The ExpressJS response, or
   *        `null` if the code is running at the client side.
   * @param {{
   *          encode: function(string): string=,
   *          decode: function(string): string
   *        }=} cookieTransformFunction
   * @return {ima.core.router.Response} This response.
   */
  init(response, cookieTransformFunction = {}) {
    this._cookieTransformFunction = Object.assign(
      this._cookieTransformFunction,
      cookieTransformFunction
    );
    this._response = response;
    this._internalCookieStorage = new Map();
    this._internalHeadersStorage = {};

    return this;
  }

  /**
   * Redirects the client to the specified location, with the specified
   * redirect HTTP response code.
   *
   * For full list of HTTP response status codes see
   * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   *
   * Use this method only at the server side.
   *
   * @param {string} url The URL to which the client should be redirected.
   * @param {number=} [status=302] The HTTP status code to send to the
   *        client.
   * @param {{
   *          httpStatus: number=,
   *          headers: Object<string, *>
   *        }} [options={}] The redirect options
   * @return {Response} This response.
   */
  redirect(url, options = { httpStatus: 302, headers: {} }) {
    if ($Debug) {
      if (this._response && this._response.headersSent) {
        throw new GenericError(
          'ima.core.router.Response:redirect The response has already ' +
            'been sent. Check your workflow.',
          { url, options }
        );
      }
    }

    this._internalHeadersStorage = {
      ...this._internalHeadersStorage,
      ...options?.headers,
    };

    throw new GenericError('IMA internal redirect', {
      url,
      status: options.httpStatus,
    });
  }

  /**
   * Sets a cookie, which will be sent to the client with the response.
   *
   * @param {string} name The cookie name.
   * @param {(boolean|number|string)} value The cookie value, will be
   *        converted to string.
   * @param {{domain: string=, expires: (number|string)=, maxAge: number=}}
   *        options Cookie attributes. Only the attributes listed in the type
   *        annotation of this field are supported. For documentation and full
   *        list of cookie attributes
   *        see http://tools.ietf.org/html/rfc2965#page-5
   * @return {Response} This response.
   */
  setCookie(name, value, options = {}) {
    if ($Debug) {
      if (this._response && this._response.headersSent) {
        throw new GenericError(
          'ima.core.router.Response:setCookie The response has already ' +
            'been sent. Check your workflow.',
          { name, value, options }
        );
      }
    }

    let advancedOptions = Object.assign(
      {},
      this._cookieTransformFunction,
      options
    );

    this._internalCookieStorage.set(name, {
      value,
      options: advancedOptions,
    });

    return this;
  }

  /**
   * Sets a header, which will be sent to the client with the response.
   *
   * @param {string} name The cookie name.
   * @param {*} value The cookie value, will be
   * @return {Response} This response.
   */
  setHeader(name, value) {
    if ($Debug) {
      if (this._response && this._response.headersSent) {
        throw new GenericError(
          'ima.core.router.Response:setHeader The response has already ' +
            'been sent. Check your workflow.',
          { name, value }
        );
      }
    }

    this._internalHeadersStorage[name] = value;

    return this;
  }

  /**
   * Return object which contains response headers and cookie.
   *
   * @return {{cookie: Map<string, value: string, options: {domain: string=, expires: (number|string}>, headers: Object<string, *>}}
   */
  getResponseParams() {
    return {
      cookie: this._internalCookieStorage,
      headers: this._internalHeadersStorage,
    };
  }
}
// @endif
