---
category: "debug"
title: "DevTool"
---

## DevTool&nbsp;<a name="DevTool" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L12" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Developer tools, used mostly for navigating the page state history.

**Kind**: global class  

* [DevTool](#DevTool)
    * [new DevTool(pageManager, stateManager, window, dispatcher, eventBus)](#new_DevTool_new)
    * [._pageManager](#DevTool+_pageManager) : <code>PageManager</code>
    * [._stateManager](#DevTool+_stateManager) : <code>PageStateManager</code>
    * [._window](#DevTool+_window) : <code>Window</code>
    * [._dispatcher](#DevTool+_dispatcher) : <code>Dispatcher</code>
    * [._eventBus](#DevTool+_eventBus) : <code>EventBus</code>
    * [.init()](#DevTool+init)
    * [.setState(statePatch)](#DevTool+setState)
    * [.getState()](#DevTool+getState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.clearAppSource()](#DevTool+clearAppSource)


* * *

### new DevTool(pageManager, stateManager, window, dispatcher, eventBus)&nbsp;<a name="new_DevTool_new"></a>
Initializes the developer tools.


| Param | Type | Description |
| --- | --- | --- |
| pageManager | <code>PageManager</code> | Application page manager. |
| stateManager | <code>PageStateManager</code> | Application state manager. |
| window | <code>Window</code> | IMA window wrapper. |
| dispatcher | <code>Dispatcher</code> | IMA event dispatcher. |
| eventBus | <code>EventBus</code> | IMA DOM event bus. |


* * *

### devTool.\_pageManager : <code>PageManager</code>&nbsp;<a name="DevTool+_pageManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application page manager.

**Kind**: instance property of [<code>DevTool</code>](#DevTool)  

* * *

### devTool.\_stateManager : <code>PageStateManager</code>&nbsp;<a name="DevTool+_stateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application state manager.

**Kind**: instance property of [<code>DevTool</code>](#DevTool)  

* * *

### devTool.\_window : <code>Window</code>&nbsp;<a name="DevTool+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L46" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
IMA window wrapper.

**Kind**: instance property of [<code>DevTool</code>](#DevTool)  

* * *

### devTool.\_dispatcher : <code>Dispatcher</code>&nbsp;<a name="DevTool+_dispatcher" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L53" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
IMA event dispatcher.

**Kind**: instance property of [<code>DevTool</code>](#DevTool)  

* * *

### devTool.\_eventBus : <code>EventBus</code>&nbsp;<a name="DevTool+_eventBus" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L60" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
IMA DOM event bus.

**Kind**: instance property of [<code>DevTool</code>](#DevTool)  

* * *

### devTool.init()&nbsp;<a name="DevTool+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the developer tools.

**Kind**: instance method of [<code>DevTool</code>](#DevTool)  

* * *

### devTool.setState(statePatch)&nbsp;<a name="DevTool+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L87" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the provided state to the state manager.

**Kind**: instance method of [<code>DevTool</code>](#DevTool)  

| Param | Type | Description |
| --- | --- | --- |
| statePatch | <code>Object.&lt;string, \*&gt;</code> | A patch of the current page state. |


* * *

### devTool.getState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="DevTool+getState" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L96" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current page state.

**Kind**: instance method of [<code>DevTool</code>](#DevTool)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current page state.  

* * *

### devTool.clearAppSource()&nbsp;<a name="DevTool+clearAppSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/debug/DevTool.js#L103" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the current application state.

**Kind**: instance method of [<code>DevTool</code>](#DevTool)  

* * *

