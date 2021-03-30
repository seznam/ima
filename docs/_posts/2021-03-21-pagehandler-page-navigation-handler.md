---
category: "page/handler"
title: "API - PageNavigationHandler"
menuTitle: "PageNavigationHandler"
---

## PageNavigationHandler&nbsp;<a name="PageNavigationHandler" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global class  

* [PageNavigationHandler](#PageNavigationHandler)
    * [new PageNavigationHandler(window)](#new_PageNavigationHandler_new)
    * [._window](#PageNavigationHandler+_window) : <code>ima.core.window.Window</code>
    * [.init()](#PageNavigationHandler+init)
    * [.handlePreManagedState()](#PageNavigationHandler+handlePreManagedState)
    * [.handlePostManagedState()](#PageNavigationHandler+handlePostManagedState)
    * [._saveScrollHistory()](#PageNavigationHandler+_saveScrollHistory)
    * [._scrollTo(scroll)](#PageNavigationHandler+_scrollTo)
    * [._setAddressBar(url, isRedirection)](#PageNavigationHandler+_setAddressBar)


* * *

### new PageNavigationHandler(window)&nbsp;<a name="new_PageNavigationHandler_new"></a>

| Param | Type | Description |
| --- | --- | --- |
| window | <code>Window</code> | The utility for manipulating the global context        and global client-side-specific APIs. |


* * *

### pageNavigationHandler.\_window : <code>ima.core.window.Window</code>&nbsp;<a name="PageNavigationHandler+_window" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L26" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The utility for manipulating the global context and global
client-side-specific APIs.

**Kind**: instance property of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

* * *

### pageNavigationHandler.init()&nbsp;<a name="PageNavigationHandler+init" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

* * *

### pageNavigationHandler.handlePreManagedState()&nbsp;<a name="PageNavigationHandler+handlePreManagedState" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L44" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

* * *

### pageNavigationHandler.handlePostManagedState()&nbsp;<a name="PageNavigationHandler+handlePostManagedState" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L71" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

* * *

### pageNavigationHandler.\_saveScrollHistory()&nbsp;<a name="PageNavigationHandler+_saveScrollHistory" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Save user's scroll state to history.

Replace scroll values in current state for actual scroll values in
document.

**Kind**: instance method of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

* * *

### pageNavigationHandler.\_scrollTo(scroll)&nbsp;<a name="PageNavigationHandler+_scrollTo" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Scrolls to give coordinates on a page.

**Kind**: instance method of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

| Param | Type |
| --- | --- |
| scroll | <code>Object</code> | 
| [scroll.x] | <code>number</code> | 
| [scroll.y] | <code>number</code> | 


* * *

### pageNavigationHandler.\_setAddressBar(url, isRedirection)&nbsp;<a name="PageNavigationHandler+_setAddressBar" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/handler/PageNavigationHandler.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the provided URL to the browser's address bar by pushing or replacing a new
state to the history.

The state object pushed to or replaced in the history will be an object with the
following structure: <code>{url: string</code>}. The <code>url</code> field will
be set to the provided URL.

**Kind**: instance method of [<code>PageNavigationHandler</code>](#PageNavigationHandler)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL. |
| isRedirection | <code>boolean</code> | If replaceState should be used instead of pushState. |


* * *

