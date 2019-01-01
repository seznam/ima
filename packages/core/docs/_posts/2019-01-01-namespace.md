---
category: "general"
title: "namespace"
---

## ~~Namespace~~&nbsp;<a name="Namespace" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/namespace.js#L11" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
***Deprecated***

Namespace creation, manipulation and traversal utility. This utility is used
to create semi-global shared namespaces for registering references to
interfaces, classes and constants of the application to provide access to
each other more easily than by using the ES6 import/export mechanism.

**Kind**: global class  

* ~~[Namespace](#Namespace)~~
    * [new exports.Namespace()](#new_Namespace_new)
    * ~~[.namespace(path)](#Namespace+namespace) ⇒ <code>\*</code>~~
    * [.has(path)](#Namespace+has) ⇒ <code>boolean</code>
    * [.get(path)](#Namespace+get) ⇒ <code>\*</code>


* * *

### new exports.Namespace()&nbsp;<a name="new_Namespace_new"></a>
Initializes the namespace provider.

This is a private constructor, you should use the exported <code>ns</code>
instance to create and use namespaces (see the examples).


* * *

### ~~namespace.namespace(path) ⇒ <code>\*</code>~~&nbsp;<a name="Namespace+namespace" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/namespace.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
***Deprecated***

Verifies that the specified path in namespace exists, creates it if it
does not, and returns the value at the specified path in the namespace.

The method recursively creates all path parts in the namespaces as empty
plain objects for all path parts that do not exist yet, including the
last one. This means, that if called with a non-existing namespace path
as an argument, the return value will be the last created namespace
object.

**Kind**: instance method of [<code>Namespace</code>](#Namespace)  
**Returns**: <code>\*</code> - The value at the specified path in the namespace.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The namespace path. |


* * *

### namespace.has(path) ⇒ <code>boolean</code>&nbsp;<a name="Namespace+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/namespace.js#L79" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Verifies that the specified namespace path point to an existing
namespace or terminal value.

**Kind**: instance method of [<code>Namespace</code>](#Namespace)  
**Returns**: <code>boolean</code> - <code>true</code> if the namespace or terminal value exists
        at the specified path.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The namespace path to test. |


* * *

### namespace.get(path) ⇒ <code>\*</code>&nbsp;<a name="Namespace+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/namespace.js#L89" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return value for the specified namespace path point.

**Kind**: instance method of [<code>Namespace</code>](#Namespace)  
**Returns**: <code>\*</code> - The value at the specified path in the namespace.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The namespace path to test. |


* * *

