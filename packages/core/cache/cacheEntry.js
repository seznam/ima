import ns from 'ima/namespace';

ns.namespace('Ima.Cache');

/**
 * The cache entry is a typed container of cache data used to track the
 * creation and expiration of cache entries.
 *
 * @class CacheEntry
 * @namespace Ima.Cache
 * @module Ima
 * @submodule Ima.Cache
 */
export default class CacheEntry {

	/**
	 * Initializes the cache entry.
	 *
	 * @constructor
	 * @method constructor
	 * @param {*} value The cache entry value.
	 * @param {number} ttl The time to live in milliseconds.
	 */
	constructor(value, ttl) {
		/**
		 * Cache entry value.
		 *
		 * @property _value
		 * @private
		 * @type {*}
		 */
		this._value = value;

		/**
		 * The time to live in milliseconds. The cache entry is considered
		 * expired after this time.
		 *
		 * @property _ttl
		 * @private
		 * @type {number}
		 */
		this._ttl = ttl;

		/**
		 * The timestamp of creation of this cache entry.
		 *
		 * @property _created
		 * @private
		 * @type {number}
		 */
		this._created = Date.now();
	}

	/**
	 * Returns {@code true} if this entry has expired.
	 *
	 * @method isExpired
	 * @return {boolean} {@code true} if this entry has expired.
	 */
	isExpired() {
		var now = Date.now();
		return now > this._created + this._ttl;
	}

	/**
	 * Exports this cache entry into a JSON-serializable object.
	 *
	 * @method serialize
	 * @return {{value: *, ttl: number}} This entry exported to a
	 *         JSON-serializable object.
	 */
	serialize() {
		return { value: this._value, ttl: this._ttl };
	}

	/**
	 * Returns the entry value. If entry value is type of object returns clone
	 * of that object.
	 *
	 * @method getValue
	 * @return {*} The entry value.
	 */
	getValue() {
		return this._value;
	}
}

ns.Ima.Cache.CacheEntry = CacheEntry;
