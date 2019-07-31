---
category: "router"
title: "AbstractRouter"
---

## *AbstractRouter*&nbsp;<a name="AbstractRouter" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The basic implementation of the <code>Router</code> interface, providing the
common or default functionality for parts of the API.

**Kind**: global abstract class  

* *[AbstractRouter](#AbstractRouter)*
    * *[new AbstractRouter(pageManager, factory, dispatcher)](#new_AbstractRouter_new)*
    * *[._pageManager](#AbstractRouter+_pageManager) : <code>PageManager</code>*
    * *[._factory](#AbstractRouter+_factory) : <code>RouteFactory</code>*
    * *[._dispatcher](#AbstractRouter+_dispatcher) : <code>Dispatcher</code>*
    * *[._protocol](#AbstractRouter+_protocol) : <code>string</code>*
    * *[._host](#AbstractRouter+_host) : <code>string</code>*
    * *[._root](#AbstractRouter+_root) : <code>string</code>*
    * *[._languagePartPath](#AbstractRouter+_languagePartPath) : <code>string</code>*
    * *[._routes](#AbstractRouter+_routes) : <code>Map.&lt;string, Route&gt;</code>*
    * *[.init()](#AbstractRouter+init)*
    * *[.add()](#AbstractRouter+add)*
    * *[.remove()](#AbstractRouter+remove)*
    * *[.getPath()](#AbstractRouter+getPath)*
    * *[.getUrl()](#AbstractRouter+getUrl)*
    * *[.getBaseUrl()](#AbstractRouter+getBaseUrl)*
    * *[.getDomain()](#AbstractRouter+getDomain)*
    * *[.getHost()](#AbstractRouter+getHost)*
    * *[.getProtocol()](#AbstractRouter+getProtocol)*
    * *[.getCurrentRouteInfo()](#AbstractRouter+getCurrentRouteInfo)*
    * **[.listen()](#AbstractRouter+listen)**
    * **[.redirect()](#AbstractRouter+redirect)**
    * *[.link()](#AbstractRouter+link)*
    * *[.route()](#AbstractRouter+route)*
    * *[.handleError()](#AbstractRouter+handleError)*
    * *[.handleNotFound()](#AbstractRouter+handleNotFound)*
    * *[.isClientError()](#AbstractRouter+isClientError)*
    * *[.isRedirection()](#AbstractRouter+isRedirection)*
    * *[._extractRoutePath(path)](#AbstractRouter+_extractRoutePath) ⇒ <code>string</code>*
    * *[._handle(route, params, options, [action])](#AbstractRouter+_handle) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>*
    * *[._getRouteByPath(path)](#AbstractRouter+_getRouteByPath) ⇒ <code>Route</code>*
    * *[._getCurrentlyRoutedPath()](#AbstractRouter+_getCurrentlyRoutedPath) ⇒ <code>string</code>*


* * *

### *new AbstractRouter(pageManager, factory, dispatcher)*&nbsp;<a name="new_AbstractRouter_new"></a>
Initializes the router.


| Param | Type | Description |
| --- | --- | --- |
| pageManager | <code>PageManager</code> | The page manager handling UI rendering,        and transitions between pages if at the client side. |
| factory | <code>RouteFactory</code> | Factory for routes. |
| dispatcher | <code>Dispatcher</code> | Dispatcher fires events to app. |

**Example**  
```js
router.link('article', {articleId: 1});
```
**Example**  
```js
router.redirect('http://www.example.com/web');
```
**Example**  
```js
router.add(
       'home',
       '/',
       ns.app.page.home.Controller,
       ns.app.page.home.View,
       {
         onlyUpdate: false,
         autoScroll: true,
         allowSPA: true,
         documentView: null,
         managedRootView: null,
         viewAdapter: null
       }
     );
```

* * *

### *abstractRouter.\_pageManager : <code>PageManager</code>*&nbsp;<a name="AbstractRouter+_pageManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The page manager handling UI rendering, and transitions between
pages if at the client side.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_factory : <code>RouteFactory</code>*&nbsp;<a name="AbstractRouter+_factory" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L57" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory for routes.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_dispatcher : <code>Dispatcher</code>*&nbsp;<a name="AbstractRouter+_dispatcher" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L64" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Dispatcher fires events to app.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_protocol : <code>string</code>*&nbsp;<a name="AbstractRouter+_protocol" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current protocol used to access the application, terminated by a
colon (for example <code>https:</code>).

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_host : <code>string</code>*&nbsp;<a name="AbstractRouter+_host" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L79" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The application's host.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_root : <code>string</code>*&nbsp;<a name="AbstractRouter+_root" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The URL path pointing to the application's root.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_languagePartPath : <code>string</code>*&nbsp;<a name="AbstractRouter+_languagePartPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L94" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The URL path fragment used as a suffix to the <code>_root</code> field
that specifies the current language.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_routes : <code>Map.&lt;string, Route&gt;</code>*&nbsp;<a name="AbstractRouter+_routes" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L101" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Storage of all known routes. The key are the route names.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.init()*&nbsp;<a name="AbstractRouter+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L107" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.add()*&nbsp;<a name="AbstractRouter+add" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L118" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.remove()*&nbsp;<a name="AbstractRouter+remove" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L142" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getPath()*&nbsp;<a name="AbstractRouter+getPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L151" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getUrl()*&nbsp;<a name="AbstractRouter+getUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L160" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getBaseUrl()*&nbsp;<a name="AbstractRouter+getBaseUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L167" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getDomain()*&nbsp;<a name="AbstractRouter+getDomain" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L174" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getHost()*&nbsp;<a name="AbstractRouter+getHost" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L181" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getProtocol()*&nbsp;<a name="AbstractRouter+getProtocol" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L188" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getCurrentRouteInfo()*&nbsp;<a name="AbstractRouter+getCurrentRouteInfo" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L195" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### **abstractRouter.listen()**&nbsp;<a name="AbstractRouter+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L215" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### **abstractRouter.redirect()**&nbsp;<a name="AbstractRouter+redirect" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L225" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.link()*&nbsp;<a name="AbstractRouter+link" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L234" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.route()*&nbsp;<a name="AbstractRouter+route" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L250" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.handleError()*&nbsp;<a name="AbstractRouter+handleError" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L272" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.handleNotFound()*&nbsp;<a name="AbstractRouter+handleNotFound" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L295" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.isClientError()*&nbsp;<a name="AbstractRouter+isClientError" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L319" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.isRedirection()*&nbsp;<a name="AbstractRouter+isRedirection" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L330" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_extractRoutePath(path) ⇒ <code>string</code>*&nbsp;<a name="AbstractRouter+_extractRoutePath" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L346" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Strips the URL path part that points to the application's root (base
URL) from the provided path.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  
**Returns**: <code>string</code> - URL path relative to the application's base URL.  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Relative or absolute URL path. |


* * *

### *abstractRouter.\_handle(route, params, options, [action]) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>*&nbsp;<a name="AbstractRouter+_handle" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L386" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles the provided route and parameters by initializing the route's
controller and rendering its state via the route's view.

The result is then sent to the client if used at the server side, or
displayed if used as the client side.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  
**Returns**: <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code> - A promise that resolves when the
        page is rendered and the result is sent to the client, or
        displayed if used at the client side.  

| Param | Type | Description |
| --- | --- | --- |
| route | <code>Route</code> | The route that should have its        associated controller rendered via the associated view. |
| params | <code>Object.&lt;string, (Error\|string)&gt;</code> | Parameters extracted from        the URL path and query. |
| options | <code>Object</code> | The options overrides route options defined in the        <code>routes.js</code> configuration file. |
| [action] | <code>Object</code> | An action        object describing what triggered this routing. |


* * *

### *abstractRouter.\_getRouteByPath(path) ⇒ <code>Route</code>*&nbsp;<a name="AbstractRouter+_getRouteByPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L423" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the route matching the provided URL path part. The path may
contain a query.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  
**Returns**: <code>Route</code> - The route matching the path, or <code>null</code> if no such
        route exists.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path. |


* * *

### *abstractRouter.\_getCurrentlyRoutedPath() ⇒ <code>string</code>*&nbsp;<a name="AbstractRouter+_getCurrentlyRoutedPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/AbstractRouter.js#L439" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns path that is stored in private property when a <code>route</code>
method is called.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

