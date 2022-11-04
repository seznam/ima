---
id: "PageStateManagerImpl"
title: "Class: PageStateManagerImpl"
sidebar_label: "PageStateManagerImpl"
sidebar_position: 0
custom_edit_url: null
---

The implementation of the [PageStateManager](PageStateManager.md) interface.

## Hierarchy

- [`PageStateManager`](PageStateManager.md)

  ↳ **`PageStateManagerImpl`**

## Constructors

### constructor

• **new PageStateManagerImpl**(`dispatcher`)

Initializes the page state manager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dispatcher` | [`Dispatcher`](Dispatcher.md) | Dispatcher fires events to app. |

#### Overrides

[PageStateManager](PageStateManager.md).[constructor](PageStateManager.md#constructor)

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:27](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L27)

## Properties

### \_cursor

• `Private` **\_cursor**: `number` = `-1`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:12](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L12)

___

### \_dispatcher

• `Private` **\_dispatcher**: [`Dispatcher`](Dispatcher.md)

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L13)

___

### \_ongoingTransaction

• `Private` **\_ongoingTransaction**: `boolean` = `false`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L14)

___

### \_statePatchQueue

• `Private` **\_statePatchQueue**: [`UnknownParameters`](../modules.md#unknownparameters)[] = `[]`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L15)

___

### \_states

• `Private` **\_states**: [`UnknownParameters`](../modules.md#unknownparameters)[] = `[]`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:16](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L16)

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

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): typeof [`Dispatcher`](Dispatcher.md)[]

#### Returns

typeof [`Dispatcher`](Dispatcher.md)[]

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:18](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L18)

## Methods

### \_callOnChangeCallback

▸ **_callOnChangeCallback**(`newState`): `void`

Call registered callback function on (@link onChange) with newState.

#### Parameters

| Name | Type |
| :------ | :------ |
| `newState` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`void`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:158](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L158)

___

### \_eraseExcessHistory

▸ **_eraseExcessHistory**(): `void`

Erase the oldest state from storage only if it exceed max
defined size of history.

#### Returns

`void`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:140](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L140)

___

### \_pushToHistory

▸ **_pushToHistory**(`newState`): `void`

Push new state to history storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `newState` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`void`

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:150](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L150)

___

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

[packages/core/src/page/state/PageStateManagerImpl.ts:89](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L89)

___

### cancelTransaction

▸ **cancelTransaction**(): `void`

Cancels ongoing transaction. Uncommited state changes are lost.

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[cancelTransaction](PageStateManager.md#canceltransaction)

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:131](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L131)

___

### clear

▸ **clear**(): `void`

Clears the state history.

#### Returns

`void`

#### Overrides

[PageStateManager](PageStateManager.md).[clear](PageStateManager.md#clear)

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:36](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L36)

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

[packages/core/src/page/state/PageStateManagerImpl.ts:106](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L106)

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

[packages/core/src/page/state/PageStateManagerImpl.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L75)

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

[packages/core/src/page/state/PageStateManagerImpl.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L68)

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

[packages/core/src/page/state/PageStateManagerImpl.ts:82](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L82)

___

### setState

▸ **setState**(`patchState`): `undefined` \| `number`

Sets a new page state by applying the provided patch to the current
state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `patchState` | [`UnknownParameters`](../modules.md#unknownparameters) | The patch of the current state. |

#### Returns

`undefined` \| `number`

#### Overrides

[PageStateManager](PageStateManager.md).[setState](PageStateManager.md#setstate)

#### Defined in

[packages/core/src/page/state/PageStateManagerImpl.ts:44](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManagerImpl.ts#L44)
