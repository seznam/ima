---
category: "router"
title: "ServerRouter"
---

## ServerRouter&nbsp;<a name="ServerRouter" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/router/ServerRouter.js#L13" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The server-side implementation of the <code>Router</code> interface.

**Kind**: global class  

* [ServerRouter](#ServerRouter)
    * [new ServerRouter(pageManager, factory, dispatcher, request, response)](#new_ServerRouter_new)
    * [._request](#ServerRouter+_request) : <code>Request</code>
    * [._response](#ServerRouter+_response) : <code>Response</code>
    * [.getPath()](#ServerRouter+getPath)
    * [.listen()](#ServerRouter+listen)
    * [.redirect()](#ServerRouter+redirect)


* * *

### new ServerRouter(pageManager, factory, dispatcher, request, response)&nbsp;<a name="new_ServerRouter_new"></a>
Initializes the router.


| Param | Type | Description |
| --- | --- | --- |
| pageManager | <code>PageManager</code> | The current page manager. |
| factory | <code>RouteFactory</code> | The router factory used to create routes. |
| dispatcher | <code>Dispatcher</code> | Dispatcher fires events to app. |
| request | <code>Request</code> | The current HTTP request. |
| response | <code>Response</code> | The current HTTP response. |


* * *

### serverRouter._request : <code>Request</code>&nbsp;<a name="ServerRouter+_request" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/router/ServerRouter.js#L35" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current HTTP request.

**Kind**: instance property of [<code>ServerRouter</code>](#ServerRouter)  

* * *

### serverRouter._response : <code>Response</code>&nbsp;<a name="ServerRouter+_response" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/router/ServerRouter.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current HTTP response.

**Kind**: instance property of [<code>ServerRouter</code>](#ServerRouter)  

* * *

### serverRouter.getPath()&nbsp;<a name="ServerRouter+getPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/router/ServerRouter.js#L48" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ServerRouter</code>](#ServerRouter)  

* * *

### serverRouter.listen()&nbsp;<a name="ServerRouter+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/router/ServerRouter.js#L55" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ServerRouter</code>](#ServerRouter)  

* * *

### serverRouter.redirect()&nbsp;<a name="ServerRouter+redirect" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/router/ServerRouter.js#L62" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ServerRouter</code>](#ServerRouter)  

* * *

