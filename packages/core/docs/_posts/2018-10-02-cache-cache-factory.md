---
category: "cache"
title: "CacheFactory"
---

## CacheFactory&nbsp;<a name="CacheFactory" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheFactory.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory for creating instances of [CacheEntry](CacheEntry).

**Kind**: global class  

* * *

### cacheFactory.createCacheEntry(value, [ttl]) ⇒ <code>CacheEntry</code>&nbsp;<a name="CacheFactory+createCacheEntry" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheFactory.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create a new instance of [CacheEntry](CacheEntry) with value and ttl.

**Kind**: instance method of [<code>CacheFactory</code>](#CacheFactory)  
**Returns**: <code>CacheEntry</code> - The created cache entry.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The cache entry value. |
| [ttl] | <code>number</code> | Cache entry time to live in milliseconds. The        entry will expire after the specified amount of milliseconds. |


* * *

