---
category: "page/manager"
title: "ClientPageManager"
---

## ClientPageManager&nbsp;<a name="ClientPageManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L13" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Page manager for controller on the client side.

**Kind**: global class  

* [ClientPageManager](#ClientPageManager)
    * [new ClientPageManager(pageFactory, pageRenderer, stateManager, handlerRegistry, window, eventBus)](#new_ClientPageManager_new)
    * [._window](#ClientPageManager+_window) : <code>ima.window.Window</code>
    * [._eventBus](#ClientPageManager+_eventBus) : <code>ima.event.EventBus</code>
    * [._boundOnCustomEventHandler()](#ClientPageManager+_boundOnCustomEventHandler) : <code>function</code>
    * [.init()](#ClientPageManager+init)
    * [.manage()](#ClientPageManager+manage)
    * [.destroy()](#ClientPageManager+destroy)
    * [._onCustomEventHandler(event)](#ClientPageManager+_onCustomEventHandler)
    * [._parseCustomEvent(event)](#ClientPageManager+_parseCustomEvent) ⇒ <code>Object</code>
    * [._handleEventWithController(method, data)](#ClientPageManager+_handleEventWithController) ⇒ <code>boolean</code>
    * [._handleEventWithExtensions(method, data)](#ClientPageManager+_handleEventWithExtensions) ⇒ <code>boolean</code>


* * *

### new ClientPageManager(pageFactory, pageRenderer, stateManager, handlerRegistry, window, eventBus)&nbsp;<a name="new_ClientPageManager_new"></a>
Initializes the client-side page manager.


| Param | Type | Description |
| --- | --- | --- |
| pageFactory | <code>PageFactory</code> | Factory used by the page manager to        create instances of the controller for the current route, and        decorate the controllers and page state managers. |
| pageRenderer | <code>PageRenderer</code> | The current renderer of the page. |
| stateManager | <code>PageStateManager</code> | The current page state manager. |
| handlerRegistry | <code>HandlerRegistry</code> | Instance of HandlerRegistry that        holds a list of pre-manage and post-manage handlers. |
| window | <code>Window</code> | The utility for manipulating the global context        and global client-side-specific APIs. |
| eventBus | <code>EventBus</code> | The event bus for dispatching and listening        for custom IMA events propagated through the DOM. |


* * *

### clientPageManager.\_window : <code>ima.window.Window</code>&nbsp;<a name="ClientPageManager+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The utility for manipulating the global context and global
client-side-specific APIs.

**Kind**: instance property of [<code>ClientPageManager</code>](#ClientPageManager)  

* * *

### clientPageManager.\_eventBus : <code>ima.event.EventBus</code>&nbsp;<a name="ClientPageManager+_eventBus" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L64" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The event bus for dispatching and listening for custom IMA events
propagated through the DOM.

**Kind**: instance property of [<code>ClientPageManager</code>](#ClientPageManager)  

* * *

### clientPageManager.\_boundOnCustomEventHandler() : <code>function</code>&nbsp;<a name="ClientPageManager+_boundOnCustomEventHandler" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Event listener for the custom DOM events used by the event bus,
bound to this instance.

**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  

* * *

### clientPageManager.init()&nbsp;<a name="ClientPageManager+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L80" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  

* * *

### clientPageManager.manage()&nbsp;<a name="ClientPageManager+manage" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L91" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  

* * *

### clientPageManager.destroy()&nbsp;<a name="ClientPageManager+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L102" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  

* * *

### clientPageManager.\_onCustomEventHandler(event)&nbsp;<a name="ClientPageManager+_onCustomEventHandler" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L127" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Custom DOM event handler.

The handler invokes the event listener in the active controller, if such
listener is present. The name of the controller's listener method is
created by turning the first symbol of the event's name to upper case,
and then prefixing the result with the 'on' prefix.

For example: for an event named 'toggle' the controller's listener
would be named 'onToggle'.

The controller's listener will be invoked with the event's data as an
argument.

**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>CustomEvent</code> | The encountered event bus DOM event. |


* * *

### clientPageManager.\_parseCustomEvent(event) ⇒ <code>Object</code>&nbsp;<a name="ClientPageManager+_parseCustomEvent" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L164" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extracts the details of the provided event bus custom DOM event, along
with the expected name of the current controller's method for
intercepting the event.

**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  
**Returns**: <code>Object</code> - The event's
        details.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>CustomEvent</code> | The encountered event bus custom DOM event. |


* * *

### clientPageManager.\_handleEventWithController(method, data) ⇒ <code>boolean</code>&nbsp;<a name="ClientPageManager+_handleEventWithController" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L185" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Attempts to handle the currently processed event bus custom DOM event
using the current controller. The method returns <code>true</code> if the
event is handled by the controller.

**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  
**Returns**: <code>boolean</code> - <code>true</code> if the event has been handled by the
        controller, <code>false</code> if the controller does not have a
        method for processing the event.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The name of the method the current controller        should use to process the currently processed event bus custom        DOM event. |
| data | <code>Object.&lt;string, \*&gt;</code> | The custom event's data. |


* * *

### clientPageManager.\_handleEventWithExtensions(method, data) ⇒ <code>boolean</code>&nbsp;<a name="ClientPageManager+_handleEventWithExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/page/manager/ClientPageManager.js#L210" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Attempts to handle the currently processed event bus custom DOM event
using the registered extensions of the current controller. The method
returns <code>true</code> if the event is handled by the controller.

**Kind**: instance method of [<code>ClientPageManager</code>](#ClientPageManager)  
**Returns**: <code>boolean</code> - <code>true</code> if the event has been handled by one of
        the controller's extensions, <code>false</code> if none of the
        controller's extensions has a method for processing the event.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The name of the method the current controller        should use to process the currently processed event bus custom        DOM event. |
| data | <code>Object.&lt;string, \*&gt;</code> | The custom event's data. |


* * *

