import HttpStatusCode from './StatusCode';
import GenericError from '../error/GenericError';

/**
 * An object representing the complete request parameters used to create and
 * send the HTTP request.
 * @typedef {Object} HttpProxy~RequestParams
 * @property {string} method The HTTP method.
 * @property {string} url The original URL to which to make the request.
 * @property {string} transformedUrl The actual URL to which to make the
 *           request, created by applying the URL transformer to the
 *           original URL.
 * @property {Object<string, (boolean|number|string|Date)>} data The request
 *           data, sent as query or body.
 * @property {HttpAgent~RequestOptions} options The high-level request options
 *           provided by the HTTP agent.
 */

/**
 * An object that describes a failed HTTP request, providing
 * information about both the failure reported by the server and how the
 * request has been sent to the server.
 * @typedef {Object} HttpProxy~ErrorParams
 * @property {string} errorName An error name.
 * @property {number} status The HTTP response status code send by the
 *           server.
 * @property {object} body The body of HTTP error response (detailed
 *           information).
 * @property {Error} cause The low-level cause error.
 * @property {HttpProxy~RequestParams} params An object representing the
 *           complete request parameters used to create and send the HTTP
 *           request.
 */

/**
 * Middleware proxy between {@link HttpAgent} implementations and the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API Fetch API},
 * providing a Promise-oriented API for sending requests.
 */
export default class HttpProxy {
  /**
   * Initializes the HTTP proxy.
   *
   * @param {UrlTransformer} transformer A transformer of URLs to which
   *        requests are made.
   * @param {Window} window Helper for manipulating the global object `window`
   *        regardless of the client/server-side environment.
   */
  constructor(transformer, window) {
    /**
     * A transformer of URLs to which requests are made.
     *
     * @type {UrlTransformer}
     */
    this._transformer = transformer;

    /**
     * Helper for manipulating the global object `window` regardless of the
     * client/server-side environment.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * The default HTTP headers to include with the HTTP requests, unless
     * overridden.
     *
     * @type {Map<string, string>}
     */
    this._defaultHeaders = new Map();
  }

  /**
   * Executes a HTTP request to the specified URL using the specified HTTP
   * method, carrying the provided data.
   *
   * @param {string} method The HTTP method to use.
   * @param {string} url The URL to which the request should be made.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to
   *        be send to the server. The data will be included as query
   *        parameters if the request method is `GET` or `HEAD`, and as
   *        a request body for any other request method.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise.<HttpAgent~Response>} A promise that resolves to the server
   *         response.
   */
  request(method, url, data, options) {
    const requestParams = this._composeRequestParams(
      method,
      url,
      data,
      options
    );

    return new Promise((resolve, reject) => {
      let requestTimeoutId;

      if (options.timeout) {
        requestTimeoutId = setTimeout(() => {
          reject(
            new GenericError('The HTTP request timed out', {
              status: HttpStatusCode.TIMEOUT
            })
          );
        }, options.timeout);
      }

      const fetch = this._getFetchApi();
      fetch(
        this._composeRequestUrl(
          url,
          !this._shouldRequestHaveBody(method, data) ? data : {}
        ),
        this._composeRequestInit(method, data, options)
      )
        .then(response => {
          if (requestTimeoutId) {
            clearTimeout(requestTimeoutId);
          }

          const contentType = response.headers.get('content-type');

          if (response.status === HttpStatusCode.NO_CONTENT) {
            return Promise.resolve([response, null]);
          } else if (contentType && contentType.includes('application/json')) {
            return response.json().then(body => [response, body]);
          } else {
            return response.text().then(body => [response, body]);
          }
        })
        .then(([response, responseBody]) =>
          this._processResponse(requestParams, response, responseBody)
        )
        .then(resolve, reject);
    }).catch(fetchError => {
      throw this._processError(fetchError, requestParams);
    });
  }

  /**
   * Sets the specified default HTTP header. The header will be sent with all
   * subsequent HTTP requests unless reconfigured using this method,
   * overridden by request options, or cleared by
   * {@link HttpProxy#clearDefaultHeaders} method.
   *
   * @param {string} header A header name.
   * @param {string} value A header value.
   */
  setDefaultHeader(header, value) {
    this._defaultHeaders.set(header, value);
  }

  /**
   * Clears all defaults headers sent with all requests.
   */
  clearDefaultHeaders() {
    this._defaultHeaders.clear();
  }

  /**
   * Gets an object that describes a failed HTTP request, providing
   * information about both the failure reported by the server and how the
   * request has been sent to the server.
   *
   * @param {string} method The HTTP method used to make the request.
   * @param {string} url The URL to which the request has been made.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        with the request.
   * @param {HttpAgent~RequestOptions} options Optional request options.
   * @param {number} status The HTTP response status code send by the server.
   * @param {object} body The body of HTTP error response (detailed
   *        information).
   * @param {Error} cause The low-level cause error.
   * @return {HttpProxy~ErrorParams} An object containing both the details of
   *         the error and the request that lead to it.
   */
  getErrorParams(method, url, data, options, status, body, cause) {
    let params = this._composeRequestParams(method, url, data, options);

    if (typeof body === 'undefined') {
      body = {};
    }

    let error = { status, body, cause };

    switch (status) {
      case HttpStatusCode.TIMEOUT:
        error.errorName = 'Timeout';
        break;
      case HttpStatusCode.BAD_REQUEST:
        error.errorName = 'Bad Request';
        break;
      case HttpStatusCode.UNAUTHORIZED:
        error.errorName = 'Unauthorized';
        break;
      case HttpStatusCode.FORBIDDEN:
        error.errorName = 'Forbidden';
        break;
      case HttpStatusCode.NOT_FOUND:
        error.errorName = 'Not Found';
        break;
      case HttpStatusCode.SERVER_ERROR:
        error.errorName = 'Internal Server Error';
        break;
      default:
        error.errorName = 'Unknown';
        break;
    }

    return Object.assign(error, params);
  }

  /**
   * Returns `true` if cookies have to be processed manually by setting
   * `Cookie` HTTP header on requests and parsing the `Set-Cookie` HTTP
   * response header.
   *
   * The result of this method depends on the current application
   * environment, the client-side usually handles cookie processing
   * automatically, leading this method returning `false`.
   *
   * At the client-side, the method tests whether the client has cookies
   * enabled (which results in cookies being automatically processed by the
   * browser), and returns `true` or `false` accordingly.
   *
   * @return {boolean} `true` if cookies are not processed automatically by
   *         the environment and have to be handled manually by parsing
   *         response headers and setting request headers, otherwise `false`.
   */
  haveToSetCookiesManually() {
    return !this._window.isClient();
  }

  /**
   * Processes the response received from the server.
   *
   * @param {HttpProxy~RequestParams} requestParams The original request's
   *        parameters.
   * @param {Response} response The Fetch API's `Response` object representing
   *        the server's response.
   * @param {*} responseBody The server's response body.
   * @return {HttpAgent~Response} The server's response along with all related
   *         metadata.
   */
  _processResponse(requestParams, response, responseBody) {
    if (response.ok) {
      return {
        status: response.status,
        body: responseBody,
        params: requestParams,
        headers: this._headersToPlainObject(response.headers),
        headersRaw: response.headers,
        cached: false
      };
    } else {
      throw new GenericError('The request failed', {
        status: response.status,
        body: responseBody
      });
    }
  }

  /**
   * Converts the provided Fetch API's `Headers` object to a plain object.
   *
   * @param {Headers} headers The headers to convert.
   * @return {Object.<string, string>} Converted headers.
   */
  _headersToPlainObject(headers) {
    let plainHeaders = {};

    if (headers.entries) {
      for (let [key, value] of headers.entries()) {
        plainHeaders[key] = value;
      }
    } else if (headers.forEach) {
      /**
       * Check for forEach() has to be here because in old Firefoxes (versions lower than 44) there is not
       * possibility to iterate through all the headers - according to docs
       * (https://developer.mozilla.org/en-US/docs/Web/API/Headers) where is "entries(), keys(), values(), and support
       * of for...of" is supported from Firefox version 44
       */
      if (headers.getAll) {
        /**
         * @todo This branch should be removed with node-fetch release
         *       2.0.0.
         */
        headers.forEach((_, headerName) => {
          plainHeaders[headerName] = headers.getAll(headerName).join(', ');
        });
      } else if (headers.get) {
        /**
         * In case that Headers.getAll() from previous branch doesn't exist because it is obsolete and deprecated - in
         * newer versions of the Fetch spec, Headers.getAll() has been deleted, and Headers.get() has been updated to
         * fetch all header values instead of only the first one - according to docs
         * (https://developer.mozilla.org/en-US/docs/Web/API/Headers/getAll)
         */
        headers.forEach((_, headerName) => {
          plainHeaders[headerName] = headers.get(headerName);
        });
      } else {
        /**
         * @todo If Microsoft Edge supported headers.entries(), we'd remove
         *       this branch.
         */
        headers.forEach((headerValue, headerName) => {
          plainHeaders[headerName] = headerValue;
        });
      }
    }

    return plainHeaders;
  }

  /**
   * Processes the provided Fetch API or internal error and creates an error
   * to expose to the calling API.
   *
   * @param {Error} fetchError The internal error to process.
   * @param {HttpProxy~RequestParams} requestParams An object representing the
   *        complete request parameters used to create and send the HTTP
   *        request.
   * @return {GenericError} The error to provide to the calling API.
   */
  _processError(fetchError, requestParams) {
    const errorParams =
      fetchError instanceof GenericError ? fetchError.getParams() : {};
    return this._createError(
      fetchError,
      requestParams,
      errorParams.status || HttpStatusCode.SERVER_ERROR,
      errorParams.body || null
    );
  }

  /**
   * Creates an error that represents a failed HTTP request.
   *
   * @param {Error} cause The error's message.
   * @param {HttpProxy~RequestParams} requestParams An object representing the
   *        complete request parameters used to create and send the HTTP
   *        request.
   * @param {number} status Server's response HTTP status code.
   * @param {*} responseBody The body of the server's response, if any.
   * @return {GenericError} The error representing a failed HTTP request.
   */
  _createError(cause, requestParams, status, responseBody = null) {
    return new GenericError(
      cause.message,
      this.getErrorParams(
        requestParams.method,
        requestParams.url,
        requestParams.data,
        requestParams.options,
        status,
        responseBody,
        cause
      )
    );
  }

  /**
   * Returns {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch window.fetch}
   * compatible API to use, depending on the method being used at the server
   * (polyfill) or client (native/polyfill) side.
   *
   * @return {function((string|Request), RequestInit=): Promise.<Response>} An
   *         implementation of the Fetch API to use.
   */
  _getFetchApi() {
    const fetch = 'node-fetch';

    return this._window.isClient()
      ? this._window.getWindow().fetch
      : require(fetch);
  }

  /**
   * Composes an object representing the HTTP request parameters from the
   * provided arguments.
   *
   * @param {string} method The HTTP method to use.
   * @param {string} url The URL to which the request should be sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to
   *        send with the request.
   * @param {HttpAgent~RequestOptions} options Optional request options.
   * @return {HttpProxy~RequestParams} An object
   *         representing the complete request parameters used to create and
   *         send the HTTP request.
   */
  _composeRequestParams(method, url, data, options) {
    return {
      method,
      url,
      transformedUrl: this._transformer.transform(url),
      data,
      options
    };
  }

  /**
   * Composes an init object, which can be used as a second argument of
   * `window.fetch` method.
   *
   * @param {string} method The HTTP method to use.
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @param {HttpAgent~RequestOptions} options Options provided by the HTTP
   *        agent.
   * @return {RequestInit} A `RequestInit` object of the Fetch API.
   */
  _composeRequestInit(method, data, options) {
    const contentType = this._getContentType(method, data, options);

    if (contentType) {
      options.headers['Content-Type'] = contentType;
    }

    for (let [headerName, headerValue] of this._defaultHeaders) {
      options.headers[headerName] = headerValue;
    }

    let requestInit = {
      method: method.toUpperCase(),
      headers: options.headers,
      credentials: options.withCredentials ? 'include' : 'same-origin',
      redirect: 'follow'
    };

    if (this._shouldRequestHaveBody(method, data)) {
      requestInit.body = this._transformRequestBody(data, options.headers);
    }

    Object.assign(requestInit, options.fetchOptions || {});

    return requestInit;
  }

  /**
   * Gets a `Content-Type` header value for defined method, data and options.
   *
   * @param {string} method The HTTP method to use.
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @param {HttpAgent~RequestOptions} options Options provided by the HTTP
   *        agent.
   * @return {string|null} A `Content-Type` header value, null for requests
   *        with no body.
   */
  _getContentType(method, data, options) {
    if (
      options.headers['Content-Type'] &&
      typeof options.headers['Content-Type'] === 'string'
    ) {
      return options.headers['Content-Type'];
    }

    if (this._shouldRequestHaveBody(method, data)) {
      return 'application/json';
    }

    return null;
  }

  /**
   * Transforms the provided URL using the current URL transformer and adds
   * the provided data to the URL's query string.
   *
   * @param {string} url The URL to prepare for use with the fetch API.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to be
   *        attached to the query string.
   * @return {string} The transformed URL with the provided data attached to
   *         its query string.
   */
  _composeRequestUrl(url, data) {
    const transformedUrl = this._transformer.transform(url);
    const queryString = this._convertObjectToQueryString(data || {});
    const delimiter = queryString
      ? transformedUrl.includes('?')
        ? '&'
        : '?'
      : '';

    return `${transformedUrl}${delimiter}${queryString}`;
  }

  /**
   * Checks if a request should have a body (`GET` and `HEAD` requests don't
   * have a body).
   *
   * @param {string} method The HTTP method.
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @return {boolean} `true` if a request has a body, otherwise `false`.
   */
  _shouldRequestHaveBody(method, data) {
    return !!(
      method &&
      data &&
      !['get', 'head'].includes(method.toLowerCase())
    );
  }

  /**
   * Formats request body according to request headers.
   *
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @param {Object.<string, string>} headers Headers object from options provided by the HTTP
   *        agent.
   * @returns {string|Object|FormData}
   * @private
   */
  _transformRequestBody(data, headers) {
    switch (headers['Content-Type']) {
      case 'application/json':
        return JSON.stringify(data);
      case 'application/x-www-form-urlencoded':
        return this._convertObjectToQueryString(data);
      case 'multipart/form-data':
        return this._convertObjectToFormData(data);
      default:
        return data;
    }
  }

  /**
   * Returns query string representation of the data parameter.
   * (Returned string does not contain ? at the beginning)
   *
   * @param {Object.<string, (boolean|number|string|Date)>} object The object to be converted
   * @returns {string} Query string representation of the given object
   * @private
   */
  _convertObjectToQueryString(object) {
    return Object.keys(object)
      .map(key => [key, object[key]].map(encodeURIComponent).join('='))
      .join('&');
  }

  /**
   * Converts given data to FormData object.
   * If FormData object is not supported by the browser the original object is returned.
   *
   * @param {Object.<string, (boolean|number|string|Date)>} object The object to be converted
   * @returns {Object|FormData}
   * @private
   */
  _convertObjectToFormData(object) {
    const window = this._window.getWindow();

    if (!window || !window.FormData) {
      return object;
    }
    const formDataObject = new FormData();
    Object.keys(object).forEach(key => formDataObject.append(key, object[key]));

    return formDataObject;
  }
}
