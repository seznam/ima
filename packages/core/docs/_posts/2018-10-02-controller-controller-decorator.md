---
category: "controller"
title: "ControllerDecorator"
---

## ControllerDecorator ⇐ <code>Controller</code>&nbsp;<a name="ControllerDecorator" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L10" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Decorator for page controllers. The decorator manages references to the meta
attributes manager and other utilities so these can be easily provided to
the decorated page controller when needed.

**Kind**: global class  
**Extends**: <code>Controller</code>  

* [ControllerDecorator](#ControllerDecorator) ⇐ <code>Controller</code>
    * [new ControllerDecorator(controller, metaManager, router, dictionary, settings)](#new_ControllerDecorator_new)
    * [._controller](#ControllerDecorator+_controller) : <code>Controller</code>
    * [._metaManager](#ControllerDecorator+_metaManager) : <code>MetaManager</code>
    * [._router](#ControllerDecorator+_router) : <code>Router</code>
    * [._dictionary](#ControllerDecorator+_dictionary) : <code>Dictionary</code>
    * [._settings](#ControllerDecorator+_settings) : <code>Object.&lt;string, \*&gt;</code>
    * [.init()](#ControllerDecorator+init)
    * [.destroy()](#ControllerDecorator+destroy)
    * [.activate()](#ControllerDecorator+activate)
    * [.deactivate()](#ControllerDecorator+deactivate)
    * [.load()](#ControllerDecorator+load)
    * [.update()](#ControllerDecorator+update)
    * [.setReactiveView()](#ControllerDecorator+setReactiveView)
    * [.setState()](#ControllerDecorator+setState)
    * [.getState()](#ControllerDecorator+getState)
    * [.addExtension()](#ControllerDecorator+addExtension)
    * [.getExtensions()](#ControllerDecorator+getExtensions)
    * [.setMetaParams()](#ControllerDecorator+setMetaParams)
    * [.setRouteParams()](#ControllerDecorator+setRouteParams)
    * [.getRouteParams()](#ControllerDecorator+getRouteParams)
    * [.setPageStateManager()](#ControllerDecorator+setPageStateManager)
    * [.getHttpStatus()](#ControllerDecorator+getHttpStatus)
    * [.getMetaManager()](#ControllerDecorator+getMetaManager) ⇒ <code>MetaManager</code>


* * *

### new ControllerDecorator(controller, metaManager, router, dictionary, settings)&nbsp;<a name="new_ControllerDecorator_new"></a>
Initializes the controller decorator.


| Param | Type | Description |
| --- | --- | --- |
| controller | <code>Controller</code> | The controller being decorated. |
| metaManager | <code>MetaManager</code> | The meta page attributes manager. |
| router | <code>Router</code> | The application router. |
| dictionary | <code>Dictionary</code> | Localization phrases dictionary. |
| settings | <code>Object.&lt;string, \*&gt;</code> | Application settings for the        current application environment. |


* * *

### controllerDecorator._controller : <code>Controller</code>&nbsp;<a name="ControllerDecorator+_controller" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The controller being decorated.

**Kind**: instance property of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator._metaManager : <code>MetaManager</code>&nbsp;<a name="ControllerDecorator+_metaManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L36" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The meta page attributes manager.

**Kind**: instance property of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator._router : <code>Router</code>&nbsp;<a name="ControllerDecorator+_router" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L43" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The application router.

**Kind**: instance property of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator._dictionary : <code>Dictionary</code>&nbsp;<a name="ControllerDecorator+_dictionary" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Localization phrases dictionary.

**Kind**: instance property of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator._settings : <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="ControllerDecorator+_settings" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L57" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application settings for the current application environment.

**Kind**: instance property of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.init()&nbsp;<a name="ControllerDecorator+init" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.destroy()&nbsp;<a name="ControllerDecorator+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L70" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.activate()&nbsp;<a name="ControllerDecorator+activate" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L77" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.deactivate()&nbsp;<a name="ControllerDecorator+deactivate" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L84" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.load()&nbsp;<a name="ControllerDecorator+load" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L91" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.update()&nbsp;<a name="ControllerDecorator+update" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L98" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.setReactiveView()&nbsp;<a name="ControllerDecorator+setReactiveView" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.setState()&nbsp;<a name="ControllerDecorator+setState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.getState()&nbsp;<a name="ControllerDecorator+getState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L119" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.addExtension()&nbsp;<a name="ControllerDecorator+addExtension" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.getExtensions()&nbsp;<a name="ControllerDecorator+getExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L135" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.setMetaParams()&nbsp;<a name="ControllerDecorator+setMetaParams" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L142" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.setRouteParams()&nbsp;<a name="ControllerDecorator+setRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L155" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.getRouteParams()&nbsp;<a name="ControllerDecorator+getRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L162" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.setPageStateManager()&nbsp;<a name="ControllerDecorator+setPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L169" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.getHttpStatus()&nbsp;<a name="ControllerDecorator+getHttpStatus" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L176" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  

* * *

### controllerDecorator.getMetaManager() ⇒ <code>MetaManager</code>&nbsp;<a name="ControllerDecorator+getMetaManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/controller/ControllerDecorator.js#L187" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the meta attributes manager configured by the decorated
controller.

**Kind**: instance method of [<code>ControllerDecorator</code>](#ControllerDecorator)  
**Returns**: <code>MetaManager</code> - The Meta attributes manager configured by the
        decorated controller.  

* * *

