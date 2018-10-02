---
category: "event"
title: "Dispatcher"
---

## Dispatcher&nbsp;<a name="Dispatcher" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/Dispatcher.js#L12" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Dispatcher](#Dispatcher)
    * [.clear()](#Dispatcher+clear) ⇒ [<code>Dispatcher</code>](#Dispatcher)
    * [.listen(event, listener, [scope])](#Dispatcher+listen) ⇒ [<code>Dispatcher</code>](#Dispatcher)
    * [.unlisten(event, listener, [scope])](#Dispatcher+unlisten) ⇒ [<code>Dispatcher</code>](#Dispatcher)
    * [.fire(event, data, [imaInternalEvent])](#Dispatcher+fire) ⇒ [<code>Dispatcher</code>](#Dispatcher)


* * *

### dispatcher.clear() ⇒ [<code>Dispatcher</code>](#Dispatcher)&nbsp;<a name="Dispatcher+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/Dispatcher.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deregisters all event listeners currently registered with this
dispatcher.

**Kind**: instance method of [<code>Dispatcher</code>](#Dispatcher)  
**Returns**: [<code>Dispatcher</code>](#Dispatcher) - This dispatcher.  

* * *

### dispatcher.listen(event, listener, [scope]) ⇒ [<code>Dispatcher</code>](#Dispatcher)&nbsp;<a name="Dispatcher+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/Dispatcher.js#L38" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener to be executed when the specified
event is fired on this dispatcher.

When the specified event is fired, the event listener will be executed
with the data passed with the event as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon. Registering the same listener for the
same event and with the same scope multiple times has no effect.

**Kind**: instance method of [<code>Dispatcher</code>](#Dispatcher)  
**Returns**: [<code>Dispatcher</code>](#Dispatcher) - This dispatcher.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event to listen for. |
| listener | <code>function</code> | The event listener to register. |
| [scope] | <code>Object</code> | The object to which the <code>this</code> keyword        will be bound in the event listener. |


* * *

### dispatcher.unlisten(event, listener, [scope]) ⇒ [<code>Dispatcher</code>](#Dispatcher)&nbsp;<a name="Dispatcher+unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/Dispatcher.js#L51" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deregisters the provided event listener, so it will no longer be
executed with the specified scope when the specified event is fired.

**Kind**: instance method of [<code>Dispatcher</code>](#Dispatcher)  
**Returns**: [<code>Dispatcher</code>](#Dispatcher) - This dispatcher.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event for which the listener        should be deregistered. |
| listener | <code>function</code> | The event listener to deregister. |
| [scope] | <code>Object</code> | The object to which the <code>this</code> keyword        would be bound in the event listener. |


* * *

### dispatcher.fire(event, data, [imaInternalEvent]) ⇒ [<code>Dispatcher</code>](#Dispatcher)&nbsp;<a name="Dispatcher+fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/Dispatcher.js#L73" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Fires a new event of the specified name, carrying the provided data.

The method will synchronously execute all event listeners registered for
the specified event, passing the provided data to them as the first
argument.

Note that this method does not prevent the event listeners to modify the
data in any way. The order in which the event listeners will be executed
is unspecified and should not be relied upon.

**Kind**: instance method of [<code>Dispatcher</code>](#Dispatcher)  
**Returns**: [<code>Dispatcher</code>](#Dispatcher) - This dispatcher.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| event | <code>string</code> |  | The name of the event to fire. |
| data | <code>Object.&lt;string, \*&gt;</code> |  | The data to pass to the event listeners. |
| [imaInternalEvent] | <code>boolean</code> | <code>false</code> | The flag signalling whether        this is an internal IMA event. The fired event is treated as a        custom application event if this flag is not set.        The flag is used only for debugging and has no effect on the        propagation of the event. |


* * *

