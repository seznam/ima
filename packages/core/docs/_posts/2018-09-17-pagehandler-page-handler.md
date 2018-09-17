---
category: "page/handler"
title: "PageHandler"
---

## PageHandler&nbsp;<a name="PageHandler" href="https://github.com/seznam/IMA.js-core/tree/stable/page/handler/PageHandler.js#L4" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global class  

* [PageHandler](#PageHandler)
    * [.handlePreManagedState(managedPage, nextManagedPage, [action])](#PageHandler+handlePreManagedState)
    * [.handlePostManagedState(managedPage, previousManagedPage, [action])](#PageHandler+handlePostManagedState)


* * *

### pageHandler.handlePreManagedState(managedPage, nextManagedPage, [action])&nbsp;<a name="PageHandler+handlePreManagedState" href="https://github.com/seznam/IMA.js-core/tree/stable/page/handler/PageHandler.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Called before a PageManager starts to transition from previous page to
a new one.

**Kind**: instance method of [<code>PageHandler</code>](#PageHandler)  

| Param | Type | Description |
| --- | --- | --- |
| managedPage | <code>ManagedPage</code> | The currently managed page - soon-to-be        previously managed page. |
| nextManagedPage | <code>ManagedPage</code> | The data of the page that's about to        be managed. |
| [action] | <code>Object</code> | An action object describing what triggered the routing. |


* * *

### pageHandler.handlePostManagedState(managedPage, previousManagedPage, [action])&nbsp;<a name="PageHandler+handlePostManagedState" href="https://github.com/seznam/IMA.js-core/tree/stable/page/handler/PageHandler.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Called after a PageManager finishes transition from previous page to
a new one.

**Kind**: instance method of [<code>PageHandler</code>](#PageHandler)  

| Param | Type | Description |
| --- | --- | --- |
| managedPage | <code>ManagedPage</code> | The currently managed page. |
| previousManagedPage | <code>ManagedPage</code> | The data of the page that was        previously managed. |
| [action] | <code>Object</code> | An action object describing what triggered the routing. |


* * *

