---
id: "Error"
title: "Class: Error"
sidebar_label: "Error"
sidebar_position: 0
custom_edit_url: null
---

The IMA application error extends the native `Error` with additional details
that lead to the error and the HTTP status code to send to the client.

Implementation note: This is an interface that extends the abstract class
[ExtensibleError](ExtensibleError.md), which does not make much sense from the strict
OOP standpoint, but is necessary due to limitations of JavaScript, so that
IMA errors are instances of both the native errors and of this interface.

## Hierarchy

- [`ExtensibleError`](ExtensibleError.md)

  ↳ **`Error`**

  ↳↳ [`GenericError`](GenericError.md)

## Constructors

### constructor

• **new Error**(`message`, `dropInternalStackFrames?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `undefined` |
| `dropInternalStackFrames` | `boolean` | `true` |

#### Inherited from

[ExtensibleError](ExtensibleError.md).[constructor](ExtensibleError.md#constructor)

#### Defined in

[packages/core/src/error/ExtensibleError.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L43)

## Properties

### \_dropInternalStackFrames

• `Protected` **\_dropInternalStackFrames**: `boolean`

#### Inherited from

[ExtensibleError](ExtensibleError.md).[_dropInternalStackFrames](ExtensibleError.md#_dropinternalstackframes)

#### Defined in

[packages/core/src/error/ExtensibleError.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L15)

___

### message

• **message**: `string`

#### Inherited from

[ExtensibleError](ExtensibleError.md).[message](ExtensibleError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

[ExtensibleError](ExtensibleError.md).[name](ExtensibleError.md#name)

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

[ExtensibleError](ExtensibleError.md).[prepareStackTrace](ExtensibleError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[ExtensibleError](ExtensibleError.md).[stackTraceLimit](ExtensibleError.md#stacktracelimit)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:13

## Accessors

### stack

• `get` **stack**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Inherited from

ExtensibleError.stack

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

#### Defined in

[packages/core/src/error/Error.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/Error.ts#L26)

___

### getParams

▸ **getParams**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the error parameters providing additional details about the
error. The structure of the returned object is always
situation-dependent, but the returned object usually contains the
`status: number` field which represents the HTTP status to send to
the client.

**`See`**

Error#getHttpStatus

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The route parameters of the route at which
        the error has occurred.

#### Defined in

[packages/core/src/error/Error.ts:41](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/Error.ts#L41)

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

[ExtensibleError](ExtensibleError.md).[captureStackTrace](ExtensibleError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:4
