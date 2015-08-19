import ns from 'imajs/client/core/namespace';

ns.namespace('App.Base');

/**
 * Base class for Resource.
 * @class Resource
 * @extends App.Interface.Resource
 * @namespace App.Base
 * @module App.Base
 *
 * @requires App.Http.Handler
 * @requires Vendor.Rsvp
 */
class Resource extends ns.App.Interface.Resource {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Http} http
	 * @param {String} url - API URL (Base server + api specific path.)
	 * @param {App.Base.EntityFactory} entityFactory
	 * @param {Core.Cache.Handler} cache
	 */
	constructor(http, url, entityFactory, cache) {
		super();

		/**
		 * Handler for HTTP requests.
		 *
		 * @property _http
		 * @private
		 * @type {Core.Interface.Http}
		 */
		this._http = http;

		/**
		 * API URL for specific resource.
		 *
		 * @property _apiUrl
		 * @private
		 * @type {String}
		 */
		this._apiUrl = url;

		/**
		 * Cache for caching parts of request response.
		 *
		 * @property _cache
		 * @private
		 * @type {Core.Cache.Handler}
		 */
		this._cache = cache;

		/**
		 * Factory for creating entities.
		 *
		 * @property _entityFactory
		 * @private
		 * @type {App.Base.EntityFactory}
		 */
		this._entityFactory = entityFactory;

		/**
		 * @property _defaultOptions
		 * @type {Object}
		 * @default { ttl: 3600000, timeout: 2000, repeatRequest: 1 }
		 * */
		this._defaultOptions = { ttl: 3600000, timeout: 2000, repeatRequest: 1 };

	}

	/**
	 * Gets 1 entity from http and returns Entity.
	 *
	 * @method getEntity
	 * @param {String} [id=null] ID for get entity from API.
	 * @param {Object} [data={}]
	 * @param {Object} [options={}] Possible keys { ttl: {number}(in ms), timeout: {number}(in ms), repeatRequest: {number} }
	 * @param {Boolean} [force=false] Forces request, doesn't use cache.
	 * @return {App.Base.Entity}
	 */
	getEntity(id = null, data = {}, options = {}, force = false) {
		var url = this._getUrl(id);
		options = this._getOptions(options);

		if (force) {
			this._clearCacheForRequest(url, data);
		}

		return this._http
			.get(url, data, options)
			.then((result) => {
				return this._entityFactory.createEntity(result.body);
			}, (error) => {
				throw error;
			});
	}

	/**
	 * Posts data to http and returns new Entity.
	 *
	 * @method createEntity
	 * @param {Object} [data={}]
	 * @param {Object} [options={}] Possible keys { ttl: {number}(in ms), timeout: {number}(in ms), repeatRequest: {number} }
	 * @return {App.Base.Entity}
	 */
	createEntity(data = {}, options = {}) {
		var url = this._getUrl();
		options = this._getOptions(options);

		return this._http
			.post(url, data, options)
			.then((result) => {
				return this._entityFactory.createEntity(result.body);
			}, (error) => {
				throw error;
			});
	}

	/**
	 * Return request url.
	 *
	 * @method _getUrl
	 * @private
	 * @param {String} [id=null]
	 * @return {String}
	 */
	_getUrl(id = null) {
		var url = this._apiUrl;

		if (id) {
			url += '/' + id;
		}

		return url;
	}

	/**
	 * Return request options.
	 *
	 * @method _getOptions
	 * @private
	 * @param {Object} options
	 * @return {Object}
	 */
	_getOptions(options) {
		return Object.assign(this._defaultOptions, options);
	}

	/**
	 * Clear data in cache for request.
	 *
	 * @method _clearCacheForRequest
	 * @param {String} url
	 * @param {Object} data
	 */
	_clearCacheForRequest(url, data) {
		var cacheKey = this._http.getCacheKey(url, data);
		this._cache.delete(cacheKey);
	}
}

ns.App.Base.Resource = Resource;
