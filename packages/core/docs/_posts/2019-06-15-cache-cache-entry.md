---
category: "cache"
title: "CacheEntry"
---

## CacheEntry&nbsp;<a name="CacheEntry" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L12" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The cache entry is a typed container of cache data used to track the
creation and expiration of cache entries.

**Kind**: global class  

* [CacheEntry](#CacheEntry)
    * [new CacheEntry(value, ttl)](#new_CacheEntry_new)
    * [._value](#CacheEntry+_value) : <code>\*</code>
    * [._ttl](#CacheEntry+_ttl) : <code>number</code>
    * [._created](#CacheEntry+_created) : <code>number</code>
    * [.isExpired()](#CacheEntry+isExpired) ⇒ <code>boolean</code>
    * [.serialize()](#CacheEntry+serialize) ⇒ <code>Object</code>
    * [.getValue()](#CacheEntry+getValue) ⇒ <code>\*</code>


* * *

### new CacheEntry(value, ttl)&nbsp;<a name="new_CacheEntry_new"></a>
Initializes the cache entry.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The cache entry value. |
| ttl | <code>number</code> | The time to live in milliseconds. |


* * *

### cacheEntry.\_value : <code>\*</code>&nbsp;<a name="CacheEntry+_value" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L18" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Cache entry value.

**Kind**: instance property of [<code>CacheEntry</code>](#CacheEntry)  

* * *

### cacheEntry.\_ttl : <code>number</code>&nbsp;<a name="CacheEntry+_ttl" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L26" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The time to live in milliseconds. The cache entry is considered
expired after this time.

**Kind**: instance property of [<code>CacheEntry</code>](#CacheEntry)  

* * *

### cacheEntry.\_created : <code>number</code>&nbsp;<a name="CacheEntry+_created" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L33" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The timestamp of creation of this cache entry.

**Kind**: instance property of [<code>CacheEntry</code>](#CacheEntry)  

* * *

### cacheEntry.isExpired() ⇒ <code>boolean</code>&nbsp;<a name="CacheEntry+isExpired" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns `true` if this entry has expired.

**Kind**: instance method of [<code>CacheEntry</code>](#CacheEntry)  
**Returns**: <code>boolean</code> - `true` if this entry has expired.  

* * *

### cacheEntry.serialize() ⇒ <code>Object</code>&nbsp;<a name="CacheEntry+serialize" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Exports this cache entry into a JSON-serializable object.

**Kind**: instance method of [<code>CacheEntry</code>](#CacheEntry)  
**Returns**: <code>Object</code> - This entry exported to a
        JSON-serializable object.  

* * *

### cacheEntry.getValue() ⇒ <code>\*</code>&nbsp;<a name="CacheEntry+getValue" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/cache/CacheEntry.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the entry value.

**Kind**: instance method of [<code>CacheEntry</code>](#CacheEntry)  
**Returns**: <code>\*</code> - The entry value.  

* * *

