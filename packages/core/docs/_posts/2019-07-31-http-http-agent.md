---
category: "http"
title: "HttpAgent"
---

## HttpAgent&nbsp;<a name="HttpAgent" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [HttpAgent](#HttpAgent)
    * _instance_
        * [.get(url, data, [options])](#HttpAgent+get) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)
        * [.post(url, data, [options])](#HttpAgent+post) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)
        * [.put(url, data, [options])](#HttpAgent+put) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)
        * [.patch(url, data, [options])](#HttpAgent+patch) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)
        * [.delete(url, data, [options])](#HttpAgent+delete) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)
        * [.getCacheKey(method, url, data)](#HttpAgent+getCacheKey) ⇒ <code>string</code>
        * [.setDefaultHeader(header, value)](#HttpAgent+setDefaultHeader) ⇒ [<code>HttpAgent</code>](#HttpAgent)
        * [.clearDefaultHeaders()](#HttpAgent+clearDefaultHeaders) ⇒ [<code>HttpAgent</code>](#HttpAgent)
    * _inner_
        * [~RequestOptions](#HttpAgent..RequestOptions) : <code>Object</code>
        * [~Response](#HttpAgent..Response) : <code>Object</code>


* * *

### httpAgent.get(url, data, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)&nbsp;<a name="HttpAgent+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sends an HTTP GET request to the specified URL, sending the provided
data as query parameters.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response) - A promise that resolves to the
        response.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to which the request should be made. |
| data | <code>Object.&lt;string, (boolean\|number\|string)&gt;</code> | The data to send        to the server as query parameters. |
| [options] | [<code>RequestOptions</code>](#HttpAgent..RequestOptions) | Optional request options. |


* * *

### httpAgent.post(url, data, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)&nbsp;<a name="HttpAgent+post" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L67" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sends an HTTP POST request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response) - A promise that resolves to the
        response.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to which the request should be made. |
| data | <code>string</code> \| <code>Object.&lt;string, \*&gt;</code> | The data to send to the server        as the request body. |
| [options] | [<code>RequestOptions</code>](#HttpAgent..RequestOptions) | Optional request options. |


* * *

### httpAgent.put(url, data, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)&nbsp;<a name="HttpAgent+put" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L82" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sends an HTTP PUT request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response) - A promise that resolves to the
        response.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to which the request should be made. |
| data | <code>string</code> \| <code>Object.&lt;string, \*&gt;</code> | The data to send to the server        as the request body. |
| [options] | [<code>RequestOptions</code>](#HttpAgent..RequestOptions) | Optional request options. |


* * *

### httpAgent.patch(url, data, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)&nbsp;<a name="HttpAgent+patch" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L97" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sends an HTTP PATCH request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response) - A promise that resolves to the
        response.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to which the request should be made. |
| data | <code>string</code> \| <code>Object.&lt;string, \*&gt;</code> | The data to send to the server        as the request body. |
| [options] | [<code>RequestOptions</code>](#HttpAgent..RequestOptions) | Optional request options. |


* * *

### httpAgent.delete(url, data, [options]) ⇒ [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response)&nbsp;<a name="HttpAgent+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L112" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sends an HTTP DELETE request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>Promise.&lt;Response&gt;</code>](#HttpAgent..Response) - A promise that resolves to the
        response.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to which the request should be made. |
| data | <code>string</code> \| <code>Object.&lt;string, \*&gt;</code> | The data to send to the server        as the request body. |
| [options] | [<code>RequestOptions</code>](#HttpAgent..RequestOptions) | Optional request options. |


* * *

### httpAgent.getCacheKey(method, url, data) ⇒ <code>string</code>&nbsp;<a name="HttpAgent+getCacheKey" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates a cache key to use for identifying a request to the specified
URL using the specified HTTP method, submitting the provided data.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: <code>string</code> - The key to use for identifying such a request in the
        cache.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method used by the request. |
| url | <code>string</code> | The URL to which the request is sent. |
| data | <code>Object.&lt;string, string&gt;</code> | The data associated with the        request. These can be either the query parameters or request body        data. |


* * *

### httpAgent.setDefaultHeader(header, value) ⇒ [<code>HttpAgent</code>](#HttpAgent)&nbsp;<a name="HttpAgent+setDefaultHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L138" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the specified header to be sent with every subsequent HTTP request,
unless explicitly overridden by request options.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>HttpAgent</code>](#HttpAgent) - This HTTP agent.  

| Param | Type | Description |
| --- | --- | --- |
| header | <code>string</code> | The name of the header. |
| value | <code>string</code> | The header value. To provide multiple values,        separate them with commas        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2). |


* * *

### httpAgent.clearDefaultHeaders() ⇒ [<code>HttpAgent</code>](#HttpAgent)&nbsp;<a name="HttpAgent+clearDefaultHeaders" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L145" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears all configured default headers.

**Kind**: instance method of [<code>HttpAgent</code>](#HttpAgent)  
**Returns**: [<code>HttpAgent</code>](#HttpAgent) - This HTTP agent.  

* * *

### HttpAgent~RequestOptions : <code>Object</code>&nbsp;<a name="HttpAgent..RequestOptions" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L1" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Options for a request sent using the HTTP agent.

**Kind**: inner typedef of [<code>HttpAgent</code>](#HttpAgent)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [timeout] | <code>number</code> | Specifies the request timeout in milliseconds. |
| [ttl] | <code>number</code> | Specified how long the request may be cached in           milliseconds. |
| [repeatRequest] | <code>number</code> | Specifies the maximum number of tries to           repeat the request if the request fails. |
| [headers] | <code>Object.&lt;string, string&gt;</code> | Sets the additional request           headers (the keys are case-insensitive header names, the values           are header values). |
| [fetchOptions] | <code>Object.&lt;string, \*&gt;</code> | Sets the fetch request options. |
| [cache] | <code>boolean</code> | Flag that enables caching the HTTP request           (enabled by default, also applies to requests in progress). |
| [withCredentials] | <code>boolean</code> | Flag that indicates whether the           request should be made using credentials such as cookies or           authorization headers. |
| [listeners] | <code>Object</code> | Listeners for request events. |
| [postProcessor] | <code>function</code> | Response           post-processor applied just before the response is stored in the           cache and returned. |


* * *

### HttpAgent~Response : <code>Object</code>&nbsp;<a name="HttpAgent..Response" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/http/HttpAgent.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
A response from the server.

**Kind**: inner typedef of [<code>HttpAgent</code>](#HttpAgent)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | The HTTP response status code. |
| body | <code>\*</code> | The parsed response body, parsed as JSON. |
| params | <code>HttpProxy~RequestParams</code> | The original request params. |
| headers | <code>Object.&lt;string, string&gt;</code> | The response HTTP headers. |
| cached | <code>boolean</code> | Whether or not the response has been cached. |


* * *

