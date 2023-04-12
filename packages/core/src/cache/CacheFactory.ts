import { CacheEntry } from './CacheEntry';
import { Dependencies } from '../oc/ObjectContainer';

/**
 * Factory for creating instances of {@link CacheEntry}.
 */
export class CacheFactory<V> {
  static get $dependencies(): Dependencies {
    return [];
  }

  /**
   * Create a new instance of {@link CacheEntry} with value and ttl.
   *
   * @param value The cache entry value.
   * @param ttl Cache entry time to live in milliseconds. The
   *        entry will expire after the specified amount of milliseconds.
   * @param created Cache entry created time in milliseconds.
   * @return The created cache entry.
   */
  createCacheEntry(value: V, ttl: number | string): CacheEntry<V> {
    return new CacheEntry<V>(value, ttl);
  }
}
