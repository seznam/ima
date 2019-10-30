---
category: "controller"
title: "AbstractController"
---

## *AbstractController ⇐ <code>Controller</code>*&nbsp;<a name="AbstractController" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L15" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Basic implementation of the [Controller](Controller) interface, providing the
default implementation of the most of the API.

**Kind**: global abstract class  
**Extends**: <code>Controller</code>  

* *[AbstractController](#AbstractController) ⇐ <code>Controller</code>*
    * *[new AbstractController()](#new_AbstractController_new)*
    * *[._pageStateManager](#AbstractController+_pageStateManager) : <code>PageStateManager</code>*
    * *[._extensions](#AbstractController+_extensions) : <code>Array.&lt;Extension&gt;</code>*
    * *[.status](#AbstractController+status) : <code>number</code>*
    * *[.params](#AbstractController+params) : <code>Object.&lt;string, string&gt;</code>*
    * *[.init()](#AbstractController+init)*
    * *[.destroy()](#AbstractController+destroy)*
    * *[.activate()](#AbstractController+activate)*
    * *[.deactivate()](#AbstractController+deactivate)*
    * **[.load()](#AbstractController+load)**
    * *[.update()](#AbstractController+update)*
    * *[.setState()](#AbstractController+setState)*
    * *[.getState()](#AbstractController+getState)*
    * *[.addExtension()](#AbstractController+addExtension)*
    * *[.getExtensions()](#AbstractController+getExtensions)*
    * **[.setMetaParams()](#AbstractController+setMetaParams)**
    * *[.setRouteParams()](#AbstractController+setRouteParams)*
    * *[.getRouteParams()](#AbstractController+getRouteParams)*
    * *[.setPageStateManager()](#AbstractController+setPageStateManager)*
    * *[.getHttpStatus()](#AbstractController+getHttpStatus)*


* * *

### *new AbstractController()*&nbsp;<a name="new_AbstractController_new"></a>
Initializes the controller.


* * *

### *abstractController.\_pageStateManager : <code>PageStateManager</code>*&nbsp;<a name="AbstractController+_pageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
State manager.

**Kind**: instance property of [<code>AbstractController</code>](#AbstractController)  
**Access**: protected  

* * *

### *abstractController.\_extensions : <code>Array.&lt;Extension&gt;</code>*&nbsp;<a name="AbstractController+_extensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L31" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The controller's extensions.

**Kind**: instance property of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.status : <code>number</code>*&nbsp;<a name="AbstractController+status" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L38" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The HTTP response code to send to the client.

**Kind**: instance property of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.params : <code>Object.&lt;string, string&gt;</code>*&nbsp;<a name="AbstractController+params" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L47" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The route parameters extracted from the current route. This field is
set externally by IMA right before the [Controller#init](Controller#init) or the
[Controller#update](Controller#update) method is called.

**Kind**: instance property of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.init()*&nbsp;<a name="AbstractController+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L53" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.destroy()*&nbsp;<a name="AbstractController+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L58" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.activate()*&nbsp;<a name="AbstractController+activate" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.deactivate()*&nbsp;<a name="AbstractController+deactivate" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L68" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### **abstractController.load()**&nbsp;<a name="AbstractController+load" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L74" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.update()*&nbsp;<a name="AbstractController+update" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L84" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.setState()*&nbsp;<a name="AbstractController+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L91" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.getState()*&nbsp;<a name="AbstractController+getState" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L100" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.addExtension()*&nbsp;<a name="AbstractController+addExtension" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L111" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.getExtensions()*&nbsp;<a name="AbstractController+getExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L118" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### **abstractController.setMetaParams()**&nbsp;<a name="AbstractController+setMetaParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.setRouteParams()*&nbsp;<a name="AbstractController+setRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L136" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.getRouteParams()*&nbsp;<a name="AbstractController+getRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L143" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.setPageStateManager()*&nbsp;<a name="AbstractController+setPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L150" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

### *abstractController.getHttpStatus()*&nbsp;<a name="AbstractController+getHttpStatus" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/AbstractController.js#L157" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractController</code>](#AbstractController)  

* * *

