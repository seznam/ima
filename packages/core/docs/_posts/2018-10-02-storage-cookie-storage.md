---
category: "storage"
title: "CookieStorage"
---

## Classes

<dl>
<dt><a href="#CookieStorage">CookieStorage</a></dt>
<dd><p>Storage of cookies, mirroring the cookies to the current request / response
at the server side and the <code>document.cookie</code> property at the client
side. The storage caches the cookies internally.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#MAX_EXPIRE_DATE">MAX_EXPIRE_DATE</a> : <code>Date</code></dt>
<dd><p>Implementation note: This is the largest possible safe value that has been
tested, used to represent &quot;infinity&quot;.</p>
</dd>
<dt><a href="#COOKIE_SEPARATOR">COOKIE_SEPARATOR</a> : <code>string</code></dt>
<dd><p>Separator used to separate cookie declarations in the <code>Cookie</code> HTTP
header or the return value of the <code>document.cookie</code> property.</p>
</dd>
</dl>

## CookieStorage&nbsp;<a name="CookieStorage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Storage of cookies, mirroring the cookies to the current request / response
at the server side and the <code>document.cookie</code> property at the client
side. The storage caches the cookies internally.

**Kind**: global class  

* [CookieStorage](#CookieStorage)
    * [new CookieStorage(window, request, response)](#new_CookieStorage_new)
    * [._window](#CookieStorage+_window) : <code>Window</code>
    * [._request](#CookieStorage+_request) : <code>Request</code>
    * [._response](#CookieStorage+_response) : <code>Response</code>
    * [._options](#CookieStorage+_options) : <code>Object</code>
    * [._transformFunction](#CookieStorage+_transformFunction) : <code>Object</code>
    * [.init(options, transformFunction)](#CookieStorage+init)
    * [.has()](#CookieStorage+has)
    * [.get()](#CookieStorage+get)
    * [.set(name, value, [options])](#CookieStorage+set)
    * [.delete(name, [options])](#CookieStorage+delete) ⇒ <code>Storage</code>
    * [.clear()](#CookieStorage+clear)
    * [.keys()](#CookieStorage+keys)
    * [.size()](#CookieStorage+size)
    * [.getCookiesStringForCookieHeader()](#CookieStorage+getCookiesStringForCookieHeader) ⇒ <code>string</code>
    * [.parseFromSetCookieHeader(setCookieHeader)](#CookieStorage+parseFromSetCookieHeader)
    * [._parse()](#CookieStorage+_parse)
    * [._firstLetterToLowerCase(word)](#CookieStorage+_firstLetterToLowerCase) ⇒ <code>string</code>
    * [._generateCookieString(name, value, options)](#CookieStorage+_generateCookieString) ⇒ <code>string</code>
    * [._getExpirationAsDate(expiration)](#CookieStorage+_getExpirationAsDate) ⇒ <code>Date</code>
    * [._extractCookie(cookieString)](#CookieStorage+_extractCookie) ⇒ <code>Object</code>
    * [._extractNameAndValue(pair, pairIndex)](#CookieStorage+_extractNameAndValue) ⇒ <code>Array.&lt;?(boolean\|string\|Date)&gt;</code>
    * [._sanitizeCookieValue(value)](#CookieStorage+_sanitizeCookieValue) ⇒ <code>string</code>
    * [._recomputeCookieMaxAgeAndExpires(options)](#CookieStorage+_recomputeCookieMaxAgeAndExpires)


* * *

### new CookieStorage(window, request, response)&nbsp;<a name="new_CookieStorage_new"></a>
Initializes the cookie storage.


| Param | Type | Description |
| --- | --- | --- |
| window | <code>Window</code> | The window utility. |
| request | <code>Request</code> | The current HTTP request. |
| response | <code>Response</code> | The current HTTP response. |


* * *

### cookieStorage._window : <code>Window</code>&nbsp;<a name="CookieStorage+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The window utility used to determine whether the IMA is being run
at the client or at the server.

**Kind**: instance property of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage._request : <code>Request</code>&nbsp;<a name="CookieStorage+_request" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current HTTP request. This field is used at the server side.

**Kind**: instance property of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage._response : <code>Response</code>&nbsp;<a name="CookieStorage+_response" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L70" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current HTTP response. This field is used at the server side.

**Kind**: instance property of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage._options : <code>Object</code>&nbsp;<a name="CookieStorage+_options" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L84" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The overriding cookie attribute values.

**Kind**: instance property of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage._transformFunction : <code>Object</code>&nbsp;<a name="CookieStorage+_transformFunction" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L101" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Transform encode and decode functions for cookie value.

**Kind**: instance property of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage.init(options, transformFunction)&nbsp;<a name="CookieStorage+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L122" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| transformFunction | <code>Object</code> | 


* * *

### cookieStorage.has()&nbsp;<a name="CookieStorage+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L136" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage.get()&nbsp;<a name="CookieStorage+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L143" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage.set(name, value, [options])&nbsp;<a name="CookieStorage+set" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L170" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The key identifying the storage entry. |
| value | <code>\*</code> | The storage entry value. |
| [options] | <code>Object</code> | The cookie options. The <code>maxAge</code> is the maximum        age in seconds of the cookie before it will be deleted, the        <code>expires</code> is an alternative to that, specifying the moment        at which the cookie will be discarded. The <code>domain</code> and        <code>path</code> specify the cookie's domain and path. The        <code>httpOnly</code> and <code>secure</code> flags set the flags of the        same name of the cookie. |


* * *

### cookieStorage.delete(name, [options]) ⇒ <code>Storage</code>&nbsp;<a name="CookieStorage+delete" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L208" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deletes the cookie identified by the specified name.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  
**Returns**: <code>Storage</code> - This storage.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name identifying the cookie. |
| [options] | <code>Object</code> | The cookie options. The <code>domain</code> and        <code>path</code> specify the cookie's domain and path. The        <code>httpOnly</code> and <code>secure</code> flags set the flags of the        same name of the cookie. |


* * *

### cookieStorage.clear()&nbsp;<a name="CookieStorage+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L220" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage.keys()&nbsp;<a name="CookieStorage+keys" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L231" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage.size()&nbsp;<a name="CookieStorage+size" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L238" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage.getCookiesStringForCookieHeader() ⇒ <code>string</code>&nbsp;<a name="CookieStorage+getCookiesStringForCookieHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L249" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns all cookies in this storage serialized to a string compatible
with the <code>Cookie</code> HTTP header.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  
**Returns**: <code>string</code> - All cookies in this storage serialized to a string
        compatible with the <code>Cookie</code> HTTP header.  

* * *

### cookieStorage.parseFromSetCookieHeader(setCookieHeader)&nbsp;<a name="CookieStorage+parseFromSetCookieHeader" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L273" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Parses cookies from the provided <code>Set-Cookie</code> HTTP header value.

The parsed cookies will be set to the internal storage, and the current
HTTP response (via the <code>Set-Cookie</code> HTTP header) if at the server
side, or the browser (via the <code>document.cookie</code> property).

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

| Param | Type | Description |
| --- | --- | --- |
| setCookieHeader | <code>string</code> | The value of the <code>Set-Cookie</code> HTTP        header. |


* * *

### cookieStorage._parse()&nbsp;<a name="CookieStorage+_parse" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L289" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Parses cookies from a cookie string and sets the parsed cookies to the
internal storage.

The method obtains the cookie string from the request's <code>Cookie</code>
HTTP header when used at the server side, and the <code>document.cookie</code>
property at the client side.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

* * *

### cookieStorage._firstLetterToLowerCase(word) ⇒ <code>string</code>&nbsp;<a name="CookieStorage+_firstLetterToLowerCase" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L320" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates a copy of the provided word (or text) that has its first
character converted to lower case.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  
**Returns**: <code>string</code> - A copy of the provided string with its first character
        converted to lower case.  

| Param | Type | Description |
| --- | --- | --- |
| word | <code>string</code> | The word (or any text) that should have its first        character converted to lower case. |


* * *

### cookieStorage._generateCookieString(name, value, options) ⇒ <code>string</code>&nbsp;<a name="CookieStorage+_generateCookieString" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L349" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates a string representing the specified cookied, usable either
with the <code>document.cookie</code> property or the <code>Set-Cookie</code> HTTP
header.

(Note that the <code>Cookie</code> HTTP header uses a slightly different
syntax.)

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  
**Returns**: <code>string</code> - A string representing the cookie. Setting this string
        to the <code>document.cookie</code> property will set the cookie to
        the browser's cookie storage.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The cookie name. |
| value | <code>boolean</code> \| <code>number</code> \| <code>string</code> | The cookie value, will be        converted to string. |
| options | <code>Object</code> | Cookie attributes. Only the attributes listed in the        type annotation of this field are supported. For documentation        and full list of cookie attributes see        http://tools.ietf.org/html/rfc2965#page-5 |


* * *

### cookieStorage._getExpirationAsDate(expiration) ⇒ <code>Date</code>&nbsp;<a name="CookieStorage+_getExpirationAsDate" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L372" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Converts the provided cookie expiration to a <code>Date</code> instance.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  
**Returns**: <code>Date</code> - Cookie expiration as a <code>Date</code> instance.  

| Param | Type | Description |
| --- | --- | --- |
| expiration | <code>number</code> \| <code>string</code> \| <code>Date</code> | Cookie expiration in seconds        from now, or as a string compatible with the <code>Date</code>        constructor. |


* * *

### cookieStorage._extractCookie(cookieString) ⇒ <code>Object</code>&nbsp;<a name="CookieStorage+_extractCookie" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L397" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extract cookie name, value and options from cookie string.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

| Param | Type | Description |
| --- | --- | --- |
| cookieString | <code>string</code> | The value of the <code>Set-Cookie</code> HTTP        header. |


* * *

### cookieStorage._extractNameAndValue(pair, pairIndex) ⇒ <code>Array.&lt;?(boolean\|string\|Date)&gt;</code>&nbsp;<a name="CookieStorage+_extractNameAndValue" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L429" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Extract name and value for defined pair and pair index.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

| Param | Type |
| --- | --- |
| pair | <code>string</code> | 
| pairIndex | <code>number</code> | 


* * *

### cookieStorage._sanitizeCookieValue(value) ⇒ <code>string</code>&nbsp;<a name="CookieStorage+_sanitizeCookieValue" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L478" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sanitize cookie value by rules in
(@see http://tools.ietf.org/html/rfc6265#section-4r.1.1). Erase all
invalid characters from cookie value.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  
**Returns**: <code>string</code> - Sanitized value  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Cookie value |


* * *

### cookieStorage._recomputeCookieMaxAgeAndExpires(options)&nbsp;<a name="CookieStorage+_recomputeCookieMaxAgeAndExpires" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L522" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Recomputes cookie's attributes maxAge and expires between each other.

**Kind**: instance method of [<code>CookieStorage</code>](#CookieStorage)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Cookie attributes. Only the attributes listed in the        type annotation of this field are supported. For documentation        and full list of cookie attributes see        http://tools.ietf.org/html/rfc2965#page-5 |


* * *

## MAX_EXPIRE_DATE : <code>Date</code>&nbsp;<a name="MAX_EXPIRE_DATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L14" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Implementation note: This is the largest possible safe value that has been
tested, used to represent "infinity".

**Kind**: global constant  

* * *

## COOKIE_SEPARATOR : <code>string</code>&nbsp;<a name="COOKIE_SEPARATOR" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/storage/CookieStorage.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Separator used to separate cookie declarations in the <code>Cookie</code> HTTP
header or the return value of the <code>document.cookie</code> property.

**Kind**: global constant  

* * *

