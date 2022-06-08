---
category: "router"
title: "API - RouteFactory"
menuTitle: "RouteFactory"
---

## RouteFactory&nbsp;<a name="RouteFactory" href="https://github.com/seznam/ima/blob/v18.0.0-rc.0/packages/core/src/router/RouteFactory.js#L7" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility factory used by router to create routes.

**Kind**: global class  

* * *

### routeFactory.createRoute(name, pathExpression, controller, view, options) ⇒ <code>AbstractRoute</code>&nbsp;<a name="RouteFactory+createRoute" href="https://github.com/seznam/ima/blob/v18.0.0-rc.0/packages/core/src/router/RouteFactory.js#L48" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create new instance of ima.core.router.AbstractRoute.

**Kind**: instance method of [<code>RouteFactory</code>](#RouteFactory)  
**Returns**: <code>AbstractRoute</code> - The constructed route.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The unique name of this route, identifying it among        the rest of the routes in the application. |
| pathExpression | <code>string</code> \| <code>Route~PathExpression</code> | A path expression        specifying either the URL path part matching this route (must not\        contain a query string) with optionally containing named parameter        placeholders specified as <code>:parameterName</code>. Or object defining        matcher in form of regular expression and toPath and extractParameters        function overrides. |
| controller | <code>string</code> | The full name of Object Container alias        identifying the controller associated with this route. |
| view | <code>string</code> | The full name or Object Container alias identifying        the view class associated with this route. |
| options | <code>Object</code> | The route additional options. |


* * *

