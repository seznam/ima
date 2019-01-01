---
category: "storage"
title: "WeakMapStorage"
---

## Classes

<dl>
<dt><a href="#WeakMapStorage">WeakMapStorage</a></dt>
<dd><p>A specialization of the <code>MapStorage</code> storage mimicking the native
<code>WeakMap</code> using its internal garbage collector used once the size of
the storage reaches the configured threshold.</p>
</dd>
<dt><a href="#WeakRef">WeakRef</a></dt>
<dd><p>A simple reference wrapper that emulates a weak reference. We seem to have
no other option, since WeakMap and WeakSet are not enumerable (so what is
the point of WeakMap and WeakSet if you still need to manage the keys?!) and
there is no native way to create a weak reference.</p>
</dd>
</dl>

## WeakMapStorage&nbsp;<a name="WeakMapStorage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
A specialization of the <code>MapStorage</code> storage mimicking the native
<code>WeakMap</code> using its internal garbage collector used once the size of
the storage reaches the configured threshold.

**Kind**: global class  

* [WeakMapStorage](#WeakMapStorage)
    * [new WeakMapStorage(config)](#new_WeakMapStorage_new)
    * [._entryTtl](#WeakMapStorage+_entryTtl) : <code>number</code>
    * [.has()](#WeakMapStorage+has)
    * [.get()](#WeakMapStorage+get)
    * [.set()](#WeakMapStorage+set)
    * [.delete()](#WeakMapStorage+delete)
    * [.keys()](#WeakMapStorage+keys)
    * [.size()](#WeakMapStorage+size)
    * [._discardExpiredEntries()](#WeakMapStorage+_discardExpiredEntries)


* * *

### new WeakMapStorage(config)&nbsp;<a name="new_WeakMapStorage_new"></a>
Initializes the storage.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Weak map storage configuration. The        fields have the following meaning:        - entryTtl The time-to-live of a storage entry in milliseconds. |


* * *

### weakMapStorage.\_entryTtl : <code>number</code>&nbsp;<a name="WeakMapStorage+_entryTtl" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The time-to-live of a storage entry in milliseconds.

**Kind**: instance property of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.has()&nbsp;<a name="WeakMapStorage+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.get()&nbsp;<a name="WeakMapStorage+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.set()&nbsp;<a name="WeakMapStorage+set" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.delete()&nbsp;<a name="WeakMapStorage+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.keys()&nbsp;<a name="WeakMapStorage+keys" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L70" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.size()&nbsp;<a name="WeakMapStorage+size" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L79" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

### weakMapStorage.\_discardExpiredEntries()&nbsp;<a name="WeakMapStorage+_discardExpiredEntries" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deletes all expired entries from this storage.

**Kind**: instance method of [<code>WeakMapStorage</code>](#WeakMapStorage)  

* * *

## WeakRef&nbsp;<a name="WeakRef" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
A simple reference wrapper that emulates a weak reference. We seem to have
no other option, since WeakMap and WeakSet are not enumerable (so what is
the point of WeakMap and WeakSet if you still need to manage the keys?!) and
there is no native way to create a weak reference.

**Kind**: global class  

* [WeakRef](#WeakRef)
    * [new WeakRef(target, ttl)](#new_WeakRef_new)
    * [._reference](#WeakRef+_reference) : <code>Object</code>
    * [._expiration](#WeakRef+_expiration) : <code>number</code>
    * [.target](#WeakRef+target) ⇒ <code>Object</code>


* * *

### new WeakRef(target, ttl)&nbsp;<a name="new_WeakRef_new"></a>
Initializes the weak reference to the target reference.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target reference that should be referenced by        this weak reference. |
| ttl | <code>number</code> | The maximum number of milliseconds the weak        reference should be kept. The reference will be discarded once        ACCESSED after the specified timeout. |


* * *

### weakRef.\_reference : <code>Object</code>&nbsp;<a name="WeakRef+_reference" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L134" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The actual target reference, or <code>null</code> if the reference has
been already discarded.

**Kind**: instance property of [<code>WeakRef</code>](#WeakRef)  

* * *

### weakRef.\_expiration : <code>number</code>&nbsp;<a name="WeakRef+_expiration" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L142" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The UNIX timestamp with millisecond precision marking the moment at
or after which the reference will be discarded.

**Kind**: instance property of [<code>WeakRef</code>](#WeakRef)  

* * *

### weakRef.target ⇒ <code>Object</code>&nbsp;<a name="WeakRef+target" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/storage/WeakMapStorage.js#L152" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the target reference, provided that the target reference is
still alive. Returns <code>null</code> if the reference has been discarded.

**Kind**: instance property of [<code>WeakRef</code>](#WeakRef)  
**Returns**: <code>Object</code> - The target reference, or <code>null</code> if the reference
        has been discarded by the garbage collector.  

* * *

