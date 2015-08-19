import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Cache');

/**
 * Configurable generic implementation of the {@codelink Core.Interface.Cache}
 * interface.
 *
 * @class Handler
 * @implements Core.Interface.Cache
 * @namespace Core.Cache
 * @module Core
 * @submodule Core.Cache
 *
 * @requires Core.Interface.Storage
 *
 * @example
 *   if (cache.has('model.articles')) {
 *     return cache.get('model.articles');
 *   } else {
 *     var articles = getArticlesFromStorage();
 *     cache.set('model.articles', articles, 60 * 60 * 1000); // cache for an hour
 *   }
 */
export default class Handler extends ns.Core.Interface.Cache {
	/**
	 * Initializes the cache.
	 *
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Storage} cacheStorage The cache entry storage to
	 *        use.
	 * @param {Core.Cache.Factory} factory Which create new instance of cache entry
	 * @param {{ttl: number, enabled: false}} [config={ttl: 30000, enabled: false}]
	 */
	constructor(cacheStorage, factory, config = { ttl: 30000, enabled: false }) {
		super();

		/**
		 * Cache entry storage.
		 *
		 * @property _cache
		 * @private
		 * @type {Core.Interface.Storage}
		 */
		this._cache = cacheStorage;

		/**
		 * @property _factory
		 * @private
		 * @type {Core.Cache.Factory}
		 */
		this._factory = factory;

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
	 * Clear the cache by deleting all entries.
	 *
	 * @inheritDoc
	 * @override
	 * @method clear
	 */
	clear() {
		this._cache.clear();
	}

	/**
	 * Tests whether the cache contains a fresh entry for the specified key. A
	 * cache entry is fresh if the has not expired its TTL (time to live).
	 *
	 * The method always returns {@code false} if the cache is currently
	 * disabled.
	 *
	 * @inheritDoc
	 * @override
	 * @method has
	 * @param {string} key The identifier of the cache entry.
	 * @return {boolean} {@code true} if the cache is enabled, the entry exists
	 *         and has not expired yet.
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
	 * Returns the value of the entry identified by the specified key.
	 *
	 * The method returns {@code null} if the specified entry does not exist, has
	 * already expired, or the cache is currently disabled.
	 *
	 * @inheritDoc
	 * @override
	 * @method get
	 * @param {string} key The identifier of the cache entry.
	 * @return {*} The value of the specified cache entry, or {@code null} if the
	 *         entry is not available.
	 */
	get(key) {
		if (this.has(key)) {
			var value = this._cache.get(key).getValue();

			return this._clone(value);
		}

		return null;
	}

	/**
	 * Sets the cache entry identified by the specified key to the provided
	 * value. The entry is created if it does not exist yet.
	 *
	 * @inheritDoc
	 * @override
	 * @method set
	 * @param {string} key The identifier of the cache entry.
	 * @param {*} value The cache entry value.
	 * @param {?number=} ttl Cache entry time to live in milliseconds. The entry
	 *        will expire after the specified amount of milliseconds. Use
	 *        {@code null} or omit the parameter to use the default TTL of this
	 *        cache.
	 */
	set(key, value, ttl = null) {
		var cacheEntry = this._factory
				.createCacheEntry(this._clone(value), ttl || this._ttl);

		this._cache.set(key, cacheEntry);
	}

	/**
	 * Deletes the specified cache entry. The method has no effect if the entry
	 * does not exist.
	 *
	 * @inheritDoc
	 * @override
	 * @method delete
	 * @param {string} key The identifier of the cache entry.
	 */
	delete(key) {
		this._cache.delete(key);
	}

	/**
	 * Disables the cache, preventing the retrieval of any cached entries and
	 * reporting all cache entries as non-existing. Disabling the cache does not
	 * however prevent setting the existing or creating new cache entries.
	 *
	 * The method has no effect if the cache is already disabled.
	 *
	 * @inheritDoc
	 * @override
	 * @method disable
	 */
	disable() {
		this._enabled = false;
	}

	/**
	 * Enables the cache, allowing the retrieval of cache entries.
	 *
	 * The method has no effect if the cache is already enabled.
	 *
	 * @inheritDoc
	 * @override
	 * @method enable
	 */
	enable() {
		this._enabled = true;
	}

	/**
	 * Exports the state of this cache to a JSON string.
	 *
	 * @inheritDoc
	 * @override
	 * @method serialize
	 * @return {string} A JSON string containing an object representing of the
	 *         current state of this cache.
	 */
	serialize() {
		var dataToSerialize = {};

		for (var key of this._cache.keys()) {
			var serializeEntry = this._cache.get(key).serialize();

			if ($Debug) {
				if (!this._canSerializeValue(serializeEntry.value)) {
					 throw new Error(`Core.Cache.Handler:serialize You want to serialize ` +
							 `${serializeEntry.value.toString()} for key ${key}. Clear value from cache or ` +
							 `change their type so that will be serializable with JSON.stringify.`);
				}
			}

			dataToSerialize[key] = serializeEntry;
		}

		return JSON.stringify(dataToSerialize).replace(/<\/script/g, '<\\/script');
	}

	/**
	 * Deserialization data from JSON.
	 *
	 * @inheritDoc
	 * @override
	 * @method deserialize
	 * @param {Object<string, {value: *, ttl: number}>} serializedData An object
	 *         representing the state of the cache to load, obtained by parsing
	 *         the JSON string returned by the {@codelink serialize} method.
	 */
	deserialize(serializedData) {
		for (var key of Object.keys(serializedData)) {
			var cacheEntryItem = serializedData[key];
			this.set(key, cacheEntryItem.value, cacheEntryItem.ttl);
		}
	}

	/**
	 * Returns true if value can be serializable with JSON.stringify method.
	 *
	 * @method _canSerializeValue
	 * @param {string} key
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
	 * @method _clone
	 * @param {*} value
	 * @return {*}
	 */
	_clone(value) {
		if (value !== null && typeof value === 'object') {
			return ns.Vendor.$Helper.clone(value);
		}

		return value;
	}
}

ns.Core.Cache.Handler = Handler;
