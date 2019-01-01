---
category: "cache"
title: "Cache"
---

## Cache&nbsp;<a name="Cache" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Cache](#Cache)
    * [.clear()](#Cache+clear)
    * [.has(key)](#Cache+has) ⇒ <code>boolean</code>
    * [.get(key)](#Cache+get) ⇒ <code>\*</code>
    * [.set(key, value, [ttl])](#Cache+set)
    * [.delete(key)](#Cache+delete)
    * [.disable()](#Cache+disable)
    * [.enable()](#Cache+enable)
    * [.serialize()](#Cache+serialize) ⇒ <code>string</code>
    * [.deserialize(serializedData)](#Cache+deserialize)


* * *

### cache.clear()&nbsp;<a name="Cache+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L13" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the cache by deleting all entries.

**Kind**: instance method of [<code>Cache</code>](#Cache)  

* * *

### cache.has(key) ⇒ <code>boolean</code>&nbsp;<a name="Cache+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the cache contains a fresh entry for the specified key. A
cache entry is fresh if the has not expired its TTL (time to live).

The method always returns `false` if the cache is currently disabled.

**Kind**: instance method of [<code>Cache</code>](#Cache)  
**Returns**: <code>boolean</code> - `true` if the cache is enabled, the entry exists and has
        not expired yet.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The identifier of the cache entry. |


* * *

### cache.get(key) ⇒ <code>\*</code>&nbsp;<a name="Cache+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the value of the entry identified by the specified key.

The method returns `null` if the specified entry does not exist, has
already expired, or the cache is currently disabled.

**Kind**: instance method of [<code>Cache</code>](#Cache)  
**Returns**: <code>\*</code> - The value of the specified cache entry, or `null` if the entry
        is not available.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The identifier of the cache entry. |


* * *

### cache.set(key, value, [ttl])&nbsp;<a name="Cache+set" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L51" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the cache entry identified by the specified key to the provided
value. The entry is created if it does not exist yet.

The method has no effect if the cache is currently disabled.

**Kind**: instance method of [<code>Cache</code>](#Cache)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The identifier of the cache entry. |
| value | <code>\*</code> | The cache entry value. |
| [ttl] | <code>number</code> | Cache entry time to live in milliseconds. The        entry will expire after the specified amount of milliseconds. Use        `null` or omit the parameter to use the default TTL of this cache. |


* * *

### cache.delete(key)&nbsp;<a name="Cache+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L59" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deletes the specified cache entry. The method has no effect if the entry
does not exist.

**Kind**: instance method of [<code>Cache</code>](#Cache)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The identifier of the cache entry. |


* * *

### cache.disable()&nbsp;<a name="Cache+disable" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L71" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Disables the cache, preventing the retrieval of any cached entries and
reporting all cache entries as non-existing. Disabling the cache does
not however prevent modifying the existing or creating new cache
entries.

Disabling the cache also clears all of its current entries.

The method has no effect if the cache is already disabled.

**Kind**: instance method of [<code>Cache</code>](#Cache)  

* * *

### cache.enable()&nbsp;<a name="Cache+enable" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L78" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Enables the cache, allowing the retrieval of cache entries.

The method has no effect if the cache is already enabled.

**Kind**: instance method of [<code>Cache</code>](#Cache)  

* * *

### cache.serialize() ⇒ <code>string</code>&nbsp;<a name="Cache+serialize" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Exports the state of this cache to an HTML-safe JSON string. The data
obtained by parsing the result of this method are compatible with the
[deserialize](#Cache+deserialize) method.

**Kind**: instance method of [<code>Cache</code>](#Cache)  
**Returns**: <code>string</code> - A JSON string containing an object representing of the
        current state of this cache.  

* * *

### cache.deserialize(serializedData)&nbsp;<a name="Cache+deserialize" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/cache/Cache.js#L100" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Loads the provided serialized cache data into this cache. Entries
present in this cache but not specified in the provided data will remain
in this cache intact.

**Kind**: instance method of [<code>Cache</code>](#Cache)  

| Param | Type | Description |
| --- | --- | --- |
| serializedData | <code>Object.&lt;string, {value: \*, ttl: number}&gt;</code> | An        object representing the state of the cache to load, obtained by        parsing the JSON string returned by the [serialize](#Cache+serialize)        method. |


* * *

