---
id: "Dispatcher"
title: "Class: Dispatcher"
sidebar_label: "Dispatcher"
sidebar_position: 0
custom_edit_url: null
---

A Dispatcher is a utility that manager event listeners registered for events
and allows distributing (firing) events to the listeners registered for the
given event.

The dispatcher provides a single-node event bus and is usually used to
propagate events from controllers to UI components when modifying/passing
the state is impractical for any reason.

## Hierarchy

- **`Dispatcher`**

  ↳ [`DispatcherImpl`](DispatcherImpl.md)

## Constructors

### constructor

• **new Dispatcher**()

## Methods

### clear

▸ **clear**(): [`Dispatcher`](Dispatcher.md)

Deregisters all event listeners currently registered with this
dispatcher.

#### Returns

[`Dispatcher`](Dispatcher.md)

#### Defined in

[packages/core/src/event/Dispatcher.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/Dispatcher.ts#L21)

___

### fire

▸ **fire**(`event`, `data`, `imaInternalEvent?`): [`Dispatcher`](Dispatcher.md)

Fires a new event of the specified name, carrying the provided data.

The method will synchronously execute all event listeners registered for
the specified event, passing the provided data to them as the first
argument.

Note that this method does not prevent the event listeners to modify the
data in any way. The order in which the event listeners will be executed
is unspecified and should not be relied upon.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event to fire. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to pass to the event listeners. |
| `imaInternalEvent?` | `boolean` | The flag signalling whether        this is an internal IMA event. The fired event is treated as a        custom application event if this flag is not set.        The flag is used only for debugging and has no effect on the        propagation of the event. |

#### Returns

[`Dispatcher`](Dispatcher.md)

This dispatcher.

#### Defined in

[packages/core/src/event/Dispatcher.ts:81](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/Dispatcher.ts#L81)

___

### listen

▸ **listen**(`event`, `listener`, `scope?`): [`Dispatcher`](Dispatcher.md)

Registers the provided event listener to be executed when the specified
event is fired on this dispatcher.

When the specified event is fired, the event listener will be executed
with the data passed with the event as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon. Registering the same listener for the
same event and with the same scope multiple times has no effect.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event to listen for. |
| `listener` | `Listener` | The event listener to register. |
| `scope?` | `unknown` | The object to which the `this` keyword        will be bound in the event listener. |

#### Returns

[`Dispatcher`](Dispatcher.md)

This dispatcher.

#### Defined in

[packages/core/src/event/Dispatcher.ts:42](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/Dispatcher.ts#L42)

___

### unlisten

▸ **unlisten**(`event`, `listener`, `scope?`): [`Dispatcher`](Dispatcher.md)

Deregisters the provided event listener, so it will no longer be
executed with the specified scope when the specified event is fired.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `string` | The name of the event for which the listener        should be deregistered. |
| `listener` | `Listener` | The event listener to deregister. |
| `scope?` | `unknown` | The object to which the `this` keyword        would be bound in the event listener. |

#### Returns

[`Dispatcher`](Dispatcher.md)

This dispatcher.

#### Defined in

[packages/core/src/event/Dispatcher.ts:57](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/Dispatcher.ts#L57)
