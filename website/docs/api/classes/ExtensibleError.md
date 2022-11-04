---
id: "ExtensibleError"
title: "Class: ExtensibleError"
sidebar_label: "ExtensibleError"
sidebar_position: 0
custom_edit_url: null
---

Base class of custom error classes, extending the native `Error` class.

This class has been introduced to fix the Babel-related issues with
extending the native JavaScript (Error) classes.

**`Param`**

The message describing the cause of the error.

**`Param`**

Whether or not the call stack
       frames referring to the constructors of the custom errors should be
       excluded from the stack of this error (just like the native platform
       call stack frames are dropped by the JS engine).
       This flag is enabled by default.

## Hierarchy

- `Error`

  ↳ **`ExtensibleError`**

  ↳↳ [`Error`](Error.md)

## Constructors

### constructor

• **new ExtensibleError**(`message`, `dropInternalStackFrames?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `string` | `undefined` |
| `dropInternalStackFrames` | `boolean` | `true` |

#### Overrides

Error.constructor

#### Defined in

[packages/core/src/error/ExtensibleError.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L43)

## Properties

### \_dropInternalStackFrames

• `Protected` **\_dropInternalStackFrames**: `boolean`

#### Defined in

[packages/core/src/error/ExtensibleError.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L15)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

Error.name

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

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:13

## Accessors

### stack

• `get` **stack**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Overrides

Error.stack

#### Defined in

[packages/core/src/error/ExtensibleError.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/error/ExtensibleError.ts#L17)

## Methods

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

Error.captureStackTrace

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:4
