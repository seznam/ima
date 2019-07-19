---
category: "page/handler"
title: "PageHandler"
---

## PageHandler&nbsp;<a name="PageHandler" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/handler/PageHandler.js#L4" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global class  

* [PageHandler](#PageHandler)
    * [.init()](#PageHandler+init)
    * [.handlePreManagedState(managedPage, nextManagedPage, [action])](#PageHandler+handlePreManagedState)
    * [.handlePostManagedState(managedPage, previousManagedPage, [action])](#PageHandler+handlePostManagedState)
    * [.destroy()](#PageHandler+destroy)


* * *

### pageHandler.init()&nbsp;<a name="PageHandler+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/handler/PageHandler.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the page handler.

**Kind**: instance method of [<code>PageHandler</code>](#PageHandler)  

* * *

### pageHandler.handlePreManagedState(managedPage, nextManagedPage, [action])&nbsp;<a name="PageHandler+handlePreManagedState" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/handler/PageHandler.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Called before a PageManager starts to transition from previous page to
a new one.

**Kind**: instance method of [<code>PageHandler</code>](#PageHandler)  

| Param | Type | Description |
| --- | --- | --- |
| managedPage | <code>ManagedPage</code> | The currently managed page - soon-to-be        previously managed page. |
| nextManagedPage | <code>ManagedPage</code> | The data of the page that's about to        be managed. |
| [action] | <code>Object</code> | An action object describing what triggered the routing. |


* * *

### pageHandler.handlePostManagedState(managedPage, previousManagedPage, [action])&nbsp;<a name="PageHandler+handlePostManagedState" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/handler/PageHandler.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Called after a PageManager finishes transition from previous page to
a new one.

**Kind**: instance method of [<code>PageHandler</code>](#PageHandler)  

| Param | Type | Description |
| --- | --- | --- |
| managedPage | <code>ManagedPage</code> | The currently managed page. |
| previousManagedPage | <code>ManagedPage</code> | The data of the page that was        previously managed. |
| [action] | <code>Object</code> | An action object describing what triggered the routing. |


* * *

### pageHandler.destroy()&nbsp;<a name="PageHandler+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/handler/PageHandler.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

**Kind**: instance method of [<code>PageHandler</code>](#PageHandler)  

* * *

