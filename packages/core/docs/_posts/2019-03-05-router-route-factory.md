---
category: "router"
title: "RouteFactory"
---

## RouteFactory&nbsp;<a name="RouteFactory" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/RouteFactory.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility factory used by router to create routes.

**Kind**: global class  

* * *

### routeFactory.createRoute(name, pathExpression, controller, view, options) ⇒ <code>Route</code>&nbsp;<a name="RouteFactory+createRoute" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/RouteFactory.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create new instance of ima.router.Route.

**Kind**: instance method of [<code>RouteFactory</code>](#RouteFactory)  
**Returns**: <code>Route</code> - The constructed route.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The unique name of this route, identifying it among        the rest of the routes in the application. |
| pathExpression | <code>string</code> | A path expression specifying the URL path        part matching this route (must not contain a query string),        optionally containing named parameter placeholders specified as        <code>:parameterName</code>. |
| controller | <code>string</code> | The full name of Object Container alias        identifying the controller associated with this route. |
| view | <code>string</code> | The full name or Object Container alias identifying        the view class associated with this route. |
| options | <code>Object</code> | The route additional options. |


* * *

