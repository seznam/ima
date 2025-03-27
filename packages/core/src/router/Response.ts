/* @if client **
export class Response {};
/* @else */
import { Response as ExpressResponse, CookieOptions } from 'express';

import { RouteOptions } from './Router';
import { GenericError } from '../error/GenericError';
import { UnknownParameters } from '../types';

export type CookieTransformFunction = {
  encode: (value: string) => string;
  decode: (value: string) => string;
};

/**
 * Wrapper for the ExpressJS response, exposing only the necessary minimum.
 */
export class Response {
  /**
   * The ExpressJS response object, or `undefined` if running at the
   * client side.
   */
  protected _response?: ExpressResponse;
  /**
   * Internal cookie storage for Set-Cookie header.
   */
  protected _internalCookieStorage: Map<
    string,
    { value: string; options: CookieOptions }
  > = new Map();
  protected _internalHeadersStorage: UnknownParameters = {};
  /**
   * Transform function for cookie value.
   */
  protected _cookieTransformFunction: CookieTransformFunction = {
    encode: value => value,
    decode: value => value,
  };

  static get $dependencies() {
    return [];
  }

  /**
   * Initializes this response wrapper with the provided ExpressJS response
   * object.
   *
   * @param response The ExpressJS response, or
   *        `null` if the code is running at the client side.
   * @param cookieTransformFunction
   * @return This response.
   */
  init(response: ExpressResponse, cookieTransformFunction = {}) {
    this._cookieTransformFunction = Object.assign(
      this._cookieTransformFunction,
      cookieTransformFunction
    );
    this._response = response;
    this._internalCookieStorage.clear();
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
   * @param url The URL to which the client should be redirected.
   * @param[status=302] The HTTP status code to send to the
   *        client.
   * @param headers Custom headers to be used on the response.
   * @return This response.
   */
  redirect(
    url: string,
    options: Partial<RouteOptions> = { httpStatus: 302, headers: {} }
  ) {
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
   * @param name The cookie name.
   * @param value The cookie value, will be
   *        converted to string.
   * @param options Cookie attributes. Only the attributes listed in the type
   *        annotation of this field are supported. For documentation and full
   *        list of cookie attributes
   *        see http://tools.ietf.org/html/rfc2965#page-5
   * @return This response.
   */
  setCookie(
    name: string,
    value: boolean | number | string,
    options: CookieOptions = {}
  ): this {
    if ($Debug) {
      if (this._response && this._response.headersSent) {
        throw new GenericError(
          'ima.core.router.Response:setCookie The response has already ' +
            'been sent. Check your workflow.',
          { name, value, options }
        );
      }
    }

    const advancedOptions = Object.assign(
      {},
      this._cookieTransformFunction,
      options
    );

    this._internalCookieStorage.set(name, {
      value: value as string,
      options: advancedOptions,
    });

    return this;
  }

  /**
   * Sets a header, which will be sent to the client with the response.
   *
   * @param name The header name.
   * @param value The header value, will be
   * @return This response.
   */
  setHeader(name: string, value: unknown) {
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
   */
  getResponseParams() {
    return {
      cookie: this._internalCookieStorage,
      headers: this._internalHeadersStorage,
    };
  }

  /**
   * Returns the ExpressJS response object.
   */
  getResponse(): ExpressResponse | undefined {
    return this._response;
  }
}
// @endif
