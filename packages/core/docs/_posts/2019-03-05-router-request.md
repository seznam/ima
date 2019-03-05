---
category: "router"
title: "Request"
---

## Request&nbsp;<a name="Request" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Wrapper for the ExpressJS request, exposing only the necessary minimum.

**Kind**: global class  

* [Request](#Request)
    * [new Request()](#new_Request_new)
    * [._request](#Request+_request) : <code>Express.Request</code>
    * [.init(request)](#Request+init)
    * [.getPath()](#Request+getPath) ⇒ <code>string</code>
    * [.getCookieHeader()](#Request+getCookieHeader) ⇒ <code>string</code>
    * [.getFile()](#Request+getFile) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.getFiles()](#Request+getFiles) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.getBody()](#Request+getBody) ⇒ <code>string</code>
    * [.getHeader(header)](#Request+getHeader) ⇒ <code>string</code>
    * [.getIP()](#Request+getIP) ⇒ <code>string</code>
    * [.getIPs()](#Request+getIPs) ⇒ <code>Array.&lt;string&gt;</code>


* * *

### new Request()&nbsp;<a name="new_Request_new"></a>
Initializes the request.


* * *

### request.\_request : <code>Express.Request</code>&nbsp;<a name="Request+_request" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L21" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current ExpressJS request object, or <code>null</code> if running at
the client side.

**Kind**: instance property of [<code>Request</code>](#Request)  

* * *

### request.init(request)&nbsp;<a name="Request+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L31" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the request using the provided ExpressJS request object.

**Kind**: instance method of [<code>Request</code>](#Request)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Express.Request</code> | The ExpressJS request object        representing the current request. Use <code>null</code> at the client        side. |


* * *

### request.getPath() ⇒ <code>string</code>&nbsp;<a name="Request+getPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the path part of the URL to which the request was made.

**Kind**: instance method of [<code>Request</code>](#Request)  
**Returns**: <code>string</code> - The path to which the request was made.  

* * *

### request.getCookieHeader() ⇒ <code>string</code>&nbsp;<a name="Request+getCookieHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L49" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the <code>Cookie</code> HTTP header value.

**Kind**: instance method of [<code>Request</code>](#Request)  
**Returns**: <code>string</code> - The value of the <code>Cookie</code> header.  

* * *

### request.getFile() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Request+getFile" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L58" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns uploaded file to server and meta information.

**Kind**: instance method of [<code>Request</code>](#Request)  

* * *

### request.getFiles() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Request+getFiles" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L67" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns upaloaded files to server with their meta information.

**Kind**: instance method of [<code>Request</code>](#Request)  

* * *

### request.getBody() ⇒ <code>string</code>&nbsp;<a name="Request+getBody" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L76" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns body of request.

**Kind**: instance method of [<code>Request</code>](#Request)  

* * *

### request.getHeader(header) ⇒ <code>string</code>&nbsp;<a name="Request+getHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the specified HTTP request header.

**Kind**: instance method of [<code>Request</code>](#Request)  

| Param | Type |
| --- | --- |
| header | <code>string</code> | 


* * *

### request.getIP() ⇒ <code>string</code>&nbsp;<a name="Request+getIP" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L95" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the remote IP address of the request.

**Kind**: instance method of [<code>Request</code>](#Request)  

* * *

### request.getIPs() ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="Request+getIPs" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/router/Request.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns array of IP addresses specified in the “X-Forwarded-For”
request header.

**Kind**: instance method of [<code>Request</code>](#Request)  

* * *

