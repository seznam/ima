---
category: "page/state"
title: "PageStateManagerDecorator"
---

## PageStateManagerDecorator&nbsp;<a name="PageStateManagerDecorator" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Decorator for page state manager, which add logic for limiting Extension
competence.

**Kind**: global class  

* [PageStateManagerDecorator](#PageStateManagerDecorator)
    * [new PageStateManagerDecorator(pageStateManager, allowedStateKeys)](#new_PageStateManagerDecorator_new)
    * [._pageStateManager](#PageStateManagerDecorator+_pageStateManager) : <code>PageStateManager</code>
    * [._allowedStateKeys](#PageStateManagerDecorator+_allowedStateKeys) : <code>Array.&lt;string&gt;</code>
    * [.clear()](#PageStateManagerDecorator+clear)
    * [.setState()](#PageStateManagerDecorator+setState)
    * [.getState()](#PageStateManagerDecorator+getState)
    * [.getAllStates()](#PageStateManagerDecorator+getAllStates)


* * *

### new PageStateManagerDecorator(pageStateManager, allowedStateKeys)&nbsp;<a name="new_PageStateManagerDecorator_new"></a>
Initializes the page state manager decorator.


| Param | Type |
| --- | --- |
| pageStateManager | <code>PageStateManager</code> | 
| allowedStateKeys | <code>Array.&lt;string&gt;</code> | 


* * *

### pageStateManagerDecorator._pageStateManager : <code>PageStateManager</code>&nbsp;<a name="PageStateManagerDecorator+_pageStateManager" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current page state manager.

**Kind**: instance property of [<code>PageStateManagerDecorator</code>](#PageStateManagerDecorator)  

* * *

### pageStateManagerDecorator._allowedStateKeys : <code>Array.&lt;string&gt;</code>&nbsp;<a name="PageStateManagerDecorator+_allowedStateKeys" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Array of access keys for state.

**Kind**: instance property of [<code>PageStateManagerDecorator</code>](#PageStateManagerDecorator)  

* * *

### pageStateManagerDecorator.clear()&nbsp;<a name="PageStateManagerDecorator+clear" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L36" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerDecorator</code>](#PageStateManagerDecorator)  

* * *

### pageStateManagerDecorator.setState()&nbsp;<a name="PageStateManagerDecorator+setState" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L43" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerDecorator</code>](#PageStateManagerDecorator)  

* * *

### pageStateManagerDecorator.getState()&nbsp;<a name="PageStateManagerDecorator+getState" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L65" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerDecorator</code>](#PageStateManagerDecorator)  

* * *

### pageStateManagerDecorator.getAllStates()&nbsp;<a name="PageStateManagerDecorator+getAllStates" href="https://github.com/seznam/IMA.js-core/tree/stable/page/state/PageStateManagerDecorator.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageStateManagerDecorator</code>](#PageStateManagerDecorator)  

* * *

