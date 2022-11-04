---
id: "Window"
title: "Class: Window"
sidebar_label: "Window"
sidebar_position: 0
custom_edit_url: null
---

The [Window](Window.md) interface defines various utility API for easier
cross-environment usage of various low-level client-side JavaScript APIs
available through various global objects.

## Hierarchy

- **`Window`**

  ↳ [`ServerWindow`](ServerWindow.md)

  ↳ [`ClientWindow`](ClientWindow.md)

## Constructors

### constructor

• **new Window**()

## Methods

### bindEventListener

▸ **bindEventListener**(`eventTarget`, `event`, `listener`, `useCapture?`): `void`

Registers the provided event listener to be executed when the specified
event occurs on the specified event target.

Registering the same event listener for the same event on the same event
target with the same `useCapture` flag value repeatedly has no
effect.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target. |
| `event` | `string` | The name of the event. |
| `listener` | (`event`: `Event`) => `void` | The event listener. |
| `useCapture?` | `boolean` \| `ListenerOptions` | If true, the method initiates event        capture. After initiating capture, all events of the specified        type will be dispatched to the registered listener before being        dispatched to any EventTarget beneath it in the DOM tree. Events        which are bubbling upward through the tree will not trigger a        listener designated to use capture. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:266](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L266)

___

### createCustomEvent

▸ **createCustomEvent**(`name`, `options`): `CustomEvent`<`any`\>

Create new instance of CustomEvent of the specified name and using the
provided options.

**`See`**

https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Custom event's name (sometimes referred to as the        event's type). |
| `options` | [`UnknownParameters`](../modules.md#unknownparameters) | The custom event's options. |

#### Returns

`CustomEvent`<`any`\>

The created custom event.

#### Defined in

[packages/core/src/window/Window.ts:244](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L244)

___

### getBody

▸ **getBody**(): `undefined` \| `HTMLElement`

Returns the document's body element. The method returns
`undefined` if invoked at the server-side.

#### Returns

`undefined` \| `HTMLElement`

The document's body element, or
        `undefined` if invoked at the server side.

#### Defined in

[packages/core/src/window/Window.ts:149](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L149)

___

### getDocument

▸ **getDocument**(): `undefined` \| `Document`

Returns the native `document` object representing any web page loaded
in the browser and serves as an entry point into the web page's content
which is the DOM tree at the client-side. The method returns `undefined`
if used at the server-side.

#### Returns

`undefined` \| `Document`

The `document` object at the
        client-side, or `undefined` at the server-side.

#### Defined in

[packages/core/src/window/Window.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L75)

___

### getDomain

▸ **getDomain**(): `string`

Returns the domain of the current document's URL as
``${protocol}://${host}``.

#### Returns

`string`

The current domain.

#### Defined in

[packages/core/src/window/Window.ts:115](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L115)

___

### getElementById

▸ **getElementById**(`id`): ``null`` \| `Element`

Returns the HTML element with the specified `id` attribute value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The value of the `id` attribute to look for. |

#### Returns

``null`` \| `Element`

The element with the specified id, or
        `null` if no such element exists.

#### Defined in

[packages/core/src/window/Window.ts:160](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L160)

___

### getHistoryState

▸ **getHistoryState**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the history state.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current history state

#### Defined in

[packages/core/src/window/Window.ts:169](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L169)

___

### getHost

▸ **getHost**(): `string`

#### Returns

`string`

The current host.

#### Defined in

[packages/core/src/window/Window.ts:122](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L122)

___

### getPath

▸ **getPath**(): `string`

Returns the path part of the current URL, including the query string.

#### Returns

`string`

The path and query string parts of the current URL.

#### Defined in

[packages/core/src/window/Window.ts:131](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L131)

___

### getScrollX

▸ **getScrollX**(): `number`

Returns the number of pixels the viewport is scrolled horizontally.

#### Returns

`number`

The number of pixels the viewport is scrolled
        horizontally.

#### Defined in

[packages/core/src/window/Window.ts:85](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L85)

___

### getScrollY

▸ **getScrollY**(): `number`

Returns the number of pixels the document is scrolled vertically.

#### Returns

`number`

The number of pixels the document is scrolled
        vertically.

#### Defined in

[packages/core/src/window/Window.ts:95](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L95)

___

### getUrl

▸ **getUrl**(): `string`

#### Returns

`string`

The current document's URL.

#### Defined in

[packages/core/src/window/Window.ts:138](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L138)

___

### getWindow

▸ **getWindow**(): `undefined` \| `Window`

Returns the native `window` object representing the global context
at the client-side. The method returns `undefined` if used at the
server-side.

#### Returns

`undefined` \| `Window`

The `window` object at the
        client-side, or `undefined` at the server-side.

#### Defined in

[packages/core/src/window/Window.ts:62](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L62)

___

### hasSessionStorage

▸ **hasSessionStorage**(): `boolean`

Returns `true` if the session storage is supported.

#### Returns

`boolean`

`true` if the session storage is supported.

#### Defined in

[packages/core/src/window/Window.ts:41](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L41)

___

### isClient

▸ **isClient**(): `boolean`

#### Returns

`boolean`

`true` if invoked at the client side.

#### Defined in

[packages/core/src/window/Window.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L21)

___

### isCookieEnabled

▸ **isCookieEnabled**(): `boolean`

Returns `true` if the cookies are set and processed with every
HTTP request and response automatically by the environment.

#### Returns

`boolean`

`true` if cookies are handled automatically by
        the environment.

#### Defined in

[packages/core/src/window/Window.ts:32](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L32)

___

### pushState

▸ **pushState**(`state`, `title`, `url?`): `void`

Pushes a new state to the browser history. The method has no effect if
the current browser does not support the history API (IE9).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`UnknownParameters`](../modules.md#unknownparameters) | A state object associated with the        history item, preferably representing the page state. |
| `title` | `string` | The page title related to the state. Note that        this parameter is ignored by some browsers. |
| `url?` | `string` | The new URL at which the state is available. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:216](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L216)

___

### querySelector

▸ **querySelector**(`selector`): ``null`` \| `Element`

Returns the first element matching the specified CSS 3 selector.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | The CSS selector. |

#### Returns

``null`` \| `Element`

The first element matching the CSS selector or
        `null` if no such element exists.

#### Defined in

[packages/core/src/window/Window.ts:180](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L180)

___

### querySelectorAll

▸ **querySelectorAll**(`selector`): `NodeList`

Returns a node list of all elements matching the specified CSS 3
selector.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | The CSS selector. |

#### Returns

`NodeList`

A node list containing all elements matching the
        specified CSS selector.

#### Defined in

[packages/core/src/window/Window.ts:192](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L192)

___

### redirect

▸ **redirect**(`url`): `void`

Performs a hard redirect (discarding the current JavaScript state) to
the specified URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the browser will be redirected. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:202](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L202)

___

### replaceState

▸ **replaceState**(`state`, `title`, `url?`): `void`

Replaces the current history entry. The method has no effect if the
current browser does not support the history API (IE9).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`UnknownParameters`](../modules.md#unknownparameters) | A state object associated with the        history item, preferably representing the page state. |
| `title` | `string` | The page title related to the state. Note that        this parameter is ignored by some browsers. |
| `url?` | `string` | The new URL at which the state is available. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:230](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L230)

___

### scrollTo

▸ **scrollTo**(`x`, `y`): `void`

Scrolls the viewport to the specified location (if possible).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | Horizontal scroll offset in pixels. |
| `y` | `number` | Vertical scroll offset in pixels. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:105](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L105)

___

### setTitle

▸ **setTitle**(`title`): `void`

Sets the new page title of the document.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | The new page title. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:50](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L50)

___

### unbindEventListener

▸ **unbindEventListener**(`eventTarget`, `event`, `listener`, `useCapture?`): `void`

Deregisters the provided event listener, so it will no longer we
executed when the specified event occurs on the specified event target.

The method has no effect if the provided event listener is not
registered to be executed at the specified event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | The event target. |
| `event` | `string` | The name of the event. |
| `listener` | (`event`: `Event`) => `void` | The event listener. |
| `useCapture?` | `boolean` \| `ListenerOptions` | The `useCapture` flag value        that was used when the listener was registered. |

#### Returns

`void`

#### Defined in

[packages/core/src/window/Window.ts:288](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/Window.ts#L288)
