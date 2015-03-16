import ns from 'core/namespace/ns.js';

ns.namespace('Core.Http');

/**
 * Handler for http request.
 *
 * @class Handler
 * @extends Core.Interface.Http
 * @namespace Core.Http
 * @module Core
 * @submodule Core.Http
 *
 * @requires Core.Http.Proxy
 * @requires Core.Cache.Handler
 * @requires Core.Storage.Cookie
 * @requires Core.Interface.Dictionary
 */
class Handler extends ns.Core.Interface.Http{

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Http.Proxy} proxy
	 * @param {Core.Cache.Handler} cache
	 * @param {Core.Storage.Cookie} cookie
	 * @param {Core.Interface.Dictionary} dictionary
	 * @param {Promise} promise
	 * @param {Object} config
	 * @example
	 *      http
	 *          .get('url', {data: data}, {ttl: 2000, repeatRequest: 1, timeout: 2000, accept: 'application/json'})
	 *          .then((respond) => {
	 *              //resolve
	 *          }
	 *          .catch((error) => {
	 *             //catch
	 *          });
	 * @example
	 *      http
	 *          .setConstantHeader('Accept-Language', 'cs')
	 *          .clearConstantHeader();
	 */
	constructor(proxy, cache, cookie, dictionary, promise, config) {
		super();

		/**
		 * @property _proxy
		 * @private
		 * @type {Core.Http.Proxy}
		 * @default proxy
		 */
		this._proxy = proxy;

		/**
		 * @property _cache
		 * @private
		 * @type {Core.Cache.Handler}
		 * @default cache
		 */
		this._cache = cache;

		/**
		 * @property _cookie
		 * @private
		 * @type {Core.Storage.Cookie}
		 * @default cookie
		 */
		this._cookie = cookie;

		/**
		 * @property _dictionary
		 * @private
		 * @type {Core.Interface.Dictionary}
		 * @default dictionary
		 */
		this._dictionary = dictionary;

		/**
		 * @property _promise
		 * @private 
		 * @type {Promise}
		 * @default promise
		 */
		this._promise = promise;

		/**
		 * Cache prefix for http requests.
		 *
		 * @property _cachePrefix
		 * @private
		 * @type {String}
		 * @default 'http.'
		 */
		this._cachePrefix = config.cachePrefix;

		/**
		 * Cache prefix for promises.
		 *
		 * @property _cachePrefixPromise
		 * @private
		 * @type {String}
		 * @default 'http.promise.'
		 */
		this._cachePrefixPromise = config.cachePrefixPromise;

		/**
		 * Default options for request.
		 *
		 * @property _options
		 * @private
		 * @type {Object}
		 * */
		this._options = {
			ttl: config.ttl,
			timeout: config.timeout,
			repeatRequest: config.repeatRequest,
			accept: config.accept
		};

	}

	/**
	 * Return data from api for GET request.
	 *
	 * @method get
	 * @param {String} url
	 * @param {Object} [data]
	 * @param {Object} [options] - possibility keys {ttl, timeout, repeatRequest}
	 * @return {Promise}
	 */
	get(url, data, options) {
		return this._requestWithCheckCache('get', url, data, options);
	}

	/**
	 * Return data from api for POST request.
	 *
	 * @method post
	 * @param {String} url
	 * @param {Object} [data]
	 * @param {Object} [options]  - possibility keys {ttl, timeout, repeatRequest}
	 * @return {Promise}
	 */
	post(url, data, options) {
		return this._requestWithCheckCache('post', url, data, options);
	}

	/**
	 * Return data from api for PUT request.
	 *
	 * @method put
	 * @param {String} url
	 * @param {Object} [data]
	 * @param {Object} [options] - possibility keys {ttl, timeout, repeatRequest}
	 * @return {Promise}
	 */
	put(url, data, options) {
		return this._requestWithCheckCache('put', url, data, options);
	}

	/**
	 * Return data from api for DELETE request.
	 *
	 * @method delete
	 * @param {String} url
	 * @param {Object} [data]
	 * @param {Object} [options] - possibility keys {ttl, timeout, repeatRequest}
	 * @return {Promise}
	 */
	delete(url, data, options) {
		return this._requestWithCheckCache('delete', url, data, options);
	}

	/**
	 * Return data from api for PATCH request.
	 *
	 * @method patch
	 * @param {String} url
	 * @param {Object} [data]
	 * @param {Object} [options] - possibility keys {ttl, timeout, repeatRequest}
	 * @return {Promise}
	 */
	patch(url, data, options) {
		return this._requestWithCheckCache('patch', url, data, options);
	}

	/**
	 * Return cached data for request.
	 *
	 * @method _getCachedData
	 * @private
	 * @param {String} url
	 * @param {Object} data
	 * @return {Promise|null}
	 */
	_getCachedData(url, data) {
		var cacheKey = this.getCacheKey(url, data);
		var cachePromiseKey = this._getCachePromiseKey(url, data);

		if (this._cache.has(cachePromiseKey)) {
			return this._cache.get(cachePromiseKey);
		}

		if (this._cache.has(cacheKey)) {
			var cacheData = this._cache.get(cacheKey);

			return this._promise.resolve(cacheData);
		}

		return null;
	}

	/**
	 * Check cache and if data isnt available then make real request.
	 *
	 * @method _requestWithCheckCache
	 * @private
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} [data={}]
	 * @param {Object} [options={timeout: 2000, ttl: 0, repeatRequest: 1}] - possibility keys {timeout, ttl, repeatRequest, accept, language, cookie}
	 * @return {Promise}
	 */
	_requestWithCheckCache(method, url, data, options) {
		var cachedData = this._getCachedData(url, data);

		if (cachedData) {
			return cachedData;
		}

		options = this._getOptions(options);

		return this._request(method, url, data, options);
	}

	/**
	 * Make real http request on proxy.
	 *
	 * @method _request
	 * @private
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} data
	 * @param {Object} options
	 * @return {Promise}
	 */
	_request(method, url, data, options) {
		var cachePromiseKey = this._getCachePromiseKey(url, data);

		var cachePromise =(
			this._proxy
				.request(method, url, data, options)
				.then((respond) => {
					return this._proxyResolved(respond);
				},(errorParams) => {
					return this._proxyRejected(errorParams);
				})
		);
		this._cache.set(cachePromiseKey, cachePromise);

		return cachePromise;
	}

	/**
	 * Proxy request resolved.
	 *
	 * @method _proxyResolved
	 * @private
	 * @param {Object} respond proxy respond
	 * @return {Mixed} return resolved results
	 */
	_proxyResolved(respond) {
		var results = respond.body;
		var params = respond.params;

		var cachePromiseKey = this._getCachePromiseKey(params.url, params.data);
		var cacheKey = this.getCacheKey(params.url, params.data);

		this._cache.delete(cachePromiseKey);
		this._cache.set(cacheKey, results, params.options.ttl);

		if (this._proxy.haveSetCookieManually()) {
			var settedCookies = respond.header['set-cookie'];

			if (settedCookies) {
				settedCookies.forEach((setCookieHeader) => {
					this._cookie.parseFromSetCookieHeader(setCookieHeader);
				});
			}
		}

		return results;
	}

	/**
	 * Proxy request rejected.
	 *
	 * @method _proxyRejected
	 * @private
	 * @param {Object} errorParams
	 * */
	_proxyRejected(errorParams) {
		if (errorParams.options.repeatRequest > 0) {
			errorParams.options.repeatRequest--;

			return this._request(errorParams.method, errorParams.url, errorParams.data, errorParams.options);
		} else {
			var cachePromiseKey = this._getCachePromiseKey(errorParams.url, errorParams.data);
			this._cache.delete(cachePromiseKey);

			return this._promise.reject(ns.oc.create('$Error', errorParams.errorName + ': Core.Http.Handler:_proxyRejected', errorParams));
		}

	}

	/**
	 * Return options for request.
	 *
	 * @method _getOptions
	 * @private
	 * @param {Object} options
	 * @return {Object}
	 */
	_getOptions(options) {
		var extendOptions = {
			language: this._dictionary.getLanguage(),
			cookie: this._cookie.getCookiesString()
		};

		return  Object.assign(this._options, extendOptions, options);
	}


	/**
	 * Return cache key.
	 *
	 * @method getCacheKey
	 * @param {String} url
	 * @param {Object} data
	 * @return {String}
	 */
	getCacheKey(url, data) {
		return this._cachePrefix + this._getCachePostfixKey(url, data);
	}

	/**
	 * Return cache promise key.
	 *
	 * @method _getCachePromiseKey
	 * @private
	 * @param {String} url
	 * @param {Object} data
	 * @return {String}
	 */
	_getCachePromiseKey(url, data) {
		return this._cachePrefixPromise + this._getCachePostfixKey(url, data);
	}

	/**
	 * Set constant header to all request.
	 *
	 * @method setConstantHeader
	 * @chainable
	 * @param {String} header
	 * @param {String} value
	 */
	setConstantHeader(header, value) {
		this._proxy.setConstantHeader(header,value);

		return this;
	}

	/**
	 * Clear constant header to all request.
	 *
	 * @method clearConstantHeader
	 * @chainable
	 */
	clearConstantHeader() {
		this._proxy.clearConstantHeader();

		return this;
	}

	/**
	 * Return cache postfix key.
	 *
	 * @method _getCachePostfixKey
	 * @private
	 * @param {String} url
	 * @param {Object} data
	 * @return {String}
	 */
	_getCachePostfixKey(url, data) {
		return url + JSON.stringify(data);
	}

}

ns.Core.Http.Handler = Handler;
