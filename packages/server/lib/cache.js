/**
 * Server-side cache implementation for the rendered page being the responses
 * of HTTP GET requests.
 */
class Cache {
  /**
   * Initializes the cache.
   *
   * @param {{enabled: (boolean|function(Express.Request): boolean), cacheKeyGenerator: ?function(Express.Request): string, entryTtl: number, unusedEntryTtl: number}} cacheConfig
   *        The cache configuration. See app/environment.js for details.
   */
  constructor(cacheConfig) {
    /**
     * The cache configuration. See app/environment.js for details.
     *
     * @type {{enabled: (boolean|function(Express.Request): boolean), cacheKeyGenerator: ?function(Express.Request): string, entryTtl: number, unusedEntryTtl: number}}
     */
    this._cacheConfig = cacheConfig;

    /**
     * Whether or not the cache or enabled. If set to a function, the
     * function can enable this cache for only the requests for which the
     * function returns `true`.
     *
     * @type {(boolean|function(Express.Request): boolean)}
     */
    this._enabled = cacheConfig.enabled;

    /**
     * The actual cache, represented as a map of cache keys, generated from
     * the properties of the requests, to entries containing the rendered
     * pages.
     *
     * @type {Map<string, Entry>}
     */
    this._cache = new Map();

    /**
     * The cache key generator for entries.
     *
     * @type {function(Express.Request): string}
     */
    this._keyGenerator = cacheConfig.cacheKeyGenerator || defaultKeyGenerator;

    /**
     * The maximum cache entries in cache.
     *
     * @type {number}
     */
    this._maxEntries = cacheConfig.maxEntries || 100;
  }

  /**
   * Retrieves the rendered page for requests matching the provided one. The
   * request equality is determined by the current key generator.
   *
   * The method returns `null` if no page for such request is currently
   * cached.
   *
   * @param {Express.Request} request The current express.js HTTP request.
   * @return {?string} The cached rendered page content, or `null`.
   */
  get(request) {
    let key = this._keyGenerator(request);

    if (!this._cache.has(key)) {
      return null;
    }

    let entry = this._cache.get(key);

    if (entry.shouldBeDiscarded) {
      return null;
    }

    return entry.value;
  }

  /**
   * Stores the provided page content within this cache for use with all
   * requests matching the specified one. The request equality is determined
   * by the current key generator.
   *
   * It is strongly recommended to use this method only for successfully
   * generated (HTTP 200 OK) pages that are not SPA pages (these are already
   * cached by the SPA page server).
   *
   * @param {Express.Request} request The express.js HTTP request.
   * @param {string} pageContent The rendered page content.
   * @return {boolean}
   */
  set(request, pageContent) {
    this._runGarbageCollector();

    if (typeof this._enabled === 'boolean') {
      if (!this._enabled) {
        return false;
      }
    } else if (!this._enabled(request)) {
      return false;
    }

    if (this._cache.size >= this._maxEntries) {
      return false;
    }

    let key = this._keyGenerator(request);
    this._cache.set(key, new Entry(pageContent, this._cacheConfig));

    return true;
  }

  /**
   * Traverses the contents of this cache and deletes all entries that are
   * either expired or haven't been used for a long time.
   *
   * @private
   */
  _runGarbageCollector() {
    for (let pair of this._cache.entries()) {
      let key = pair[0];
      let entry = pair[1];
      if (entry.shouldBeDiscarded) {
        this._cache.delete(key);
      }
    }
  }
}

/**
 * Class for representing and easier management of the server-side cache
 * entries.
 */
class Entry {
  /**
   * Creates a new server cache entry.
   *
   * @param {string} value The entry value.
   * @param {{enabled: (boolean|function(Express.Request): boolean), cacheKeyGenerator: ?function(Express.Request): string, entryTtl: number, unusedEntryTtl: number}} cacheConfig
   *        The cache configuration. See app/environment.js for details.
   */
  constructor(value, cacheConfig) {
    /**
     * The entry value.
     *
     * @type {string}
     */
    this._value = value;

    /**
     * The time, in milliseconds, after which the unused entries are
     * discarded.
     *
     * @type {number}
     */
    this._unusedEntryTtl = cacheConfig.unusedEntryTtl;

    let now = Date.now();

    /**
     * UNIX timestamp with milliseconds precision marking when this entry
     * should be discarded for being expired.
     *
     * @type {number}
     */
    this._expiredAfter = now + cacheConfig.entryTtl;

    /**
     * UNIX timestamp with millisecond precision marking when this entry
     * should be discarded for not being used.
     *
     * @type {number}
     */
    this._discardIfUnusedAfter = now + cacheConfig.unusedEntryTtl;
  }

  /**
   * Returns `true` if this entry has either expired or has not been
   * used for a long time.
   *
   * @return {boolean} `true` if this entry should be discarded.
   */
  get shouldBeDiscarded() {
    let now = Date.now();

    return now > this._expiredAfter || now > this._discardIfUnusedAfter;
  }

  /**
   * Returns the entry value. Also marks this as entry as "just used",
   * preventing it from being discarded for the configured amount of time for
   * not being used.
   *
   * @return {string}
   */
  get value() {
    this._discardIfUnusedAfter = Date.now() + this._unusedEntryTtl;

    return this._value;
  }
}

/**
 * Generates a cache key identifying the provided HTTP request and simillar
 * requests that may share the same page content.
 *
 * @param {Express.Request} request The current express.js HTTP request.
 * @return {string} The generated cache key.
 */
function defaultKeyGenerator(request) {
  let protocol = request.res?.locals?.protocol ?? request.protocol;
  let host = request.res?.locals?.host ?? request.get('Host');
  let url = request.originalUrl;

  return protocol + ':' + host + url;
}

module.exports = ({ environment }) => new Cache(environment.$Server.cache);
module.exports.Cache = Cache;
