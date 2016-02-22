import ns from 'ima/namespace';

ns.namespace('Ima.Cache');

/**
 * Factory for creating instances of Ima.Cache.CacheEntry.
 *
 * @class CacheFactory
 * @namespace Ima.Cache
 * @module Ima
 * @submodule Ima.Cache
 */
export default class CacheFactory {

	/**
	 * Initializes the cache entry factory.
	 *
	 * @method constructor
	 * @constructor
	 * @param {function(new: Ima.Cache.CacheEntry, *, number)} CacheEntry
	 */
	constructor(CacheEntry) {

		/**
		 * @property _CacheEntry
		 * @private
		 * @type {function(new: Ima.Cache.CacheEntry, *, number)}
		 */
		this._CacheEntry = CacheEntry;
	}

	/**
	 * Create new instance of Ima.Cache.CacheEntry with value a ttl.
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

ns.Ima.Cache.CacheFactory = CacheFactory;
