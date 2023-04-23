export type SerializedData<V = unknown> = {
  [key: string]: { value: V; ttl: number };
};

/**
 * The cache provides a temporary storage for expirable information. The
 * primary use of a cache is caching information obtained via costly means
 * (CPU-heavy computation or networking) to speed up the application's
 * performance when the same information needs to be retrieved multiple times.
 */
export abstract class Cache<V = unknown> {
  /**
   * Clears the cache by deleting all entries.
   */
  clear(): void {
    return;
  }

  /**
   * Tests whether the cache contains a fresh entry for the specified key. A
   * cache entry is fresh if the has not expired its TTL (time to live).
   *
   * The method always returns `false` if the cache is currently disabled.
   *
   * @param key The identifier of the cache entry.
   * @return `true` if the cache is enabled, the entry exists and has
   *         not expired yet.
   */
  has(key: string): boolean {
    return false;
  }

  /**
   * Returns the value of the entry identified by the specified key.
   *
   * The method returns `null` if the specified entry does not exist, has
   * already expired, or the cache is currently disabled.
   *
   * @param key The identifier of the cache entry.
   * @return The value of the specified cache entry, or `null` if the entry
   *         is not available.
   */
  get(key: string): V | null {
    return null;
  }

  /**
   * Sets the cache entry identified by the specified key to the provided
   * value. The entry is created if it does not exist yet.
   *
   * The method has no effect if the cache is currently disabled.
   *
   * @param key The identifier of the cache entry.
   * @param value The cache entry value.
   * @param ttl Cache entry time to live in milliseconds. The
   *        entry will expire after the specified amount of milliseconds. Use
   *        `null` or omit the parameter to use the default TTL of this cache.
   */
  set(key: string, value: V, ttl?: number | string): void {
    return;
  }

  /**
   * Deletes the specified cache entry. The method has no effect if the entry
   * does not exist.
   *
   * @param key The identifier of the cache entry.
   */
  delete(key: string): void {
    return;
  }

  /**
   * Disables the cache, preventing the retrieval of any cached entries and
   * reporting all cache entries as non-existing. Disabling the cache does
   * not however prevent modifying the existing or creating new cache
   * entries.
   *
   * Disabling the cache also clears all of its current entries.
   *
   * The method has no effect if the cache is already disabled.
   */
  disable(): void {
    return;
  }

  /**
   * Enables the cache, allowing the retrieval of cache entries.
   *
   * The method has no effect if the cache is already enabled.
   */
  enable(): void {
    return;
  }

  /**
   * Exports the state of this cache to an HTML-safe JSON string. The data
   * obtained by parsing the result of this method are compatible with the
   * {@link Cache#deserialize} method.
   *
   * @return A JSON string containing an object representing of the
   *         current state of this cache.
   */
  serialize(): string {
    return '';
  }

  /**
   * Loads the provided serialized cache data into this cache. Entries
   * present in this cache but not specified in the provided data will remain
   * in this cache intact.
   *
   * @param serializedData An
   *        object representing the state of the cache to load, obtained by
   *        parsing the JSON string returned by the {@link Cache#serialize}
   *        method.
   */
  deserialize(serializedData: SerializedData<V>): void {
    return;
  }
}
