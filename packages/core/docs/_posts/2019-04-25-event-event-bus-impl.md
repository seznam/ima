---
category: "event"
title: "EventBusImpl"
---

## Classes

<dl>
<dt><a href="#EventBusImpl">EventBusImpl</a></dt>
<dd><p>Helper for custom events.</p>
<p>It offers public methods for firing custom events and two methods for
catching events (e.g. inside view components).</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#IMA_EVENT">IMA_EVENT</a> : <code>string</code></dt>
<dd><p>Global name of IMA.js custom event.</p>
</dd>
</dl>

## EventBusImpl&nbsp;<a name="EventBusImpl" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L21" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Helper for custom events.

It offers public methods for firing custom events and two methods for
catching events (e.g. inside view components).

**Kind**: global class  

* [EventBusImpl](#EventBusImpl)
    * [new EventBusImpl(window)](#new_EventBusImpl_new)
    * [._window](#EventBusImpl+_window) : <code>Window</code>
    * [._listeners](#EventBusImpl+_listeners) : <code>WeakMap.&lt;function(Event), WeakMap.&lt;EventTarget, Map.&lt;string, function(Event)&gt;&gt;&gt;</code>
    * [._allListenersTargets](#EventBusImpl+_allListenersTargets) : <code>WeakMap.&lt;EventTarget, WeakSet.&lt;function(Event)&gt;&gt;</code>
    * [.fire()](#EventBusImpl+fire)
    * [.listenAll()](#EventBusImpl+listenAll)
    * [.listen()](#EventBusImpl+listen)
    * [.unlistenAll()](#EventBusImpl+unlistenAll)
    * [.unlisten()](#EventBusImpl+unlisten)


* * *

### new EventBusImpl(window)&nbsp;<a name="new_EventBusImpl_new"></a>
Initializes the custom event helper.


| Param | Type | Description |
| --- | --- | --- |
| window | <code>Window</code> | The IMA window helper. |


* * *

### eventBusImpl.\_window : <code>Window</code>&nbsp;<a name="EventBusImpl+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The IMA window helper.

**Kind**: instance property of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.\_listeners : <code>WeakMap.&lt;function(Event), WeakMap.&lt;EventTarget, Map.&lt;string, function(Event)&gt;&gt;&gt;</code>&nbsp;<a name="EventBusImpl+_listeners" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L53" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of listeners provided to the public API of this event bus to a
map of event targets to a map of event names to actual listeners
bound to the native API.

The "listen all" event listeners are not registered in this map.

**Kind**: instance property of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.\_allListenersTargets : <code>WeakMap.&lt;EventTarget, WeakSet.&lt;function(Event)&gt;&gt;</code>&nbsp;<a name="EventBusImpl+_allListenersTargets" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of event targets to listeners executed on all IMA.js event bus
events.

**Kind**: instance property of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.fire()&nbsp;<a name="EventBusImpl+fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L67" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.listenAll()&nbsp;<a name="EventBusImpl+listenAll" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L92" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.listen()&nbsp;<a name="EventBusImpl+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.unlistenAll()&nbsp;<a name="EventBusImpl+unlistenAll" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L152" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

### eventBusImpl.unlisten()&nbsp;<a name="EventBusImpl+unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L192" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>EventBusImpl</code>](#EventBusImpl)  

* * *

## IMA\_EVENT : <code>string</code>&nbsp;<a name="IMA_EVENT" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBusImpl.js#L13" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Global name of IMA.js custom event.

**Kind**: global constant  

* * *

