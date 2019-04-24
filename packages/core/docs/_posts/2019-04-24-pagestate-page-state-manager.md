---
category: "page/state"
title: "PageStateManager"
---

## PageStateManager&nbsp;<a name="PageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManager.js#L4" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Manager of the current page state and state history.

**Kind**: global class  

* [PageStateManager](#PageStateManager)
    * [.clear()](#PageStateManager+clear)
    * [.setState(statePatch)](#PageStateManager+setState)
    * [.getState()](#PageStateManager+getState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.getAllStates()](#PageStateManager+getAllStates) ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>


* * *

### pageStateManager.clear()&nbsp;<a name="PageStateManager+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManager.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the state history.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

* * *

### pageStateManager.setState(statePatch)&nbsp;<a name="PageStateManager+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManager.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets a new page state by applying the provided patch to the current
state.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

| Param | Type | Description |
| --- | --- | --- |
| statePatch | <code>Object.&lt;string, \*&gt;</code> | The patch of the current state. |


* * *

### pageStateManager.getState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="PageStateManager+getState" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManager.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current page state.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current page state.  

* * *

### pageStateManager.getAllStates() ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="PageStateManager+getAllStates" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/state/PageStateManager.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the recorded history of page states. The states will be
chronologically sorted from the oldest to the newest.

Note that the implementation may limit the size of the recorded history,
therefore the complete history may not be available.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  
**Returns**: <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code> - The recorded history of page states.  

* * *

