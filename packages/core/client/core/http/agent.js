import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

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
export default class Agent extends ns.Core.Interface.HttpAgent {
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
	 *        request option values and cache option values.
	 * @example
	 *      http
	 *          .get('url', { data: data }, {
	 *              ttl: 2000,
	 *              repeatRequest: 1,
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
	constructor(proxy, cache, cookie, config) {
		super();

		/**
		 * HTTP proxy, used to execute the HTTP requests.
		 *
		 * @private
		 * @property _proxy
		 * @type {Core.Http.Proxy}
		 */
		this._proxy = proxy;

		/**
		 * Internal request cache, used to cache both completed request results and
		 * ongoing requests.
		 *
		 * @private
		 * @property _cache
		 * @type {Core.Cache.Handler}
		 */
		this._cache = cache;

		/**
		 * Cookie storage, used to keep track of cookies received from the server
		 * and send them with the subsequent requests to the server.
		 *
		 * @private
		 * @property _cookie
		 * @type {Core.Storage.Cookie}
		 */
		this._cookie = cookie;

		/**
		 * Cache options.
		 *
		 * @private
		 * @property _cacheOptions
		 * @type {Object<string, string>}
		 */
		this._cacheOptions = config.cacheOptions;

		/**
		 * Default request options.
		 *
		 * @private
		 * @property _defaultRequestOptions
		 * @type {Object<string, (number|string)>}
		 */
		this._defaultRequestOptions = config.defaultRequestOptions;
	}

	/**
	 * Sends an HTTP GET request to the specified URL, sending the provided data
	 * as query parameters.
	 *
	 * @inheritDoc
	 * @override
	 * @method get
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as query parameters.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers. The {@code cache} can be used to bypass the cache
	 *        of pending and finished HTTP requests.
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
	 * @inheritDoc
	 * @override
	 * @method post
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
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
	 * Sends an HTTP PUT request to the specified URL, sending the provided data
	 * as a request body.
	 *
	 * @inheritDoc
	 * @override
	 * @method put
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
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
	 * Sends an HTTP PATCH request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @inheritDoc
	 * @override
	 * @method patch
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
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
	 * Sends an HTTP DELETE request to the specified URL, sending the provided
	 * data as a request body.
	 *
	 * @inheritDoc
	 * @override
	 * @method delete
	 * @param {string} url The URL to which the request should be made.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send to the server as request body.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=}=} options
	 *        Optional request options. The {@code timeout} specifies the request
	 *        timeout in milliseconds, the {@code ttl} specified how long the
	 *        request may be cached in milliseconds, the
	 *        {@code repeatRequest} specifies the maximum number of tries to
	 *        repeat the request if the request fails, The {@code headers} set
	 *        request headers.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
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
	 * Generates a cache key to use for identifying a request to the specified
	 * URL and submitted data.
	 *
	 * @inheritDoc
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
		return this._cacheOptions.prefix + this._getCacheKeySuffix(method, url, data);
	}

	/**
	 * Set constant header to all request.
	 *
	 * @inheritDoc
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
		this._proxy.setDefaultHeader(header, value);

		return this;
	}

	/**
	 * Clears all defaults headers sent with all requests.
	 *
	 * @inheritDoc
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
	 * @private
	 * @method _requestWithCheckCache
	 * @param {string} method The HTTP method to use.
	 * @param {string} url The URL to which the request should be sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data to
	 *        send with the request.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=}} options
	 *        HTTP request options, as described in the public API.
	 * @return {Promise<*>} A promise that resolves to the response body parsed
	 *         as JSON.
	 */
	_requestWithCheckCache(method, url, data, options) {
		options = this._prepareOptions(options);

		if (options.cache) {
			var cachedData = this._getCachedData(method, url, data);

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
	 * @private
	 * @method _getCachedData
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
	 * @private
	 * @method _request
	 * @param {string} method HTTP method to use.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=}} options
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
				}, (errorParams) => {
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
	 * @private
	 * @method _proxyResolved
	 * @param {Vendor.SuperAgent.Response} response Server response.
	 * @return {{status: number, body: *, params: Object, headers: Object, cached: boolean}}
	 */
	_proxyResolved(response) {
		var agentResponse = {
			status: response.status,
			body: response.body,
			params: response.params,
			headers: response.header,
			cached: false
		};
		var cachePromiseKey = this._getRequestPromiseCacheKey(
			agentResponse.params.method,
			agentResponse.params.url,
			agentResponse.params.data
		);

		this._cache.delete(cachePromiseKey);

		if (agentResponse.params.options.cache) {
			this._saveAgentResponseToCache(agentResponse);
		}

		if (this._proxy.haveToSetCookiesManually()) {
			this._setCookiesFromResponse(agentResponse);
		}

		return agentResponse;
	}

	/**
	 * Handles rejection of the HTTP request by the HTTP proxy. The method tests
	 * whether there are any remaining tries for the request, and if there are
	 * any, it attempts re-send the request.
	 *
	 * The method rejects the internal request promise if there are no tries
	 * left.
	 *
	 * @private
	 * @method _proxyRejected
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
			var errorMessage = `${errorName}: Core.Http.Agent:_proxyRejected`;
			var error = new IMAError(errorMessage, errorParams);
			return Promise.reject(error);
		}
	}

	/**
	 * Prepares the provided request options object by filling in missing options
	 * with default values and addding extra options used internally.
	 *
	 * @private
	 * @method _prepareOptions
	 * @param {{timeout: number=, ttl: number=, repeatRequest: number=,
	 *        headers: Object<string, string>=, cache: boolean=}} options
	 *        HTTP request options, as described in the public API.
	 * @return {Object<string, (number|string)>} Request options with set
	 *         filled-in default values for missing fields, and extra options
	 *         used internally.
	 */
	_prepareOptions(options) {
		var extraOptions = {
			cookie: this._cookie.getCookiesString(),
			headers: {}
		};

		var composedOptions = Object.assign(
			{},
			this._defaultRequestOptions,
			extraOptions,
			options
		);

		composedOptions.headers = Object.assign(
			{},
			this._defaultRequestOptions.headers,
			options.headers || {}
		);

		return composedOptions;
	}

	/**
	 * Generates the cache key identifying an HTTP request promise for an HTTP
	 * request in progress to the specified URL with the specified data.
	 *
	 * @private
	 * @method _getRequestPromiseCacheKey
	 * @param {string} method The HTTP method used by the request.
	 * @param {string} url The URL to which the request is sent.
	 * @param {Object<string, (boolean|number|string|Date)>} data The data sent
	 *        with the request.
	 * @return {string} The cache key identifying a promise for an ongoing HTTP
	 *         request for the specified URL and data.
	 */
	_getRequestPromiseCacheKey(method, url, data) {
		return this._cacheOptions.prefixPromise +
			this._getCacheKeySuffix(method, url, data);
	}

	/**
	 * Generates cache key suffix for an HTTP request to the specified URL with
	 * the specified data.
	 *
	 * @private
	 * @method _getCacheKeySuffix
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

	/**
	 * Set all cookies from response headers set-cookie.
	 *
	 * @private
	 * @method setCookiesFromResponse
	 * @param {{status: number, body: *, params: Object, headers: Object, cached: boolean}} agentResponse
	 */
	_setCookiesFromResponse(agentResponse) {
		if (agentResponse.headers) {
			var receivedCookies = agentResponse.headers['set-cookie'];

			if (receivedCookies) {
				receivedCookies.forEach((cookieHeader) => {
					this._cookie.parseFromSetCookieHeader(cookieHeader);
				});
			}
		}
	}

	/**
	 * Save agent response to cache for next request.
	 *
	 * @private
	 * @method _saveAgentResponseToCache
	 * @param {{status: number, body: *, params: Object, headers: Object, cached: boolean}} agentResponse
	 */
	_saveAgentResponseToCache(agentResponse) {
		var cacheKey = this.getCacheKey(
			agentResponse.params.method,
			agentResponse.params.url,
			agentResponse.params.data
		);

		var responseClone = Object.assign({}, agentResponse);
		responseClone.cached = true;

		this._cache.set(cacheKey, responseClone, agentResponse.params.options.ttl);
	}
}

ns.Core.Http.Agent = Agent;
