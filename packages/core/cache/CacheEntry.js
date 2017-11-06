import ns from '../namespace';

ns.namespace('ima.cache');

/**
 * The cache entry is a typed container of cache data used to track the
 * creation and expiration of cache entries.
 */
export default class CacheEntry {
	/**
	 * Initializes the cache entry.
	 *
	 * @param {*} value The cache entry value.
	 * @param {number} ttl The time to live in milliseconds.
	 */
	constructor(value, ttl) {
		/**
		 * Cache entry value.
		 *
		 * @type {*}
		 */
		this._value = value;

		/**
		 * The time to live in milliseconds. The cache entry is considered
		 * expired after this time.
		 *
		 * @type {number}
		 */
		this._ttl = ttl;

		/**
		 * The timestamp of creation of this cache entry.
		 *
		 * @type {number}
		 */
		this._created = Date.now();
	}

	/**
	 * Returns {@code true} if this entry has expired.
	 *
	 * @return {boolean} {@code true} if this entry has expired.
	 */
	isExpired() {
		let now = Date.now();
		return now > this._created + this._ttl;
	}

	/**
	 * Exports this cache entry into a JSON-serializable object.
	 *
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
	 * @return {*} The entry value.
	 */
	getValue() {
		return this._value;
	}
}

ns.ima.cache.CacheEntry = CacheEntry;
