---
category: "page/state"
title: "API - PageStateManager"
menuTitle: "PageStateManager"
---

## PageStateManager&nbsp;<a name="PageStateManager" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L4" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Manager of the current page state and state history.

**Kind**: global class  

* [PageStateManager](#PageStateManager)
    * [.clear()](#PageStateManager+clear)
    * [.setState(statePatch)](#PageStateManager+setState)
    * [.getState()](#PageStateManager+getState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.getAllStates()](#PageStateManager+getAllStates) ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [.getTransactionStatePatches()](#PageStateManager+getTransactionStatePatches) ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [.beginTransaction()](#PageStateManager+beginTransaction)
    * [.commitTransaction()](#PageStateManager+commitTransaction)
    * [.cancelTransaction()](#PageStateManager+cancelTransaction)


* * *

### pageStateManager.clear()&nbsp;<a name="PageStateManager+clear" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the state history.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

* * *

### pageStateManager.setState(statePatch)&nbsp;<a name="PageStateManager+setState" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets a new page state by applying the provided patch to the current
state.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

| Param | Type | Description |
| --- | --- | --- |
| statePatch | <code>Object.&lt;string, \*&gt;</code> | The patch of the current state. |


* * *

### pageStateManager.getState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="PageStateManager+getState" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current page state.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current page state.  

* * *

### pageStateManager.getAllStates() ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="PageStateManager+getAllStates" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the recorded history of page states. The states will be
chronologically sorted from the oldest to the newest.

Note that the implementation may limit the size of the recorded history,
therefore the complete history may not be available.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  
**Returns**: <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code> - The recorded history of page states.  

* * *

### pageStateManager.getTransactionStatePatches() ⇒ <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="PageStateManager+getTransactionStatePatches" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns queueing state patches off the main state from the begin of transaction.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  
**Returns**: <code>Array.&lt;Object.&lt;string, \*&gt;&gt;</code> - State patches from the begin of transaction.  

* * *

### pageStateManager.beginTransaction()&nbsp;<a name="PageStateManager+beginTransaction" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Starts queueing state patches off the main state. While the transaction
is active every {@method setState} call has no effect on the current state.

Note that call to {@method getState} after the transaction has begun will
return state as it was before the transaction.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

* * *

### pageStateManager.commitTransaction()&nbsp;<a name="PageStateManager+commitTransaction" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Applies queued state patches to the main state. All patches are squashed
and applied with one {@method setState} call.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

* * *

### pageStateManager.cancelTransaction()&nbsp;<a name="PageStateManager+cancelTransaction" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/PageStateManager.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Cancels ongoing transaction. Uncommited state changes are lost.

**Kind**: instance method of [<code>PageStateManager</code>](#PageStateManager)  

* * *

