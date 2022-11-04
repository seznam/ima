---
id: "Response"
title: "Class: Response"
sidebar_label: "Response"
sidebar_position: 0
custom_edit_url: null
---

Wrapper for the ExpressJS response, exposing only the necessary minimum.

## Constructors

### constructor

• **new Response**()

## Properties

### \_cookieTransformFunction

• `Protected` **\_cookieTransformFunction**: `Object`

Transform function for cookie value.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decode` | (`value`: `string`) => `string` |
| `encode` | (`value`: `string`) => `string` |

#### Defined in

[packages/core/src/router/Response.ts:29](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L29)

___

### \_internalCookieStorage

• `Protected` **\_internalCookieStorage**: `Map`<`string`, { `options`: `CookieOptions` ; `value`: `string`  }\>

Internal cookie storage for Set-Cookie header.

#### Defined in

[packages/core/src/router/Response.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L21)

___

### \_internalHeadersStorage

• `Protected` **\_internalHeadersStorage**: [`UnknownParameters`](../modules.md#unknownparameters) = `{}`

#### Defined in

[packages/core/src/router/Response.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L25)

___

### \_response

• `Protected` `Optional` **\_response**: `Response`<`any`, `Record`<`string`, `any`\>\>

The ExpressJS response object, or `undefined` if running at the
client side.

#### Defined in

[packages/core/src/router/Response.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L17)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/router/Response.ts:37](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L37)

## Methods

### getResponseParams

▸ **getResponseParams**(): `Object`

Return object which contains response headers and cookie.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cookie` | `Map`<`string`, { `options`: `CookieOptions` ; `value`: `string`  }\> |
| `headers` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Defined in

[packages/core/src/router/Response.ts:169](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L169)

___

### init

▸ **init**(`response`, `cookieTransformFunction?`): [`Response`](Response.md)

Initializes this response wrapper with the provided ExpressJS response
object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | `Response`<`any`, `Record`<`string`, `any`\>\> | The ExpressJS response, or        `null` if the code is running at the client side. |
| `cookieTransformFunction` | `Object` |  |

#### Returns

[`Response`](Response.md)

This response.

#### Defined in

[packages/core/src/router/Response.ts:50](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L50)

___

### redirect

▸ **redirect**(`url`, `options?`): `void`

Redirects the client to the specified location, with the specified
redirect HTTP response code.

For full list of HTTP response status codes see
http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

Use this method only at the server side.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the client should be redirected. @param[status=302] The HTTP status code to send to the        client. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | - |

#### Returns

`void`

This response.

#### Defined in

[packages/core/src/router/Response.ts:77](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L77)

___

### setCookie

▸ **setCookie**(`name`, `value`, `options?`): [`Response`](Response.md)

Sets a cookie, which will be sent to the client with the response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The cookie name. |
| `value` | `string` \| `number` \| `boolean` | The cookie value, will be        converted to string. |
| `options` | `Object` | Cookie attributes. Only the attributes listed in the type        annotation of this field are supported. For documentation and full        list of cookie attributes        see http://tools.ietf.org/html/rfc2965#page-5 |

#### Returns

[`Response`](Response.md)

This response.

#### Defined in

[packages/core/src/router/Response.ts:114](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L114)

___

### setHeader

▸ **setHeader**(`name`, `value`): [`Response`](Response.md)

Sets a header, which will be sent to the client with the response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The header name. |
| `value` | `unknown` | The header value, will be |

#### Returns

[`Response`](Response.md)

This response.

#### Defined in

[packages/core/src/router/Response.ts:150](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Response.ts#L150)
