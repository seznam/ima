import {
  ImaRequestInit,
  HttpAgentRequestOptions,
  HttpAgentResponse,
} from './HttpAgent';
import { HttpStatusCode } from './HttpStatusCode';
import { UrlTransformer } from './UrlTransformer';
import { GenericError } from '../error/GenericError';
import { StringParameters, UnknownParameters } from '../types';
import { Window } from '../window/Window';

/**
 * An object representing the complete request parameters used to create and
 * send the HTTP request.
 * @typedef HttpProxy~RequestParams
 * @property method The HTTP method.
 * @property url The original URL to which to make the request.
 * @property transformedUrl The actual URL to which to make the
 *           request, created by applying the URL transformer to the
 *           original URL.
 * @property data The request
 *           data, sent as query or body.
 * @property options The high-level request options
 *           provided by the HTTP agent.
 */

export type HttpProxyRequestParams = {
  method: string;
  url: string;
  transformedUrl: string;
  data?: UnknownParameters;
  options: HttpAgentRequestOptions;
};

/**
 * An object that describes a failed HTTP request, providing
 * information about both the failure reported by the server and how the
 * request has been sent to the server.
 * @typedef HttpProxy~ErrorParams
 * @property errorName An error name.
 * @property status The HTTP response status code send by the
 *           server.
 * @property body The body of HTTP error response (detailed
 *           information).
 * @property cause The low-level cause error.
 * @property params An object representing the
 *           complete request parameters used to create and send the HTTP
 *           request.
 */

export type HttpProxyErrorParams<B = unknown> = {
  errorName: string;
  status: number;
  body: B;
  cause: Error;
} & HttpProxyRequestParams;

/**
 * Middleware proxy between {@link HttpAgent} implementations and the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API Fetch API},
 * providing a Promise-oriented API for sending requests.
 */
export class HttpProxy {
  protected _transformer: UrlTransformer;
  protected _window: Window;
  protected _defaultHeaders: Map<string, string>;

  /**
   * Initializes the HTTP proxy.
   *
   * @param transformer A transformer of URLs to which
   *        requests are made.
   * @param window Helper for manipulating the global object `window`
   *        regardless of the client/server-side environment.
   */
  constructor(transformer: UrlTransformer, window: Window) {
    /**
     * A transformer of URLs to which requests are made.
     */
    this._transformer = transformer;

    /**
     * Helper for manipulating the global object `window` regardless of the
     * client/server-side environment.
     */
    this._window = window;

    /**
     * The default HTTP headers to include with the HTTP requests, unless
     * overridden.
     */
    this._defaultHeaders = new Map();
  }

  /**
   * Executes a HTTP request to the specified URL using the specified HTTP
   * method, carrying the provided data.
   *
   * @param method The HTTP method to use.
   * @param url The URL to which the request should be made.
   * @param data The data to
   *        be send to the server. The data will be included as query
   *        parameters if the request method is `GET` or `HEAD`, and as
   *        a request body for any other request method.
   * @param options Optional request options.
   * @return A promise that resolves to the server
   *         response.
   */
  request<B>(
    method: string,
    url: string,
    data: UnknownParameters | undefined,
    options: HttpAgentRequestOptions
  ): Promise<HttpAgentResponse<B>> {
    const requestParams = this._composeRequestParams(
      method,
      url,
      data,
      options
    );

    // Track request timeout status
    let requestTimeoutId: number | NodeJS.Timeout | null = null;
    let isTimeoutAbortDefined = false;

    if (
      options.timeout &&
      !options.abortController &&
      !options.fetchOptions?.signal
    ) {
      isTimeoutAbortDefined = true;
      options.abortController = new AbortController();
    }

    return new Promise<HttpAgentResponse<B>>((resolve, reject) => {
      if (options.timeout) {
        requestTimeoutId = setTimeout(() => {
          options.abortController?.abort();

          // Reset timeout abort controller for another attempt
          if (isTimeoutAbortDefined && options.repeatRequest > 0) {
            options.abortController = new AbortController();
            options.fetchOptions.signal = options.abortController?.signal;
          }

          return reject(
            new GenericError('The HTTP request timed out', {
              status: HttpStatusCode.TIMEOUT,
            })
          );
        }, options.timeout);
      }

      fetch(
        this._composeRequestUrl(
          url,
          !this._shouldRequestHaveBody(method, data)
            ? (data as StringParameters)
            : {}
        ),
        this._composeRequestInit(method, data, options)
      )
        .then(response => {
          if (requestTimeoutId) {
            clearTimeout(requestTimeoutId);
            requestTimeoutId = null;
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
          this._processResponse<B>(requestParams, response, responseBody)
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
   * @param header A header name.
   * @param value A header value.
   * @returns this
   */
  setDefaultHeader(header: string, value: string): this {
    this._defaultHeaders.set(header, value);

    return this;
  }

  /**
   * Clears all defaults headers sent with all requests.
   *
   * @returns this
   */
  clearDefaultHeaders(): this {
    this._defaultHeaders.clear();

    return this;
  }

  /**
   * Gets an object that describes a failed HTTP request, providing
   * information about both the failure reported by the server and how the
   * request has been sent to the server.
   *
   * @param method The HTTP method used to make the request.
   * @param url The URL to which the request has been made.
   * @param data The data sent
   *        with the request.
   * @param options Optional request options.
   * @param status The HTTP response status code send by the server.
   * @param body The body of HTTP error response (detailed
   *        information).
   * @param cause The low-level cause error.
   * @return An object containing both the details of
   *         the error and the request that lead to it.
   */
  getErrorParams<B = unknown>(
    method: string,
    url: string,
    data: UnknownParameters | undefined,
    options: HttpAgentRequestOptions,
    status: number,
    body: B | undefined,
    cause: Error
  ): HttpProxyErrorParams<B> {
    let errorName = '';
    const params = this._composeRequestParams(method, url, data, options);

    if (typeof body === 'undefined') {
      body = {} as B;
    }

    switch (status) {
      case HttpStatusCode.TIMEOUT:
        errorName = 'Timeout';
        break;
      case HttpStatusCode.BAD_REQUEST:
        errorName = 'Bad Request';
        break;
      case HttpStatusCode.UNAUTHORIZED:
        errorName = 'Unauthorized';
        break;
      case HttpStatusCode.FORBIDDEN:
        errorName = 'Forbidden';
        break;
      case HttpStatusCode.NOT_FOUND:
        errorName = 'Not Found';
        break;
      case HttpStatusCode.SERVER_ERROR:
        errorName = 'Internal Server Error';
        break;
      default:
        errorName = 'Unknown';
        break;
    }

    return { errorName, status, body, cause, ...params };
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
   * `true` if cookies are not processed automatically by
   *         the environment and have to be handled manually by parsing
   *         response headers and setting request headers, otherwise `false`.
   */
  haveToSetCookiesManually(): boolean {
    return !this._window.isClient();
  }

  /**
   * Processes the response received from the server.
   *
   * @param requestParams The original request's
   *        parameters.
   * @param response The Fetch API's `Response` object representing
   *        the server's response.
   * @param responseBody The server's response body.
   * @return The server's response along with all related
   *         metadata.
   */
  _processResponse<B>(
    requestParams: HttpProxyRequestParams,
    response: Response,
    responseBody: B
  ): HttpAgentResponse<B> {
    if (response.ok) {
      return {
        status: response.status,
        body: responseBody,
        params: requestParams,
        headers: this._headersToPlainObject(response.headers),
        headersRaw: response.headers,
        cached: false,
      };
    }

    throw new GenericError('The request failed', {
      status: response.status,
      body: responseBody,
    });
  }

  /**
   * Converts the provided Fetch API's `Headers` object to a plain object.
   *
   * @param headers The headers to convert.
   * @return Converted headers.
   */
  _headersToPlainObject(headers: Headers): StringParameters {
    const plainHeaders: StringParameters = {};

    for (const [key, value] of headers) {
      plainHeaders[key] = value;
    }

    return plainHeaders;
  }

  /**
   * Processes the provided Fetch API or internal error and creates an error
   * to expose to the calling API.
   *
   * @param fetchError The internal error to process.
   * @param requestParams An object representing the
   *        complete request parameters used to create and send the HTTP
   *        request.
   * @return The error to provide to the calling API.
   */
  _processError(
    fetchError: GenericError | Error,
    requestParams: HttpProxyRequestParams
  ): GenericError {
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
   * @param cause The error's message.
   * @param requestParams An object representing the
   *        complete request parameters used to create and send the HTTP
   *        request.
   * @param status Server's response HTTP status code.
   * @param responseBody The body of the server's response, if any.
   * @return The error representing a failed HTTP request.
   */
  _createError(
    cause: GenericError | Error,
    requestParams: HttpProxyRequestParams,
    status: number,
    responseBody: unknown = null
  ): GenericError {
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
   * Composes an object representing the HTTP request parameters from the
   * provided arguments.
   *
   * @param method The HTTP method to use.
   * @param url The URL to which the request should be sent.
   * @param data The data to
   *        send with the request.
   * @param options Optional request options.
   * @return An object representing the complete request parameters used to create and
   *         send the HTTP request.
   */
  _composeRequestParams(
    method: string,
    url: string,
    data: UnknownParameters | undefined,
    options: HttpAgentRequestOptions
  ): HttpProxyRequestParams {
    return {
      method,
      url,
      transformedUrl: this._transformer.transform(url),
      data,
      options,
    };
  }

  /**
   * Composes an init object, which can be used as a second argument of
   * `window.fetch` method.
   *
   * @param method The HTTP method to use.
   * @param data The data to
   *        be send with a request.
   * @param options Options provided by the HTTP
   *        agent.
   * @return {ImaRequestInit} An `ImaRequestInit` object (extended from `RequestInit` of the Fetch API).
   */
  _composeRequestInit(
    method: string,
    data: UnknownParameters | undefined,
    options: HttpAgentRequestOptions
  ): ImaRequestInit {
    const requestInit: {
      body?: unknown;
      headers: Record<string, string>;
      [key: string]: unknown;
    } = {
      method: method.toUpperCase(),
      redirect: 'follow',
      headers: options.fetchOptions?.headers || {},
    };

    const contentType = this._getContentType(method, data, requestInit.headers);

    if (contentType) {
      requestInit.headers['Content-Type'] = contentType;
    }

    for (const [headerName, headerValue] of this._defaultHeaders) {
      requestInit.headers[headerName] = headerValue;
    }

    if (this._shouldRequestHaveBody(method, data)) {
      requestInit.body = this._transformRequestBody(data, requestInit.headers);
    }

    // Re-assign signal from abort controller to fetch options
    if (!options.fetchOptions?.signal && options.abortController?.signal) {
      options.fetchOptions = {
        ...options.fetchOptions,
        signal: options.abortController.signal,
      };
    }

    Object.assign(requestInit, options.fetchOptions || {});

    return requestInit;
  }

  /**
   * Gets a `Content-Type` header value for defined method, data and options.
   *
   * @param method The HTTP method to use.
   * @param data The data to
   *        be send with a request.
   * @param options Options provided by the HTTP
   *        agent.
   * @return A `Content-Type` header value, null for requests
   *        with no body.
   */
  _getContentType(
    method: string,
    data: UnknownParameters | undefined,
    headers: Record<string, string>
  ): string | null {
    if (
      headers['Content-Type'] &&
      typeof headers['Content-Type'] === 'string'
    ) {
      return headers['Content-Type'];
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
   * @param url The URL to prepare for use with the fetch API.
   * @param data The data to be attached to the query string.
   * @return The transformed URL with the provided data attached to
   *         its query string.
   */
  _composeRequestUrl(url: string, data: StringParameters | undefined): string {
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
   * @param method The HTTP method.
   * @param data The data to
   *        be send with a request.
   * @return `true` if a request has a body, otherwise `false`.
   */
  _shouldRequestHaveBody(
    method: string,
    data: UnknownParameters | undefined
  ): boolean {
    return !!(
      method &&
      data &&
      !['get', 'head'].includes(method.toLowerCase())
    );
  }

  /**
   * Formats request body according to request headers.
   *
   * @param data The data to
   *        be send with a request.
   * @param headers Headers object from options provided by the HTTP
   *        agent.
   * @private
   */
  _transformRequestBody(
    data: UnknownParameters | undefined,
    headers: Record<string, string>
  ): string | UnknownParameters | FormData | undefined {
    switch (headers['Content-Type']) {
      case 'application/json':
        return JSON.stringify(data);
      case 'application/x-www-form-urlencoded':
        return this._convertObjectToQueryString(data as StringParameters);
      case 'multipart/form-data':
        return this._convertObjectToFormData(data as StringParameters);
      default:
        return data;
    }
  }

  /**
   * Returns query string representation of the data parameter.
   * (Returned string does not contain ? at the beginning)
   *
   * @param object The object to be converted
   * @returns Query string representation of the given object
   * @private
   */
  _convertObjectToQueryString<
    T extends Record<string, string | number | boolean>
  >(object: T | undefined): string | undefined {
    if (!object) {
      return undefined;
    }

    return Object.keys(object)
      .map(key =>
        [key, object[key]]
          .map(value => {
            return encodeURIComponent(value);
          })
          .join('=')
      )
      .join('&');
  }

  /**
   * Converts given data to FormData object.
   * If FormData object is not supported by the browser the original object is returned.
   *
   * @param object The object to be converted
   * @returns
   * @private
   */
  _convertObjectToFormData<T extends Record<string, string | Blob>>(
    object: T | undefined
  ): T | FormData | undefined {
    if (!object) {
      return undefined;
    }

    const window = this._window.getWindow();

    if (!window || !FormData) {
      return object;
    }

    const formDataObject = new FormData();
    Object.keys(object).forEach(key => formDataObject.append(key, object[key]));

    return formDataObject;
  }
}
