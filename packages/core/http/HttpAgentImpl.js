import HttpAgent from './HttpAgent';
import GenericError from '../error/GenericError';

/**
 * Implementation of the {@codelink HttpAgent} interface with internal caching
 * of completed and ongoing HTTP requests and cookie storage.
 */
export default class HttpAgentImpl extends HttpAgent {
  /**
   * Initializes the HTTP handler.
   *
   * @param {HttpProxy} proxy The low-level HTTP proxy for sending the HTTP
   *        requests.
   * @param {Cache} cache Cache to use for caching ongoing and completed
   *        requests.
   * @param {CookieStorage} cookie The cookie storage to use internally.
   * @param {Object<string, *>} config Configuration of the HTTP handler for
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
   *              language: 'en',
   *              listeners: { 'progress': callbackFunction }
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
  constructor(proxy, cache, cookie, config) {
    super();

    /**
     * HTTP proxy, used to execute the HTTP requests.
     *
     * @type {HttpProxy}
     */
    this._proxy = proxy;

    /**
     * Internal request cache, used to cache completed request results.
     *
     * @type {Cache}
     */
    this._cache = cache;

    /**
     * Cookie storage, used to keep track of cookies received from the
     * server and send them with the subsequent requests to the server.
     *
     * @type {CookieStorage}
     */
    this._cookie = cookie;

    /**
     * Cache options.
     *
     * @type {Object<string, string>}
     */
    this._cacheOptions = config.cacheOptions;

    /**
     * Default request options.
     *
     * @type {{
     *         timeout: number,
     *         ttl: number,
     *         repeatRequest: number,
     *         headers: Object<string, string>,
     *         cache: boolean,
     *         withCredentials: boolean,
     *         fetchOptions: Object<string, *>,
     *         postProcessor: function(Object<string, *>)
     *       }}
     */
    this._defaultRequestOptions = config.defaultRequestOptions;

    /**
     * Internal request cache, used to cache ongoing requests.
     *
     * @type {Map<string, Promise<{
     *         status: number,
     *         body: *,
     *         params: {
     *           method: string,
     *           url: string,
     *           transformedUrl: string,
     *           data: Object<string, (boolean|number|string)>
     *         },
     *         headers: Object<string, string>,
     *         cached: boolean
     *       }>>}
     */
    this._internalCacheOfPromises = new Map();
  }

  /**
   * @inheritdoc
   */
  get(url, data, options = {}) {
    return this._requestWithCheckCache('get', url, data, options);
  }

  /**
   * @inheritdoc
   */
  post(url, data, options = {}) {
    return this._requestWithCheckCache(
      'post',
      url,
      data,
      Object.assign({}, options, { cache: false })
    );
  }

  /**
   * @inheritdoc
   */
  put(url, data, options = {}) {
    return this._requestWithCheckCache(
      'put',
      url,
      data,
      Object.assign({}, options, { cache: false })
    );
  }

  /**
   * @inheritdoc
   */
  patch(url, data, options = {}) {
    return this._requestWithCheckCache(
      'patch',
      url,
      data,
      Object.assign({}, options, { cache: false })
    );
  }

  /**
   * @inheritdoc
   */
  delete(url, data, options = {}) {
    return this._requestWithCheckCache(
      'delete',
      url,
      data,
      Object.assign({}, options, { cache: false })
    );
  }

  /**
   * @inheritdoc
   */
  getCacheKey(method, url, data) {
    return (
      this._cacheOptions.prefix + this._getCacheKeySuffix(method, url, data)
    );
  }

  /**
   * @inheritdoc
   */
  setDefaultHeader(header, value) {
    this._proxy.setDefaultHeader(header, value);

    return this;
  }

  /**
   * @inheritdoc
   */
  clearDefaultHeaders() {
    this._proxy.clearDefaultHeaders();

    return this;
  }

  /**
   * Check cache and if data isnt available then make real request.
   *
   * @param {string} method The HTTP method to use.
   * @param {string} url The URL to which the request should be sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to
   *        send with the request.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the response
   *         with body parsed as JSON.
   */
  _requestWithCheckCache(method, url, data, options) {
    options = this._prepareOptions(options);

    if (options.cache) {
      let cachedData = this._getCachedData(method, url, data);

      if (cachedData) {
        return cachedData;
      }
    }

    return this._request(method, url, data, options);
  }

  /**
   * Tests whether an ongoing or completed HTTP request for the specified URL
   * and data is present in the internal cache and, if it is, the method
   * returns a promise that resolves to the response body parsed as JSON.
   *
   * The method returns {@code null} if no such request is present in the
   * cache.
   *
   * @param {string} method The HTTP method used by the request.
   * @param {string} url The URL to which the request was made.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        to the server with the request.
   * @return {?Promise<HttpAgent~Response>} A promise that will resolve to the
   *         server response with the body parsed as JSON, or {@code null} if
   *         no such request is present in the cache.
   */
  _getCachedData(method, url, data) {
    let cacheKey = this.getCacheKey(method, url, data);

    if (this._internalCacheOfPromises.has(cacheKey)) {
      return this._internalCacheOfPromises.get(cacheKey);
    }

    if (this._cache.has(cacheKey)) {
      let cacheData = this._cache.get(cacheKey);

      return Promise.resolve(cacheData);
    }

    return null;
  }

  /**
   * Sends a new HTTP request using the specified method to the specified
   * url. The request will carry the provided data as query parameters if the
   * HTTP method is GET, but the data will be sent as request body for any
   * other request method.
   *
   * @param {string} method HTTP method to use.
   * @param {string} url The URL to which the request is sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        with the request.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the response
   *         with the body parsed as JSON.
   */
  _request(method, url, data, options) {
    let cacheKey = this.getCacheKey(method, url, data);

    let cachePromise = this._proxy
      .request(method, url, data, options)
      .then(
        response => this._proxyResolved(response),
        error => this._proxyRejected(error)
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
  _proxyResolved(response) {
    let agentResponse = {
      status: response.status,
      body: response.body,
      params: response.params,
      headers: response.headers,
      headersRaw: response.headersRaw,
      cached: false
    };
    let cacheKey = this.getCacheKey(
      agentResponse.params.method,
      agentResponse.params.url,
      agentResponse.params.data
    );

    this._internalCacheOfPromises.delete(cacheKey);

    if (this._proxy.haveToSetCookiesManually()) {
      this._setCookiesFromResponse(agentResponse);
    }

    let { postProcessor, cache } = agentResponse.params.options;
    if (typeof postProcessor === 'function') {
      agentResponse = postProcessor(agentResponse);
    }

    if (cache) {
      this._saveAgentResponseToCache(agentResponse);
    }

    return agentResponse;
  }

  /**
   * Handles rejection of the HTTP request by the HTTP proxy. The method
   * tests whether there are any remaining tries for the request, and if
   * there are any, it attempts re-send the request.
   *
   * The method rejects the internal request promise if there are no tries
   * left.
   *
   * @param {GenericError} error The error provided by the HttpProxy,
   *        carrying the error parameters, such as the request url, data,
   *        method, options and other useful data.
   * @return {Promise<HttpAgent~Response>} A promise that will either resolve to a
   *         server's response (with the body parsed as JSON) if there are
   *         any tries left and the re-tried request succeeds, or rejects
   *         with an error containing details of the cause of the request's
   *         failure.
   */
  _proxyRejected(error) {
    let errorParams = error.getParams();
    let method = errorParams.method;
    let url = errorParams.url;
    let data = errorParams.data;

    if (errorParams.options.repeatRequest > 0) {
      errorParams.options.repeatRequest--;

      return this._request(method, url, data, errorParams.options);
    } else {
      let cacheKey = this.getCacheKey(method, url, data);
      this._internalCacheOfPromises.delete(cacheKey);

      let errorName = errorParams.errorName;
      let errorMessage = `${errorName}: ima.http.Agent:_proxyRejected: ${
        error.message
      }`;
      let agentError = new GenericError(errorMessage, errorParams);
      return Promise.reject(agentError);
    }
  }

  /**
   * Prepares the provided request options object by filling in missing
   * options with default values and addding extra options used internally.
   *
   * @param {HttpAgent~RequestOptions} options Optional request options.
   * @return {HttpAgent~RequestOptions} Request options with set filled-in
   *         default values for missing fields, and extra options used
   *         internally.
   */
  _prepareOptions(options) {
    let composedOptions = Object.assign(
      {},
      this._defaultRequestOptions,
      options
    );

    composedOptions.headers = Object.assign(
      { Cookie: this._cookie.getCookiesStringForCookieHeader() },
      this._defaultRequestOptions.headers,
      options.headers || {}
    );

    return composedOptions;
  }

  /**
   * Generates cache key suffix for an HTTP request to the specified URL with
   * the specified data.
   *
   * @param {string} method The HTTP method used by the request.
   * @param {string} url The URL to which the request is sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        with the request.
   * @return {string} The suffix of a cache key to use for a request to the
   *         specified URL, carrying the specified data.
   */
  _getCacheKeySuffix(method, url, data) {
    return `${method}:${url}?${JSON.stringify(data).replace(/<\/script/gi, '<\\/script')}`;
  }

  /**
   * Sets all cookies from the {@code Set-Cookie} response header to the
   * cookie storage.
   *
   * @param {HttpAgent~Response} agentResponse The response of the server.
   */
  _setCookiesFromResponse(agentResponse) {
    if (agentResponse.headersRaw) {
      let receivedCookies = agentResponse.headersRaw.raw()['set-cookie'];

      if (receivedCookies) {
        receivedCookies.forEach(cookieHeader => {
          this._cookie.parseFromSetCookieHeader(cookieHeader);
        });
      }
    }
  }

  /**
   * Saves the server response to the cache to be used as the result of the
   * next request of the same properties.
   *
   * @param {HttpAgent~Response} agentResponse The response of the server.
   */
  _saveAgentResponseToCache(agentResponse) {
    let cacheKey = this.getCacheKey(
      agentResponse.params.method,
      agentResponse.params.url,
      agentResponse.params.data
    );

    agentResponse.cached = true;
    let ttl = agentResponse.params.options.ttl;
    this._cache.set(cacheKey, agentResponse, ttl);
    agentResponse.cached = false;
  }
}
