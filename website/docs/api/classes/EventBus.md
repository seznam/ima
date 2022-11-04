---
id: "EventBus"
title: "Class: EventBus"
sidebar_label: "EventBus"
sidebar_position: 0
custom_edit_url: null
---

Utility for sending and intercepting wrapped custom DOM events on the DOM or
propagating them to the current controller.

As with native events, the event fired by this event bus always propagate up
the DOM tree until they reach the window.

Note that the events fired by this event bus are wrapped in custom DOM
events which always bear an obscure name set by the implementation of this
interface, preventing custom event name collisions, and allowing observation
and capture of all fired events. The actual event name is always consistent
by the implementation.

## Hierarchy

- **`EventBus`**

  ↳ [`EventBusImpl`](EventBusImpl.md)

## Constructors

### constructor

• **new EventBus**()

## Methods

### fire

▸ **fire**(`eventTarget`, `eventName`, `data`, `options?`): [`EventBus`](EventBus.md)

Fires a new custom event of the specified name, carrying the provided
data.

Note that this method does not prevent the event listeners to modify the
data in any way. The order in which the event listeners will be executed
is unspecified and should not be relied upon.

Note that the default options are
`{ bubbles: true, cancelable: true }`, which is different from the
default values used in the native custom events
(`{ bubbles: false, cancelable: false }`).

**`Throws`**

Thrown if the provided event target cannot be used to
        fire the event.

**`See`**

https://developer.mozilla.org/en-US/docs/Web/API/Event/Event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target at which the event        will be  dispatched (e.g. element/document/window). |
| `eventName` | `string` | The name of the event to fire. |
| `data` | `unknown` | The data to pass to the event listeners. |
| `options?` | `Options` | The        override of the default options passed to the constructor of the        custom event fired by this event bus.        The default options passed to the custom event constructor are        `{ bubbles: true, cancelable: true }`. |

#### Returns

[`EventBus`](EventBus.md)

This custom event bus.

#### Defined in

[packages/core/src/event/EventBus.ts:54](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBus.ts#L54)

___

### listen

▸ **listen**(`eventTarget`, `eventName`, `listener`): [`EventBus`](EventBus.md)

Registers the provided event listener to be executed when the specific
custom event is fired by the same implementation of the event bus and
passes through the specified event target.

When the specified event is fired, the event listener will be executed
with the event passed as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target at which the listener        should listen for the specified event. |
| `eventName` | `string` | The name of the event to listen for. |
| `listener` | `Listener` | The event listener to        register. |

#### Returns

[`EventBus`](EventBus.md)

This event bus.

#### Defined in

[packages/core/src/event/EventBus.ts:102](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBus.ts#L102)

___

### listenAll

▸ **listenAll**(`eventTarget`, `listener`): [`EventBus`](EventBus.md)

Registers the provided event listener to be executed when any custom
event is fired using the same implementation of the event bus and passes
through the specified event target.

When the specified event is fired, the event listener will be executed
with the event passed as the first argument.

The order in which the event listeners will be executed is unspecified
and should not be relied upon.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target at which the listener        should listen for all event bus events. |
| `listener` | `Listener` | The event listener to        register. |

#### Returns

[`EventBus`](EventBus.md)

This event bus.

#### Defined in

[packages/core/src/event/EventBus.ts:80](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBus.ts#L80)

___

### unlisten

▸ **unlisten**(`eventTarget`, `eventName`, `listener`): [`EventBus`](EventBus.md)

Removes the provided event listener from the set of event listeners
executed when the specified custom event fired by the same
implementation passes through the specified event target.

The method has no effect if the listener is not registered for the
specified event at the specified event target.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target at which the listener        is listening for the event. |
| `eventName` | `string` | The name of the event listened for. |
| `listener` | `Listener` | The event listener to        deregister. |

#### Returns

[`EventBus`](EventBus.md)

This event bus.

#### Defined in

[packages/core/src/event/EventBus.ts:139](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBus.ts#L139)

___

### unlistenAll

▸ **unlistenAll**(`eventTarget`, `listener`): [`EventBus`](EventBus.md)

Removes the provided event listener from the set of event listeners
executed when the any custom event fired by the same implementation
passes through the specified event target.

The method has no effect if the listener is not registered at the
specified event target.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target at which the event        listener listens for events. |
| `listener` | `Listener` | The event listener to        deregister. |

#### Returns

[`EventBus`](EventBus.md)

This event bus.

#### Defined in

[packages/core/src/event/EventBus.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBus.ts#L120)
