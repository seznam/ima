---
category: "storage"
title: "SessionMapStorage"
---

## SessionMapStorage&nbsp;<a name="SessionMapStorage" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L22" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The <code>SessionMap</code> storage is an implementation of the
<code>Storage</code> interface acting as a synchronization proxy between
the underlying map storage and the <code>sessionStorage</code> DOM storage.

**Kind**: global class  

* [SessionMapStorage](#SessionMapStorage)
    * [new SessionMapStorage(map, session)](#new_SessionMapStorage_new)
    * [._map](#SessionMapStorage+_map) : <code>MapStorage</code>
    * [._session](#SessionMapStorage+_session) : <code>SessionStorage</code>
    * [.init()](#SessionMapStorage+init)
    * [.has()](#SessionMapStorage+has)
    * [.get()](#SessionMapStorage+get)
    * [.set()](#SessionMapStorage+set)
    * [.delete()](#SessionMapStorage+delete)
    * [.clear()](#SessionMapStorage+clear)
    * [.keys()](#SessionMapStorage+keys)
    * [.size()](#SessionMapStorage+size)


* * *

### new SessionMapStorage(map, session)&nbsp;<a name="new_SessionMapStorage_new"></a>
Initializes the storage.


| Param | Type | Description |
| --- | --- | --- |
| map | <code>MapStorage</code> | The map storage to use. |
| session | <code>SessionStorage</code> | The session storage to use. |


* * *

### sessionMapStorage.\_map : <code>MapStorage</code>&nbsp;<a name="SessionMapStorage+_map" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The map storage, synced with the session storage.

**Kind**: instance property of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.\_session : <code>SessionStorage</code>&nbsp;<a name="SessionMapStorage+_session" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The session storage, synced with the map storage.

**Kind**: instance property of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.init()&nbsp;<a name="SessionMapStorage+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L43" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.has()&nbsp;<a name="SessionMapStorage+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L55" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.get()&nbsp;<a name="SessionMapStorage+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L62" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.set()&nbsp;<a name="SessionMapStorage+set" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L69" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.delete()&nbsp;<a name="SessionMapStorage+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L85" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.clear()&nbsp;<a name="SessionMapStorage+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L94" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.keys()&nbsp;<a name="SessionMapStorage+keys" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L103" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

### sessionMapStorage.size()&nbsp;<a name="SessionMapStorage+size" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/storage/SessionMapStorage.js#L110" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionMapStorage</code>](#SessionMapStorage)  

* * *

