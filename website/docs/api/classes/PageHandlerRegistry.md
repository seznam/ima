---
id: "PageHandlerRegistry"
title: "Class: PageHandlerRegistry"
sidebar_label: "PageHandlerRegistry"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`PageHandler`](PageHandler.md)

  ↳ **`PageHandlerRegistry`**

## Constructors

### constructor

• **new PageHandlerRegistry**(...`pageHandlers`)

Creates an instance of HandlerRegistry and creates `SerialBatch`
instance for pre-handlers and post-handlers.

**`Memberof`**

HandlerRegistry

#### Parameters

| Name | Type |
| :------ | :------ |
| `...pageHandlers` | [`PageHandler`](PageHandler.md)[] |

#### Overrides

[PageHandler](PageHandler.md).[constructor](PageHandler.md#constructor)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L19)

## Properties

### \_pageHandlers

• `Protected` **\_pageHandlers**: [`PageHandler`](PageHandler.md)[]

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:8](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L8)

___

### \_postManageHandlers

• `Protected` `Optional` **\_postManageHandlers**: [`Execution`](Execution.md)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:10](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L10)

___

### \_preManageHandlers

• `Protected` `Optional` **\_preManageHandlers**: [`Execution`](Execution.md)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:9](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L9)

___

### ExecutionMethod

▪ `Static` **ExecutionMethod**: typeof [`SerialBatch`](SerialBatch.md) = `SerialBatch`

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:12](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L12)

## Methods

### destroy

▸ **destroy**(): `void`

Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

#### Returns

`void`

#### Overrides

[PageHandler](PageHandler.md).[destroy](PageHandler.md#destroy)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:87](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L87)

___

### handlePostManagedState

▸ **handlePostManagedState**(`managedPage`, `previousManagedPage`, `action`): `Promise`<`unknown`\>

Executes the post-manage handlers with given arguments

#### Parameters

| Name | Type |
| :------ | :------ |
| `managedPage` | ``null`` \| `ManagedPage` |
| `previousManagedPage` | `ManagedPage` |
| `action` | `PageAction` |

#### Returns

`Promise`<`unknown`\>

#### Overrides

[PageHandler](PageHandler.md).[handlePostManagedState](PageHandler.md#handlepostmanagedstate)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:72](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L72)

___

### handlePreManagedState

▸ **handlePreManagedState**(`managedPage`, `nextManagedPage`, `action`): `Promise`<`unknown`\>

Executes the pre-manage handlers with given arguments

#### Parameters

| Name | Type |
| :------ | :------ |
| `managedPage` | ``null`` \| `ManagedPage` |
| `nextManagedPage` | `ManagedPage` |
| `action` | `PageAction` |

#### Returns

`Promise`<`unknown`\>

#### Overrides

[PageHandler](PageHandler.md).[handlePreManagedState](PageHandler.md#handlepremanagedstate)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:53](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L53)

___

### init

▸ **init**(): `void`

Initializes the page handler.

#### Returns

`void`

#### Overrides

[PageHandler](PageHandler.md).[init](PageHandler.md#init)

#### Defined in

[packages/core/src/page/handler/PageHandlerRegistry.ts:28](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandlerRegistry.ts#L28)
