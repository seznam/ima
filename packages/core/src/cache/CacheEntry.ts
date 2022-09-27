/**
 * The cache entry is a typed container of cache data used to track the
 * creation and expiration of cache entries.
 */
export default class CacheEntry {
  protected _value: unknown;
  protected _ttl: number | string;
  protected _created: number;

  /**
   * Initializes the cache entry.
   *
   * @param {*} value The cache entry value.
   * @param ttl The time to live in milliseconds.
   */
  constructor(value: unknown, ttl: number | string) {
    /**
     * Cache entry value.
     */
    this._value = value;

    /**
     * The time to live in milliseconds. The cache entry is considered
     * expired after this time.
     */
    this._ttl = ttl;

    /**
     * The timestamp of creation of this cache entry.
     */
    this._created = Date.now();
  }

  /**
   * Returns `true` if this entry has expired.
   *
   * @return {boolean} `true` if this entry has expired.
   */
  isExpired(): boolean {
    const now = Date.now();
    return now > this._created + (this._ttl as number);
  }

  /**
   * Exports this cache entry into a JSON-serializable object.
   *
   * This entry exported to a
   *         JSON-serializable object.
   */
  serialize(): { value: unknown; ttl: number | string } {
    return { value: this._value, ttl: this._ttl };
  }

  /**
   * Returns the entry value.
   */
  getValue(): unknown {
    return this._value;
  }
}
