import * as Helpers from '@ima/helpers';

import { Cache } from './Cache';
import { CacheEntry, SerializedCacheEntry } from './CacheEntry';
import { CacheFactory } from './CacheFactory';
import { Storage } from '../storage/Storage';
import { UnknownParameters } from '../types';

/**
 * Configurable generic implementation of the {@link Cache} interface.
 *
 * @example
 * if (cache.has('model.articles')) {
 *   return cache.get('model.articles');
 * } else {
 *   let articles = getArticlesFromStorage();
 *   // cache for an hour
 *   cache.set('model.articles', articles, 60 * 60 * 1000);
 * }
 */
export class CacheImpl<V> extends Cache<V> {
  /**
   * Pre-compiled regex for escaping </script tags in serialized output.
   * This avoids recompiling the regex on every serialize() call.
   */
  private static readonly SCRIPT_TAG_REGEX = /<\/script/gi;

  protected _cache: Storage<CacheEntry<V>>;
  protected _factory: CacheFactory<V>;
  protected _Helper: typeof Helpers;
  protected _ttl: number;
  protected _enabled: boolean;

  /**
   * Initializes the cache.
   *
   * @param cacheStorage The cache entry storage to use.
   * @param factory Which create new instance of cache entry.
   * @param Helper The IMA.js helper methods.
   * @param config The cache configuration.
   */
  constructor(
    cacheStorage: Storage<CacheEntry<V>>,
    factory: CacheFactory<V>,
    Helper: typeof Helpers,
    { ttl = 30000, enabled = false }
  ) {
    super();

    this._cache = cacheStorage;
    this._factory = factory;

    /**
     * Tha IMA.js helper methods.
     */
    this._Helper = Helper;

    /**
     * Default cache entry time to live in milliseconds.
     */
    this._ttl = ttl;

    /**
     * Flag signalling whether the cache is currently enabled.
     */
    this._enabled = enabled;
  }

  /**
   * @inheritDoc
   */
  clear(): void {
    this._cache.clear();
  }

  /**
   * @inheritDoc
   */
  has(key: string): boolean {
    if (!this._enabled || !this._cache.has(key)) {
      return false;
    }

    const cacheEntry = this._cache.get!(key);

    if (cacheEntry && !cacheEntry.isExpired()) {
      return true;
    }

    this.delete(key);

    return false;
  }

  /**
   * @inheritDoc
   */
  get(key: string): V | null {
    if (this.has(key)) {
      const cacheEntryItem = this._cache.get(key);
      const value = cacheEntryItem!.getValue();

      return this._clone(value);
    }

    return null;
  }

  /**
   * @inheritDoc
   */
  set(key: string, value: V, ttl: number | string = 0): void {
    if (!this._enabled) {
      return;
    }

    const cacheEntry = this._factory.createCacheEntry(
      this._clone(value),
      ttl || this._ttl
    );

    this._cache.set(key, cacheEntry);
  }

  /**
   * @inheritDoc
   */
  delete(key: string): void {
    this._cache.delete(key);
  }

  /**
   * @inheritDoc
   */
  disable(): void {
    this._enabled = false;
    this.clear();
  }

  /**
   * @inheritDoc
   */
  enable(): void {
    this._enabled = true;
  }

  /**
   * @inheritDoc
   */
  serialize(): string {
    // Use Object.create(null) to avoid prototype chain overhead
    const dataToSerialize: Record<
      string,
      SerializedCacheEntry<V>
    > = Object.create(null);

    for (const key of this._cache.keys()) {
      const currentValue = this._cache.get(key);

      if (currentValue instanceof CacheEntry) {
        const serializeEntry = currentValue.serialize();

        if (serializeEntry.ttl === Infinity) {
          serializeEntry.ttl = 'Infinity';
        }

        if ($Debug) {
          if (!this._canSerializeValue(serializeEntry.value)) {
            throw new Error(
              `ima.core.cache.CacheImpl:serialize An ` +
                `attempt to serialize ` +
                `${serializeEntry.toString()}, stored ` +
                `using the key ${key}, was made, but the value ` +
                `cannot be serialized. Remove this entry from ` +
                `the cache or change its type so that can be ` +
                `serialized using JSON.stringify().`
            );
          }
        }

        dataToSerialize[key] = serializeEntry;
      }
    }

    // Use pre-compiled regex
    return JSON.stringify(dataToSerialize).replace(
      CacheImpl.SCRIPT_TAG_REGEX,
      '<\\/script'
    );
  }

  /**
   * @inheritDoc
   */
  deserialize(serializedData: {
    [key: string]: SerializedCacheEntry<V>;
  }): void {
    for (const key in serializedData) {
      const cacheEntryItem = serializedData[key];
      const ttl =
        cacheEntryItem.ttl === 'Infinity' ? Infinity : cacheEntryItem.ttl;

      this.set(key, cacheEntryItem.value, ttl);
    }
  }

  /**
   * Tests whether the provided value can be serialized into JSON.
   *
   * @param value The value to test whether or not it can be serialized.
   * @return `true` if the provided value can be serialized into JSON,
   *         `false` otherwise.
   */
  private _canSerializeValue(value: unknown): boolean {
    // Early exit for primitives
    const valueType = typeof value;

    if (
      value === null ||
      value === undefined ||
      valueType === 'string' ||
      valueType === 'number' ||
      valueType === 'boolean'
    ) {
      return true;
    }

    // Check for non-serializable types
    if (
      value instanceof Date ||
      value instanceof RegExp ||
      value instanceof Promise ||
      valueType === 'function'
    ) {
      console.warn('The provided value is not serializable: ', value);

      return false;
    }

    // Handle arrays
    if (value.constructor === Array) {
      for (const element of value as Array<unknown>) {
        if (!this._canSerializeValue(element)) {
          console.warn('The provided array is not serializable: ', value);

          return false;
        }
      }

      return true;
    }

    // Handle objects
    if (valueType === 'object') {
      for (const propertyName of Object.keys(value)) {
        if (
          !this._canSerializeValue((value as UnknownParameters)[propertyName])
        ) {
          console.warn(
            'The provided object is not serializable due to the ' +
              'following property: ',
            propertyName,
            value
          );

          return false;
        }
      }
    }

    return true;
  }

  /**
   * Attempts to clone the provided value, if possible. Values that cannot be
   * cloned (e.g. promises) will be simply returned.
   *
   * @param value The value to clone.
   * @return The created clone, or the provided value if the value cannot be
   *         cloned.
   */
  private _clone(value: V): V {
    // Early exit for null and primitives
    if (value == null) {
      return value;
    }

    const valueType = typeof value;

    // Only clone objects (arrays, plain objects, etc.)
    if (valueType === 'object' && !(value instanceof Promise)) {
      return this._Helper.clone(value);
    }

    return value;
  }
}
