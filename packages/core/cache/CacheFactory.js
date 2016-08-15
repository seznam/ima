import ns from '../namespace';
import CacheEntry from './CacheEntry';

ns.namespace('ima.cache');

/**
 * Factory for creating instances of {@linkcode CacheEntry}.
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
	 * @param {function(new: CacheEntry, *, number)} CacheEntry
	 */
	constructor(CacheEntry) {

		/**
		 * @property _CacheEntry
		 * @private
		 * @type {function(new: CacheEntry, *, number)}
		 */
		this._CacheEntry = CacheEntry;
	}

	/**
	 * Create new instance of {@linkcode CacheEntry} with value a ttl.
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
