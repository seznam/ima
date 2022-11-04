---
id: "EventBusImpl"
title: "Class: EventBusImpl"
sidebar_label: "EventBusImpl"
sidebar_position: 0
custom_edit_url: null
---

Helper for custom events.

It offers public methods for firing custom events and two methods for
catching events (e.g. inside view components).

## Hierarchy

- [`EventBus`](EventBus.md)

  ↳ **`EventBusImpl`**

## Constructors

### constructor

• **new EventBusImpl**(`window`)

Initializes the custom event helper.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `window` | [`Window`](Window.md) | The IMA window helper. |

#### Overrides

[EventBus](EventBus.md).[constructor](EventBus.md#constructor)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:48](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L48)

## Properties

### \_allListenersTargets

• `Private` **\_allListenersTargets**: `WeakMap`<`EventTarget`, `AllListenersWeakMap`\>

Map of event targets to listeners executed on all IMA.js event bus
events.

#### Defined in

[packages/core/src/event/EventBusImpl.ts:36](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L36)

___

### \_listeners

• `Private` **\_listeners**: `WeakMap`<`Listener`, `ListenersWeakMap`\>

Map of listeners provided to the public API of this event bus to a
map of event targets to a map of event names to actual listeners
bound to the native API.

The "listen all" event listeners are not registered in this map.

#### Defined in

[packages/core/src/event/EventBusImpl.ts:31](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L31)

___

### \_window

• `Private` **\_window**: [`Window`](Window.md)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L23)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): typeof [`Window`](Window.md)[]

#### Returns

typeof [`Window`](Window.md)[]

#### Defined in

[packages/core/src/event/EventBusImpl.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L39)

## Methods

### fire

▸ **fire**(`eventTarget`, `eventName`, `data`, `options?`): [`EventBusImpl`](EventBusImpl.md)

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
| `options` | `Options` | The        override of the default options passed to the constructor of the        custom event fired by this event bus.        The default options passed to the custom event constructor are        `{ bubbles: true, cancelable: true }`. |

#### Returns

[`EventBusImpl`](EventBusImpl.md)

This custom event bus.

#### Overrides

[EventBus](EventBus.md).[fire](EventBus.md#fire)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:60](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L60)

___

### listen

▸ **listen**(`eventTarget`, `eventName`, `listener`): [`EventBusImpl`](EventBusImpl.md)

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

[`EventBusImpl`](EventBusImpl.md)

This event bus.

#### Overrides

[EventBus](EventBus.md).[listen](EventBus.md#listen)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:121](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L121)

___

### listenAll

▸ **listenAll**(`eventTarget`, `listener`): [`EventBusImpl`](EventBusImpl.md)

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

[`EventBusImpl`](EventBusImpl.md)

This event bus.

#### Overrides

[EventBus](EventBus.md).[listenAll](EventBus.md#listenall)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:93](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L93)

___

### unlisten

▸ **unlisten**(`eventTarget`, `eventName`, `listener`): [`EventBusImpl`](EventBusImpl.md)

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

[`EventBusImpl`](EventBusImpl.md)

This event bus.

#### Overrides

[EventBus](EventBus.md).[unlisten](EventBus.md#unlisten)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:212](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L212)

___

### unlistenAll

▸ **unlistenAll**(`eventTarget`, `listener`): [`EventBusImpl`](EventBusImpl.md)

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

[`EventBusImpl`](EventBusImpl.md)

This event bus.

#### Overrides

[EventBus](EventBus.md).[unlistenAll](EventBus.md#unlistenall)

#### Defined in

[packages/core/src/event/EventBusImpl.ts:171](https://github.com/seznam/ima/blob/16487954/packages/core/src/event/EventBusImpl.ts#L171)
