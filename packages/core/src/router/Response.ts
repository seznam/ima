/* @if client **
export default class Response {};
/* @else */
import GenericError from '../error/GenericError';
import { Response as ExpressResponse, CookieOptions } from 'express';

/**
 * Wrapper for the ExpressJS response, exposing only the necessary minimum.
 */
export default class Response {
  /**
   * The ExpressJS response object, or `undefined` if running at the
   * client side.
   */
  protected _response?: ExpressResponse;
  /**
   * It is flag for sent response for request.
   */
  protected _isSent = false;
  /**
   * HTTP Status code.
   */
  protected _status = 500;
  /**
   * The content of response.
   */
  protected _content = '';
  /**
   * The rendered page state.
   */
  protected _pageState: { [key: string]: unknown } = {};
  /**
   * Internal cookie storage for Set-Cookie header.
   */
  protected _internalCookieStorage: Map<
    string,
    { value: string; options: CookieOptions }
  > = new Map();
  /**
   * Transform function for cookie value.
   */
  protected _cookieTransformFunction: {
    encode: (value: string) => string;
    decode: (value: string) => string;
  } = {
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
    this._isSent = false;
    this._status = 500;
    this._content = '';
    this._pageState = {};
    this._internalCookieStorage = new Map();

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
  redirect(url: string, status = 302, headers = {}) {
    // TODO IMA@18 refactor to use an `options` object for `status` and `headers`, same as $Router
    if ($Debug) {
      if (this._isSent === true) {
        const params = this.getResponseParams();
        params.url = url;

        throw new GenericError(
          'ima.core.router.Response:redirect The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._isSent = true;
    this._status = status;
    this._setCookieHeaders();

    if (this._response) {
      this._response.set(headers);
      this._response.redirect(status, url);
    }

    return this;
  }

  /**
   * Sets the HTTP status code that will be sent to the client when the
   * response is sent.
   *
   * For full list of available response codes see
   * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   *
   * Use this method only at the server side.
   *
   * @param httpStatus HTTP response status code to send to the
   *        client.
   * @return This response.
   */
  status(httpStatus: number): this {
    if ($Debug) {
      if (this._isSent === true) {
        const params = this.getResponseParams();

        throw new GenericError(
          'ima.core.router.Response:status The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._status = httpStatus;
    if (this._response) {
      this._response.status(httpStatus);
    }

    return this;
  }

  /**
   * Sends the response to the client with the provided content. Use this
   * method only at the server side.
   *
   * @param content The response body.
   * @return This response.
   */
  send(content: string): this {
    if ($Debug) {
      if (this._isSent === true) {
        const params = this.getResponseParams();
        params.content = content;

        throw new GenericError(
          'ima.core.router.Response:send The response has already been ' +
            'sent. Check your workflow.',
          params
        );
      }
    }

    this._isSent = true;
    this._content = content;
    this._setCookieHeaders();
    if (this._response) {
      this._response.send(content);
    }

    return this;
  }

  /**
   * Sets the rendered page state.
   *
   * @param pageState The rendered page state.
   * @return This response.
   */
  setPageState(pageState: { [key: string]: unknown }): this {
    if ($Debug) {
      if (this._isSent === true) {
        const params = this.getResponseParams();
        params.pageState = pageState;

        throw new GenericError(
          'ima.core.router.Response:setState The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._pageState = pageState;

    return this;
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
    options = {}
  ): this {
    if ($Debug) {
      if (this._isSent === true) {
        const params = this.getResponseParams();
        params.name = name;
        params.value = value;
        params.options = options;

        throw new GenericError(
          'ima.core.router.Response:setCookie The response has already ' +
            'been sent. Check your workflow.',
          params
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
      options: advancedOptions as CookieOptions,
    });

    return this;
  }

  /**
   * Return object which contains response status, content and rendered
   * page state.
   */
  getResponseParams(): {
    status: number;
    content: string;
    pageState: { [key: string]: unknown };
    name?: string;
    value?: boolean | string | number;
    options?: object;
    url?: string;
  } {
    return {
      status: this._status,
      content: this._content,
      pageState: this._pageState,
    };
  }

  /**
   * Return true if response is sent from server to client.
   */
  isResponseSent() {
    return this._isSent;
  }

  /**
   * Set cookie headers for response.
   */
  _setCookieHeaders() {
    for (const [name, param] of this._internalCookieStorage) {
      const options = this._prepareCookieOptionsForExpress(param.options);
      if (this._response) {
        this._response.cookie(name, param.value, options);
      }
    }
  }

  /**
   * Prepares cookie options for Express.
   *
   * @param options Cookie attributes. Only the attributes listed in the type
   *        annotation of this field are supported. For documentation and full
   *        list of cookie attributes
   *        see http://tools.ietf.org/html/rfc2965#page-5
   * @return Cookie options prepared for Express.
   */
  _prepareCookieOptionsForExpress(options: CookieOptions) {
    const expressOptions = Object.assign({}, options);

    if (typeof expressOptions.maxAge === 'number') {
      expressOptions.maxAge *= 1000;
    } else {
      delete expressOptions.maxAge;
    }

    return expressOptions;
  }
}
// @endif
