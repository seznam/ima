import ns from 'ima/namespace';
import CacheInterface from 'ima/cache/cache';

ns.namespace('ima.cache');

/**
 * Configurable generic implementation of the {@codelink ima.cache.Cache}
 * interface.
 *
 * @class CacheImpl
 * @implements ima.cache.Cache
 * @namespace ima.cache
 * @module ima
 * @submodule ima.cache
 *
 * @requires ima.storage.Storage
 * @requires vendor.$Helper
 *
 * @example
 *   if (cache.has('model.articles')) {
 *     return cache.get('model.articles');
 *   } else {
 *     var articles = getArticlesFromStorage();
 *     // cache for an hour
 *     cache.set('model.articles', articles, 60 * 60 * 1000);
 *   }
 */
export default class CacheImpl extends CacheInterface {
	/**
	 * Initializes the cache.
	 *
	 * @method constructor
	 * @constructor
	 * @param {ima.storage.Storage} cacheStorage The cache entry storage to
	 *        use.
	 * @param {ima.cache.CacheFactory} factory Which create new instance of cache
	 *        entry.
	 * @param {vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {{ttl: number, enabled: boolean}} [config={ttl: 30000, enabled: false}]
	 *        The cache configuration.
	 */
	constructor(cacheStorage, factory, Helper,
			config = { ttl: 30000, enabled: false }) {
		super();

		/**
		 * Cache entry storage.
		 *
		 * @property _cache
		 * @private
		 * @type {ima.storage.Storage}
		 */
		this._cache = cacheStorage;

		/**
		 * @property _factory
		 * @private
		 * @type {ima.cache.CacheFactory}
		 */
		this._factory = factory;

		/**
		 * Tha IMA.js helper methods.
		 *
		 * @private
		 * @property _Helper
		 * @type {vendor.$Helper}
		 */
		this._Helper = Helper;

		/**
		 * Default cache entry time to live in milliseconds.
		 *
		 * @property _ttl
		 * @private
		 * @type {number}
		 * @default this._config.ttl
		 */
		this._ttl = config.ttl;

		/**
		 * Flag signalling whether the cache is currently enabled.
		 *
		 * @property _enabled
		 * @private
		 * @type {boolean}
		 */
		this._enabled = config.enabled;
	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._cache.clear();
	}

	/**
	 * @inheritdoc
	 * @method has
	 */
	has(key) {
		if (!this._enabled || !this._cache.has(key)) {
			return false;
		}

		var cacheEntry = this._cache.get(key);
		if (cacheEntry && !cacheEntry.isExpired()) {
			return true;
		}

		this.delete(key);

		return false;
	}

	/**
	 * @inheritdoc
	 * @method get
	 */
	get(key) {
		if (this.has(key)) {
			var value = this._cache.get(key).getValue();

			return this._clone(value);
		}

		return null;
	}

	/**
	 * @inheritdoc
	 * @method set
	 */
	set(key, value, ttl = null) {
		if (!this._enabled) {
			return;
		}

		var cacheEntry = this._factory
				.createCacheEntry(this._clone(value), ttl || this._ttl);

		this._cache.set(key, cacheEntry);
	}

	/**
	 * @inheritdoc
	 * @method delete
	 */
	delete(key) {
		this._cache.delete(key);
	}

	/**
	 * @inheritdoc
	 * @method disable
	 */
	disable() {
		this._enabled = false;
		this.clear();
	}

	/**
	 * @inheritdoc
	 * @method enable
	 */
	enable() {
		this._enabled = true;
	}

	/**
	 * @inheritdoc
	 * @method serialize
	 */
	serialize() {
		var dataToSerialize = {};

		for (var key of this._cache.keys()) {
			var serializeEntry = this._cache.get(key).serialize();

			if ($Debug) {
				if (!this._canSerializeValue(serializeEntry.value)) {
					throw new Error(`ima.cache.CacheImpl:serialize You want ` +
							`to serialize ` +
							`${serializeEntry.value.toString()} for key ` +
							`${key}. Clear value from cache or change their ` +
							`type so that will be serializable with ` +
							`JSON.stringify.`);
				}
			}

			dataToSerialize[key] = serializeEntry;
		}

		return JSON
				.stringify(dataToSerialize)
				.replace(/<\/script/g, '<\\/script');
	}

	/**
	 * @inheritdoc
	 * @method deserialize
	 */
	deserialize(serializedData) {
		for (var key of Object.keys(serializedData)) {
			var cacheEntryItem = serializedData[key];
			this.set(key, cacheEntryItem.value, cacheEntryItem.ttl);
		}
	}

	/**
	 * @private
	 * @method _canSerializeValue
	 * @param {*} value
	 * @return {boolean}
	 */
	_canSerializeValue(value) {
		if (value instanceof Date ||
			value instanceof RegExp ||
			value instanceof Promise ||
			typeof value === 'function'
		) {
			return false;
		}

		if (value && value.constructor === Array) {
			for (var partValue of value) {
				if (!this._canSerializeValue(value[partValue])) {
					return false;
				}
			}
		}

		if (value && typeof value === 'object') {
			for (var valueKey of Object.keys(value)) {
				if (!this._canSerializeValue(value[valueKey])) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Clone only mutable values.
	 *
	 * @private
	 * @method _clone
	 * @param {*} value
	 * @return {*}
	 */
	_clone(value) {
		if (
			value !== null &&
			typeof value === 'object' &&
			!(value instanceof Promise)
		) {
			return this._Helper.clone(value);
		}

		return value;
	}
}

ns.ima.cache.CacheImpl = CacheImpl;
