---
category: "extension"
title: "AbstractExtension"
---

## *AbstractExtension ⇐ <code>Extension</code>*&nbsp;<a name="AbstractExtension" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L10" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Abstract extension

**Kind**: global abstract class  
**Extends**: <code>Extension</code>  

* *[AbstractExtension](#AbstractExtension) ⇐ <code>Extension</code>*
    * *[._pageStateManager](#AbstractExtension+_pageStateManager) : <code>PageStateManager</code>*
    * *[.status](#AbstractExtension+status) : <code>number</code>*
    * *[.params](#AbstractExtension+params) : <code>Object.&lt;string, string&gt;</code>*
    * *[.init()](#AbstractExtension+init)*
    * *[.destroy()](#AbstractExtension+destroy)*
    * *[.activate()](#AbstractExtension+activate)*
    * *[.deactivate()](#AbstractExtension+deactivate)*
    * **[.load()](#AbstractExtension+load)**
    * *[.update()](#AbstractExtension+update)*
    * *[.setState()](#AbstractExtension+setState)*
    * *[.getState()](#AbstractExtension+getState)*
    * *[.setRouteParams()](#AbstractExtension+setRouteParams)*
    * *[.getRouteParams()](#AbstractExtension+getRouteParams)*
    * *[.setPageStateManager()](#AbstractExtension+setPageStateManager)*
    * *[.getHttpStatus()](#AbstractExtension+getHttpStatus)*
    * *[.getAllowedStateKeys()](#AbstractExtension+getAllowedStateKeys)*


* * *

### *abstractExtension._pageStateManager : <code>PageStateManager</code>*&nbsp;<a name="AbstractExtension+_pageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L20" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
State manager.

**Kind**: instance property of [<code>AbstractExtension</code>](#AbstractExtension)  
**Access**: protected  

* * *

### *abstractExtension.status : <code>number</code>*&nbsp;<a name="AbstractExtension+status" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L27" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The HTTP response code to send to the client.

**Kind**: instance property of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.params : <code>Object.&lt;string, string&gt;</code>*&nbsp;<a name="AbstractExtension+params" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The route parameters extracted from the current route.

**Kind**: instance property of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.init()*&nbsp;<a name="AbstractExtension+init" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.destroy()*&nbsp;<a name="AbstractExtension+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.activate()*&nbsp;<a name="AbstractExtension+activate" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.deactivate()*&nbsp;<a name="AbstractExtension+deactivate" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L55" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### **abstractExtension.load()**&nbsp;<a name="AbstractExtension+load" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.update()*&nbsp;<a name="AbstractExtension+update" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L71" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.setState()*&nbsp;<a name="AbstractExtension+setState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L78" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.getState()*&nbsp;<a name="AbstractExtension+getState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L87" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.setRouteParams()*&nbsp;<a name="AbstractExtension+setRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L98" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.getRouteParams()*&nbsp;<a name="AbstractExtension+getRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.setPageStateManager()*&nbsp;<a name="AbstractExtension+setPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.getHttpStatus()*&nbsp;<a name="AbstractExtension+getHttpStatus" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L119" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

### *abstractExtension.getAllowedStateKeys()*&nbsp;<a name="AbstractExtension+getAllowedStateKeys" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/extension/AbstractExtension.js#L128" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns array of allowed state keys for extension.

**Kind**: instance method of [<code>AbstractExtension</code>](#AbstractExtension)  

* * *

