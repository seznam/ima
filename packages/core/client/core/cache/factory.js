import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Cache');

/**
 * Factory for creating instace of Core.Cache.Entry.
 *
 * @class Factory
 * @namespace Core.Cache
 * @module Core
 * @submodule Core.Cache
 *
 * @requires Core.ObjectContainer
 */
export default class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Cache.Entry} Entry
	 */
	constructor(Entry) {

		/**
		 * @property _Entry
		 * @private
		 * @type {Core.Cache.Entry}
		 */
		this._Entry = Entry;
	}

	/**
	 * Create new instance of Core.Cache.Entry with value a ttl.
	 *
	 * @method createCacheEntry
	 * @param {*} value The cache entry value.
	 * @param {?number=} ttl Cache entry time to live in milliseconds. The entry
	 *        will expire after the specified amount of milliseconds.
	 */
	createCacheEntry(value, ttl) {
		return new this._Entry(value, ttl);
	}
}

ns.Core.Cache.Factory = Factory;
