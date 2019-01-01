---
category: "general"
title: "vendorLinker"
---

## VendorLinker&nbsp;<a name="VendorLinker" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L7" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for linking vendor node modules with the application by exporting
them to the IMA loader's modules.

**Kind**: global class  

* [VendorLinker](#VendorLinker)
    * [new exports.VendorLinker()](#new_VendorLinker_new)
    * [._modules](#VendorLinker+_modules) : <code>Map.&lt;string, Object.&lt;string, \*&gt;&gt;</code>
    * [._plugins](#VendorLinker+_plugins) : <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [.set(moduleName, moduleValues)](#VendorLinker+set)
    * [.get(moduleName, [imaInternalModule])](#VendorLinker+get) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.clear()](#VendorLinker+clear) ⇒ [<code>VendorLinker</code>](#VendorLinker)
    * [.bindToNamespace(ns)](#VendorLinker+bindToNamespace)
    * [.getImaPlugins()](#VendorLinker+getImaPlugins) ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>


* * *

### new exports.VendorLinker()&nbsp;<a name="new_VendorLinker_new"></a>
Initializes the vendor linker.


* * *

### vendorLinker.\_modules : <code>Map.&lt;string, Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="VendorLinker+_modules" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L17" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Internal storage of loaded modules.

**Kind**: instance property of [<code>VendorLinker</code>](#VendorLinker)  

* * *

### vendorLinker.\_plugins : <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="VendorLinker+_plugins" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Internal storage of loaded IMA plugins.

**Kind**: instance property of [<code>VendorLinker</code>](#VendorLinker)  

* * *

### vendorLinker.set(moduleName, moduleValues)&nbsp;<a name="VendorLinker+set" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L35" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the provided vendor node module to the internal registry of this
vendor linker, and registers an IMA loader module of the same name,
exporting the same values.

**Kind**: instance method of [<code>VendorLinker</code>](#VendorLinker)  

| Param | Type | Description |
| --- | --- | --- |
| moduleName | <code>string</code> | The name of the module. |
| moduleValues | <code>Object.&lt;string, \*&gt;</code> | Values exported from the module. |


* * *

### vendorLinker.get(moduleName, [imaInternalModule]) ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="VendorLinker+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the provided vendor node module from the internal registry of this
vendor linker.

**Kind**: instance method of [<code>VendorLinker</code>](#VendorLinker)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - moduleValues Values exported from the module.  

| Param | Type | Description |
| --- | --- | --- |
| moduleName | <code>string</code> | The name of the module. |
| [imaInternalModule] | <code>boolean</code> |  |


* * *

### vendorLinker.clear() ⇒ [<code>VendorLinker</code>](#VendorLinker)&nbsp;<a name="VendorLinker+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L79" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears all loaded modules and plugins from this vendor linker.

**Kind**: instance method of [<code>VendorLinker</code>](#VendorLinker)  
**Returns**: [<code>VendorLinker</code>](#VendorLinker) - This vendor linker.  

* * *

### vendorLinker.bindToNamespace(ns)&nbsp;<a name="VendorLinker+bindToNamespace" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L93" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Binds the vendor modules loaded in this vendor linker to the
<code>Vendor</code> sub-namespace of the provided namespace.

**Kind**: instance method of [<code>VendorLinker</code>](#VendorLinker)  

| Param | Type | Description |
| --- | --- | --- |
| ns | <code>Namespace</code> | The namespace to which the vendor modules should        be bound. |


* * *

### vendorLinker.getImaPlugins() ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="VendorLinker+getImaPlugins" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/vendorLinker.js#L111" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the loaded IMA plugins as an array of export objects.

**Kind**: instance method of [<code>VendorLinker</code>](#VendorLinker)  
**Returns**: <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code> - The loaded IMA plugins.  

* * *

