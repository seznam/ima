---
id: "Request"
title: "Class: Request"
sidebar_label: "Request"
sidebar_position: 0
custom_edit_url: null
---

Wrapper for the ExpressJS request, exposing only the necessary minimum.

## Constructors

### constructor

• **new Request**()

## Properties

### \_request

• `Protected` `Optional` **\_request**: `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\>

The current ExpressJS request object, or `null` if running at
the client side.

#### Defined in

[packages/core/src/router/Request.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L14)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/router/Request.ts:16](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L16)

## Methods

### getBody

▸ **getBody**(): `any`

Returns body of request.

#### Returns

`any`

#### Defined in

[packages/core/src/router/Request.ts:66](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L66)

___

### getCookieHeader

▸ **getCookieHeader**(): `undefined` \| `string`

Returns the `Cookie` HTTP header value.

#### Returns

`undefined` \| `string`

The value of the `Cookie` header.

#### Defined in

[packages/core/src/router/Request.ts:45](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L45)

___

### getFile

▸ **getFile**(): `undefined` \| ``null`` \| `File`

Returns uploaded file to server and meta information.

#### Returns

`undefined` \| ``null`` \| `File`

#### Defined in

[packages/core/src/router/Request.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L52)

___

### getFiles

▸ **getFiles**(): `undefined` \| ``null`` \| { `[fieldname: string]`: `Multer.File`[];  } \| `File`[]

Returns upaloaded files to server with their meta information.

#### Returns

`undefined` \| ``null`` \| { `[fieldname: string]`: `Multer.File`[];  } \| `File`[]

#### Defined in

[packages/core/src/router/Request.ts:59](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L59)

___

### getHeader

▸ **getHeader**(`header`): ``null`` \| `string`

Returns the specified HTTP request header.

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `string` |

#### Returns

``null`` \| `string`

#### Defined in

[packages/core/src/router/Request.ts:73](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L73)

___

### getIP

▸ **getIP**(): ``null`` \| `string`

Returns the remote IP address of the request.

#### Returns

``null`` \| `string`

#### Defined in

[packages/core/src/router/Request.ts:80](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L80)

___

### getIPs

▸ **getIPs**(): `string`[]

Returns array of IP addresses specified in the “X-Forwarded-For”
request header.

#### Returns

`string`[]

#### Defined in

[packages/core/src/router/Request.ts:88](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L88)

___

### getPath

▸ **getPath**(): `string`

Returns the path part of the URL to which the request was made.

#### Returns

`string`

The path to which the request was made.

#### Defined in

[packages/core/src/router/Request.ts:36](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L36)

___

### init

▸ **init**(`request`): `void`

Initializes the request using the provided ExpressJS request object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `Request`<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`<`string`, `any`\>\> | The ExpressJS request object        representing the current request. Use `null` at the client        side. |

#### Returns

`void`

#### Defined in

[packages/core/src/router/Request.ts:27](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Request.ts#L27)
