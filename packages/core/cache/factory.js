import ns from 'ima/namespace';

ns.namespace('Ima.Cache');

/**
 * Factory for creating instances of Ima.Cache.Entry.
 *
 * @class Factory
 * @namespace Ima.Cache
 * @module Ima
 * @submodule Ima.Cache
 */
export default class Factory {

	/**
	 * Initializes the cache entry factory.
	 *
	 * @method constructor
	 * @constructor
	 * @param {function(new: Ima.Cache.Entry, *, number)} Entry
	 */
	constructor(Entry) {

		/**
		 * @property _Entry
		 * @private
		 * @type {function(new: Ima.Cache.Entry, *, number)}
		 */
		this._Entry = Entry;
	}

	/**
	 * Create new instance of Ima.Cache.Entry with value a ttl.
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

ns.Ima.Cache.Factory = Factory;
