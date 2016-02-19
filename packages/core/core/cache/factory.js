import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Cache');

/**
 * Factory for creating instances of Core.Cache.Entry.
 *
 * @class Factory
 * @namespace Core.Cache
 * @module Core
 * @submodule Core.Cache
 */
export default class Factory {

	/**
	 * Initializes the cache entry factory.
	 *
	 * @method constructor
	 * @constructor
	 * @param {function(new: Core.Cache.Entry, *, number)} Entry
	 */
	constructor(Entry) {

		/**
		 * @property _Entry
		 * @private
		 * @type {function(new: Core.Cache.Entry, *, number)}
		 */
		this._Entry = Entry;
	}

	/**
	 * Create new instance of Core.Cache.Entry with value a ttl.
	 *
	 * @method createCacheEntry
	 * @param {*} value The cache entry value.
	 * @param {?number=} ttl Cache entry time to live in milliseconds. The
	 *        entry will expire after the specified amount of milliseconds.
	 */
	createCacheEntry(value, ttl) {
		return new this._Entry(value, ttl);
	}
}

ns.Core.Cache.Factory = Factory;
