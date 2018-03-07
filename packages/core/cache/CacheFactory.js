import CacheEntry from './CacheEntry';

/**
 * Factory for creating instances of {@link CacheEntry}.
 */
export default class CacheFactory {
  static get $dependencies() {
    return [];
  }

  /**
   * Create a new instance of {@link CacheEntry} with value and ttl.
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
