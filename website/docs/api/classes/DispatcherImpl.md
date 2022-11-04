---
id: "DispatcherImpl"
title: "Class: DispatcherImpl"
sidebar_label: "DispatcherImpl"
sidebar_position: 0
custom_edit_url: null
---

Default implementation of the [Dispatcher](Dispatcher.md) interface.

## Hierarchy

- [`Dispatcher`](Dispatcher.md)

  ↳ **`DispatcherImpl`**

## Constructors

### constructor

• **new DispatcherImpl**()

Initializes the dispatcher.

#### Overrides

[Dispatcher](Dispatcher.md).[constructor](Dispatcher.md#constructor)

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:32](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L32)

## Properties

### \_eventListeners

• `Protected` **\_eventListeners**: `Map`<`string`, `Map`<`Listener`, `Set`<`unknown`\>\>\>

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L23)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L25)

## Methods

### \_createNewEvent

▸ **_createNewEvent**(`event`): `void`

Create new Map storage of listeners for the specified event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event. |

#### Returns

`void`

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:142](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L142)

___

### \_createNewListener

▸ **_createNewListener**(`event`, `listener`): `void`

Create new Set storage of scopes for the specified event and listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event. |
| `listener` | `Listener` | The event listener. |

#### Returns

`void`

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:153](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L153)

___

### \_getListenersOf

▸ **_getListenersOf**(`event`): `Readonly`<`Map`<`Listener`, `Set`<`unknown`\>\>\>

Retrieves the map of event listeners to scopes they are bound to.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event. |

#### Returns

`Readonly`<`Map`<`Listener`, `Set`<`unknown`\>\>\>

A map of event listeners to the
        scopes in which they should be executed. The returned map is an
        unmodifiable empty map if no listeners are registered for the
        event.

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:192](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L192)

___

### \_getScopesOf

▸ **_getScopesOf**(`event`, `listener`): `Readonly`<`Set`<`unknown`\>\>

Retrieves the scopes in which the specified event listener should be
executed for the specified event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event. |
| `listener` | `Listener` | The event listener. |

#### Returns

`Readonly`<`Set`<`unknown`\>\>

The scopes in which the specified listeners
        should be executed in case of the specified event. The returned
        set is an unmodifiable empty set if no listeners are registered
        for the event.

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:173](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L173)

___

### clear

▸ **clear**(): [`DispatcherImpl`](DispatcherImpl.md)

Deregisters all event listeners currently registered with this
dispatcher.

#### Returns

[`DispatcherImpl`](DispatcherImpl.md)

#### Overrides

[Dispatcher](Dispatcher.md).[clear](Dispatcher.md#clear)

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L46)

___

### fire

▸ **fire**(`event`, `data`, `imaInternalEvent?`): [`DispatcherImpl`](DispatcherImpl.md)

Fires a new event of the specified name, carrying the provided data.

The method will synchronously execute all event listeners registered for
the specified event, passing the provided data to them as the first
argument.

Note that this method does not prevent the event listeners to modify the
data in any way. The order in which the event listeners will be executed
is unspecified and should not be relied upon.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `event` | `string` | `undefined` | The name of the event to fire. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | `undefined` | The data to pass to the event listeners. |
| `imaInternalEvent` | `boolean` | `false` | The flag signalling whether        this is an internal IMA event. The fired event is treated as a        custom application event if this flag is not set.        The flag is used only for debugging and has no effect on the        propagation of the event. |

#### Returns

[`DispatcherImpl`](DispatcherImpl.md)

This dispatcher.

#### Overrides

[Dispatcher](Dispatcher.md).[fire](Dispatcher.md#fire)

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:115](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L115)

___

### listen

▸ **listen**(`event`, `listener`, `scope?`): [`DispatcherImpl`](DispatcherImpl.md)

Registers the provided event listener to be executed when the specified
event is fired on this dispatcher.

When the specified event is fired, the event listener will be executed
with the data passed with the event as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon. Registering the same listener for the
same event and with the same scope multiple times has no effect.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `event` | `string` | `undefined` | The name of the event to listen for. |
| `listener` | `Listener` | `undefined` | The event listener to register. |
| `scope` | `unknown` | `null` | The object to which the `this` keyword        will be bound in the event listener. |

#### Returns

[`DispatcherImpl`](DispatcherImpl.md)

This dispatcher.

#### Overrides

[Dispatcher](Dispatcher.md).[listen](Dispatcher.md#listen)

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:55](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L55)

___

### unlisten

▸ **unlisten**(`event`, `listener`, `scope?`): [`DispatcherImpl`](DispatcherImpl.md)

Deregisters the provided event listener, so it will no longer be
executed with the specified scope when the specified event is fired.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `event` | `string` | `undefined` | The name of the event for which the listener        should be deregistered. |
| `listener` | `Listener` | `undefined` | The event listener to deregister. |
| `scope` | `unknown` | `null` | The object to which the `this` keyword        would be bound in the event listener. |

#### Returns

[`DispatcherImpl`](DispatcherImpl.md)

This dispatcher.

#### Overrides

[Dispatcher](Dispatcher.md).[unlisten](Dispatcher.md#unlisten)

#### Defined in

[packages/core/src/event/DispatcherImpl.ts:80](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/DispatcherImpl.ts#L80)
