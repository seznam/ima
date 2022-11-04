---
id: "GenericError"
title: "Class: GenericError"
sidebar_label: "GenericError"
sidebar_position: 0
custom_edit_url: null
---

Implementation of the [Error](Error.md) interface, providing more advanced
error API.

## Hierarchy

- [`Error`](Error.md)

  ↳ **`GenericError`**

## Constructors

### constructor

• **new GenericError**(`message`, `params?`, `dropInternalStackFrames?`)

Initializes the generic IMA error.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | The message describing the cause of the error. |
| `params` | `Object` | `{}` | A data map providing additional        details related to the error. It is recommended to set the        `status` field to the HTTP response code that should be sent        to the client. |
| `dropInternalStackFrames` | `boolean` | `true` | Whether or not the call stack        frames referring to the constructors of the custom errors should        be excluded from the stack of this error (just like the native        platform call stack frames are dropped by the JS engine).        This flag is enabled by default. |

#### Overrides

[Error](Error.md).[constructor](Error.md#constructor)

#### Defined in

[packages/core/src/error/GenericError.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/GenericError.ts#L26)

## Properties

### \_dropInternalStackFrames

• `Protected` **\_dropInternalStackFrames**: `boolean`

#### Inherited from

[Error](Error.md).[_dropInternalStackFrames](Error.md#_dropinternalstackframes)

#### Defined in

[packages/core/src/error/ExtensibleError.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L15)

___

### \_params

• `Protected` **\_params**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `status?` | `number` |

#### Defined in

[packages/core/src/error/GenericError.ts:10](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/GenericError.ts#L10)

___

### message

• **message**: `string`

#### Inherited from

[Error](Error.md).[message](Error.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

[Error](Error.md).[name](Error.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1040

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[Error](Error.md).[prepareStackTrace](Error.md#preparestacktrace)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[Error](Error.md).[stackTraceLimit](Error.md#stacktracelimit)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:13

## Accessors

### stack

• `get` **stack**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Inherited from

Error.stack

#### Defined in

[packages/core/src/error/ExtensibleError.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L17)

## Methods

### getHttpStatus

▸ **getHttpStatus**(): `number`

Returns the HTTP status to send to the client.

If the error has occurred at the client-side, the status code is used to
determine the error page to show to the user.

This method is a shorthand for the following code snippet:
`this.getParams().status || 500`.

**`See`**

http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html

#### Returns

`number`

The HTTP status to send to the client.

#### Overrides

[Error](Error.md).[getHttpStatus](Error.md#gethttpstatus)

#### Defined in

[packages/core/src/error/GenericError.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/GenericError.ts#L38)

___

### getParams

▸ **getParams**(): `Object`

Returns the error parameters providing additional details about the
error. The structure of the returned object is always
situation-dependent, but the returned object usually contains the
`status: number` field which represents the HTTP status to send to
the client.

**`See`**

Error#getHttpStatus

#### Returns

`Object`

The route parameters of the route at which
        the error has occurred.

| Name | Type |
| :------ | :------ |
| `status?` | `number` |

#### Overrides

[Error](Error.md).[getParams](Error.md#getparams)

#### Defined in

[packages/core/src/error/GenericError.ts:45](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/GenericError.ts#L45)

___

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[Error](Error.md).[captureStackTrace](Error.md#capturestacktrace)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:4
