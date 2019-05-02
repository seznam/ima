---
category: "http"
title: "HttpAgentImpl"
---

## HttpAgentImpl&nbsp;<a name="HttpAgentImpl" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Implementation of the <code>HttpAgent</code> interface with internal caching
of completed and ongoing HTTP requests and cookie storage.

**Kind**: global class  

* [HttpAgentImpl](#HttpAgentImpl)
    * [new HttpAgentImpl(proxy, cache, cookie, config)](#new_HttpAgentImpl_new)
    * [._proxy](#HttpAgentImpl+_proxy) : <code>HttpProxy</code>
    * [._cache](#HttpAgentImpl+_cache) : <code>Cache</code>
    * [._cookie](#HttpAgentImpl+_cookie) : <code>CookieStorage</code>
    * [._cacheOptions](#HttpAgentImpl+_cacheOptions) : <code>Object.&lt;string, string&gt;</code>
    * [._defaultRequestOptions](#HttpAgentImpl+_defaultRequestOptions) : <code>Object</code>
    * [._internalCacheOfPromises](#HttpAgentImpl+_internalCacheOfPromises) : <code>Map.&lt;string, Promise.&lt;{status: number, body: \*, params: {method: string, url: string, transformedUrl: string, data: Object.&lt;string, (boolean\|number\|string)&gt;}, headers: Object.&lt;string, string&gt;, cached: boolean}&gt;&gt;</code>
    * [.get()](#HttpAgentImpl+get)
    * [.post()](#HttpAgentImpl+post)
    * [.put()](#HttpAgentImpl+put)
    * [.patch()](#HttpAgentImpl+patch)
    * [.delete()](#HttpAgentImpl+delete)
    * [.getCacheKey()](#HttpAgentImpl+getCacheKey)
    * [.setDefaultHeader()](#HttpAgentImpl+setDefaultHeader)
    * [.clearDefaultHeaders()](#HttpAgentImpl+clearDefaultHeaders)
    * [._requestWithCheckCache(method, url, data, [options])](#HttpAgentImpl+_requestWithCheckCache) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>
    * [._getCachedData(method, url, data)](#HttpAgentImpl+_getCachedData) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>
    * [._request(method, url, data, [options])](#HttpAgentImpl+_request) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>
    * [._proxyResolved(response)](#HttpAgentImpl+_proxyResolved) ⇒ <code>HttpAgent~Response</code>
    * [._proxyRejected(error)](#HttpAgentImpl+_proxyRejected) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>
    * [._prepareOptions(options)](#HttpAgentImpl+_prepareOptions) ⇒ <code>HttpAgent~RequestOptions</code>
    * [._getCacheKeySuffix(method, url, data)](#HttpAgentImpl+_getCacheKeySuffix) ⇒ <code>string</code>
    * [._setCookiesFromResponse(agentResponse)](#HttpAgentImpl+_setCookiesFromResponse)
    * [._saveAgentResponseToCache(agentResponse)](#HttpAgentImpl+_saveAgentResponseToCache)


* * *

### new HttpAgentImpl(proxy, cache, cookie, config)&nbsp;<a name="new_HttpAgentImpl_new"></a>
Initializes the HTTP handler.


| Param | Type | Description |
| --- | --- | --- |
| proxy | <code>HttpProxy</code> | The low-level HTTP proxy for sending the HTTP        requests. |
| cache | <code>Cache</code> | Cache to use for caching ongoing and completed        requests. |
| cookie | <code>CookieStorage</code> | The cookie storage to use internally. |
| config | <code>Object.&lt;string, \*&gt;</code> | Configuration of the HTTP handler for        the current application environment, specifying the various        default request option values and cache option values. |


* * *

### httpAgentImpl.\_proxy : <code>HttpProxy</code>&nbsp;<a name="HttpAgentImpl+_proxy" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
HTTP proxy, used to execute the HTTP requests.

**Kind**: instance property of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.\_cache : <code>Cache</code>&nbsp;<a name="HttpAgentImpl+_cache" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L57" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Internal request cache, used to cache completed request results.

**Kind**: instance property of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.\_cookie : <code>CookieStorage</code>&nbsp;<a name="HttpAgentImpl+_cookie" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L65" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Cookie storage, used to keep track of cookies received from the
server and send them with the subsequent requests to the server.

**Kind**: instance property of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.\_cacheOptions : <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="HttpAgentImpl+_cacheOptions" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Cache options.

**Kind**: instance property of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.\_defaultRequestOptions : <code>Object</code>&nbsp;<a name="HttpAgentImpl+_defaultRequestOptions" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L88" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Default request options.

**Kind**: instance property of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.\_internalCacheOfPromises : <code>Map.&lt;string, Promise.&lt;{status: number, body: \*, params: {method: string, url: string, transformedUrl: string, data: Object.&lt;string, (boolean\|number\|string)&gt;}, headers: Object.&lt;string, string&gt;, cached: boolean}&gt;&gt;</code>&nbsp;<a name="HttpAgentImpl+_internalCacheOfPromises" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L106" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Internal request cache, used to cache ongoing requests.

**Kind**: instance property of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.get()&nbsp;<a name="HttpAgentImpl+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.post()&nbsp;<a name="HttpAgentImpl+post" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L119" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.put()&nbsp;<a name="HttpAgentImpl+put" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L131" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.patch()&nbsp;<a name="HttpAgentImpl+patch" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L143" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.delete()&nbsp;<a name="HttpAgentImpl+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L155" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.getCacheKey()&nbsp;<a name="HttpAgentImpl+getCacheKey" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L167" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.setDefaultHeader()&nbsp;<a name="HttpAgentImpl+setDefaultHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L176" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.clearDefaultHeaders()&nbsp;<a name="HttpAgentImpl+clearDefaultHeaders" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L185" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

* * *

### httpAgentImpl.\_requestWithCheckCache(method, url, data, [options]) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>&nbsp;<a name="HttpAgentImpl+_requestWithCheckCache" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L202" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Check cache and if data isnt available then make real request.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>Promise.&lt;HttpAgent~Response&gt;</code> - A promise that resolves to the response
        with body parsed as JSON.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method to use. |
| url | <code>string</code> | The URL to which the request should be sent. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data to        send with the request. |
| [options] | <code>HttpAgent~RequestOptions</code> | Optional request options. |


* * *

### httpAgentImpl.\_getCachedData(method, url, data) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>&nbsp;<a name="HttpAgentImpl+_getCachedData" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L232" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether an ongoing or completed HTTP request for the specified URL
and data is present in the internal cache and, if it is, the method
returns a promise that resolves to the response body parsed as JSON.

The method returns <code>null</code> if no such request is present in the
cache.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>Promise.&lt;HttpAgent~Response&gt;</code> - A promise that will resolve to the
        server response with the body parsed as JSON, or <code>null</code> if
        no such request is present in the cache.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method used by the request. |
| url | <code>string</code> | The URL to which the request was made. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data sent        to the server with the request. |


* * *

### httpAgentImpl.\_request(method, url, data, [options]) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>&nbsp;<a name="HttpAgentImpl+_request" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L262" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sends a new HTTP request using the specified method to the specified
url. The request will carry the provided data as query parameters if the
HTTP method is GET, but the data will be sent as request body for any
other request method.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>Promise.&lt;HttpAgent~Response&gt;</code> - A promise that resolves to the response
        with the body parsed as JSON.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | HTTP method to use. |
| url | <code>string</code> | The URL to which the request is sent. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data sent        with the request. |
| [options] | <code>HttpAgent~RequestOptions</code> | Optional request options. |


* * *

### httpAgentImpl.\_proxyResolved(response) ⇒ <code>HttpAgent~Response</code>&nbsp;<a name="HttpAgentImpl+_proxyResolved" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L286" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles successful completion of an HTTP request by the HTTP proxy.

The method also updates the internal cookie storage with the cookies
received from the server.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>HttpAgent~Response</code> - The post-processed server response.  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>HttpAgent~Response</code> | Server response. |


* * *

### httpAgentImpl.\_proxyRejected(error) ⇒ <code>Promise.&lt;HttpAgent~Response&gt;</code>&nbsp;<a name="HttpAgentImpl+_proxyRejected" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L336" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles rejection of the HTTP request by the HTTP proxy. The method
tests whether there are any remaining tries for the request, and if
there are any, it attempts re-send the request.

The method rejects the internal request promise if there are no tries
left.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>Promise.&lt;HttpAgent~Response&gt;</code> - A promise that will either resolve to a
        server's response (with the body parsed as JSON) if there are
        any tries left and the re-tried request succeeds, or rejects
        with an error containing details of the cause of the request's
        failure.  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>GenericError</code> | The error provided by the HttpProxy,        carrying the error parameters, such as the request url, data,        method, options and other useful data. |


* * *

### httpAgentImpl.\_prepareOptions(options) ⇒ <code>HttpAgent~RequestOptions</code>&nbsp;<a name="HttpAgentImpl+_prepareOptions" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L368" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Prepares the provided request options object by filling in missing
options with default values and addding extra options used internally.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>HttpAgent~RequestOptions</code> - Request options with set filled-in
        default values for missing fields, and extra options used
        internally.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>HttpAgent~RequestOptions</code> | Optional request options. |


* * *

### httpAgentImpl.\_getCacheKeySuffix(method, url, data) ⇒ <code>string</code>&nbsp;<a name="HttpAgentImpl+_getCacheKeySuffix" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L400" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates cache key suffix for an HTTP request to the specified URL with
the specified data.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  
**Returns**: <code>string</code> - The suffix of a cache key to use for a request to the
        specified URL, carrying the specified data.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method used by the request. |
| url | <code>string</code> | The URL to which the request is sent. |
| data | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The data sent        with the request. |


* * *

### httpAgentImpl.\_setCookiesFromResponse(agentResponse)&nbsp;<a name="HttpAgentImpl+_setCookiesFromResponse" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L418" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets all cookies from the <code>Set-Cookie</code> response header to the
cookie storage.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

| Param | Type | Description |
| --- | --- | --- |
| agentResponse | <code>HttpAgent~Response</code> | The response of the server. |


* * *

### httpAgentImpl.\_saveAgentResponseToCache(agentResponse)&nbsp;<a name="HttpAgentImpl+_saveAgentResponseToCache" href="https://github.com/seznam/IMA.js-core/tree/0.16.6/http/HttpAgentImpl.js#L439" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Saves the server response to the cache to be used as the result of the
next request of the same properties.

**Kind**: instance method of [<code>HttpAgentImpl</code>](#HttpAgentImpl)  

| Param | Type | Description |
| --- | --- | --- |
| agentResponse | <code>HttpAgent~Response</code> | The response of the server. |


* * *

