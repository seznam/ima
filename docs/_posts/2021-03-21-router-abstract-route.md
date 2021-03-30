---
category: "router"
title: "API - AbstractRoute"
menuTitle: "AbstractRoute"
---

## Classes

<dl>
<dt><a href="#AbstractRoute">AbstractRoute</a></dt>
<dd><p>Utility for representing and manipulating a single route in the router&#39;s
configuration.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#LOOSE_SLASHES_REGEXP">LOOSE_SLASHES_REGEXP</a> : <code>RegExp</code></dt>
<dd><p>Regular expression used to match and remove the starting and trailing
forward slashes from a path expression or a URL path.</p>
</dd>
</dl>

## AbstractRoute&nbsp;<a name="AbstractRoute" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for representing and manipulating a single route in the router's
configuration.

**Kind**: global class  

* [AbstractRoute](#AbstractRoute)
    * [new AbstractRoute(name, pathExpression, controller, view, options)](#new_AbstractRoute_new)
    * _instance_
        * [._name](#AbstractRoute+_name) : <code>string</code>
        * [._pathExpression](#AbstractRoute+_pathExpression) : <code>any</code>
        * [._controller](#AbstractRoute+_controller) : <code>string</code>
        * [._view](#AbstractRoute+_view) : <code>React.Component</code>
        * [._options](#AbstractRoute+_options) : <code>Object</code>
        * [.getName()](#AbstractRoute+getName) ⇒ <code>string</code>
        * [.getController()](#AbstractRoute+getController) ⇒ <code>string</code>
        * [.getView()](#AbstractRoute+getView) ⇒ <code>string</code>
        * [.getOptions()](#AbstractRoute+getOptions) ⇒ <code>Object</code>
        * [.getPathExpression()](#AbstractRoute+getPathExpression) ⇒ <code>any</code>
        * *[.toPath([params])](#AbstractRoute+toPath) ⇒ <code>string</code>*
        * *[.matches(path)](#AbstractRoute+matches) ⇒ <code>boolean</code>*
        * *[.extractParameters(path)](#AbstractRoute+extractParameters) ⇒ <code>Object.&lt;string, ?string&gt;</code>*
        * [._getQuery(path)](#AbstractRoute+_getQuery) ⇒ <code>Object.&lt;string, ?string&gt;</code>
        * [._decodeURIParameter(parameterValue)](#AbstractRoute+_decodeURIParameter) ⇒ <code>string</code>
        * [._getTrimmedPath(path)](#AbstractRoute+_getTrimmedPath) ⇒ <code>string</code>
    * _static_
        * [.pairsToQuery([pairs])](#AbstractRoute.pairsToQuery) ⇒ <code>string</code>
        * [.paramsToQuery(params)](#AbstractRoute.paramsToQuery)


* * *

### new AbstractRoute(name, pathExpression, controller, view, options)&nbsp;<a name="new_AbstractRoute_new"></a>
Initializes the route.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The unique name of this route, identifying it among        the rest of the routes in the application. |
| pathExpression | <code>any</code> | Path expression used in route matching, to generate        valid path with provided params and parsing params from current path. |
| controller | <code>string</code> | The full name of Object Container alias        identifying the controller associated with this route. |
| view | <code>string</code> | The full name or Object Container alias identifying        the view class associated with this route. |
| options | <code>Object</code> | The route additional options. |


* * *

### abstractRoute.\_name : <code>string</code>&nbsp;<a name="AbstractRoute+_name" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The unique name of this route, identifying it among the rest of the
routes in the application.

**Kind**: instance property of [<code>AbstractRoute</code>](#AbstractRoute)  

* * *

### abstractRoute.\_pathExpression : <code>any</code>&nbsp;<a name="AbstractRoute+_pathExpression" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L113" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Path expression used in route matching, to generate valid path with
provided params and parsing params from current path.

**Kind**: instance property of [<code>AbstractRoute</code>](#AbstractRoute)  

* * *

### abstractRoute.\_controller : <code>string</code>&nbsp;<a name="AbstractRoute+_controller" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L121" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The full name of Object Container alias identifying the controller
associated with this route.

**Kind**: instance property of [<code>AbstractRoute</code>](#AbstractRoute)  

* * *

### abstractRoute.\_view : <code>React.Component</code>&nbsp;<a name="AbstractRoute+_view" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L129" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The full name or Object Container alias identifying the view class
associated with this route.

**Kind**: instance property of [<code>AbstractRoute</code>](#AbstractRoute)  

* * *

### abstractRoute.\_options : <code>Object</code>&nbsp;<a name="AbstractRoute+_options" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L153" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The route additional options.

**Kind**: instance property of [<code>AbstractRoute</code>](#AbstractRoute)  

* * *

### abstractRoute.getName() ⇒ <code>string</code>&nbsp;<a name="AbstractRoute+getName" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L171" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the unique identifying name of this route.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - The name of the route, identifying it.  

* * *

### abstractRoute.getController() ⇒ <code>string</code>&nbsp;<a name="AbstractRoute+getController" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L182" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the full name of the controller to use when this route is
matched by the current URL, or an Object Container-registered alias of
the controller.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - The name of alias of the controller.  

* * *

### abstractRoute.getView() ⇒ <code>string</code>&nbsp;<a name="AbstractRoute+getView" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L193" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the full name of the view class or an Object
Container-registered alias for the view class, representing the view to
use when this route is matched by the current URL.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - The name or alias of the view class.  

* * *

### abstractRoute.getOptions() ⇒ <code>Object</code>&nbsp;<a name="AbstractRoute+getOptions" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L219" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return route additional options.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  

* * *

### abstractRoute.getPathExpression() ⇒ <code>any</code>&nbsp;<a name="AbstractRoute+getPathExpression" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L229" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Path expression used in route matching, to generate valid path with
provided params and parsing params from current path.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>any</code> - The path expression.  

* * *

### *abstractRoute.toPath([params]) ⇒ <code>string</code>*&nbsp;<a name="AbstractRoute+toPath" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L247" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates the URL and query parts of a URL by substituting the route's
parameter placeholders by the provided parameter value.

The extraneous parameters that do not match any of the route's
placeholders will be appended as the query string.

**Kind**: instance abstract method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - Path and, if necessary, query parts of the URL
        representing this route with its parameters replaced by the
        provided parameter values.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | <code>{}</code> | The route        parameter values. |


* * *

### *abstractRoute.matches(path) ⇒ <code>boolean</code>*&nbsp;<a name="AbstractRoute+matches" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L262" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the provided URL path matches this route. The provided
path may contain the query.

**Kind**: instance abstract method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>boolean</code> - <code>true</code> if the provided path matches this route.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path. |


* * *

### *abstractRoute.extractParameters(path) ⇒ <code>Object.&lt;string, ?string&gt;</code>*&nbsp;<a name="AbstractRoute+extractParameters" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L282" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extracts the parameter values from the provided path. The method
extracts both the in-path parameters and parses the query, allowing the
query parameters to override the in-path parameters.

The method returns an empty hash object if the path does not match this
route.

**Kind**: instance abstract method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>Object.&lt;string, ?string&gt;</code> - Map of parameter names to parameter
        values.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 


* * *

### abstractRoute.\_getQuery(path) ⇒ <code>Object.&lt;string, ?string&gt;</code>&nbsp;<a name="AbstractRoute+_getQuery" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L297" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extracts and decodes the query parameters from the provided URL path and
query.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>Object.&lt;string, ?string&gt;</code> - Parsed query parameters.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The URL path, including the optional query string        (if any). |


* * *

### abstractRoute.\_decodeURIParameter(parameterValue) ⇒ <code>string</code>&nbsp;<a name="AbstractRoute+_decodeURIParameter" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L339" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Decoding parameters.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - decodedValue  

| Param | Type |
| --- | --- |
| parameterValue | <code>string</code> | 


* * *

### abstractRoute.\_getTrimmedPath(path) ⇒ <code>string</code>&nbsp;<a name="AbstractRoute+_getTrimmedPath" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L357" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Trims the trailing forward slash from the provided URL path.

**Kind**: instance method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - Trimmed path.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to trim. |


* * *

### AbstractRoute.pairsToQuery([pairs]) ⇒ <code>string</code>&nbsp;<a name="AbstractRoute.pairsToQuery" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Converts array of pairs (tuples) into valid URI query component.
Filters out invalid inputs (undefined, null, object, array, non-pair).

**Kind**: static method of [<code>AbstractRoute</code>](#AbstractRoute)  
**Returns**: <code>string</code> - Valid URI query component or empty string if
        there are no valid pairs provided.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [pairs] | <code>Array</code> | <code>[]</code> | Array of arrays where the first element must be         string|number and the second element can be any |

**Example**  
```js
let pairs = [['a', true], ['hello world', 123]];
pairsToQuery(pairs); // => "?a=true&hello%20world=123"
```

* * *

### AbstractRoute.paramsToQuery(params)&nbsp;<a name="AbstractRoute.paramsToQuery" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L54" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Converts object of key/value pairs to URI query,
which can be appended to url.

**Kind**: static method of [<code>AbstractRoute</code>](#AbstractRoute)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object.&lt;string, any&gt;</code> | Key/value pairs. |


* * *

## LOOSE\_SLASHES\_REGEXP : <code>RegExp</code>&nbsp;<a name="LOOSE_SLASHES_REGEXP" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/router/AbstractRoute.js#L10" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Regular expression used to match and remove the starting and trailing
forward slashes from a path expression or a URL path.

**Kind**: global constant  

* * *

