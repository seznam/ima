---
id: "ClientWindow"
title: "Class: ClientWindow"
sidebar_label: "ClientWindow"
sidebar_position: 0
custom_edit_url: null
---

Client-side implementation of the [Window](Window.md) utility API.

## Hierarchy

- [`Window`](Window.md)

  ↳ **`ClientWindow`**

## Constructors

### constructor

• **new ClientWindow**()

#### Inherited from

[Window](Window.md).[constructor](Window.md#constructor)

## Properties

### \_scopedListeners

• `Private` **\_scopedListeners**: `WeakMap`<`object`, `any`\>

#### Defined in

[packages/core/src/window/ClientWindow.ts:11](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L11)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/window/ClientWindow.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L13)

## Methods

### \_addScopedListener

▸ **_addScopedListener**(`eventTarget`, `event`, `listener`, `useCapture?`, `scope?`, `usedListener?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | `undefined` |
| `event` | `string` | `undefined` |
| `listener` | (`event`: `Event`) => `void` | `undefined` |
| `useCapture` | `boolean` | `false` |
| `scope?` | `unknown` | `undefined` |
| `usedListener?` | (`event`: `Event`) => `void` | `undefined` |

#### Returns

`void`

#### Defined in

[packages/core/src/window/ClientWindow.ts:288](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L288)

___

### \_findScopedListener

▸ **_findScopedListener**(`eventTarget`, `event`, `listener`, `useCapture`, `scope`, `remove?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | `undefined` |
| `event` | `string` | `undefined` |
| `listener` | (`event`: `Event`) => `void` | `undefined` |
| `useCapture` | `boolean` \| `ListenerOptions` | `undefined` |
| `scope` | `unknown` | `undefined` |
| `remove` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[packages/core/src/window/ClientWindow.ts:305](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L305)

___

### bindEventListener

▸ **bindEventListener**(`eventTarget`, `event`, `listener`, `useCapture?`, `scope?`): `void`

Registers the provided event listener to be executed when the specified
event occurs on the specified event target.

Registering the same event listener for the same event on the same event
target with the same `useCapture` flag value repeatedly has no
effect.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | `undefined` | The event target. |
| `event` | `string` | `undefined` | The name of the event. |
| `listener` | (`event`: `Event`) => `void` | `undefined` | The event listener. |
| `useCapture` | `boolean` | `false` | If true, the method initiates event        capture. After initiating capture, all events of the specified        type will be dispatched to the registered listener before being        dispatched to any EventTarget beneath it in the DOM tree. Events        which are bubbling upward through the tree will not trigger a        listener designated to use capture. |
| `scope?` | `unknown` | `undefined` | - |

#### Returns

`void`

#### Overrides

[Window](Window.md).[bindEventListener](Window.md#bindeventlistener)

#### Defined in

[packages/core/src/window/ClientWindow.ts:209](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L209)

___

### createCustomEvent

▸ **createCustomEvent**(`name`, `options`): `CustomEvent`<`unknown`\>

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

`CustomEvent`<`unknown`\>

The created custom event.

#### Overrides

[Window](Window.md).[createCustomEvent](Window.md#createcustomevent)

#### Defined in

[packages/core/src/window/ClientWindow.ts:202](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L202)

___

### getBody

▸ **getBody**(): `HTMLElement`

Returns the document's body element. The method returns
`undefined` if invoked at the server-side.

#### Returns

`HTMLElement`

The document's body element, or
        `undefined` if invoked at the server side.

#### Overrides

[Window](Window.md).[getBody](Window.md#getbody)

#### Defined in

[packages/core/src/window/ClientWindow.ts:142](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L142)

___

### getDocument

▸ **getDocument**(): `Document`

Returns the native `document` object representing any web page loaded
in the browser and serves as an entry point into the web page's content
which is the DOM tree at the client-side. The method returns `undefined`
if used at the server-side.

#### Returns

`Document`

The `document` object at the
        client-side, or `undefined` at the server-side.

#### Overrides

[Window](Window.md).[getDocument](Window.md#getdocument)

#### Defined in

[packages/core/src/window/ClientWindow.ts:70](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L70)

___

### getDomain

▸ **getDomain**(): `string`

Returns the domain of the current document's URL as
``${protocol}://${host}``.

#### Returns

`string`

The current domain.

#### Overrides

[Window](Window.md).[getDomain](Window.md#getdomain)

#### Defined in

[packages/core/src/window/ClientWindow.ts:114](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L114)

___

### getElementById

▸ **getElementById**(`id`): ``null`` \| `HTMLElement`

Returns the HTML element with the specified `id` attribute value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The value of the `id` attribute to look for. |

#### Returns

``null`` \| `HTMLElement`

The element with the specified id, or
        `null` if no such element exists.

#### Overrides

[Window](Window.md).[getElementById](Window.md#getelementbyid)

#### Defined in

[packages/core/src/window/ClientWindow.ts:149](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L149)

___

### getHistoryState

▸ **getHistoryState**(): `any`

Returns the history state.

#### Returns

`any`

The current history state

#### Overrides

[Window](Window.md).[getHistoryState](Window.md#gethistorystate)

#### Defined in

[packages/core/src/window/ClientWindow.ts:156](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L156)

___

### getHost

▸ **getHost**(): `string`

#### Returns

`string`

The current host.

#### Overrides

[Window](Window.md).[getHost](Window.md#gethost)

#### Defined in

[packages/core/src/window/ClientWindow.ts:121](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L121)

___

### getPath

▸ **getPath**(): `string`

Returns the path part of the current URL, including the query string.

#### Returns

`string`

The path and query string parts of the current URL.

#### Overrides

[Window](Window.md).[getPath](Window.md#getpath)

#### Defined in

[packages/core/src/window/ClientWindow.ts:128](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L128)

___

### getScrollX

▸ **getScrollX**(): `number`

Returns the number of pixels the viewport is scrolled horizontally.

#### Returns

`number`

The number of pixels the viewport is scrolled
        horizontally.

#### Overrides

[Window](Window.md).[getScrollX](Window.md#getscrollx)

#### Defined in

[packages/core/src/window/ClientWindow.ts:77](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L77)

___

### getScrollY

▸ **getScrollY**(): `number`

Returns the number of pixels the document is scrolled vertically.

#### Returns

`number`

The number of pixels the document is scrolled
        vertically.

#### Overrides

[Window](Window.md).[getScrollY](Window.md#getscrolly)

#### Defined in

[packages/core/src/window/ClientWindow.ts:92](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L92)

___

### getUrl

▸ **getUrl**(): `string`

#### Returns

`string`

The current document's URL.

#### Overrides

[Window](Window.md).[getUrl](Window.md#geturl)

#### Defined in

[packages/core/src/window/ClientWindow.ts:135](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L135)

___

### getWindow

▸ **getWindow**(): `Window` & typeof `globalThis`

Returns the native `window` object representing the global context
at the client-side. The method returns `undefined` if used at the
server-side.

#### Returns

`Window` & typeof `globalThis`

The `window` object at the
        client-side, or `undefined` at the server-side.

#### Overrides

[Window](Window.md).[getWindow](Window.md#getwindow)

#### Defined in

[packages/core/src/window/ClientWindow.ts:63](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L63)

___

### hasSessionStorage

▸ **hasSessionStorage**(): `boolean`

Returns `true` if the session storage is supported.

#### Returns

`boolean`

`true` if the session storage is supported.

#### Overrides

[Window](Window.md).[hasSessionStorage](Window.md#hassessionstorage)

#### Defined in

[packages/core/src/window/ClientWindow.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L34)

___

### isClient

▸ **isClient**(): `boolean`

#### Returns

`boolean`

`true` if invoked at the client side.

#### Overrides

[Window](Window.md).[isClient](Window.md#isclient)

#### Defined in

[packages/core/src/window/ClientWindow.ts:20](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L20)

___

### isCookieEnabled

▸ **isCookieEnabled**(): `boolean`

Returns `true` if the cookies are set and processed with every
HTTP request and response automatically by the environment.

#### Returns

`boolean`

`true` if cookies are handled automatically by
        the environment.

#### Overrides

[Window](Window.md).[isCookieEnabled](Window.md#iscookieenabled)

#### Defined in

[packages/core/src/window/ClientWindow.ts:27](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L27)

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

#### Overrides

[Window](Window.md).[pushState](Window.md#pushstate)

#### Defined in

[packages/core/src/window/ClientWindow.ts:184](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L184)

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

#### Overrides

[Window](Window.md).[querySelector](Window.md#queryselector)

#### Defined in

[packages/core/src/window/ClientWindow.ts:163](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L163)

___

### querySelectorAll

▸ **querySelectorAll**(`selector`): `NodeListOf`<`Element`\>

Returns a node list of all elements matching the specified CSS 3
selector.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | The CSS selector. |

#### Returns

`NodeListOf`<`Element`\>

A node list containing all elements matching the
        specified CSS selector.

#### Overrides

[Window](Window.md).[querySelectorAll](Window.md#queryselectorall)

#### Defined in

[packages/core/src/window/ClientWindow.ts:170](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L170)

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

#### Overrides

[Window](Window.md).[redirect](Window.md#redirect)

#### Defined in

[packages/core/src/window/ClientWindow.ts:177](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L177)

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

#### Overrides

[Window](Window.md).[replaceState](Window.md#replacestate)

#### Defined in

[packages/core/src/window/ClientWindow.ts:193](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L193)

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

#### Overrides

[Window](Window.md).[scrollTo](Window.md#scrollto)

#### Defined in

[packages/core/src/window/ClientWindow.ts:107](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L107)

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

#### Overrides

[Window](Window.md).[setTitle](Window.md#settitle)

#### Defined in

[packages/core/src/window/ClientWindow.ts:56](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L56)

___

### unbindEventListener

▸ **unbindEventListener**(`eventTarget`, `event`, `listener`, `useCapture?`, `scope?`): `void`

Deregisters the provided event listener, so it will no longer we
executed when the specified event occurs on the specified event target.

The method has no effect if the provided event listener is not
registered to be executed at the specified event.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `eventTarget` | `EventTarget` | `undefined` | The event target. |
| `event` | `string` | `undefined` | The name of the event. |
| `listener` | (`event`: `Event`) => `void` | `undefined` | The event listener. |
| `useCapture` | `boolean` | `false` | The `useCapture` flag value        that was used when the listener was registered. |
| `scope?` | `unknown` | `undefined` | - |

#### Returns

`void`

#### Overrides

[Window](Window.md).[unbindEventListener](Window.md#unbindeventlistener)

#### Defined in

[packages/core/src/window/ClientWindow.ts:249](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ClientWindow.ts#L249)
