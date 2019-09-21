---
category: "router"
title: "Router"
---

## Router&nbsp;<a name="Router" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L7" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Router](#Router)
    * [.init(config)](#Router+init)
    * [.add(name, pathExpression, controller, view, [options])](#Router+add) ⇒ [<code>Router</code>](#Router)
    * [.remove(name)](#Router+remove) ⇒ [<code>Router</code>](#Router)
    * [.getPath()](#Router+getPath) ⇒ <code>string</code>
    * [.getUrl()](#Router+getUrl) ⇒ <code>string</code>
    * [.getBaseUrl()](#Router+getBaseUrl) ⇒ <code>string</code>
    * [.getDomain()](#Router+getDomain) ⇒ <code>string</code>
    * [.getHost()](#Router+getHost) ⇒ <code>string</code>
    * [.getProtocol()](#Router+getProtocol) ⇒ <code>string</code>
    * [.getCurrentRouteInfo()](#Router+getCurrentRouteInfo) ⇒ <code>Object</code>
    * [.listen()](#Router+listen) ⇒ [<code>Router</code>](#Router)
    * [.redirect(url, [options], [action])](#Router+redirect)
    * [.link(routeName, params)](#Router+link) ⇒ <code>string</code>
    * [.route(path, [options], [action])](#Router+route) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [.handleError(params, [options])](#Router+handleError) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [.handleNotFound(params, [options])](#Router+handleNotFound) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>
    * [.isClientError(reason)](#Router+isClientError) ⇒ <code>boolean</code>
    * [.isRedirection(reason)](#Router+isRedirection) ⇒ <code>boolean</code>


* * *

### router.init(config)&nbsp;<a name="Router+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the router with the provided configuration.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Router configuration.        The <code>$Protocol</code> field must be the current protocol used to        access the application, terminated by a collon (for example        <code>https:</code>).        The <code>$Root</code> field must specify the URL path pointing to the        application's root.        The <code>$LanguagePartPath</code> field must be the URL path fragment        used as a suffix to the <code>$Root</code> field that specifies the        current language.        The <code>$Host</code> field must be the application's domain (and the        port number if other than the default is used) in the following        form: <code>`${protocol</code>//${host}`}. |


* * *

### router.add(name, pathExpression, controller, view, [options]) ⇒ [<code>Router</code>](#Router)&nbsp;<a name="Router+add" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Adds a new route to router.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - This router.  
**Throws**:

- <code>ImaError</code> Thrown if a route with the same name already exists.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The unique name of this route, identifying it among        the rest of the routes in the application. |
| pathExpression | <code>string</code> | A path expression specifying the URL path        part matching this route (must not contain a query string),        optionally containing named parameter placeholders specified as        <code>:parameterName</code>. The name of the parameter is terminated        by a forward slash (<code>/</code>) or the end of the path expression        string.        The path expression may also contain optional parameters, which        are specified as <code>:?parameterName</code>. It is recommended to        specify the optional parameters at the end of the path        expression. |
| controller | <code>string</code> | The full name of Object Container alias        identifying the controller associated with this route. |
| view | <code>string</code> | The full name or Object Container alias identifying        the view class associated with this route. |
| [options] | <code>Object</code> | Additional route options, specified how the navigation to the        route will be handled.        The <code>onlyUpdate</code> can be either a flag signalling whether        the current controller and view instances should be kept if they        match the ones used by the previous route; or a callback function        that will receive the previous controller and view identifiers        used in the previously matching route, and returns a        <code>boolean</code> representing the value of the flag. This flag is        disabled by default.        The <code>autoScroll</code> flag signals whether the page should be        scrolled to the top when the navigation takes place. This flag is        enabled by default.        The <code>allowSPA</code> flag can be used to make the route        always served from the server and never using the SPA page even        if the server is overloaded. This is useful for routes that use        different document views (specified by the <code>documentView</code>        option), for example for rendering the content of iframes. |


* * *

### router.remove(name) ⇒ [<code>Router</code>](#Router)&nbsp;<a name="Router+remove" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L97" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Removes the specified route from the router's known routes.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - This router.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The route's unique name, identifying the route to        remove. |


* * *

### router.getPath() ⇒ <code>string</code>&nbsp;<a name="Router+getPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current path part of the current URL, including the query
string (if any).

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - The path and query parts of the current URL.  

* * *

### router.getUrl() ⇒ <code>string</code>&nbsp;<a name="Router+getUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current absolute URL (including protocol, host, query, etc).

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - The current absolute URL.  

* * *

### router.getBaseUrl() ⇒ <code>string</code>&nbsp;<a name="Router+getBaseUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L120" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the application's absolute base URL, pointing to the public root
of the application.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - The application's base URL.  

* * *

### router.getDomain() ⇒ <code>string</code>&nbsp;<a name="Router+getDomain" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L128" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the application's domain in the following form
<code>`${protocol</code>//${host}`}.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - The current application's domain.  

* * *

### router.getHost() ⇒ <code>string</code>&nbsp;<a name="Router+getHost" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L135" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns application's host (domain and, if necessary, the port number).

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - The current application's host.  

* * *

### router.getProtocol() ⇒ <code>string</code>&nbsp;<a name="Router+getProtocol" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L144" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current protocol used to access the application, terminated
by a colon (for example <code>https:</code>).

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - The current application protocol used to access the
        application.  

* * *

### router.getCurrentRouteInfo() ⇒ <code>Object</code>&nbsp;<a name="Router+getCurrentRouteInfo" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L156" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the information about the currently active route.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>Object</code> - The information about the current route.  
**Throws**:

- <code>ImaError</code> Thrown if a route is not define for current path.


* * *

### router.listen() ⇒ [<code>Router</code>](#Router)&nbsp;<a name="Router+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L175" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers event listeners at the client side window object allowing the
router to capture user's history (history pop state - going "back") and
page (clicking links) navigation.

The router will start processing the navigation internally, handling the
user's navigation to display the page related to the URL resulting from
the user's action.

Note that the router will not prevent forms from being submitted to the
server.

The effects of this method cannot be reverted. This method has no effect
at the server side.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: [<code>Router</code>](#Router) - This router.  

* * *

### router.redirect(url, [options], [action])&nbsp;<a name="Router+redirect" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L216" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Redirects the client to the specified location.

At the server side the method results in responding to the client with a
redirect HTTP status code and the <code>Location</code> header.

At the client side the method updates the current URL by manipulating
the browser history (if the target URL is at the same domain and
protocol as the current one) or performs a hard redirect (if the target
URL points to a different protocol or domain).

The method will result in the router handling the new URL and routing
the client to the related page if the URL is set at the client side and
points to the same domain and protocol.

**Kind**: instance method of [<code>Router</code>](#Router)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | The URL to which the client should be redirected. |
| [options] | <code>Object</code> | <code>{}</code> | The options overrides route options defined in        the <code>routes.js</code> configuration file. |
| [action] | <code>Object</code> |  | An action object        describing what triggered this routing. |


* * *

### router.link(routeName, params) ⇒ <code>string</code>&nbsp;<a name="Router+link" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L230" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates an absolute URL (including protocol, domain, etc) for the
specified route by substituting the route's parameter placeholders with
the provided parameter values.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>string</code> - An absolute URL for the specified route and parameters.  

| Param | Type | Description |
| --- | --- | --- |
| routeName | <code>string</code> | The unique name of the route, identifying the        route to use. |
| params | <code>Object.&lt;string, string&gt;</code> | Parameter values for the route's        parameter placeholders. Extraneous parameters will be added as        URL query. |


* * *

### router.route(path, [options], [action]) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="Router+route" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L263" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Routes the application to the route matching the providing path, renders
the route page and sends the result to the client.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code> - A promise resolved
        when the error has been handled and the response has been sent
        to the client, or displayed if used at the client side.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | The URL path part received from the client, with        optional query. |
| [options] | <code>Object</code> | <code>{}</code> | The options overrides route options defined in        the <code>routes.js</code> configuration file. |
| [action] | <code>Object</code> |  | An action object        describing what triggered this routing. |


* * *

### router.handleError(params, [options]) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="Router+handleError" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L294" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles an internal server error by responding with the appropriate
"internal server error" error page.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code> - A promise resolved when the error
        has been handled and the response has been sent to the client,
        or displayed if used at the client side.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object.&lt;string, (Error\|string)&gt;</code> |  | Parameters extracted from        the current URL path and query. |
| [options] | <code>Object</code> | <code>{}</code> | The options overrides route options defined in        the <code>routes.js</code> configuration file. |


* * *

### router.handleNotFound(params, [options]) ⇒ <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code>&nbsp;<a name="Router+handleNotFound" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L325" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles a "not found" error by responding with the appropriate "not
found" error page.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>Promise.&lt;Object.&lt;string, \*&gt;&gt;</code> - A promise resolved
        when the error has been handled and the response has been sent
        to the client, or displayed if used at the client side.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| params | <code>Object.&lt;string, (Error\|string)&gt;</code> |  | Parameters extracted from        the current URL path and query. |
| [options] | <code>Object</code> | <code>{}</code> | The options overrides route options defined in        the <code>routes.js</code> configuration file. |


* * *

### router.isClientError(reason) ⇒ <code>boolean</code>&nbsp;<a name="Router+isClientError" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L336" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests, if possible, whether the specified error was caused by the
client's action (for example wrong URL or request encoding) or by a
failure at the server side.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>boolean</code> - <code>true</code> if the error was caused the action of the
        client.  

| Param | Type | Description |
| --- | --- | --- |
| reason | <code>ImaError</code> \| <code>Error</code> | The encountered error. |


* * *

### router.isRedirection(reason) ⇒ <code>boolean</code>&nbsp;<a name="Router+isRedirection" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/router/Router.js#L345" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests, if possible, whether the specified error lead to redirection.

**Kind**: instance method of [<code>Router</code>](#Router)  
**Returns**: <code>boolean</code> - <code>true</code> if the error was caused the action of the
        redirection.  

| Param | Type | Description |
| --- | --- | --- |
| reason | <code>ImaError</code> \| <code>Error</code> | The encountered error. |


* * *

