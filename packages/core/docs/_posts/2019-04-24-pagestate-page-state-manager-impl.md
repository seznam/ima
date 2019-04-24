---
category: "page/state"
title: "PageStateManagerImpl"
---

## PageStateManagerImpl&nbsp;<a name="PageStateManagerImpl" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L10" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The implementation of the {@linkcode PageStateManager} interface.

**Kind**: global class  

* [PageStateManagerImpl](#PageStateManagerImpl)
    * [new PageStateManagerImpl(dispatcher)](#new_PageStateManagerImpl_new)
    * [._states](#PageStateManagerImpl+_states) : <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [._cursor](#PageStateManagerImpl+_cursor) : <code>number</code>
    * [.onChange](#PageStateManagerImpl+onChange) : <code>function</code>
    * [._dispatcher](#PageStateManagerImpl+_dispatcher) : <code>Dispatcher</code>
    * [.clear()](#PageStateManagerImpl+clear)
    * [.setState()](#PageStateManagerImpl+setState)
    * [.getState()](#PageStateManagerImpl+getState)
    * [.getAllStates()](#PageStateManagerImpl+getAllStates)
    * [._eraseExcessHistory()](#PageStateManagerImpl+_eraseExcessHistory)
    * [._pushToHistory(newState)](#PageStateManagerImpl+_pushToHistory)
    * [._callOnChangeCallback(newState)](#PageStateManagerImpl+_callOnChangeCallback)


* * *

### new PageStateManagerImpl(dispatcher)&nbsp;<a name="new_PageStateManagerImpl_new"></a>
Initializes the page state manager.


| Param | Type | Description |
| --- | --- | --- |
| dispatcher | <code>Dispatcher</code> | Dispatcher fires events to app. |


* * *

### pageStateManagerImpl.\_states : <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="PageStateManagerImpl+_states" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L26" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.\_cursor : <code>number</code>&nbsp;<a name="PageStateManagerImpl+_cursor" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L31" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.onChange : <code>function</code>&nbsp;<a name="PageStateManagerImpl+onChange" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L36" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.\_dispatcher : <code>Dispatcher</code>&nbsp;<a name="PageStateManagerImpl+_dispatcher" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.clear()&nbsp;<a name="PageStateManagerImpl+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L47" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.setState()&nbsp;<a name="PageStateManagerImpl+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L55" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.getState()&nbsp;<a name="PageStateManagerImpl+getState" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L75" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.getAllStates()&nbsp;<a name="PageStateManagerImpl+getAllStates" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L82" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.\_eraseExcessHistory()&nbsp;<a name="PageStateManagerImpl+_eraseExcessHistory" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L90" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Erase the oldest state from storage only if it exceed max
defined size of history.

**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

* * *

### pageStateManagerImpl.\_pushToHistory(newState)&nbsp;<a name="PageStateManagerImpl+_pushToHistory" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L102" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Push new state to history storage.

**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

| Param | Type |
| --- | --- |
| newState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### pageStateManagerImpl.\_callOnChangeCallback(newState)&nbsp;<a name="PageStateManagerImpl+_callOnChangeCallback" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManagerImpl.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Call registered callback function on (@codelink onChange) with newState.

**Kind**: instance method of [<code>PageStateManagerImpl</code>](#PageStateManagerImpl)  

| Param | Type |
| --- | --- |
| newState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

