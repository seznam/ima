---
category: "error"
title: "Error"
---

## Error ⇐ <code>ExtensibleError</code>&nbsp;<a name="Error" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/error/Error.js#L15" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  
**Extends**: <code>ExtensibleError</code>  

* [Error](#Error) ⇐ <code>ExtensibleError</code>
    * [.getHttpStatus()](#Error+getHttpStatus) ⇒ <code>number</code>
    * [.getParams()](#Error+getParams) ⇒ <code>Object.&lt;string, \*&gt;</code>


* * *

### error.getHttpStatus() ⇒ <code>number</code>&nbsp;<a name="Error+getHttpStatus" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/error/Error.js#L28" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the HTTP status to send to the client.

If the error has occurred at the client-side, the status code is used to
determine the error page to show to the user.

This method is a shorthand for the following code snippet:
`this.getParams().status || 500`.

**Kind**: instance method of [<code>Error</code>](#Error)  
**Returns**: <code>number</code> - The HTTP status to send to the client.  
**See**: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html  

* * *

### error.getParams() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Error+getParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/error/Error.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the error parameters providing additional details about the
error. The structure of the returned object is always
situation-dependent, but the returned object usually contains the
`status: number` field which represents the HTTP status to send to
the client.

**Kind**: instance method of [<code>Error</code>](#Error)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The route parameters of the route at which
        the error has occurred.  
**See**: Error#getHttpStatus  

* * *

