import ns from '../namespace';
import GenericError from '../error/GenericError';

ns.namespace('ima.router');

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
		 * The ExpressJS response object, or {@code null} if running at the
		 * client side.
		 *
		 * @type {?Express.Response}
		 */
    this._response = null;

    /**
		 * It is flag for sent response for request.
		 *
		 * @type {boolean}
		 */
    this._isSent = false;

    /**
		 * HTTP Status code.
		 *
		 * @type {number}
		 */
    this._status = 500;

    /**
		 * The content of response.
		 *
		 * @type {string}
		 */
    this._content = '';

    /**
		 * The rendered page state.
		 *
		 * @type {Object<string, *>}
		 */
    this._pageState = {};

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
		 * Transform function for cookie value.
		 *
		 * @type {{encode: function, decode: function}}
		 */
    this._cookieTransformFunction = {
      encode: value => value,
      decode: value => value
    };
  }

  /**
	 * Initializes this response wrapper with the provided ExpressJS response
	 * object.
	 *
	 * @param {?Express.Response} response The ExpressJS response, or
	 *        {@code null} if the code is running at the client side.
	 * @param {{
	 *          encode: function(string): string=,
	 *          decode: function(string): string
	 *        }=} cookieTransformFunction
	 * @return {ima.router.Response} This response.
	 */
  init(response, cookieTransformFunction = {}) {
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
	 * @param {string} url The URL to which the client should be redirected.
	 * @param {number=} [status=302] The HTTP status code to send to the
	 *        client.
	 * @return {Response} This response.
	 */
  redirect(url, status = 302) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.url = url;

        throw new GenericError(
          'ima.router.Response:redirect The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._isSent = true;
    this._status = status;
    this._setCookieHeaders();
    this._response.redirect(status, url);

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
	 * @param {number} httpStatus HTTP response status code to send to the
	 *        client.
	 * @return {Response} This response.
	 */
  status(httpStatus) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();

        throw new GenericError(
          'ima.router.Response:status The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._status = httpStatus;
    this._response.status(httpStatus);

    return this;
  }

  /**
	 * Sends the response to the client with the provided content. Use this
	 * method only at the server side.
	 *
	 * @param {string} content The response body.
	 * @return {Response} This response.
	 */
  send(content) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.content = content;

        throw new GenericError(
          'ima.router.Response:send The response has already been ' +
            'sent. Check your workflow.',
          params
        );
      }
    }

    this._isSent = true;
    this._content = content;
    this._setCookieHeaders();
    this._response.send(content);

    return this;
  }

  /**
	 * Sets the rendered page state.
	 *
	 * @param {Object<string, *>} pageState The rendered page state.
	 * @return {Response} This response.
	 */
  setPageState(pageState) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.pageState = pageState;

        throw new GenericError(
          'ima.router.Response:setState The response has already ' +
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
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.name = name;
        params.value = value;
        params.options = options;

        throw new GenericError(
          'ima.router.Response:setCookie The response has already ' +
            'been sent. Check your workflow.',
          params
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
      options: advancedOptions
    });

    return this;
  }

  /**
	 * Return object which contains response status, content and rendered
	 * page state.
	 *
	 * @return {{status: number, content: string, pageState: Object<string, *>}}
	 */
  getResponseParams() {
    return {
      status: this._status,
      content: this._content,
      pageState: this._pageState
    };
  }

  /**
	 * Return true if response is sent from server to client.
	 *
	 * @return {boolean}
	 */
  isResponseSent() {
    return this._isSent;
  }

  /**
	 * Set cookie headers for response.
	 */
  _setCookieHeaders() {
    for (let [name, param] of this._internalCookieStorage) {
      let options = this._prepareCookieOptionsForExpress(param.options);
      this._response.cookie(name, param.value, options);
    }
  }

  /**
	 * Prepares cookie options for Express.
	 *
	 * @param {{domain: string=, expires: (number|string)=, maxAge: number=}}
	 *        options Cookie attributes. Only the attributes listed in the type
	 *        annotation of this field are supported. For documentation and full
	 *        list of cookie attributes
	 *        see http://tools.ietf.org/html/rfc2965#page-5
	 * @return {Object} Cookie options prepared for Express.
	 */
  _prepareCookieOptionsForExpress(options) {
    let expressOptions = Object.assign({}, options);

    if (typeof expressOptions.maxAge === 'number') {
      expressOptions.maxAge *= 1000;
    } else {
      delete expressOptions.maxAge;
    }

    return expressOptions;
  }
}

ns.ima.router.Response = Response;
