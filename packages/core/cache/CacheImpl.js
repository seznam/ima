import ns from '../namespace';
import Cache from './Cache';

ns.namespace('ima.cache');

/**
 * Configurable generic implementation of the {@codelink Cache} interface.
 *
 * @example
 *   if (cache.has('model.articles')) {
 *     return cache.get('model.articles');
 *   } else {
 *     let articles = getArticlesFromStorage();
 *     // cache for an hour
 *     cache.set('model.articles', articles, 60 * 60 * 1000);
 *   }
 */
export default class CacheImpl extends Cache {
  /**
	 * Initializes the cache.
	 *
	 * @param {Storage} cacheStorage The cache entry storage to use.
	 * @param {CacheFactory} factory Which create new instance of cache entry.
	 * @param {vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {{ttl: number, enabled: boolean}} [config={ttl: 30000, enabled: false}]
	 *        The cache configuration.
	 */
  constructor(
    cacheStorage,
    factory,
    Helper,
    config = { ttl: 30000, enabled: false }
  ) {
    super();

    /**
		 * Cache entry storage.
		 *
		 * @type {Storage}
		 */
    this._cache = cacheStorage;

    /**
		 * @type {CacheFactory}
		 */
    this._factory = factory;

    /**
		 * Tha IMA.js helper methods.
		 *
		 * @type {vendor.$Helper}
		 */
    this._Helper = Helper;

    /**
		 * Default cache entry time to live in milliseconds.
		 *
		 * @type {number}
		 */
    this._ttl = config.ttl;

    /**
		 * Flag signalling whether the cache is currently enabled.
		 *
		 * @type {boolean}
		 */
    this._enabled = config.enabled;
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
  has(key) {
    if (!this._enabled || !this._cache.has(key)) {
      return false;
    }

    let cacheEntry = this._cache.get(key);
    if (cacheEntry && !cacheEntry.isExpired()) {
      return true;
    }

    this.delete(key);

    return false;
  }

  /**
	 * @inheritdoc
	 */
  get(key) {
    if (this.has(key)) {
      let value = this._cache.get(key).getValue();

      return this._clone(value);
    }

    return null;
  }

  /**
	 * @inheritdoc
	 */
  set(key, value, ttl = null) {
    if (!this._enabled) {
      return;
    }

    let cacheEntry = this._factory.createCacheEntry(
      this._clone(value),
      ttl || this._ttl
    );

    this._cache.set(key, cacheEntry);
  }

  /**
	 * @inheritdoc
	 */
  delete(key) {
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
    let dataToSerialize = {};

    for (let key of this._cache.keys()) {
      let serializeEntry = this._cache.get(key).serialize();

      if ($Debug) {
        if (!this._canSerializeValue(serializeEntry.value)) {
          throw new Error(
            `ima.cache.CacheImpl:serialize An ` +
              `attempt to serialize ` +
              `${serializeEntry.value.toString()}, stored ` +
              `using the key ${key}, was made, but the value ` +
              `cannot be serialized. Remove this entry from ` +
              `the cache or change its type so that can be ` +
              `serialized using JSON.stringify().`
          );
        }
      }

      dataToSerialize[key] = serializeEntry;
    }

    return JSON.stringify(dataToSerialize).replace(/<\/script/g, '<\\/script');
  }

  /**
	 * @inheritdoc
	 */
  deserialize(serializedData) {
    for (let key of Object.keys(serializedData)) {
      let cacheEntryItem = serializedData[key];
      this.set(key, cacheEntryItem.value, cacheEntryItem.ttl);
    }
  }

  /**
	 * Tests whether the provided value can be serialized into JSON.
	 *
	 * @param {*} value The value to test whether or not it can be serialized.
	 * @return {boolean} {@code true} if the provided value can be serialized
	 *         into JSON, {@code false} otherwise.
	 */
  _canSerializeValue(value) {
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
      for (let element of value) {
        if (!this._canSerializeValue(element)) {
          console.warn('The provided array is not serializable: ', value);

          return false;
        }
      }
    }

    if (typeof value === 'object') {
      for (let propertyName of Object.keys(value)) {
        if (!this._canSerializeValue(value[propertyName])) {
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
	 * @param {*} value The value to clone.
	 * @return {*} The created clone, or the provided value if the value cannot
	 *         be cloned.
	 */
  _clone(value) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Promise)
    ) {
      return this._Helper.clone(value);
    }

    return value;
  }
}

ns.ima.cache.CacheImpl = CacheImpl;
