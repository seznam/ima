import ns from 'core/namespace/ns.js';

ns.namespace('Core.Cache');

/**
 * @class Handler
 * @namespace Core.Cache
 * @module Core
 * @submodule Core.Cache
 *
 * @requires Core.Interface.Storage
 */
class Handler {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Storage} cacheStorage
	 * @param {Object} [config={TTL: 30000, cached: false}]
	 * @example
	 * 		if (cache.has('model.articles')) {
	 * 			return cache.get('model.articles');
	 * 		} else {
	 * 			cache.set('model.articles', articles, 60 * 60 * 1000); // cached for hour
	 * 		}
	 */
	constructor(cacheStorage, config = {TTL: 30000, cached: false}) {
		/**
		 * Keep config.
		 *
		 * @property _config
		 * @private
		 * @type {Object}
		 * @default config
		 */
		this._config = config;

		/**
		 * Time to live in [ms].
		 *
		 * @property _TTL
		 * @private
		 * @type {Number}
		 * @default this._config.TTL
		 */
		this._TTL = this._config.TTL;

		/**
		 * Flag for quick enabled and disabled cache.
		 *
		 * @property _cached
		 * @private
		 * @type {Boolean}
		 * @default this._config.cached
		 */
		this._cached = this._config.cached;

		/**
		 * Map for cache
		 *
		 * @property _cache
		 * @private
		 * @type {Core.Interface.Storage}
		 * @default cacheStorage
		 */
		this._cache = cacheStorage;
	}

	/**
	 * Clear all cache.
	 *
	 * @method clear
	 */
	clear() {
		this._cache.clear();
	}

	/**
	 * Return true if key exist in cache.
	 *
	 * @method has
	 * @param {String} key
	 * @return {Boolean}
	 */
	has(key){
		var hashedKey = this._hash(key);

		if (this._cache.has(hashedKey)) {
			var cachedData = this._cache.get(hashedKey);

			if (cachedData.isLive() && this._cached) {
				return true;
			}

		}

		return false;
	}

	/**
	 * Return cached value for key. If key doesnt exist return null.
	 *
	 * @method get
	 * @param {String} key
	 * @return {*}
	 */
	get(key) {

		if (this.has(key)) {
			var hashedKey = this._hash(key);

			return this._cache.get(hashedKey).getValue();
		} else {
			throw ns.oc.create('$Error', `Core.Cache.Handler:get isn't stored value for key '${key}'.`, {key});
		}

	}

	/**
	 * Set value to cache for key.
	 *
	 * @method set
	 * @param {String} key
	 * @param {*} value
	 * @param {Number} [TTL=this._TTL]
	 */
	set(key, value, TTL) {
		var hasdedKey = this._hash(key);
		var cacheData = ns.oc.create('$CacheData', value, TTL || this._TTL);

		this._cache.set(hasdedKey, cacheData);
	}

	/**
	 * Delete value in cache for key.
	 *
	 * @method delete
	 * @param {String} key
	 */
	delete(key) {

		if (this.has(key)) {
			var hashedKey = this._hash(key);

			this._cache.delete(hashedKey);
		}

	}

	/**
	 * Disbale cache.
	 *
	 * @method disable
	 */
	disable() {
		this._cached = false;
	}

	/**
	 * Enable cache
	 *
	 * @method enable
	 */
	enable() {
		this._cached = true;
	}

	/**
	 * Hashed key
	 *
	 * @method _hash
	 * @private
	 * @param {String} key
	 * @return {String}
	 */
	_hash(key) {
		return key;
	}

	/**
	 * Serialization data from cache.
	 *
	 * @method serialize
	 * @return {JSON}
	 */
	serialize() {
		var dataToSerialize = {};

		for (var key of this._cache.keys()) {
			dataToSerialize[key] = this._cache.get(key).getData();
		}

		return JSON.stringify(dataToSerialize);
	}


	/**
	 * Deserialization data from JSON.
	 *
	 * @method deserialize
	 * @param {Object} dataToDeserialize
	 */
	deserialize(dataToDeserialize) {

		for (var key of Object.keys(dataToDeserialize)) {
			var cacheDataItem = dataToDeserialize[key];
			this.set(key, cacheDataItem.value, cacheDataItem.TTL);
		}

	}
}

ns.Core.Cache.Handler = Handler;