---
category: "error"
title: "GenericError"
---

## GenericError ⇐ <code>Error</code>&nbsp;<a name="GenericError" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/error/GenericError.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Implementation of the [Error](Error) interface, providing more advanced
error API.

**Kind**: global class  
**Extends**: <code>Error</code>  

* [GenericError](#GenericError) ⇐ <code>Error</code>
    * [new GenericError(message, [params], [dropInternalStackFrames])](#new_GenericError_new)
    * [._params](#GenericError+_params) : <code>Object.&lt;string, \*&gt;</code>
    * [.getHttpStatus()](#GenericError+getHttpStatus)
    * [.getParams()](#GenericError+getParams)


* * *

### new GenericError(message, [params], [dropInternalStackFrames])&nbsp;<a name="new_GenericError_new"></a>
Initializes the generic IMA error.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | The message describing the cause of the error. |
| [params] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> | A data map providing additional        details related to the error. It is recommended to set the        <code>status</code> field to the HTTP response code that should be sent        to the client. |
| [dropInternalStackFrames] | <code>boolean</code> | <code>true</code> | Whether or not the call stack        frames referring to the constructors of the custom errors should        be excluded from the stack of this error (just like the native        platform call stack frames are dropped by the JS engine).        This flag is enabled by default. |


* * *

### genericError.\_params : <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="GenericError+_params" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/error/GenericError.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The data providing additional details related to this error.

**Kind**: instance property of [<code>GenericError</code>](#GenericError)  

* * *

### genericError.getHttpStatus()&nbsp;<a name="GenericError+getHttpStatus" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/error/GenericError.js#L38" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>GenericError</code>](#GenericError)  

* * *

### genericError.getParams()&nbsp;<a name="GenericError+getParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/error/GenericError.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>GenericError</code>](#GenericError)  

* * *

