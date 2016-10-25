import Cache from 'ima/cache/Cache';
import HttpAgent from 'ima/http/HttpAgent';
import AbstractEntity from 'app/model/AbstractEntity';
import AbstractEntityFactory from 'app/model/AbstractEntityFactory';

/**
 * Base class for model resource.
 *
 * @class AbstractResource
 * @namespace app.model
 * @module app.model
 *
 * @requires ima.http.HttpAgent
 */
export default class AbstractResource {

	/**
	 * @method constructor
	 * @constructor
	 * @param {HttpAgent} http
	 * @param {string} url API URL (Base server + api specific path.)
	 * @param {AbstractEntityFactory} entityFactory
	 * @param {Cache} cache
	 */
	constructor(http, url, entityFactory, cache) {

		/**
		 * Handler for HTTP requests.
		 *
		 * @private
		 * @property _http
		 * @type {HttpAgent}
		 */
		this._http = http;

		/**
		 * API URL for specific resource.
		 *
		 * @private
		 * @property _apiUrl
		 * @type {string}
		 */
		this._apiUrl = url;

		/**
		 * Cache for caching parts of request response.
		 *
		 * @private
		 * @property _cache
		 * @type {Cache}
		 */
		this._cache = cache;

		/**
		 * Factory for creating entities.
		 *
		 * @private
		 * @property _entityFactory
		 * @type {AbstractEntityFactory}
		 */
		this._entityFactory = entityFactory;

		/**
		 * @property _defaultOptions
		 * @type {Object<string, number>}
		 * @default { ttl: 3600000, timeout: 2000, repeatRequest: 1 }
		 */
		this._defaultOptions = {
			ttl: 3600000,
			timeout: 2000,
			repeatRequest: 1
		};
	}

	/**
	 * Gets 1 entity from http and returns Entity.
	 *
	 * @method getEntity
	 * @param {?string=} [id=null] ID for get entity from API.
	 * @param {Object<string, *>=} [data={}]
	 * @param {{ttl: number=, timeout: number=, repeatRequest: number=}=} options
	 *        Request options.
	 * @param {boolean} [force=false] Forces request, doesn't use cache.
	 * @return {Promise<(AbstractEntity|AbstractEntity[])>}
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
	 * Posts data to the REST API and returns a new entity.
	 *
	 * @method createEntity
	 * @param {Object<string, *>} [data={}]
	 * @param {{ttl: number=, timeout: number=, repeatRequest: number=}=} options
	 *        Request options.
	 * @return {Promise<AbstractEntity>}
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
	 * Generates the URL to which the HTTP request should be made.
	 *
	 * @private
	 * @method _getUrl
	 * @param {?string=} [id=null]
	 * @return {string}
	 */
	_getUrl(id = null) {
		let url = this._apiUrl;

		if (id) {
			url += '/' + id;
		}

		return url;
	}

	/**
	 * Composes the HTTP request options using the default options and the
	 * provided overrides.
	 *
	 * @private
	 * @method _getOptions
	 * @param {{ttl: number=, timeout: number=, repeatRequest: number=}} options
	 * @return {{ttl: number, timeout: number, repeatRequest: number}}
	 */
	_getOptions(options) {
		return Object.assign({}, this._defaultOptions, options);
	}

	/**
	 * Clears cache data associated with the specified HTTP request.
	 *
	 * @method _clearCacheForRequest
	 * @param {string} url The URL to which the request was made (without a
	 *        query string).
	 * @param {Object<string, (number|string)>} data Query data sent with the
	 *        request.
	 */
	_clearCacheForRequest(url, data) {
		let cacheKey = this._http.getCacheKey(url, data);
		this._cache.delete(cacheKey);
	}
}
