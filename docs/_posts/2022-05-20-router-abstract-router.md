---
category: "router"
title: "API - AbstractRouter"
menuTitle: "AbstractRouter"
---

## *AbstractRouter*&nbsp;<a name="AbstractRouter" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L15" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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
    * *[._routeHandlers](#AbstractRouter+_routeHandlers) : <code>Map.&lt;string, AbstractRoute&gt;</code>*
    * *[._currentMiddlewareId](#AbstractRouter+_currentMiddlewareId)*
    * *[.init()](#AbstractRouter+init)*
    * *[.add()](#AbstractRouter+add)*
    * *[.use()](#AbstractRouter+use)*
    * *[.remove()](#AbstractRouter+remove)*
    * *[.getPath()](#AbstractRouter+getPath)*
    * *[.getUrl()](#AbstractRouter+getUrl)*
    * *[.getBaseUrl()](#AbstractRouter+getBaseUrl)*
    * *[.getDomain()](#AbstractRouter+getDomain)*
    * *[.getHost()](#AbstractRouter+getHost)*
    * *[.getProtocol()](#AbstractRouter+getProtocol)*
    * *[.getCurrentRouteInfo()](#AbstractRouter+getCurrentRouteInfo)*
    * *[.getRouteHandlers()](#AbstractRouter+getRouteHandlers)*
    * **[.listen()](#AbstractRouter+listen)**
    * **[.unlisten()](#AbstractRouter+unlisten)**
    * **[.redirect()](#AbstractRouter+redirect)**
    * *[.link()](#AbstractRouter+link)*
    * *[.route()](#AbstractRouter+route)*
    * *[.handleError()](#AbstractRouter+handleError)*
    * *[.handleNotFound()](#AbstractRouter+handleNotFound)*
    * *[.isClientError()](#AbstractRouter+isClientError)*
    * *[.isRedirection()](#AbstractRouter+isRedirection)*
    * *[._extractRoutePath(path)](#AbstractRouter+_extractRoutePath) ⇒ <code>string</code>*
    * *[._handle(route, params, options, [action])](#AbstractRouter+_handle) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>*
    * *[._getRouteHandlersByPath(path)](#AbstractRouter+_getRouteHandlersByPath) ⇒ <code>Object</code>*
    * *[._getMiddlewaresForRoute(routeName)](#AbstractRouter+_getMiddlewaresForRoute) ⇒ <code>Array.&lt;RouterMiddleware&gt;</code>*
    * *[._getCurrentlyRoutedPath()](#AbstractRouter+_getCurrentlyRoutedPath) ⇒ <code>string</code>*
    * *[._runMiddlewares(middlewares, params, locals)](#AbstractRouter+_runMiddlewares)*
    * *[._addParamsFromOriginalRoute(params)](#AbstractRouter+_addParamsFromOriginalRoute) ⇒ <code>Object.&lt;string, string&gt;</code>*


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

### *abstractRouter.\_pageManager : <code>PageManager</code>*&nbsp;<a name="AbstractRouter+_pageManager" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The page manager handling UI rendering, and transitions between
pages if at the client side.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_factory : <code>RouteFactory</code>*&nbsp;<a name="AbstractRouter+_factory" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L59" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory for routes.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_dispatcher : <code>Dispatcher</code>*&nbsp;<a name="AbstractRouter+_dispatcher" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Dispatcher fires events to app.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_protocol : <code>string</code>*&nbsp;<a name="AbstractRouter+_protocol" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L74" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current protocol used to access the application, terminated by a
colon (for example <code>https:</code>).

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_host : <code>string</code>*&nbsp;<a name="AbstractRouter+_host" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L81" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The application's host.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_root : <code>string</code>*&nbsp;<a name="AbstractRouter+_root" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The URL path pointing to the application's root.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_languagePartPath : <code>string</code>*&nbsp;<a name="AbstractRouter+_languagePartPath" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L96" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The URL path fragment used as a suffix to the <code>_root</code> field
that specifies the current language.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_routeHandlers : <code>Map.&lt;string, AbstractRoute&gt;</code>*&nbsp;<a name="AbstractRouter+_routeHandlers" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L103" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Storage of all known routes and middlewares. Their names are the map keys.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_currentMiddlewareId*&nbsp;<a name="AbstractRouter+_currentMiddlewareId" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Middleware ID counter which is used to auto-generate unique middleware
names when adding them to routeHandlers map.

**Kind**: instance property of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.init()*&nbsp;<a name="AbstractRouter+init" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L115" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.add()*&nbsp;<a name="AbstractRouter+add" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.use()*&nbsp;<a name="AbstractRouter+use" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L151" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.remove()*&nbsp;<a name="AbstractRouter+remove" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L163" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getPath()*&nbsp;<a name="AbstractRouter+getPath" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L172" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getUrl()*&nbsp;<a name="AbstractRouter+getUrl" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L181" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getBaseUrl()*&nbsp;<a name="AbstractRouter+getBaseUrl" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L188" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getDomain()*&nbsp;<a name="AbstractRouter+getDomain" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L195" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getHost()*&nbsp;<a name="AbstractRouter+getHost" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L202" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getProtocol()*&nbsp;<a name="AbstractRouter+getProtocol" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L209" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getCurrentRouteInfo()*&nbsp;<a name="AbstractRouter+getCurrentRouteInfo" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L216" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.getRouteHandlers()*&nbsp;<a name="AbstractRouter+getRouteHandlers" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L239" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### **abstractRouter.listen()**&nbsp;<a name="AbstractRouter+listen" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L247" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### **abstractRouter.unlisten()**&nbsp;<a name="AbstractRouter+unlisten" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L257" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### **abstractRouter.redirect()**&nbsp;<a name="AbstractRouter+redirect" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L267" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.link()*&nbsp;<a name="AbstractRouter+link" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L276" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.route()*&nbsp;<a name="AbstractRouter+route" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L292" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.handleError()*&nbsp;<a name="AbstractRouter+handleError" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L320" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.handleNotFound()*&nbsp;<a name="AbstractRouter+handleNotFound" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L359" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.isClientError()*&nbsp;<a name="AbstractRouter+isClientError" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L399" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.isRedirection()*&nbsp;<a name="AbstractRouter+isRedirection" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L410" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_extractRoutePath(path) ⇒ <code>string</code>*&nbsp;<a name="AbstractRouter+_extractRoutePath" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L426" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Strips the URL path part that points to the application's root (base
URL) from the provided path.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  
**Returns**: <code>string</code> - URL path relative to the application's base URL.  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Relative or absolute URL path. |


* * *

### *abstractRouter.\_handle(route, params, options, [action]) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>*&nbsp;<a name="AbstractRouter+_handle" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L467" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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
| route | <code>AbstractRoute</code> | The route that should have its        associated controller rendered via the associated view. |
| params | <code>Object.&lt;string, (Error\|string)&gt;</code> | Parameters extracted from        the URL path and query. |
| options | <code>Object</code> | The options overrides route options defined in the        <code>routes.js</code> configuration file. |
| [action] | <code>Object</code> | An action        object describing what triggered this routing. |


* * *

### *abstractRouter.\_getRouteHandlersByPath(path) ⇒ <code>Object</code>*&nbsp;<a name="AbstractRouter+_getRouteHandlersByPath" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L505" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the route matching the provided URL path part (the path may
contain a query) and all middlewares preceding this route definition.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  
**Returns**: <code>Object</code> - The route
        matching the path and middlewares preceding it or <code>{</code>}
        (empty object) if no such route exists.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path. |


* * *

### *abstractRouter.\_getMiddlewaresForRoute(routeName) ⇒ <code>Array.&lt;RouterMiddleware&gt;</code>*&nbsp;<a name="AbstractRouter+_getMiddlewaresForRoute" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L532" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns middlewares preceding given route name.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

| Param | Type |
| --- | --- |
| routeName | <code>string</code> | 


* * *

### *abstractRouter.\_getCurrentlyRoutedPath() ⇒ <code>string</code>*&nbsp;<a name="AbstractRouter+_getCurrentlyRoutedPath" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L556" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns path that is stored in private property when a <code>route</code>
method is called.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

* * *

### *abstractRouter.\_runMiddlewares(middlewares, params, locals)*&nbsp;<a name="AbstractRouter+_runMiddlewares" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L569" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Runs provided middlewares in sequence.

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  

| Param | Type | Description |
| --- | --- | --- |
| middlewares | <code>Array.&lt;Promise.&lt;RouterMiddleware&gt;&gt;</code> | Array of middlewares. |
| params | <code>Object.&lt;string, string&gt;</code> | Router params that can be        mutated by middlewares. |
| locals | <code>object</code> | The locals param is used to pass local data        between middlewares. |


* * *

### *abstractRouter.\_addParamsFromOriginalRoute(params) ⇒ <code>Object.&lt;string, string&gt;</code>*&nbsp;<a name="AbstractRouter+_addParamsFromOriginalRoute" href="https://github.com/seznam/ima/blob/v17.15.0/packages/core/src/router/AbstractRouter.js#L588" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Obtains original route that was handled before not-found / error route
and assigns its params to current params

**Kind**: instance method of [<code>AbstractRouter</code>](#AbstractRouter)  
**Returns**: <code>Object.&lt;string, string&gt;</code> - Provided params merged with params
       from original route  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object.&lt;string, string&gt;</code> | Route params for not-found or        error page |


* * *

