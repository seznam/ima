---
category: "event"
title: "EventBus"
---

## EventBus&nbsp;<a name="EventBus" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBus.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [EventBus](#EventBus)
    * [.fire(eventTarget, eventName, data, [options])](#EventBus+fire) ⇒ [<code>EventBus</code>](#EventBus)
    * [.listenAll(eventTarget, listener)](#EventBus+listenAll) ⇒ [<code>EventBus</code>](#EventBus)
    * [.listen(eventTarget, eventName, listener)](#EventBus+listen) ⇒ [<code>EventBus</code>](#EventBus)
    * [.unlistenAll(eventTarget, listener)](#EventBus+unlistenAll) ⇒ [<code>EventBus</code>](#EventBus)
    * [.unlisten(eventTarget, eventName, listener)](#EventBus+unlisten) ⇒ [<code>EventBus</code>](#EventBus)


* * *

### eventBus.fire(eventTarget, eventName, data, [options]) ⇒ [<code>EventBus</code>](#EventBus)&nbsp;<a name="EventBus+fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBus.js#L44" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Fires a new custom event of the specified name, carrying the provided
data.

Note that this method does not prevent the event listeners to modify the
data in any way. The order in which the event listeners will be executed
is unspecified and should not be relied upon.

Note that the default options are
<code>{ bubbles: true, cancelable: true </code>}, which is different from the
default values used in the native custom events
(<code>{ bubbles: false, cancelable: false </code>}).

**Kind**: instance method of [<code>EventBus</code>](#EventBus)  
**Returns**: [<code>EventBus</code>](#EventBus) - This custom event bus.  
**Throws**:

- <code>Error</code> Thrown if the provided event target cannot be used to
        fire the event.

**See**: https://developer.mozilla.org/en-US/docs/Web/API/Event/Event  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventTarget | <code>EventTarget</code> |  | The event target at which the event        will be  dispatched (e.g. element/document/window). |
| eventName | <code>string</code> |  | The name of the event to fire. |
| data | <code>\*</code> |  | The data to pass to the event listeners. |
| [options] | <code>Object</code> | <code>{}</code> | The        override of the default options passed to the constructor of the        custom event fired by this event bus.        The default options passed to the custom event constructor are        <code>{ bubbles: true, cancelable: true </code>}. |


* * *

### eventBus.listenAll(eventTarget, listener) ⇒ [<code>EventBus</code>](#EventBus)&nbsp;<a name="EventBus+listenAll" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBus.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener to be executed when any custom
event is fired using the same implementation of the event bus and passes
through the specified event target.

When the specified event is fired, the event listener will be executed
with the event passed as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon.

**Kind**: instance method of [<code>EventBus</code>](#EventBus)  
**Returns**: [<code>EventBus</code>](#EventBus) - This event bus.  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | The event target at which the listener        should listen for all event bus events. |
| listener | <code>function</code> | The event listener to        register. |


* * *

### eventBus.listen(eventTarget, eventName, listener) ⇒ [<code>EventBus</code>](#EventBus)&nbsp;<a name="EventBus+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBus.js#L83" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener to be executed when the specific
custom event is fired by the same implementation of the event bus and
passes through the specified event target.

When the specified event is fired, the event listener will be executed
with the event passed as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon.

**Kind**: instance method of [<code>EventBus</code>](#EventBus)  
**Returns**: [<code>EventBus</code>](#EventBus) - This event bus.  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | The event target at which the listener        should listen for the specified event. |
| eventName | <code>string</code> | The name of the event to listen for. |
| listener | <code>function</code> | The event listener to        register. |


* * *

### eventBus.unlistenAll(eventTarget, listener) ⇒ [<code>EventBus</code>](#EventBus)&nbsp;<a name="EventBus+unlistenAll" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBus.js#L99" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Removes the provided event listener from the set of event listeners
executed when the any custom event fired by the same implementation
passes through the specified event target.

The method has no effect if the listener is not registered at the
specified event target.

**Kind**: instance method of [<code>EventBus</code>](#EventBus)  
**Returns**: [<code>EventBus</code>](#EventBus) - This event bus.  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | The event target at which the event        listener listens for events. |
| listener | <code>function</code> | The event listener to        deregister. |


* * *

### eventBus.unlisten(eventTarget, eventName, listener) ⇒ [<code>EventBus</code>](#EventBus)&nbsp;<a name="EventBus+unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.5/event/EventBus.js#L116" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Removes the provided event listener from the set of event listeners
executed when the specified custom event fired by the same
implementation passes through the specified event target.

The method has no effect if the listener is not registered for the
specified event at the specified event target.

**Kind**: instance method of [<code>EventBus</code>](#EventBus)  
**Returns**: [<code>EventBus</code>](#EventBus) - This event bus.  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | The event target at which the listener        is listening for the event. |
| eventName | <code>string</code> | The name of the event listened for. |
| listener | <code>function</code> | The event listener to        deregister. |


* * *

