---
category: "router"
title: "API - RouterMiddleware"
menuTitle: "RouterMiddleware"
---

## RouterMiddleware&nbsp;<a name="RouterMiddleware" href="https://github.com/seznam/ima/blob/v17.12.1/packages/core/src/router/RouterMiddleware.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for representing and running router middleware.

**Kind**: global class  

* [RouterMiddleware](#RouterMiddleware)
    * [new RouterMiddleware(middleware)](#new_RouterMiddleware_new)
    * [._middleware](#RouterMiddleware+_middleware) : <code>function</code>
    * [.run([params], locals)](#RouterMiddleware+run) ⇒ <code>Promise.&lt;void&gt;</code>


* * *

### new RouterMiddleware(middleware)&nbsp;<a name="new_RouterMiddleware_new"></a>
Initializes the middleware


| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>function</code> | Middleware        function accepting routeParams as a first argument, which can be mutated        and <code>locals</code> object as second argument. This can be used to pass data        between middlewares. |


* * *

### routerMiddleware.\_middleware : <code>function</code>&nbsp;<a name="RouterMiddleware+_middleware" href="https://github.com/seznam/ima/blob/v17.12.1/packages/core/src/router/RouterMiddleware.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Middleware function accepting <code>routeParams</code> as a first argument, which can be
mutated and <code>locals</code> object as second argument. This can be used to pass data
between middlewares.

**Kind**: instance property of [<code>RouterMiddleware</code>](#RouterMiddleware)  

* * *

### routerMiddleware.run([params], locals) ⇒ <code>Promise.&lt;void&gt;</code>&nbsp;<a name="RouterMiddleware+run" href="https://github.com/seznam/ima/blob/v17.12.1/packages/core/src/router/RouterMiddleware.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Passes provided params to router middleware and runs it.

**Kind**: instance method of [<code>RouterMiddleware</code>](#RouterMiddleware)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Middleware function.  

| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | The route parameter values. |
| locals | <code>object</code> | Object used to pass data between middlewares. |


* * *

