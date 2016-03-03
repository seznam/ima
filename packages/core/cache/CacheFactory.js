import ns from 'ima/namespace';

ns.namespace('ima.cache');

/**
 * Factory for creating instances of ima.cache.CacheEntry.
 *
 * @class CacheFactory
 * @namespace ima.cache
 * @module ima
 * @submodule ima.cache
 */
export default class CacheFactory {

	/**
	 * Initializes the cache entry factory.
	 *
	 * @method constructor
	 * @constructor
	 * @param {function(new: ima.cache.CacheEntry, *, number)} CacheEntry
	 */
	constructor(CacheEntry) {

		/**
		 * @property _CacheEntry
		 * @private
		 * @type {function(new: ima.cache.CacheEntry, *, number)}
		 */
		this._CacheEntry = CacheEntry;
	}

	/**
	 * Create new instance of ima.cache.CacheEntry with value a ttl.
	 *
	 * @method createCacheEntry
	 * @param {*} value The cache entry value.
	 * @param {?number=} ttl Cache entry time to live in milliseconds. The
	 *        entry will expire after the specified amount of milliseconds.
	 */
	createCacheEntry(value, ttl) {
		return new this._CacheEntry(value, ttl);
	}
}

ns.ima.cache.CacheFactory = CacheFactory;
