---
id: "PageStateManagerDecorator"
title: "Class: PageStateManagerDecorator"
sidebar_label: "PageStateManagerDecorator"
sidebar_position: 0
custom_edit_url: null
---

Decorator for page state manager, which add logic for limiting Extension
competence.

## Hierarchy

- [`PageStateManager`](PageStateManager.md)

  ↳ **`PageStateManagerDecorator`**

## Constructors

### constructor

• **new PageStateManagerDecorator**(`pageStateManager`, `allowedStateKeys`)

Initializes the page state manager decorator.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageStateManager` | [`PageStateManager`](PageStateManager.md) |
| `allowedStateKeys` | `string`[] |

#### Overrides

[PageStateManager](PageStateManager.md).[constructor](PageStateManager.md#constructor)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L25)

## Properties

### \_allowedStateKeys

• `Private` **\_allowedStateKeys**: `string`[]

Array of access keys for state.

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L17)

___

### \_pageStateManager

• `Private` **\_pageStateManager**: [`PageStateManager`](PageStateManager.md)

The current page state manager.

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L13)

___

### onChange

• `Optional` **onChange**: (`newState`: [`UnknownParameters`](../modules.md#unknownparameters)) => `void`

#### Type declaration

▸ (`newState`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `newState` | [`UnknownParameters`](../modules.md#unknownparameters) |

##### Returns

`void`

#### Inherited from

[PageStateManager](PageStateManager.md).[onChange](PageStateManager.md#onchange)

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:9](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L9)

## Methods

### beginTransaction

▸ **beginTransaction**(): `void`

Starts queueing state patches off the main state. While the transaction
is active every `setState` call has no effect on the current state.

Note that call to `getState` after the transaction has begun will
return state as it was before the transaction.

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[beginTransaction](PageStateManager.md#begintransaction)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:89](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L89)

___

### cancelTransaction

▸ **cancelTransaction**(): `void`

Cancels ongoing transaction. Uncommited state changes are lost.

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[cancelTransaction](PageStateManager.md#canceltransaction)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:103](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L103)

___

### clear

▸ **clear**(): `void`

Clears the state history.

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[clear](PageStateManager.md#clear)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L39)

___

### commitTransaction

▸ **commitTransaction**(): `void`

Applies queued state patches to the main state. All patches are squashed
and applied with one `setState` call.

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[commitTransaction](PageStateManager.md#committransaction)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:96](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L96)

___

### getAllStates

▸ **getAllStates**(): [`UnknownParameters`](../modules.md#unknownparameters)[]

Returns the recorded history of page states. The states will be
chronologically sorted from the oldest to the newest.

Note that the implementation may limit the size of the recorded history,
therefore the complete history may not be available.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)[]

The recorded history of page states.

#### Overrides

[PageStateManager](PageStateManager.md).[getAllStates](PageStateManager.md#getallstates)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L75)

___

### getState

▸ **getState**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current page state.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current page state.

#### Overrides

[PageStateManager](PageStateManager.md).[getState](PageStateManager.md#getstate)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L68)

___

### getTransactionStatePatches

▸ **getTransactionStatePatches**(): [`UnknownParameters`](../modules.md#unknownparameters)[]

Returns queueing state patches off the main state from the begin of transaction.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)[]

State patches from the begin of transaction.

#### Overrides

[PageStateManager](PageStateManager.md).[getTransactionStatePatches](PageStateManager.md#gettransactionstatepatches)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:82](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L82)

___

### setState

▸ **setState**(`statePatch`): `void`

Sets a new page state by applying the provided patch to the current
state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `statePatch` | [`UnknownParameters`](../modules.md#unknownparameters) | The patch of the current state. |

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[setState](PageStateManager.md#setstate)

#### Defined in

[packages/core/src/page/state/PageStateManagerDecorator.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerDecorator.ts#L46)
