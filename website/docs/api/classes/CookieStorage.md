---
id: "CookieStorage"
title: "Class: CookieStorage"
sidebar_label: "CookieStorage"
sidebar_position: 0
custom_edit_url: null
---

Storage of cookies, mirroring the cookies to the current request / response
at the server side and the `document.cookie` property at the client
side. The storage caches the cookies internally.

## Hierarchy

- [`MapStorage`](MapStorage.md)

  ↳ **`CookieStorage`**

## Constructors

### constructor

• **new CookieStorage**(`window`, `request`, `response`)

Initializes the cookie storage.

**`Example`**

```ts
cookie.set('cookie', 'value', { expires: 10 }); // cookie expires
                                                     // after 10s
     cookie.set('cookie'); // delete cookie
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `window` | [`Window`](Window.md) | The window utility. |
| `request` | [`Request`](Request.md) | The current HTTP request. |
| `response` | [`Response`](Response.md) | The current HTTP response. |

#### Overrides

[MapStorage](MapStorage.md).[constructor](MapStorage.md#constructor)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:92](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L92)

## Properties

### \_options

• `Private` **\_options**: `Options`

The overriding cookie attribute values.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:56](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L56)

___

### \_request

• `Private` **\_request**: [`Request`](Request.md)

The current HTTP request. This field is used at the server side.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:48](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L48)

___

### \_response

• `Private` **\_response**: [`Response`](Response.md)

The current HTTP response. This field is used at the server side.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L52)

___

### \_transformFunction

• `Private` **\_transformFunction**: `Object`

Transform encode and decode functions for cookie value.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decode` | (`value`: `string`) => `string` |
| `encode` | (`value`: `string`) => `string` |

#### Defined in

[packages/core/src/storage/CookieStorage.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L68)

___

### \_window

• `Private` **\_window**: [`Window`](Window.md)

The window utility used to determine whether the IMA is being run
at the client or at the server.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:44](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L44)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): (typeof [`Window`](Window.md) \| typeof [`Request`](Request.md) \| typeof [`Response`](Response.md))[]

#### Returns

(typeof [`Window`](Window.md) \| typeof [`Request`](Request.md) \| typeof [`Response`](Response.md))[]

#### Overrides

MapStorage.$dependencies

#### Defined in

[packages/core/src/storage/CookieStorage.ts:76](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L76)

## Methods

### \_extractCookie

▸ **_extractCookie**(`cookieString`): `Object`

Extract cookie name, value and options from cookie string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cookieString` | `string` | The value of the `Set-Cookie` HTTP        header. |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `name` | `undefined` |
| `options` | `Options` |
| `value` | `undefined` |

#### Defined in

[packages/core/src/storage/CookieStorage.ts:392](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L392)

___

### \_extractNameAndValue

▸ **_extractNameAndValue**(`pair`, `pairIndex`): ``null``[] \| (`string` \| `number` \| `boolean` \| `Date`)[]

Extract name and value for defined pair and pair index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pair` | `string` |
| `pairIndex` | `number` |

#### Returns

``null``[] \| (`string` \| `number` \| `boolean` \| `Date`)[]

#### Defined in

[packages/core/src/storage/CookieStorage.ts:419](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L419)

___

### \_firstLetterToLowerCase

▸ **_firstLetterToLowerCase**(`word`): `string`

Creates a copy of the provided word (or text) that has its first
character converted to lower case.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `word` | `string` | The word (or any text) that should have its first        character converted to lower case. |

#### Returns

`string`

A copy of the provided string with its first character
        converted to lower case.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:320](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L320)

___

### \_generateCookieString

▸ **_generateCookieString**(`name`, `value`, `options`): `string`

Generates a string representing the specified cookied, usable either
with the `document.cookie` property or the `Set-Cookie` HTTP
header.

(Note that the `Cookie` HTTP header uses a slightly different
syntax.)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The cookie name. |
| `value` | `string` \| `number` \| `boolean` | The cookie value, will be        converted to string. |
| `options` | `Options` | Cookie attributes. Only the attributes listed in the        type annotation of this field are supported. For documentation        and full list of cookie attributes see        http://tools.ietf.org/html/rfc2965#page-5 |

#### Returns

`string`

A string representing the cookie. Setting this string
        to the `document.cookie` property will set the cookie to
        the browser's cookie storage.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:343](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L343)

___

### \_getExpirationAsDate

▸ **_getExpirationAsDate**(`expiration`): `Date`

Converts the provided cookie expiration to a `Date` instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `expiration` | `string` \| `number` \| `Date` | Cookie expiration in seconds        from now, or as a string compatible with the `Date`        constructor. |

#### Returns

`Date`

Cookie expiration as a `Date` instance.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:372](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L372)

___

### \_parse

▸ **_parse**(): `void`

Parses cookies from a cookie string and sets the parsed cookies to the
internal storage.

The method obtains the cookie string from the request's `Cookie`
HTTP header when used at the server side, and the `document.cookie`
property at the client side.

#### Returns

`void`

#### Defined in

[packages/core/src/storage/CookieStorage.ts:265](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L265)

___

### \_recomputeCookieMaxAgeAndExpires

▸ **_recomputeCookieMaxAgeAndExpires**(`options`): `void`

Recomputes cookie's attributes maxAge and expires between each other.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Options` | Cookie attributes. Only the attributes listed in the        type annotation of this field are supported. For documentation        and full list of cookie attributes see        http://tools.ietf.org/html/rfc2965#page-5 |

#### Returns

`void`

#### Defined in

[packages/core/src/storage/CookieStorage.ts:510](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L510)

___

### \_sanitizeCookieValue

▸ **_sanitizeCookieValue**(`value?`): `string`

Sanitize cookie value by rules in
(@see http://tools.ietf.org/html/rfc6265#section-4r.1.1). Erase all
invalid characters from cookie value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value?` | `string` | Cookie value |

#### Returns

`string`

Sanitized value

#### Defined in

[packages/core/src/storage/CookieStorage.ts:468](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L468)

___

### clear

▸ **clear**(): [`CookieStorage`](CookieStorage.md)

Clears the storage of all entries.

#### Returns

[`CookieStorage`](CookieStorage.md)

This storage.

#### Overrides

[MapStorage](MapStorage.md).[clear](MapStorage.md#clear)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:194](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L194)

___

### delete

▸ **delete**(`name`, `options?`): [`CookieStorage`](CookieStorage.md)

Deletes the cookie identified by the specified name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name identifying the cookie. |
| `options` | `Options` | The cookie options. The `domain` and        `path` specify the cookie's domain and path. The        `httpOnly` and `secure` flags set the flags of the        same name of the cookie. |

#### Returns

[`CookieStorage`](CookieStorage.md)

This storage.

#### Overrides

[MapStorage](MapStorage.md).[delete](MapStorage.md#delete)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:182](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L182)

___

### get

▸ **get**(`name`): `undefined` \| `string`

Retrieves the value of the entry identified by the specified . The
method returns `undefined` if the entry does not exists.

Entries set to the `undefined` value can be tested for existence
using the `link has` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The key identifying the storage entry. |

#### Returns

`undefined` \| `string`

The value of the storage entry.

#### Overrides

[MapStorage](MapStorage.md).[get](MapStorage.md#get)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:127](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L127)

___

### getCookiesStringForCookieHeader

▸ **getCookiesStringForCookieHeader**(): `string`

Returns all cookies in this storage serialized to a string compatible
with the `Cookie` HTTP header.

#### Returns

`string`

All cookies in this storage serialized to a string
        compatible with the `Cookie` HTTP header.

#### Defined in

[packages/core/src/storage/CookieStorage.ts:225](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L225)

___

### has

▸ **has**(`name`): `boolean`

Returns `true` if the entry identified by the specified key exists
in this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The key identifying the storage entry. |

#### Returns

`boolean`

`true` if the storage entry exists.

#### Overrides

[MapStorage](MapStorage.md).[has](MapStorage.md#has)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:119](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L119)

___

### init

▸ **init**(`options?`, `transformFunction?`): [`CookieStorage`](CookieStorage.md)

This method is used to finalize the initialization of the storage after
the dependencies provided through the constructor have been prepared for
use.

This method must be invoked only once and it must be the first method
invoked on this instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Options` |
| `transformFunction` | `Object` |

#### Returns

[`CookieStorage`](CookieStorage.md)

This storage.

#### Overrides

[MapStorage](MapStorage.md).[init](MapStorage.md#init)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:105](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L105)

___

### keys

▸ **keys**(): `IterableIterator`<`string`\>

Returns an iterator for traversing the keys in this storage. The order
in which the keys are traversed is undefined.

#### Returns

`IterableIterator`<`string`\>

An iterator for traversing the keys in this
        storage. The iterator also implements the iterable protocol,
        returning itself as its own iterator, allowing it to be used in
        a `for..of` loop.

#### Overrides

[MapStorage](MapStorage.md).[keys](MapStorage.md#keys)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:205](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L205)

___

### parseFromSetCookieHeader

▸ **parseFromSetCookieHeader**(`setCookieHeader`): `void`

Parses cookies from the provided `Set-Cookie` HTTP header value.

The parsed cookies will be set to the internal storage, and the current
HTTP response (via the `Set-Cookie` HTTP header) if at the server
side, or the browser (via the `document.cookie` property).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `setCookieHeader` | `string` | The value of the `Set-Cookie` HTTP        header. |

#### Returns

`void`

#### Defined in

[packages/core/src/storage/CookieStorage.ts:249](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L249)

___

### set

▸ **set**(`name`, `value`, `options?`): [`CookieStorage`](CookieStorage.md)

Sets the storage entry identified by the specified key to the provided
value. The method creates the entry if it does not exist already.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The key identifying the storage entry. |
| `value` | `undefined` \| `string` | The storage entry value. |
| `options` | `Options` | The cookie options. The `maxAge` is the maximum        age in seconds of the cookie before it will be deleted, the        `expires` is an alternative to that, specifying the moment        at which the cookie will be discarded. The `domain` and        `path` specify the cookie's domain and path. The        `httpOnly` and `secure` flags set the flags of the        same name of the cookie. |

#### Returns

[`CookieStorage`](CookieStorage.md)

This storage.

#### Overrides

[MapStorage](MapStorage.md).[set](MapStorage.md#set)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:148](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L148)

___

### size

▸ **size**(): `number`

#### Returns

`number`

#### Overrides

[MapStorage](MapStorage.md).[size](MapStorage.md#size)

#### Defined in

[packages/core/src/storage/CookieStorage.ts:213](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/CookieStorage.ts#L213)
