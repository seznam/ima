import * as Helpers from '@ima/helpers';

import {
  HttpAgent,
  HttpAgentRequestOptions,
  HttpAgentResponse,
} from './HttpAgent';
import { HttpProxy, HttpProxyErrorParams } from './HttpProxy';
import { Cache } from '../cache/Cache';
import { GenericError } from '../error/GenericError';
import { CookieStorage } from '../storage/CookieStorage';
import { UnknownParameters } from '../types';

export interface HttpAgentImplCacheOptions {
  prefix: string;
}

export interface HttpAgentImplConfig {
  cacheOptions: HttpAgentImplCacheOptions;
  defaultRequestOptions: HttpAgentRequestOptions;
}

type GenericErrorCacheData = {
  cachedError: true;
  errorMessage: string;
  errorParams: HttpProxyErrorParams;
};

/**
 * Implementation of the {@link HttpAgent} interface with internal caching
 * of completed and ongoing HTTP requests and cookie storage.
 */
export class HttpAgentImpl extends HttpAgent {
  protected _proxy: HttpProxy;
  protected _cache: Cache<HttpAgentResponse<unknown> | GenericErrorCacheData>;
  protected _cookie: CookieStorage;
  protected _cacheOptions: HttpAgentImplCacheOptions;
  protected _defaultRequestOptions: HttpAgentRequestOptions;
  protected _Helper: typeof Helpers;
  protected _internalCacheOfPromises = new Map();

  /**
   * Initializes the HTTP handler.
   *
   * @param proxy The low-level HTTP proxy for sending the HTTP
   *        requests.
   * @param cache Cache to use for caching ongoing and completed
   *        requests.
   * @param cookie The cookie storage to use internally.
   * @param Helper The IMA.js helper methods.
   * @param config Configuration of the HTTP handler for
   *        the current application environment, specifying the various
   *        default request option values and cache option values.
   * @example
   *      http
   *          .get('url', { data: data }, {
   *              ttl: 2000,
   *              repeatRequest: 1,
   *              withCredentials: true,
   *              timeout: 2000,
   *              accept: 'application/json',
   *              language: 'en'
   *          })
   *          .then((response) => {
   *              //resolve
   *          }
   *          .catch((error) => {
   *             //catch
   *          });
   * @example
   *      http
   *          .setDefaultHeader('Accept-Language', 'en')
   *          .clearDefaultHeaders();
   */
  constructor(
    proxy: HttpProxy,
    cache: Cache<HttpAgentResponse<unknown>>,
    cookie: CookieStorage,
    config: HttpAgentImplConfig,
    Helper: typeof Helpers
  ) {
    super();

    /**
     * HTTP proxy, used to execute the HTTP requests.
     */
    this._proxy = proxy;

    /**
     * Internal request cache, used to cache completed request results.
     */
    this._cache = cache;

    /**
     * Cookie storage, used to keep track of cookies received from the
     * server and send them with the subsequent requests to the server.
     */
    this._cookie = cookie;
    this._cacheOptions = config.cacheOptions;
    this._defaultRequestOptions = config.defaultRequestOptions;

    /**
     * Tha IMA.js helper methods.
     */
    this._Helper = Helper;
  }

  /**
   * @inheritDoc
   */
  get<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return this._requestWithCheckCache<B>('get', url, data, options);
  }

  /**
   * @inheritDoc
   */
  post<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return this._requestWithCheckCache<B>(
      'post',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritDoc
   */
  put<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return this._requestWithCheckCache<B>(
      'put',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritDoc
   */
  patch<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return this._requestWithCheckCache<B>(
      'patch',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritDoc
   */
  delete<B = unknown>(
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    return this._requestWithCheckCache<B>(
      'delete',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritDoc
   */
  getCacheKey(method: string, url: string, data?: UnknownParameters): string {
    return (
      this._cacheOptions.prefix + this._getCacheKeySuffix(method, url, data)
    );
  }

  /**
   * @inheritDoc
   */
  invalidateCache(method: string, url: string, data?: UnknownParameters) {
    const cacheKey = this.getCacheKey(method, url, data);

    this._cache.delete(cacheKey);
  }

  /**
   * @inheritDoc
   */
  setDefaultHeader(header: string, value: string): this {
    this._proxy.setDefaultHeader(header, value);

    return this;
  }

  /**
   * @inheritDoc
   */
  clearDefaultHeaders(): this {
    this._proxy.clearDefaultHeaders();

    return this;
  }

  /**
   * Attempts to clone the provided value, if possible. Values that cannot be
   * cloned (e.g. promises) will be simply returned.
   *
   * @param value The value to clone.
   * @return The created clone, or the provided value if the value cannot be
   *         cloned.
   */
  _clone<V>(value: V): V {
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Promise)
    ) {
      return this._Helper.clone(value);
    }

    return value;
  }

  /**
   * Check cache and if data isn’t available then make real request.
   *
   * @param method The HTTP method to use.
   * @param url The URL to which the request should be sent.
   * @param data The data to send with the request.
   * @param options Optional request options.
   * @return A promise that resolves to the response
   *         with body parsed as JSON.
   */
  _requestWithCheckCache<B>(
    method: string,
    url: string,
    data?: UnknownParameters,
    options?: Partial<HttpAgentRequestOptions>
  ): Promise<HttpAgentResponse<B>> {
    const optionsWithDefault = this._prepareOptions(options, url);

    if (optionsWithDefault.cache) {
      const cachedData = this._getCachedData<B>(method, url, data);

      if (cachedData) {
        return cachedData;
      }
    }

    return this._request<B>(method, url, data, optionsWithDefault);
  }

  /**
   * Tests whether an ongoing or completed HTTP request for the specified URL
   * and data is present in the internal cache and, if it is, the method
   * returns a promise that resolves to the response body parsed as JSON.
   *
   * The method returns `null` if no such request is present in the
   * cache.
   *
   * @param method The HTTP method used by the request.
   * @param url The URL to which the request was made.
   * @param data The data sent
   *        to the server with the request.
   * @return {?Promise<HttpAgent~Response>} A promise that will resolve to the
   *         server response with the body parsed as JSON, or `null` if
   *         no such request is present in the cache.
   */
  _getCachedData<B>(
    method: string,
    url: string,
    data?: UnknownParameters
  ): Promise<HttpAgentResponse<B>> | null {
    const cacheKey = this.getCacheKey(method, url, data);

    if (this._internalCacheOfPromises.has(cacheKey)) {
      return this._internalCacheOfPromises
        .get(cacheKey)
        .then((data: UnknownParameters) => this._clone(data));
    }

    if (this._cache.has(cacheKey)) {
      const cacheData = this._cache.get(cacheKey) as
        | HttpAgentResponse<B>
        | GenericErrorCacheData;

      if ('cachedError' in cacheData) {
        const error = new GenericError(
          cacheData.errorMessage,
          cacheData.errorParams
        );
        return Promise.reject(error);
      }

      return Promise.resolve<HttpAgentResponse<B>>(cacheData);
    }

    return null;
  }

  /**
   * Sends a new HTTP request using the specified method to the specified
   * url. The request will carry the provided data as query parameters if the
   * HTTP method is GET, but the data will be sent as request body for any
   * other request method.
   *
   * @param method HTTP method to use.
   * @param url The URL to which the request is sent.
   * @param data The data sent
   *        with the request.
   * @param options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the response
   *         with the body parsed as JSON.
   */
  _request<B>(
    method: string,
    url: string,
    data: UnknownParameters | undefined,
    options: HttpAgentRequestOptions
  ): Promise<HttpAgentResponse<B>> {
    const cacheKey = this.getCacheKey(method, url, data);

    const cachePromise = this._proxy
      .request<B>(method, url, data, options)
      .then(
        response => this._proxyResolved<B>(response),
        error => this._proxyRejected<B>(error)
      );

    this._internalCacheOfPromises.set(cacheKey, cachePromise);

    return cachePromise;
  }

  /**
   * Handles successful completion of an HTTP request by the HTTP proxy.
   *
   * The method also updates the internal cookie storage with the cookies
   * received from the server.
   *
   * @param {HttpAgent~Response} response Server response.
   * @return {HttpAgent~Response} The post-processed server response.
   */
  _proxyResolved<B>(response: HttpAgentResponse<B>): HttpAgentResponse<B> {
    let agentResponse: HttpAgentResponse<B> = {
      status: response.status,
      body: response.body,
      params: response.params,
      headers: response.headers,
      headersRaw: response.headersRaw,
      cached: false,
    };
    const cacheKey = this.getCacheKey(
      agentResponse.params.method,
      agentResponse.params.url,
      agentResponse.params.data
    );

    this._internalCacheOfPromises.delete(cacheKey);

    if (this._proxy.haveToSetCookiesManually()) {
      this._setCookiesFromResponse(agentResponse);
    }

    const { postProcessors, cache } = agentResponse.params.options;

    if (Array.isArray(postProcessors)) {
      for (const postProcessor of postProcessors) {
        agentResponse = postProcessor<B>(agentResponse);
      }
    }

    const pureResponse = this._cleanResponse(agentResponse);

    if (cache) {
      this._saveAgentResponseToCache(pureResponse);
    }

    return pureResponse;
  }

  /**
   * Handles rejection of the HTTP request by the HTTP proxy. The method
   * tests whether there are any remaining tries for the request, and if
   * there are any, it attempts re-send the request.
   *
   * The method rejects the internal request promise if there are no tries
   * left.
   *
   * @param error The error provided by the HttpProxy,
   *        carrying the error parameters, such as the request url, data,
   *        method, options and other useful data.
   * @return {Promise<HttpAgent~Response>} A promise that will either resolve to a
   *         server's response (with the body parsed as JSON) if there are
   *         any tries left and the re-tried request succeeds, or rejects
   *         with an error containing details of the cause of the request's
   *         failure.
   */
  _proxyRejected<B>(
    error: GenericError<HttpProxyErrorParams>
  ): Promise<HttpAgentResponse<B>> {
    const errorParams = error.getParams();
    const method = errorParams.method;
    const url = errorParams.url;
    const data = errorParams.data;
    const options = errorParams.options;
    const isAborted =
      options.fetchOptions?.signal?.aborted ||
      options.abortController?.signal.aborted;

    if (!isAborted && options.repeatRequest > 0) {
      options.repeatRequest--;

      return this._request(method, url, data, options);
    } else {
      const cacheKey = this.getCacheKey(method, url, data);
      this._internalCacheOfPromises.delete(cacheKey);

      const errorName = errorParams.errorName;
      const errorMessage = `${errorName}: ima.core.http.Agent:_proxyRejected: ${error.message}`;

      if (options.cacheFailedRequest) {
        /**
         * Cleans error params from data (abort controller, postProcessors, error cause response)
         * that cannot be persisted before saving the error to the cache.
         */
        const pureErrorParams = this._cleanErrorParams(errorParams);

        const errorData = {
          cachedError: true as const,
          errorMessage,
          errorParams: pureErrorParams,
        };

        this._cache.set(cacheKey, errorData, options.ttl);
      }

      const agentError = new GenericError(errorMessage, errorParams);

      return Promise.reject(agentError);
    }
  }

  /**
   * Prepares the provided request options object by filling in missing
   * options with default values and adding extra options used internally.
   *
   * @param options Optional request options.
   * @return Request options with set filled-in
   *         default values for missing fields, and extra options used
   *         internally.
   */
  _prepareOptions(
    options: Partial<HttpAgentRequestOptions> = {},
    url: string
  ): HttpAgentRequestOptions {
    const composedOptions = {
      ...this._defaultRequestOptions,
      ...options,
      postProcessors: [
        ...(this._defaultRequestOptions?.postProcessors || []),
        ...(options?.postProcessors || []),
      ],
      fetchOptions: {
        ...this._defaultRequestOptions?.fetchOptions,
        ...options?.fetchOptions,
        headers: {
          ...this._defaultRequestOptions?.fetchOptions?.headers,
          ...options?.fetchOptions?.headers,
        },
      },
    };

    if (composedOptions.fetchOptions?.credentials === 'include') {
      // mock default browser behavior for server-side (sending cookie with a fetch request)
      composedOptions.fetchOptions.headers.Cookie =
        this._cookie.getCookiesStringForCookieHeader(
          options.validateCookies ? url : undefined
        );
    }

    return composedOptions;
  }

  /**
   * Generates cache key suffix for an HTTP request to the specified URL with
   * the specified data.
   *
   * @param method The HTTP method used by the request.
   * @param url The URL to which the request is sent.
   * @param data The data sent
   *        with the request.
   * @return The suffix of a cache key to use for a request to the
   *         specified URL, carrying the specified data.
   */
  _getCacheKeySuffix(
    method: string,
    url: string,
    data?: UnknownParameters
  ): string {
    let dataQuery = '';
    if (data) {
      try {
        dataQuery = JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
      } catch (error) {
        console.warn('The provided data does not have valid JSON format', data);
      }
    }

    return `${method}:${url}?${dataQuery}`;
  }

  /**
   * Sets all cookies from the `Set-Cookie` response header to the
   * cookie storage.
   *
   * @param agentResponse The response of the server.
   */
  _setCookiesFromResponse<B>(agentResponse: HttpAgentResponse<B>): void {
    if (agentResponse.headersRaw) {
      const receivedCookies = agentResponse.headersRaw.getSetCookie();

      if (receivedCookies.length > 0) {
        this._cookie.parseFromSetCookieHeader(
          receivedCookies,
          this._defaultRequestOptions.validateCookies
            ? agentResponse.params.url
            : undefined
        );
      }
    }
  }

  /**
   * Saves the server response to the cache to be used as the result of the
   * next request of the same properties.
   *
   * @param agentResponse The response of the server.
   */
  _saveAgentResponseToCache<B>(agentResponse: HttpAgentResponse<B>): void {
    const cacheKey = this.getCacheKey(
      agentResponse.params.method,
      agentResponse.params.url,
      agentResponse.params.data
    );

    agentResponse.cached = true;

    this._cache.set(cacheKey, agentResponse, agentResponse.params.options.ttl);

    agentResponse.cached = false;
  }

  /**
   * Cleans cache response from data (abort controller, postProcessors), that cannot be persisted,
   * before saving the data to the cache.
   */
  _cleanResponse<B>(response: HttpAgentResponse<B>): HttpAgentResponse<B> {
    /**
     * Create copy of agentResponse without AbortController and AbortController signal and postProcessors.
     * Setting agentResponse with AbortController or signal or postProcessors into cache would result in crash.
     */
    const { signal, ...fetchOptions } =
      response.params.options.fetchOptions || {};
    const { abortController, postProcessors, ...options } =
      response.params.options || {};
    options.fetchOptions = fetchOptions;

    const pureResponse = {
      ...response,
      params: { ...response.params, options: { ...options } },
    };

    if (pureResponse.params.options.keepSensitiveHeaders !== true) {
      pureResponse.headers = {};
      pureResponse.params.options.fetchOptions.headers = {};
      delete pureResponse.headersRaw;
    }

    return pureResponse;
  }

  /**
   * Create a copy of response errorParams without AbortController, AbortController signal, postProcessors and error cause Response.
   * Setting errorParams with AbortController or signal or postProcessors or error cause response into cache would result in crashing.
   *
   * @param params the error params.
   *
   * @return Pure copy of errorParams without non-persistent data.
   */
  _cleanErrorParams(params: HttpProxyErrorParams): HttpProxyErrorParams {
    const { signal, ...fetchOptions } = params.options.fetchOptions || {};
    const { abortController, postProcessors, ...options } =
      params.options || {};
    options.fetchOptions = fetchOptions;

    if (!options.keepSensitiveHeaders) {
      options.fetchOptions.headers = {};
    }

    const safeParams = {
      ...params,
      options: { ...options },
    };

    return JSON.parse(JSON.stringify(safeParams));
  }
}
