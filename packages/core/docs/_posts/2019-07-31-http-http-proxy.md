---
category: "http"
title: "HttpProxy"
---

## HttpProxy&nbsp;<a name="HttpProxy" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L49" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Middleware proxy between [HttpAgent](HttpAgent) implementations and the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
providing a Promise-oriented API for sending requests.

**Kind**: global class  

* [HttpProxy](#HttpProxy)
    * [new HttpProxy(transformer, window)](#new_HttpProxy_new)
    * _instance_
        * [._transformer](#HttpProxy+_transformer) : <code>UrlTransformer</code>
        * [._window](#HttpProxy+_window) : <code>Window</code>
        * [._defaultHeaders](#HttpProxy+_defaultHeaders) : <code>Map.&lt;string, string&gt;</code>
        * [.request(method, url, data, [options])](#HttpProxy+request) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>
        * [.setDefaultHeader(header, value)](#HttpProxy+setDefaultHeader)
        * [.clearDefaultHeaders()](#HttpProxy+clearDefaultHeaders)
        * [.getErrorParams(method, url, data, options, status, body, cause)](#HttpProxy+getErrorParams) ⇒ [<code>ErrorParams</code>](#HttpProxy..ErrorParams)
        * [.haveToSetCookiesManually()](#HttpProxy+haveToSetCookiesManually) ⇒ <code>boolean</code>
        * [._processResponse(requestParams, response, responseBody)](#HttpProxy+_processResponse) ⇒ <code>HttpAgent~Response</code>
        * [._headersToPlainObject(headers)](#HttpProxy+_headersToPlainObject) ⇒ <code>Object.&lt;string, string&gt;</code>
        * [._processError(fetchError, requestParams)](#HttpProxy+_processError) ⇒ <code>GenericError</code>
        * [._createError(cause, requestParams, status, responseBody)](#HttpProxy+_createError) ⇒ <code>GenericError</code>
        * [._getFetchApi()](#HttpProxy+_getFetchApi) ⇒ <code>function</code>
        * [._composeRequestParams(method, url, data, options)](#HttpProxy+_composeRequestParams) ⇒ [<code>RequestParams</code>](#HttpProxy..RequestParams)
        * [._composeRequestInit(method, data, options)](#HttpProxy+_composeRequestInit) ⇒ <code>RequestInit</code>
        * [._getContentType(method, data, options)](#HttpProxy+_getContentType) ⇒ <code>string</code>
        * [._composeRequestUrl(url, data)](#HttpProxy+_composeRequestUrl) ⇒ <code>string</code>
        * [._shouldRequestHaveBody(method, data)](#HttpProxy+_shouldRequestHaveBody) ⇒ <code>boolean</code>
    * _inner_
        * [~RequestParams](#HttpProxy..RequestParams) : <code>Object</code>
        * [~ErrorParams](#HttpProxy..ErrorParams) : <code>Object</code>


* * *

### new HttpProxy(transformer, window)&nbsp;<a name="new_HttpProxy_new"></a>
Initializes the HTTP proxy.


| Param | Type | Description |
| --- | --- | --- |
| transformer | <code>UrlTransformer</code> | A transformer of URLs to which        requests are made. |
| window | <code>Window</code> | Helper for manipulating the global object `window`        regardless of the client/server-side environment. |


* * *

### httpProxy.\_transformer : <code>UrlTransformer</code>&nbsp;<a name="HttpProxy+_transformer" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L55" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
A transformer of URLs to which requests are made.

**Kind**: instance property of [<code>HttpProxy</code>](#HttpProxy)  

* * *

### httpProxy.\_window : <code>Window</code>&nbsp;<a name="HttpProxy+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Helper for manipulating the global object `window` regardless of the
client/server-side environment.

**Kind**: instance property of [<code>HttpProxy</code>](#HttpProxy)  

* * *

### httpProxy.\_defaultHeaders : <code>Map.&lt;string, string&gt;</code>&nbsp;<a name="HttpProxy+_defaultHeaders" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L71" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The default HTTP headers to include with the HTTP requests, unless
overridden.

**Kind**: instance property of [<code>HttpProxy</code>](#HttpProxy)  

* * *

### httpProxy.request(method, url, data, [options]) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>&nbsp;<a name="HttpProxy+request" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Executes a HTTP request to the specified URL using the specified HTTP
method, carrying the provided data.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>Promise.&lt;HttpAgent~Response&gt;</code> - A promise that resolves to the server
        response.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method to use. |
| url | <code>string</code> | The URL to which the request should be made. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to        be send to the server. The data will be included as query        parameters if the request method is `GET` or `HEAD`, and as        a request body for any other request method. |
| [options] | <code>HttpAgent~RequestOptions</code> | Optional request options. |


* * *

### httpProxy.setDefaultHeader(header, value)&nbsp;<a name="HttpProxy+setDefaultHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L150" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the specified default HTTP header. The header will be sent with all
subsequent HTTP requests unless reconfigured using this method,
overridden by request options, or cleared by
[clearDefaultHeaders](#HttpProxy+clearDefaultHeaders) method.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  

| Param | Type | Description |
| --- | --- | --- |
| header | <code>string</code> | A header name. |
| value | <code>string</code> | A header value. |


* * *

### httpProxy.clearDefaultHeaders()&nbsp;<a name="HttpProxy+clearDefaultHeaders" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L157" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears all defaults headers sent with all requests.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  

* * *

### httpProxy.getErrorParams(method, url, data, options, status, body, cause) ⇒ [<code>ErrorParams</code>](#HttpProxy..ErrorParams)&nbsp;<a name="HttpProxy+getErrorParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L178" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Gets an object that describes a failed HTTP request, providing
information about both the failure reported by the server and how the
request has been sent to the server.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: [<code>ErrorParams</code>](#HttpProxy..ErrorParams) - An object containing both the details of
        the error and the request that lead to it.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method used to make the request. |
| url | <code>string</code> | The URL to which the request has been made. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data sent        with the request. |
| options | <code>HttpAgent~RequestOptions</code> | Optional request options. |
| status | <code>number</code> | The HTTP response status code send by the server. |
| body | <code>object</code> | The body of HTTP error response (detailed        information). |
| cause | <code>Error</code> | The low-level cause error. |


* * *

### httpProxy.haveToSetCookiesManually() ⇒ <code>boolean</code>&nbsp;<a name="HttpProxy+haveToSetCookiesManually" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L231" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns `true` if cookies have to be processed manually by setting
`Cookie` HTTP header on requests and parsing the `Set-Cookie` HTTP
response header.

The result of this method depends on the current application
environment, the client-side usually handles cookie processing
automatically, leading this method returning `false`.

At the client-side, the method tests whether the client has cookies
enabled (which results in cookies being automatically processed by the
browser), and returns `true` or `false` accordingly.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>boolean</code> - `true` if cookies are not processed automatically by
        the environment and have to be handled manually by parsing
        response headers and setting request headers, otherwise `false`.  

* * *

### httpProxy.\_processResponse(requestParams, response, responseBody) ⇒ <code>HttpAgent~Response</code>&nbsp;<a name="HttpProxy+_processResponse" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L246" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Processes the response received from the server.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>HttpAgent~Response</code> - The server's response along with all related
        metadata.  

| Param | Type | Description |
| --- | --- | --- |
| requestParams | [<code>RequestParams</code>](#HttpProxy..RequestParams) | The original request's        parameters. |
| response | <code>Response</code> | The Fetch API's `Response` object representing        the server's response. |
| responseBody | <code>\*</code> | The server's response body. |


* * *

### httpProxy.\_headersToPlainObject(headers) ⇒ <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="HttpProxy+_headersToPlainObject" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L270" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Converts the provided Fetch API's `Headers` object to a plain object.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>Object.&lt;string, string&gt;</code> - Converted headers.  

| Param | Type | Description |
| --- | --- | --- |
| headers | <code>Headers</code> | The headers to convert. |


* * *

### httpProxy.\_processError(fetchError, requestParams) ⇒ <code>GenericError</code>&nbsp;<a name="HttpProxy+_processError" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L326" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Processes the provided Fetch API or internal error and creates an error
to expose to the calling API.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>GenericError</code> - The error to provide to the calling API.  

| Param | Type | Description |
| --- | --- | --- |
| fetchError | <code>Error</code> | The internal error to process. |
| requestParams | [<code>RequestParams</code>](#HttpProxy..RequestParams) | An object representing the        complete request parameters used to create and send the HTTP        request. |


* * *

### httpProxy.\_createError(cause, requestParams, status, responseBody) ⇒ <code>GenericError</code>&nbsp;<a name="HttpProxy+_createError" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L348" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates an error that represents a failed HTTP request.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>GenericError</code> - The error representing a failed HTTP request.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| cause | <code>Error</code> |  | The error's message. |
| requestParams | [<code>RequestParams</code>](#HttpProxy..RequestParams) |  | An object representing the        complete request parameters used to create and send the HTTP        request. |
| status | <code>number</code> |  | Server's response HTTP status code. |
| responseBody | <code>\*</code> | <code></code> | The body of the server's response, if any. |


* * *

### httpProxy.\_getFetchApi() ⇒ <code>function</code>&nbsp;<a name="HttpProxy+_getFetchApi" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L371" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch)
compatible API to use, depending on the method being used at the server
(polyfill) or client (native/polyfill) side.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>function</code> - An
        implementation of the Fetch API to use.  

* * *

### httpProxy.\_composeRequestParams(method, url, data, options) ⇒ [<code>RequestParams</code>](#HttpProxy..RequestParams)&nbsp;<a name="HttpProxy+_composeRequestParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L392" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Composes an object representing the HTTP request parameters from the
provided arguments.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: [<code>RequestParams</code>](#HttpProxy..RequestParams) - An object
        representing the complete request parameters used to create and
        send the HTTP request.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method to use. |
| url | <code>string</code> | The URL to which the request should be sent. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to        send with the request. |
| options | <code>HttpAgent~RequestOptions</code> | Optional request options. |


* * *

### httpProxy.\_composeRequestInit(method, data, options) ⇒ <code>RequestInit</code>&nbsp;<a name="HttpProxy+_composeRequestInit" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L413" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Composes an init object, which can be used as a second argument of
`window.fetch` method.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>RequestInit</code> - A `RequestInit` object of the Fetch API.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method to use. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to        be send with a request. |
| options | <code>HttpAgent~RequestOptions</code> | Options provided by the HTTP        agent. |


* * *

### httpProxy.\_getContentType(method, data, options) ⇒ <code>string</code>&nbsp;<a name="HttpProxy+_getContentType" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L450" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Gets a `Content-Type` header value for defined method, data and options.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>string</code> - A `Content-Type` header value.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method to use. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to        be send with a request. |
| options | <code>HttpAgent~RequestOptions</code> | Options provided by the HTTP        agent. |


* * *

### httpProxy.\_composeRequestUrl(url, data) ⇒ <code>string</code>&nbsp;<a name="HttpProxy+_composeRequestUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L472" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Transforms the provided URL using the current URL transformer and adds
the provided data to the URL's query string.

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>string</code> - The transformed URL with the provided data attached to
        its query string.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to prepare for use with the fetch API. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to be        attached to the query string. |


* * *

### httpProxy.\_shouldRequestHaveBody(method, data) ⇒ <code>boolean</code>&nbsp;<a name="HttpProxy+_shouldRequestHaveBody" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L493" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Checks if a request should have a body (`GET` and `HEAD` requests don't
have a body).

**Kind**: instance method of [<code>HttpProxy</code>](#HttpProxy)  
**Returns**: <code>boolean</code> - `true` if a request has a body, otherwise `false`.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to        be send with a request. |


* * *

### HttpProxy~RequestParams : <code>Object</code>&nbsp;<a name="HttpProxy..RequestParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L4" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An object representing the complete request parameters used to create and
send the HTTP request.

**Kind**: inner typedef of [<code>HttpProxy</code>](#HttpProxy)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method. |
| url | <code>string</code> | The original URL to which to make the request. |
| transformedUrl | <code>string</code> | The actual URL to which to make the           request, created by applying the URL transformer to the           original URL. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The request           data, sent as query or body. |
| options | <code>HttpAgent~RequestOptions</code> | The high-level request options           provided by the HTTP agent. |


* * *

### HttpProxy~ErrorParams : <code>Object</code>&nbsp;<a name="HttpProxy..ErrorParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpProxy.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An object that describes a failed HTTP request, providing
information about both the failure reported by the server and how the
request has been sent to the server.

**Kind**: inner typedef of [<code>HttpProxy</code>](#HttpProxy)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| errorName | <code>string</code> | An error name. |
| status | <code>number</code> | The HTTP response status code send by the           server. |
| body | <code>object</code> | The body of HTTP error response (detailed           information). |
| cause | <code>Error</code> | The low-level cause error. |
| params | [<code>RequestParams</code>](#HttpProxy..RequestParams) | An object representing the           complete request parameters used to create and send the HTTP           request. |


* * *

