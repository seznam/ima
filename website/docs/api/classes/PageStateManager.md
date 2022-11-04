---
id: "PageStateManager"
title: "Class: PageStateManager"
sidebar_label: "PageStateManager"
sidebar_position: 0
custom_edit_url: null
---

Manager of the current page state and state history.

## Hierarchy

- **`PageStateManager`**

  ↳ [`PageStateManagerDecorator`](PageStateManagerDecorator.md)

  ↳ [`PageStateManagerImpl`](PageStateManagerImpl.md)

## Constructors

### constructor

• **new PageStateManager**()

## Properties

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

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:66](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L66)

___

### cancelTransaction

▸ **cancelTransaction**(): `void`

Cancels ongoing transaction. Uncommited state changes are lost.

#### Returns

`void`

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:81](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L81)

___

### clear

▸ **clear**(): `void`

Clears the state history.

#### Returns

`void`

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L14)

___

### commitTransaction

▸ **commitTransaction**(): `void`

Applies queued state patches to the main state. All patches are squashed
and applied with one `setState` call.

#### Returns

`void`

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:74](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L74)

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

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L46)

___

### getState

▸ **getState**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current page state.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current page state.

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L33)

___

### getTransactionStatePatches

▸ **getTransactionStatePatches**(): [`UnknownParameters`](../modules.md#unknownparameters)[]

Returns queueing state patches off the main state from the begin of transaction.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)[]

State patches from the begin of transaction.

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:55](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L55)

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

#### Defined in

[packages/core/src/page/state/PageStateManager.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/PageStateManager.ts#L24)
