export type SerializedCacheEntry = {
  value: unknown;
  ttl: number | string;
  created?: number;
};
export type JSONSerializedCacheEntry = {
  _value: unknown;
  _ttl: number | string;
  _created?: number;
};

/**
 * The cache entry is a typed container of cache data used to track the
 * creation and expiration of cache entries.
 */
export default class CacheEntry {
  /**
   * Cache entry value.
   */
  protected _value: unknown;
  /**
   * The time to live in milliseconds. The cache entry is considered
   * expired after this time.
   */
  protected _ttl: number | string;
  /**
   * The timestamp of creation of this cache entry.
   */
  protected _created: number;

  /**
   * Initializes the cache entry.
   *
   * @param value The cache entry value.
   * @param ttl The time to live in milliseconds.
   */
  constructor(value: unknown, ttl: number | string, created = Date.now()) {
    this._value = value;

    this._ttl = ttl;

    this._created = created;
  }

  /**
   * Returns `true` if this entry has expired.
   *
   * @return `true` if this entry has expired.
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
  serialize(): SerializedCacheEntry {
    return { value: this._value, ttl: this._ttl };
  }

  /**
   * Returns the entry value.
   */
  getValue(): unknown {
    return this._value;
  }
}
