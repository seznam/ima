---
category: "page/renderer"
title: "ComponentUtils"
---

## ComponentUtils&nbsp;<a name="ComponentUtils" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global class  

* [ComponentUtils](#ComponentUtils)
    * [new ComponentUtils(oc)](#new_ComponentUtils_new)
    * [._oc](#ComponentUtils+_oc) : <code>ObjectContainer</code>
    * [._utilityClasses](#ComponentUtils+_utilityClasses) : <code>Object.&lt;string, (function(new:T, ...\*)\|function(...\*): T)&gt;</code>
    * [._utilities](#ComponentUtils+_utilities) : <code>Object.&lt;string, Object&gt;</code>
    * [._utilityReferrers](#ComponentUtils+_utilityReferrers) : <code>Object.&lt;string, string&gt;</code>
    * [.register(name, componentUtilityClass, referrer)](#ComponentUtils+register)
    * [.getUtils()](#ComponentUtils+getUtils) ⇒ <code>Object.&lt;string, Object&gt;</code>
    * [.getReferrers()](#ComponentUtils+getReferrers) ⇒ <code>Object.&lt;string, string&gt;</code>
    * [._createUtilityInstance(alias, utilityClass)](#ComponentUtils+_createUtilityInstance) ⇒ <code>T</code>


* * *

### new ComponentUtils(oc)&nbsp;<a name="new_ComponentUtils_new"></a>
Initializes the registry used for managing component utils.


| Param | Type | Description |
| --- | --- | --- |
| oc | <code>ObjectContainer</code> | The application's dependency injector - the        object container. |


* * *

### componentUtils.\_oc : <code>ObjectContainer</code>&nbsp;<a name="ComponentUtils+_oc" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L14" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The application's dependency injector - the object container.

**Kind**: instance property of [<code>ComponentUtils</code>](#ComponentUtils)  

* * *

### componentUtils.\_utilityClasses : <code>Object.&lt;string, (function(new:T, ...\*)\|function(...\*): T)&gt;</code>&nbsp;<a name="ComponentUtils+_utilityClasses" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L21" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of registered utilities.

**Kind**: instance property of [<code>ComponentUtils</code>](#ComponentUtils)  

* * *

### componentUtils.\_utilities : <code>Object.&lt;string, Object&gt;</code>&nbsp;<a name="ComponentUtils+_utilities" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L28" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of instantiated utilities

**Kind**: instance property of [<code>ComponentUtils</code>](#ComponentUtils)  

* * *

### componentUtils.\_utilityReferrers : <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="ComponentUtils+_utilityReferrers" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L35" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of referrers to utilities

**Kind**: instance property of [<code>ComponentUtils</code>](#ComponentUtils)  

* * *

### componentUtils.register(name, componentUtilityClass, referrer)&nbsp;<a name="ComponentUtils+register" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers single utility class or multiple classes in alias->class mapping.

**Kind**: instance method of [<code>ComponentUtils</code>](#ComponentUtils)  

| Param | Type | Default |
| --- | --- | --- |
| name | <code>string</code> \| <code>Object.&lt;string, (function(new:T, ...\*)\|function(...\*): T)&gt;</code> |  | 
| componentUtilityClass | <code>function</code> \| <code>function</code> |  | 
| referrer | <code>string</code> | <code>null</code> | 


* * *

### componentUtils.getUtils() ⇒ <code>Object.&lt;string, Object&gt;</code>&nbsp;<a name="ComponentUtils+getUtils" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L80" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns object containing all registered utilities

**Kind**: instance method of [<code>ComponentUtils</code>](#ComponentUtils)  

* * *

### componentUtils.getReferrers() ⇒ <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="ComponentUtils+getReferrers" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L103" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ComponentUtils</code>](#ComponentUtils)  

* * *

### componentUtils.\_createUtilityInstance(alias, utilityClass) ⇒ <code>T</code>&nbsp;<a name="ComponentUtils+_createUtilityInstance" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/renderer/ComponentUtils.js#L113" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ComponentUtils</code>](#ComponentUtils)  

| Param | Type |
| --- | --- |
| alias | <code>string</code> | 
| utilityClass | <code>function</code> \| <code>function</code> | 


* * *

