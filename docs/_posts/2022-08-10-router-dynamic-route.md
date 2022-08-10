---
category: "router"
title: "API - DynamicRoute"
menuTitle: "DynamicRoute"
---

## DynamicRoute ⇐ <code>AbstractRoute</code>&nbsp;<a name="DynamicRoute" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L26" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for representing and manipulating a single dynamic route in the
router's configuration. Dynamic route is defined by regExp used for route
matching and overrides for toPath and extractParameters functions to generate
and put together valid path.

**Kind**: global class  
**Extends**: <code>AbstractRoute</code>  

* [DynamicRoute](#DynamicRoute) ⇐ <code>AbstractRoute</code>
    * [new DynamicRoute(pathExpression)](#new_DynamicRoute_new)
    * [._matcher](#DynamicRoute+_matcher) : <code>RegExp</code>
    * [._toPath](#DynamicRoute+_toPath) : <code>function</code>
    * [._extractParameters](#DynamicRoute+_extractParameters) : <code>function</code>
    * [.toPath()](#DynamicRoute+toPath)
    * [.matches()](#DynamicRoute+matches)
    * [.extractParameters()](#DynamicRoute+extractParameters)


* * *

### new DynamicRoute(pathExpression)&nbsp;<a name="new_DynamicRoute_new"></a>
Initializes the route.


| Param | Type | Description |
| --- | --- | --- |
| pathExpression | [<code>PathExpression</code>](#Route..PathExpression) | Path expression used in route matching,        to generate valid path with provided params and parsing params from current path. |


* * *

### dynamicRoute.\_matcher : <code>RegExp</code>&nbsp;<a name="DynamicRoute+_matcher" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L54" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
RegExp use in router for path matching to current route.

**Kind**: instance property of [<code>DynamicRoute</code>](#DynamicRoute)  

* * *

### dynamicRoute.\_toPath : <code>function</code>&nbsp;<a name="DynamicRoute+_toPath" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L67" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Function that generates valid path from current route and passed route params.

**Kind**: instance property of [<code>DynamicRoute</code>](#DynamicRoute)  

* * *

### dynamicRoute.\_extractParameters : <code>function</code>&nbsp;<a name="DynamicRoute+_extractParameters" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L82" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Function which takes care of parsing url params from given path.
It returns object of key/value pairs which correspond to expected path url
params and their values.

**Kind**: instance property of [<code>DynamicRoute</code>](#DynamicRoute)  

* * *

### dynamicRoute.toPath()&nbsp;<a name="DynamicRoute+toPath" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DynamicRoute</code>](#DynamicRoute)  

* * *

### dynamicRoute.matches()&nbsp;<a name="DynamicRoute+matches" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L95" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DynamicRoute</code>](#DynamicRoute)  

* * *

### dynamicRoute.extractParameters()&nbsp;<a name="DynamicRoute+extractParameters" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/router/DynamicRoute.js#L104" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>DynamicRoute</code>](#DynamicRoute)  

* * *

