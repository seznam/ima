import ns from '../namespace';
import CacheEntry from './CacheEntry';

ns.namespace('ima.cache');

/**
 * Factory for creating instances of {@linkcode CacheEntry}.
 */
export default class CacheFactory {
	static get $dependencies() {
		return [];
	}

	/**
	 * Create new instance of {@linkcode CacheEntry} with value a ttl.
	 *
	 * @param {*} value The cache entry value.
	 * @param {?number=} ttl Cache entry time to live in milliseconds. The
	 *        entry will expire after the specified amount of milliseconds.
	 * @return {CacheEntry} The created cache entry.
	 */
	createCacheEntry(value, ttl) {
		return new CacheEntry(value, ttl);
	}
}

ns.ima.cache.CacheFactory = CacheFactory;
