import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Cache');

/**
 * The cache entry is a typed container of cache data used to track the
 * creation and expiration of cache entries.
 *
 * @class Entry
 * @namespace Core.Cache
 * @module Core
 * @submodule Core.Cache
 */
class Entry {

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
		 * The time to live in milliseconds. The cache entry is considered expired
		 * after this time.
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
		return now > (this._created + this._ttl);
	}

	/**
	 * Exports this cache entry into a JSON-serializable object.
	 *
	 * @method serialize
	 * @return {{value: *, ttl: number}} This entry exported to a
	 *         JSON-serializable object.
	 */
	serialize() {
		return {value: this._value, ttl: this._ttl};
	}

	/**
	 * Returns the entry value.
	 *
	 * @method getValue
	 * @return {*} The entry value.
	 */
	getValue() {
		return this._value;
	}
}

ns.Core.Cache.Entry = Entry;
