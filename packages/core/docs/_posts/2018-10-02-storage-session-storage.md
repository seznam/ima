---
category: "storage"
title: "SessionStorage"
---

## Classes

<dl>
<dt><a href="#SessionStorage">SessionStorage</a></dt>
<dd><p>Implementation of the <code>Storage</code> interface that relies on the
native <code>sessionStorage</code> DOM storage for storing its entries.</p>
</dd>
<dt><a href="#StorageIterator">StorageIterator</a></dt>
<dd><p>Implementation of the iterator protocol and the iterable protocol for DOM
storage keys.</p>
</dd>
</dl>

## SessionStorage&nbsp;<a name="SessionStorage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Implementation of the <code>Storage</code> interface that relies on the
native <code>sessionStorage</code> DOM storage for storing its entries.

**Kind**: global class  

* [SessionStorage](#SessionStorage)
    * [new SessionStorage(window)](#new_SessionStorage_new)
    * [._storage](#SessionStorage+_storage) : <code>Storage</code>
    * [.init()](#SessionStorage+init)
    * [.has()](#SessionStorage+has)
    * [.get()](#SessionStorage+get)
    * [.set()](#SessionStorage+set)
    * [.delete()](#SessionStorage+delete)
    * [.clear()](#SessionStorage+clear)
    * [.keys()](#SessionStorage+keys)
    * [.size()](#SessionStorage+size)
    * [._deleteOldestEntry()](#SessionStorage+_deleteOldestEntry)


* * *

### new SessionStorage(window)&nbsp;<a name="new_SessionStorage_new"></a>
Initializes the session storage.


| Param | Type |
| --- | --- |
| window | <code>Window</code> | 


* * *

### sessionStorage._storage : <code>Storage</code>&nbsp;<a name="SessionStorage+_storage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L26" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The DOM storage providing the actual storage of the entries.

**Kind**: instance property of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.init()&nbsp;<a name="SessionStorage+init" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.has()&nbsp;<a name="SessionStorage+has" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.get()&nbsp;<a name="SessionStorage+get" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L46" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.set()&nbsp;<a name="SessionStorage+set" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.delete()&nbsp;<a name="SessionStorage+delete" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L90" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.clear()&nbsp;<a name="SessionStorage+clear" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L98" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.keys()&nbsp;<a name="SessionStorage+keys" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L106" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage.size()&nbsp;<a name="SessionStorage+size" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L113" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

### sessionStorage._deleteOldestEntry()&nbsp;<a name="SessionStorage+_deleteOldestEntry" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L120" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deletes the oldest entry in this storage.

**Kind**: instance method of [<code>SessionStorage</code>](#SessionStorage)  

* * *

## StorageIterator&nbsp;<a name="StorageIterator" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L148" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Implementation of the iterator protocol and the iterable protocol for DOM
storage keys.

**Kind**: global class  
**See**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols  

* [StorageIterator](#StorageIterator)
    * [new StorageIterator(storage)](#new_StorageIterator_new)
    * [._storage](#StorageIterator+_storage) : <code>Storage</code>
    * [._currentKeyIndex](#StorageIterator+_currentKeyIndex) : <code>number</code>
    * [.next()](#StorageIterator+next) ⇒ <code>Object</code>


* * *

### new StorageIterator(storage)&nbsp;<a name="new_StorageIterator_new"></a>
Initializes the DOM storage iterator.


| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> | The DOM storage to iterate through. |


* * *

### storageIterator._storage : <code>Storage</code>&nbsp;<a name="StorageIterator+_storage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L160" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The DOM storage being iterated.

**Kind**: instance property of [<code>StorageIterator</code>](#StorageIterator)  

* * *

### storageIterator._currentKeyIndex : <code>number</code>&nbsp;<a name="StorageIterator+_currentKeyIndex" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L168" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current index of the DOM storage key this iterator will return
next.

**Kind**: instance property of [<code>StorageIterator</code>](#StorageIterator)  

* * *

### storageIterator.next() ⇒ <code>Object</code>&nbsp;<a name="StorageIterator+next" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/storage/SessionStorage.js#L178" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Iterates to the next item. This method implements the iterator protocol.

**Kind**: instance method of [<code>StorageIterator</code>](#StorageIterator)  
**Returns**: <code>Object</code> - The next value in
        the sequence and whether the iterator is done iterating through
        the values.  

* * *

