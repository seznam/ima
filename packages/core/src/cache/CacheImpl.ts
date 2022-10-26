import Cache from './Cache';
import CacheEntry, {
  JSONSerializedCacheEntry,
  SerializedCacheEntry,
} from './CacheEntry';
import CacheFactory from './CacheFactory';
import Storage from '../storage/Storage';
import * as Helpers from '@ima/helpers';
import { UnknownParameters } from '../CommonTypes';

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
export default class CacheImpl extends Cache {
  protected _cache: Storage;
  protected _factory: CacheFactory;
  protected _Helper: typeof Helpers;
  protected _ttl: number;
  protected _enabled: boolean;
  /**
   * Initializes the cache.
   *
   * @param cacheStorage The cache entry storage to use.
   * @param factory Which create new instance of cache entry.
   * @param Helper The IMA.js helper methods.
   * @param [config={ttl: 30000, enabled: false}]
   *        The cache configuration.
   */
  constructor(
    cacheStorage: Storage,
    factory: CacheFactory,
    Helper: typeof Helpers,
    config: { ttl: number; enabled: boolean } = { ttl: 30000, enabled: false }
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
    this._ttl = config.ttl;

    /**
     * Flag signalling whether the cache is currently enabled.
     */
    this._enabled = config.enabled;

    this._init();
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._cache.clear();
  }

  /**
   * @inheritdoc
   */
  has(key: string) {
    if (!this._enabled || !this._cache.has(key)) {
      return false;
    }

    const cacheEntry = this._cache.get(key) as CacheEntry;
    if (cacheEntry && !cacheEntry.isExpired()) {
      return true;
    }

    this.delete(key);

    return false;
  }

  /**
   * @inheritdoc
   */
  get(key: string): unknown | null {
    if (this.has(key)) {
      const cacheEntryItem = this._cache.get(key) as CacheEntry;
      const value = cacheEntryItem.getValue();

      return this._clone(value);
    }

    return null;
  }

  /**
   * @inheritdoc
   */
  set(key: string, value: unknown, ttl: number | string = 0, created?: number) {
    if (!this._enabled) {
      return;
    }

    const cacheEntry = this._factory.createCacheEntry(
      this._clone(value),
      ttl || this._ttl,
      created
    );

    this._cache.set(key, cacheEntry);
  }

  /**
   * @inheritdoc
   */
  delete(key: string) {
    this._cache.delete(key);
  }

  /**
   * @inheritdoc
   */
  disable() {
    this._enabled = false;
    this.clear();
  }

  /**
   * @inheritdoc
   */
  enable() {
    this._enabled = true;
  }

  /**
   * @inheritdoc
   */
  serialize() {
    const dataToSerialize: UnknownParameters = {};

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
                `${(serializeEntry.value as CacheEntry).toString()}, stored ` +
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

    return JSON.stringify(dataToSerialize).replace(/<\/script/gi, '<\\/script');
  }

  /**
   * @inheritdoc
   */
  deserialize(serializedData: { [key: string]: SerializedCacheEntry }) {
    for (const key of Object.keys(serializedData)) {
      const cacheEntryItem = serializedData[key];

      if (cacheEntryItem.ttl === 'Infinity') {
        cacheEntryItem.ttl = Infinity;
      }

      this.set(
        key,
        cacheEntryItem.value,
        cacheEntryItem.ttl,
        cacheEntryItem.created
      );
    }
  }

  /**
   * Tests whether the provided value can be serialized into JSON.
   *
   * @param value The value to test whether or not it can be serialized.
   * @return `true` if the provided value can be serialized into JSON,
   *         `false` otherwise.
   */
  private _canSerializeValue(value: unknown) {
    if (
      value instanceof Date ||
      value instanceof RegExp ||
      value instanceof Promise ||
      typeof value === 'function'
    ) {
      console.warn('The provided value is not serializable: ', value);

      return false;
    }

    if (!value) {
      return true;
    }

    if (value.constructor === Array) {
      for (const element of value as Array<unknown>) {
        if (!this._canSerializeValue(element)) {
          console.warn('The provided array is not serializable: ', value);

          return false;
        }
      }
    }

    if (typeof value === 'object') {
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
  private _clone(value: unknown) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Promise)
    ) {
      return this._Helper.clone(value);
    }

    return value;
  }

  private _init() {
    for (const key of this._cache.keys()) {
      const entry = this._cache.get(key);

      if (!(entry instanceof CacheEntry)) {
        this.deserialize({
          [key]: {
            value: (entry as JSONSerializedCacheEntry)._value,
            ttl: (entry as JSONSerializedCacheEntry)._ttl,
            created: (entry as JSONSerializedCacheEntry)._created,
          },
        });
      }
    }
  }
}
