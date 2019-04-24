---
category: "error"
title: "ExtensibleError"
---

## *ExtensibleError ⇐ <code>Error</code>*&nbsp;<a name="ExtensibleError" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L17" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global abstract class  
**Extends**: <code>Error</code>  

* *[ExtensibleError](#ExtensibleError) ⇐ <code>Error</code>*
    * *[new ExtensibleError(message, [dropInternalStackFrames])](#new_ExtensibleError_new)*
    * *[.name](#ExtensibleError+name) : <code>string</code>*
    * *[.message](#ExtensibleError+message) : <code>string</code>*
    * *[._nativeError](#ExtensibleError+_nativeError) : <code>Error</code>*
    * *[._stack](#ExtensibleError+_stack) : <code>string</code>*
    * *[._dropInternalStackFrames](#ExtensibleError+_dropInternalStackFrames) : <code>boolean</code>*
    * *[.stack](#ExtensibleError+stack) : <code>string</code>*


* * *

### *new ExtensibleError(message, [dropInternalStackFrames])*&nbsp;<a name="new_ExtensibleError_new"></a>
Base class of custom error classes, extending the native `Error` class.

This class has been introduced to fix the Babel-related issues with
extending the native JavaScript (Error) classes.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | The message describing the cause of the error. |
| [dropInternalStackFrames] | <code>boolean</code> | <code>true</code> | Whether or not the call stack        frames referring to the constructors of the custom errors should be        excluded from the stack of this error (just like the native platform        call stack frames are dropped by the JS engine).        This flag is enabled by default. |


* * *

### *extensibleError.name : <code>string</code>*&nbsp;<a name="ExtensibleError+name" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L38" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The name of this error, used in the generated stack trace.

**Kind**: instance property of [<code>ExtensibleError</code>](#ExtensibleError)  

* * *

### *extensibleError.message : <code>string</code>*&nbsp;<a name="ExtensibleError+message" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The message describing the cause of the error.

**Kind**: instance property of [<code>ExtensibleError</code>](#ExtensibleError)  

* * *

### *extensibleError.\_nativeError : <code>Error</code>*&nbsp;<a name="ExtensibleError+_nativeError" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L54" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Native error instance we use to generate the call stack. For some reason
some browsers do not generate call stacks for instances of classes
extending the native `Error` class, so we bypass this shortcoming this way.

**Kind**: instance property of [<code>ExtensibleError</code>](#ExtensibleError)  

* * *

### *extensibleError.\_stack : <code>string</code>*&nbsp;<a name="ExtensibleError+_stack" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L70" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The internal cache of the generated stack. The cache is filled upon first
access to the [stack](#ExtensibleError+stack) property.

**Kind**: instance property of [<code>ExtensibleError</code>](#ExtensibleError)  

* * *

### *extensibleError.\_dropInternalStackFrames : <code>boolean</code>*&nbsp;<a name="ExtensibleError+_dropInternalStackFrames" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L80" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Whether or not the call stack frames referring to the constructors of
the custom errors should be excluded from the stack of this error (just
like the native platform call stack frames are dropped by the JS
engine).

**Kind**: instance property of [<code>ExtensibleError</code>](#ExtensibleError)  

* * *

### *extensibleError.stack : <code>string</code>*&nbsp;<a name="ExtensibleError+stack" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/error/ExtensibleError.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The call stack captured at the moment of creation of this error. The
formatting of the stack is browser-dependant.

**Kind**: instance property of [<code>ExtensibleError</code>](#ExtensibleError)  

* * *

