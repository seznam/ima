---
category: "event"
title: "DispatcherImpl"
---

## Classes

<dl>
<dt><a href="#DispatcherImpl">DispatcherImpl</a></dt>
<dd><p>Default implementation of the <code>Dispatcher</code> interface.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#EMPTY_MAP">EMPTY_MAP</a> : <code>Map.&lt;function(*), Set.&lt;?Object&gt;&gt;</code></dt>
<dd><p>An empty immutable map of event listener to scopes, used for a mismatch in
the <code>_eventListeners</code> map.</p>
</dd>
<dt><a href="#EMPTY_SET">EMPTY_SET</a> : <code>Set.&lt;?Object&gt;</code></dt>
<dd><p>An empty immutable set of event listener scopes, used for a mismatch in the
<code>_eventListeners</code> map.</p>
</dd>
</dl>

## DispatcherImpl&nbsp;<a name="DispatcherImpl" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Default implementation of the <code>Dispatcher</code> interface.

**Kind**: global class  

* [DispatcherImpl](#DispatcherImpl)
    * [new DispatcherImpl()](#new_DispatcherImpl_new)
    * [._eventListeners](#DispatcherImpl+_eventListeners) : <code>Map.&lt;string, Map.&lt;function(\*), Set.&lt;?Object&gt;&gt;&gt;</code>
    * [.clear()](#DispatcherImpl+clear)
    * [.listen()](#DispatcherImpl+listen)
    * [.unlisten()](#DispatcherImpl+unlisten)
    * [.fire()](#DispatcherImpl+fire)
    * [._createNewEvent(event)](#DispatcherImpl+_createNewEvent)
    * [._createNewListener(event, listener)](#DispatcherImpl+_createNewListener)
    * [._getScopesOf(event, listener)](#DispatcherImpl+_getScopesOf) ⇒ <code>Set.&lt;?Object&gt;</code>
    * [._getListenersOf(event)](#DispatcherImpl+_getListenersOf) ⇒ <code>Map.&lt;function(\*), Set.&lt;?Object&gt;&gt;</code>


* * *

### new DispatcherImpl()&nbsp;<a name="new_DispatcherImpl_new"></a>
Initializes the dispatcher.


* * *

### dispatcherImpl._eventListeners : <code>Map.&lt;string, Map.&lt;function(\*), Set.&lt;?Object&gt;&gt;&gt;</code>&nbsp;<a name="DispatcherImpl+_eventListeners" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L43" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of event names to a map of event listeners to a set of scopes to
which the event listener should be bound when being executed due to
the event.

**Kind**: instance property of [<code>DispatcherImpl</code>](#DispatcherImpl)  

* * *

### dispatcherImpl.clear()&nbsp;<a name="DispatcherImpl+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L49" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  

* * *

### dispatcherImpl.listen()&nbsp;<a name="DispatcherImpl+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L58" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  

* * *

### dispatcherImpl.unlisten()&nbsp;<a name="DispatcherImpl+unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L83" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  

* * *

### dispatcherImpl.fire()&nbsp;<a name="DispatcherImpl+fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L118" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  

* * *

### dispatcherImpl._createNewEvent(event)&nbsp;<a name="DispatcherImpl+_createNewEvent" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L145" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create new Map storage of listeners for the specified event.

**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event. |


* * *

### dispatcherImpl._createNewListener(event, listener)&nbsp;<a name="DispatcherImpl+_createNewListener" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L156" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create new Set storage of scopes for the specified event and listener.

**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event. |
| listener | <code>function</code> | The event listener. |


* * *

### dispatcherImpl._getScopesOf(event, listener) ⇒ <code>Set.&lt;?Object&gt;</code>&nbsp;<a name="DispatcherImpl+_getScopesOf" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L172" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the scopes in which the specified event listener should be
executed for the specified event.

**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  
**Returns**: <code>Set.&lt;?Object&gt;</code> - The scopes in which the specified listeners
        should be executed in case of the specified event. The returned
        set is an unmodifiable empty set if no listeners are registered
        for the event.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event. |
| listener | <code>function</code> | The event listener. |


* * *

### dispatcherImpl._getListenersOf(event) ⇒ <code>Map.&lt;function(\*), Set.&lt;?Object&gt;&gt;</code>&nbsp;<a name="DispatcherImpl+_getListenersOf" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L191" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the map of event listeners to scopes they are bound to.

**Kind**: instance method of [<code>DispatcherImpl</code>](#DispatcherImpl)  
**Returns**: <code>Map.&lt;function(\*), Set.&lt;?Object&gt;&gt;</code> - A map of event listeners to the
        scopes in which they should be executed. The returned map is an
        unmodifiable empty map if no listeners are registered for the
        event.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The name of the event. |


* * *

## EMPTY_MAP : <code>Map.&lt;function(\*), Set.&lt;?Object&gt;&gt;</code>&nbsp;<a name="EMPTY_MAP" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L11" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An empty immutable map of event listener to scopes, used for a mismatch in
the <code>_eventListeners</code> map.

**Kind**: global constant  

* * *

## EMPTY_SET : <code>Set.&lt;?Object&gt;</code>&nbsp;<a name="EMPTY_SET" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/event/DispatcherImpl.js#L20" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An empty immutable set of event listener scopes, used for a mismatch in the
<code>_eventListeners</code> map.

**Kind**: global constant  

* * *

