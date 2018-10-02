---
category: "page/manager"
title: "PageManager"
---

## PageManager&nbsp;<a name="PageManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/PageManager.js#L5" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The page manager is a utility for managing the current controller and its
view.

**Kind**: global class  

* [PageManager](#PageManager)
    * [.init()](#PageManager+init)
    * [.manage(route, options, [params], [action])](#PageManager+manage) ⇒ <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, \*&gt;}&gt;</code>
    * [.destroy()](#PageManager+destroy)


* * *

### pageManager.init()&nbsp;<a name="PageManager+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/PageManager.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the page manager.

**Kind**: instance method of [<code>PageManager</code>](#PageManager)  

* * *

### pageManager.manage(route, options, [params], [action]) ⇒ <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, \*&gt;}&gt;</code>&nbsp;<a name="PageManager+manage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/PageManager.js#L54" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Starts to manage the provided controller and its view. The manager
stops the management of any previously managed controller and view.

The controller and view will be initialized and rendered either into the
UI (at the client-side) or to the response to send to the client (at the
server-side).

**Kind**: instance method of [<code>PageManager</code>](#PageManager)  
**Returns**: <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, \*&gt;}&gt;</code> - A promise that will resolve to information about the rendered page.
        The <code>status</code> will contain the HTTP status code to send to the
        client (at the server side) or determine the type of error page
        to navigate to (at the client side).
        The <code>content</code> field will contain the rendered markup of
        the page at the server-side, or <code>null</code> at the client-side.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| route | <code>Route</code> |  | A route instance that holds information about the        page we should manage. |
| options | <code>Object</code> |  | The current route options. |
| [params] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | The route parameters of the        current route. |
| [action] | <code>Object</code> |  | An action object describing what triggered the routing. |


* * *

### pageManager.destroy()&nbsp;<a name="PageManager+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/PageManager.js#L60" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

**Kind**: instance method of [<code>PageManager</code>](#PageManager)  

* * *

