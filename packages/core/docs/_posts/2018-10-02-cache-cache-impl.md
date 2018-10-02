---
category: "cache"
title: "CacheImpl"
---

## CacheImpl ⇐ <code>Cache</code>&nbsp;<a name="CacheImpl" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L17" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Configurable generic implementation of the [Cache](Cache) interface.

**Kind**: global class  
**Extends**: <code>Cache</code>  

* [CacheImpl](#CacheImpl) ⇐ <code>Cache</code>
    * [new CacheImpl(cacheStorage, factory, Helper, [config])](#new_CacheImpl_new)
    * [._cache](#CacheImpl+_cache) : <code>Storage</code>
    * [._factory](#CacheImpl+_factory) : <code>CacheFactory</code>
    * [._Helper](#CacheImpl+_Helper) : <code>vendor.$Helper</code>
    * [._ttl](#CacheImpl+_ttl) : <code>number</code>
    * [._enabled](#CacheImpl+_enabled) : <code>boolean</code>
    * [.clear()](#CacheImpl+clear)
    * [.has()](#CacheImpl+has)
    * [.get()](#CacheImpl+get)
    * [.set()](#CacheImpl+set)
    * [.delete()](#CacheImpl+delete)
    * [.disable()](#CacheImpl+disable)
    * [.enable()](#CacheImpl+enable)
    * [.serialize()](#CacheImpl+serialize)
    * [.deserialize()](#CacheImpl+deserialize)
    * [._canSerializeValue(value)](#CacheImpl+_canSerializeValue) ⇒ <code>boolean</code>
    * [._clone(value)](#CacheImpl+_clone) ⇒ <code>\*</code>


* * *

### new CacheImpl(cacheStorage, factory, Helper, [config])&nbsp;<a name="new_CacheImpl_new"></a>
Initializes the cache.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| cacheStorage | <code>Storage</code> |  | The cache entry storage to use. |
| factory | <code>CacheFactory</code> |  | Which create new instance of cache entry. |
| Helper | <code>vendor.$Helper</code> |  | The IMA.js helper methods. |
| [config] | <code>Object</code> | <code>{ttl: 30000, enabled: false}</code> | The cache configuration. |

**Example**  
```js
if (cache.has('model.articles')) {
  return cache.get('model.articles');
} else {
  let articles = getArticlesFromStorage();
  // cache for an hour
  cache.set('model.articles', articles, 60 * 60 * 1000);
}
```

* * *

### cacheImpl._cache : <code>Storage</code>&nbsp;<a name="CacheImpl+_cache" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Cache entry storage.

**Kind**: instance property of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl._factory : <code>CacheFactory</code>&nbsp;<a name="CacheImpl+_factory" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl._Helper : <code>vendor.$Helper</code>&nbsp;<a name="CacheImpl+_Helper" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tha IMA.js helper methods.

**Kind**: instance property of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl._ttl : <code>number</code>&nbsp;<a name="CacheImpl+_ttl" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L59" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Default cache entry time to live in milliseconds.

**Kind**: instance property of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl._enabled : <code>boolean</code>&nbsp;<a name="CacheImpl+_enabled" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Flag signalling whether the cache is currently enabled.

**Kind**: instance property of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.clear()&nbsp;<a name="CacheImpl+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.has()&nbsp;<a name="CacheImpl+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L79" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.get()&nbsp;<a name="CacheImpl+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L97" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.set()&nbsp;<a name="CacheImpl+set" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L110" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.delete()&nbsp;<a name="CacheImpl+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.disable()&nbsp;<a name="CacheImpl+disable" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L133" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.enable()&nbsp;<a name="CacheImpl+enable" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L141" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.serialize()&nbsp;<a name="CacheImpl+serialize" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L148" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl.deserialize()&nbsp;<a name="CacheImpl+deserialize" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L181" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  

* * *

### cacheImpl._canSerializeValue(value) ⇒ <code>boolean</code>&nbsp;<a name="CacheImpl+_canSerializeValue" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L195" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the provided value can be serialized into JSON.

**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  
**Returns**: <code>boolean</code> - `true` if the provided value can be serialized into JSON,
        `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to test whether or not it can be serialized. |


* * *

### cacheImpl._clone(value) ⇒ <code>\*</code>&nbsp;<a name="CacheImpl+_clone" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/cache/CacheImpl.js#L247" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Attempts to clone the provided value, if possible. Values that cannot be
cloned (e.g. promises) will be simply returned.

**Kind**: instance method of [<code>CacheImpl</code>](#CacheImpl)  
**Returns**: <code>\*</code> - The created clone, or the provided value if the value cannot be
        cloned.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to clone. |


* * *

