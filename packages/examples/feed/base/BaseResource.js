import ns from 'ima/namespace';

ns.namespace('app.base');

/**
 * Base class for Resource.
 * @class BaseResource
 * @namespace app.base
 * @module app.base
 *
 * @requires ima.http.HttpAgent
 */
export default class BaseResource {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.http.HttpAgent} http
	 * @param {string} url - API URL (Base server + api specific path.)
	 * @param {app.base.EntityFactory} entityFactory
	 * @param {ima.cache.Cache} cache
	 */
	constructor(http, url, entityFactory, cache) {

		/**
		 * Handler for HTTP requests.
		 *
		 * @property _http
		 * @private
		 * @type {ima.http.HttpAgent}
		 */
		this._http = http;

		/**
		 * API URL for specific resource.
		 *
		 * @property _apiUrl
		 * @private
		 * @type {string}
		 */
		this._apiUrl = url;

		/**
		 * Cache for caching parts of request response.
		 *
		 * @property _cache
		 * @private
		 * @type {ima.cache.Cache}
		 */
		this._cache = cache;

		/**
		 * Factory for creating entities.
		 *
		 * @property _entityFactory
		 * @private
		 * @type {app.base.EntityFactory}
		 */
		this._entityFactory = entityFactory;

		/**
		 * @property _defaultOptions
		 * @type {Object<string, number>}
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
	 * @return {Array<app.base.BaseEntity>}
	 */
	getEntity(id = null, data = {}, options = {}, force = false) {
		let url = this._getUrl(id);
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
	 * @return {app.base.BaseEntity}
	 */
	createEntity(data = {}, options = {}) {
		let url = this._getUrl();
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
		let url = this._apiUrl;

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
		let cacheKey = this._http.getCacheKey(url, data);
		this._cache.delete(cacheKey);
	}
}

ns.app.base.BaseResource = BaseResource;
