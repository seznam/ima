import ns from 'imajs/client/core/namespace.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('Core.Http');

/**
 * Implementation of the {@codelink Core.Interface.HttpAgent} interface with
 * internal caching of completed and ongoing HTTP requests and cookie storage.
 *
 * @class Agent
 * @implements Core.Interface.HttpAgent
 * @namespace Core.Http
 * @module Core
 * @submodule Core.Http
 *
 * @requires Core.Http.Proxy
 * @requires Core.Cache.Handler
 * @requires Core.Storage.Cookie
 * @requires Core.Interface.Dictionary
 */
class Agent extends ns.Core.Interface.HttpAgent {
	/**
	 * Initializes the HTTP handler.
	 *
	 * @method constructor
	 * @constructor
	 * @param {Core.Http.Proxy} proxy The low-level HTTP proxy for sending the
	 *        HTTP requests.
	 * @param {Core.Cache.Handler} cache Cache to use for caching ongoing and
	 *        completed requests.
	 * @param {Core.Storage.Cookie} cookie The cookie storage to use internally.
	 * @param {Object<string, *>} config Configuration of the HTTP handler for
	 *        the current application environment, specifying the various default
	 *        request option values.
	 * @example
	 *      http
	 *          .get('url', { data: data }, {
	 *              ttl: 2000,
	 *              repeatRequest: 1,
	 *              timeout: 2000,
	 *              accept: 'application/json'
	 *          })
	 *          .then((response) => {
	 *              //resolve
	 *          }
	 *          .catch((error) => {
	 *             //catch
	 *          });
	 * @example
	 *      http
	 *          .setDefaultHeader('Accept-Language', 'cs')
	 *          .clearDefaultHeaders();
	 */
	constructor(proxy, cache, cookie, config) {
		super();

		/**
		 * HTTP proxy, used to execute the HTTP requests.
		 *
		 * @property _proxy
		 * @private
		 * @type {Core.Http.Proxy}
		 */
		this._proxy = proxy;

		/**
		 * Internal request cache, used to cache both completed request results and
		 * ongoing requests.
		 *
		 * @property _cache
		 * @private
		 * @type {Core.Cache.Handler}
		 */
		this._cache = cache;

		/**
		 * Cookie storage, used to keep track of cookies received from the server
		 * and send them with the subsequent requests to the server.
		 *
		 * @property _cookie
		 * @private
		 * @type {Core.Storage.Cookie}
		 */
		this._cookie = cookie;

		/**
		 * Cache key prefix for response bodies (already parsed as JSON) of
		 * completed HTTP requests.
		 *
		 * @property _cachePrefix
		 * @private
		 * @type {string}
		 */
		this._cachePrefix = config.cachePrefix;

		/**
		 * Cache key prefix for promises representing HTTP requests in progress.
		 *
		 * @property _cachePrefixPromise
		 * @private
		 * @type {string}
		 */
		this._cachePrefixPromise = config.cachePrefixPromise;

		/**
		 * Default request options.
		 *
		 * @property _options
		 * @private
		 * @type {Object<string, (number|string)>}
		 */
		this._options = config;
	}

	/**
	 * Sends an HTTP GET request to the specified URL, sending the provided data
	 * as query parameters.
	 *
	 * @inheritdoc
	 * @override
	 * @method get
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as query parameters.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, and the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	get(url, data, options = {}) {
		return this._requestWithCheckCache('get', url, data, options);
	}

	/**
	 * Sends an HTTP POST request to the specified URL, sending the provided data
	 * as a request body.
	 *
	 * @inheritdoc
	 * @override
	 * @method post
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, and the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	post(url, data, options = {}) {
		return this._requestWithCheckCache('post', url, data, options);
	}

	/**
	 * Sends an HTTP PUT request to the specified URL, sending the provided data
	 * as a request body.
	 *
	 * @inheritdoc
	 * @override
	 * @method put
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, and the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	put(url, data, options = {}) {
		return this._requestWithCheckCache('put', url, data, options);
	}

	/**
	 * Sends an HTTP PATCH request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @inheritdoc
	 * @override
	 * @method patch
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, and the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	patch(url, data, options = {}) {
		return this._requestWithCheckCache('patch', url, data, options);
	}

	/**
	 * Sends an HTTP DELETE request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @inheritdoc
	 * @override
	 * @method delete
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, and the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	delete(url, data, options = {}) {
		return this._requestWithCheckCache('delete', url, data, options);
	}

	/**
	 * Generates a cache key to use for identifying a request to the specified
	 * URL and submitted data.
	 *
	 * @inheritdoc
	 * @override
	 * @method getCacheKey
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, string>} data The data associated with the request.
	 *        These can be either the query parameters of request body
	 *        parameters.
	 * @return {string} Key to use for identifying a request to the specifed URL
	 *         with the specified request data in the cache.
	 */
	getCacheKey(method, url, data) {
		return this._cachePrefix + this._getCacheKeySuffix(method, url, data);
	}

	/**
	 * Set constant header to all request.
	 *
	 * @inheritdoc
	 * @override
	 * @method setDefaultHeader
	 * @chainable
	 * @param {string} header The name of the header.
	 * @param {string} value The header value. To provide multiple values,
	 *        separate them with commas
	 *        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2).
	 * @return {Core.Interface.HttpAgent} This instance.
	 */
	setDefaultHeader(header, value) {
		this._proxy.setDefaultHeader(header,value);

		return this;
	}

	/**
	 * Clears all defaults headers sent with all requests.
	 *
	 * @inheritdoc
	 * @override
	 * @method clearDefaultHeaders
	 * @chainable
	 * @return {Core.Interface.HttpAgent} This instance.
	 */
	clearDefaultHeaders() {
		this._proxy.clearDefaultHeaders();

		return this;
	}

	/**
	 * Check cache and if data isnt available then make real request.
	 *
	 * @method _requestWithCheckCache
	 * @private
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send with the request.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}} options
	 *        HTTP request options, as described in the public API.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	_requestWithCheckCache(method, url, data, options) {
		var cachedData = this._getCachedData(method, url, data);

		if (cachedData) {
			return cachedData;
		}

		options = this._prepareOptions(options);

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
	 * @method _getCachedData
	 * @private
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request was made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        to the server with the request.
	 * @return {?Promise<*>} A promise that will resolve to the server response
	 *         body parsed as JSON, or {@code null} if no such request is present
	 *         in the cache.
	 */
	_getCachedData(method, url, data) {
		var promiseCacheKey = this._getRequestPromiseCacheKey(method, url, data);

		if (this._cache.has(promiseCacheKey)) {
			return this._cache.get(promiseCacheKey);
		}

		var responseCacheKey = this.getCacheKey(method, url, data);

		if (this._cache.has(responseCacheKey)) {
			var cacheData = this._cache.get(responseCacheKey);

			return Promise.resolve(cacheData);
		}

		return null;
	}

	/**
	 * Sends a new HTTP request using the specified method to the specified url.
	 * The request will carry the provided data as query parameters if the HTTP
	 * method is GET, but the data will be sent as request body for any other
	 * request method.
	 *
	 * @method _request
	 * @private
	 * @param {string} method HTTP method to use.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}} options
	 *        HTTP request options, as described in the public API.
	 * @return {Promise<*>} A promise that resolves the to response body parsed
	 *         as JSON.
	 */
	_request(method, url, data, options) {
		var requestPromiseKey = this._getRequestPromiseCacheKey(method, url, data);

		var cachePromise = (
			this._proxy
				.request(method, url, data, options)
				.then((response) => {
					return this._proxyResolved(response);
				},(errorParams) => {
					return this._proxyRejected(errorParams);
				})
		);
		this._cache.set(requestPromiseKey, cachePromise);

		return cachePromise;
	}

	/**
	 * Handles successful completion of an HTTP request by the HTTP proxy.
	 *
	 * The method also updates the internal cookie storage with the cookies
	 * recieved from the server.
	 *
	 * @method _proxyResolved
	 * @private
	 * @param {Vendor.SuperAgent.Response} response Server response.
	 * @return {*} HTTP response body parsed as JSON.
	 */
	_proxyResolved(response) {
		var results = response.body;
		var params = response.params;

		var method = params.method;
		var url = params.url;
		var data = params.data;

		var cachePromiseKey = this._getRequestPromiseCacheKey(method, url, data);
		var cacheKey = this.getCacheKey(method, url, data);

		this._cache.delete(cachePromiseKey);
		this._cache.set(cacheKey, results, params.options.ttl);

		if (this._proxy.haveToSetCookiesManually() && response.header) {
			var receivedCookies = response.header['set-cookie'];

			if (receivedCookies) {
				receivedCookies.forEach((cookieHeader) => {
					this._cookie.parseFromSetCookieHeader(cookieHeader);
				});
			}
		}

		return results;
	}

	/**
	 * Handles rejection of the HTTP request by the HTTP proxy. The method tests
	 * whether there are any remaining tries for the request, and if there are
	 * any, it attempts re-send the request.
	 *
	 * The method rejects the internal request promise if there are no tries
	 * left.
	 *
	 * @method _proxyRejected
	 * @private
	 * @param {Object<string, *>} errorParams Error parameters, containing the
	 *        request url, data, method, options and other usefull data.
	 */
	_proxyRejected(errorParams) {
		var method = errorParams.method;
		var url = errorParams.url;
		var data = errorParams.data;

		if (errorParams.options.repeatRequest > 0) {
			errorParams.options.repeatRequest--;

			return this._request(method, url, data, errorParams.options);
		} else {
			var cachePromiseKey = this._getRequestPromiseCacheKey(method, url, data);
			this._cache.delete(cachePromiseKey);

			var errorName = errorParams.errorName;
			var errorMessage = `${errorName}: Core.Http.Agent:_proxyRejected`
			var error = new CoreError(errorMessage, errorParams)
			return Promise.reject(error);
		}
	}

	/**
	 * Prepares the provided request options object by filling in missing options
	 * with default values and addding extra options used internally.
	 *
	 * @method _prepareOptions
	 * @private
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=}} options
	 *        Request options, as provided by the client code.
	 * @return {Object<string, (number|string)>} Request options with set
	 *         filled-in default values for missing fields, and extra options
	 *         used internally.
	 */
	_prepareOptions(options) {
		var extraOptions = {
			cookie: this._cookie.getCookiesString()
		};

		return Object.assign({}, this._options, extraOptions, options);
	}

	/**
	 * Generates the cache key identifying an HTTP request promise for an HTTP
	 * request in progress to the specified URL with the specified data.
	 *
	 * @method _getRequestPromiseCacheKey
	 * @private
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @return {string} The cache key identifying a promise for an ongoing HTTP
	 *         request for the specified URL and data.
	 */
	_getRequestPromiseCacheKey(method, url, data) {
		return this._cachePrefixPromise +
			this._getCacheKeySuffix(method, url, data);
	}

	/**
	 * Generates cache key suffix for an HTTP request to the specified URL with
	 * the specified data.
	 *
	 * @method _getCacheKeySuffix
	 * @private
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @return {string} The suffix of a cache key to use for a request to the
	 *         specified URL, carrying the specified data.
	 */
	_getCacheKeySuffix(method, url, data) {
		return `${method}:${url}?${JSON.stringify(data)}`;
	}
}

ns.Core.Http.Agent = Agent;
