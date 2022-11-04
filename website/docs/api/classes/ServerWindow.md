---
id: "ServerWindow"
title: "Class: ServerWindow"
sidebar_label: "ServerWindow"
sidebar_position: 0
custom_edit_url: null
---

Server-side implementation of the `Window` utility API.

## Hierarchy

- [`Window`](Window.md)

  ↳ **`ServerWindow`**

## Constructors

### constructor

• **new ServerWindow**()

#### Inherited from

[Window](Window.md).[constructor](Window.md#constructor)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/window/ServerWindow.ts:12](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L12)

## Methods

### bindEventListener

▸ **bindEventListener**(): `void`

Registers the provided event listener to be executed when the specified
event occurs on the specified event target.

Registering the same event listener for the same event on the same event
target with the same `useCapture` flag value repeatedly has no
effect.

#### Returns

`void`

#### Overrides

[Window](Window.md).[bindEventListener](Window.md#bindeventlistener)

#### Defined in

[packages/core/src/window/ServerWindow.ts:191](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L191)

___

### createCustomEvent

▸ **createCustomEvent**(`name`, `options`): `CustomEvent`<`any`\> & [`UnknownParameters`](../modules.md#unknownparameters)

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

`CustomEvent`<`any`\> & [`UnknownParameters`](../modules.md#unknownparameters)

The created custom event.

#### Overrides

[Window](Window.md).[createCustomEvent](Window.md#createcustomevent)

#### Defined in

[packages/core/src/window/ServerWindow.ts:178](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L178)

___

### getBody

▸ **getBody**(): `undefined`

Returns the document's body element. The method returns
`undefined` if invoked at the server-side.

#### Returns

`undefined`

The document's body element, or
        `undefined` if invoked at the server side.

#### Overrides

[Window](Window.md).[getBody](Window.md#getbody)

#### Defined in

[packages/core/src/window/ServerWindow.ts:110](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L110)

___

### getDocument

▸ **getDocument**(): `undefined`

Returns the native `document` object representing any web page loaded
in the browser and serves as an entry point into the web page's content
which is the DOM tree at the client-side. The method returns `undefined`
if used at the server-side.

#### Returns

`undefined`

The `document` object at the
        client-side, or `undefined` at the server-side.

#### Overrides

[Window](Window.md).[getDocument](Window.md#getdocument)

#### Defined in

[packages/core/src/window/ServerWindow.ts:54](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L54)

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

[packages/core/src/window/ServerWindow.ts:82](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L82)

___

### getElementById

▸ **getElementById**(): ``null``

Returns the HTML element with the specified `id` attribute value.

#### Returns

``null``

The element with the specified id, or
        `null` if no such element exists.

#### Overrides

[Window](Window.md).[getElementById](Window.md#getelementbyid)

#### Defined in

[packages/core/src/window/ServerWindow.ts:117](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L117)

___

### getHistoryState

▸ **getHistoryState**(): `Object`

Returns the history state.

#### Returns

`Object`

The current history state

#### Overrides

[Window](Window.md).[getHistoryState](Window.md#gethistorystate)

#### Defined in

[packages/core/src/window/ServerWindow.ts:124](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L124)

___

### getHost

▸ **getHost**(): `string`

#### Returns

`string`

The current host.

#### Overrides

[Window](Window.md).[getHost](Window.md#gethost)

#### Defined in

[packages/core/src/window/ServerWindow.ts:89](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L89)

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

[packages/core/src/window/ServerWindow.ts:96](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L96)

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

[packages/core/src/window/ServerWindow.ts:61](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L61)

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

[packages/core/src/window/ServerWindow.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L68)

___

### getUrl

▸ **getUrl**(): `string`

#### Returns

`string`

The current document's URL.

#### Overrides

[Window](Window.md).[getUrl](Window.md#geturl)

#### Defined in

[packages/core/src/window/ServerWindow.ts:103](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L103)

___

### getWindow

▸ **getWindow**(): `undefined`

Returns the native `window` object representing the global context
at the client-side. The method returns `undefined` if used at the
server-side.

#### Returns

`undefined`

The `window` object at the
        client-side, or `undefined` at the server-side.

#### Overrides

[Window](Window.md).[getWindow](Window.md#getwindow)

#### Defined in

[packages/core/src/window/ServerWindow.ts:47](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L47)

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

[packages/core/src/window/ServerWindow.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L33)

___

### isClient

▸ **isClient**(): `boolean`

#### Returns

`boolean`

`true` if invoked at the client side.

#### Overrides

[Window](Window.md).[isClient](Window.md#isclient)

#### Defined in

[packages/core/src/window/ServerWindow.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L19)

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

[packages/core/src/window/ServerWindow.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L26)

___

### pushState

▸ **pushState**(): `void`

Pushes a new state to the browser history. The method has no effect if
the current browser does not support the history API (IE9).

#### Returns

`void`

#### Overrides

[Window](Window.md).[pushState](Window.md#pushstate)

#### Defined in

[packages/core/src/window/ServerWindow.ts:164](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L164)

___

### querySelector

▸ **querySelector**(): ``null``

Returns the first element matching the specified CSS 3 selector.

#### Returns

``null``

The first element matching the CSS selector or
        `null` if no such element exists.

#### Overrides

[Window](Window.md).[querySelector](Window.md#queryselector)

#### Defined in

[packages/core/src/window/ServerWindow.ts:131](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L131)

___

### querySelectorAll

▸ **querySelectorAll**(`_selector`): `DummyNodeList`

Returns a node list of all elements matching the specified CSS 3
selector.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_selector` | `string` | The CSS selector. |

#### Returns

`DummyNodeList`

A node list containing all elements matching the
        specified CSS selector.

#### Overrides

[Window](Window.md).[querySelectorAll](Window.md#queryselectorall)

#### Defined in

[packages/core/src/window/ServerWindow.ts:138](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L138)

___

### redirect

▸ **redirect**(): `void`

Performs a hard redirect (discarding the current JavaScript state) to
the specified URL.

#### Returns

`void`

#### Overrides

[Window](Window.md).[redirect](Window.md#redirect)

#### Defined in

[packages/core/src/window/ServerWindow.ts:157](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L157)

___

### replaceState

▸ **replaceState**(): `void`

Replaces the current history entry. The method has no effect if the
current browser does not support the history API (IE9).

#### Returns

`void`

#### Overrides

[Window](Window.md).[replaceState](Window.md#replacestate)

#### Defined in

[packages/core/src/window/ServerWindow.ts:171](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L171)

___

### scrollTo

▸ **scrollTo**(): `void`

Scrolls the viewport to the specified location (if possible).

#### Returns

`void`

#### Overrides

[Window](Window.md).[scrollTo](Window.md#scrollto)

#### Defined in

[packages/core/src/window/ServerWindow.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L75)

___

### setTitle

▸ **setTitle**(): `void`

Sets the new page title of the document.

#### Returns

`void`

#### Overrides

[Window](Window.md).[setTitle](Window.md#settitle)

#### Defined in

[packages/core/src/window/ServerWindow.ts:40](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L40)

___

### unbindEventListener

▸ **unbindEventListener**(): `void`

Deregisters the provided event listener, so it will no longer we
executed when the specified event occurs on the specified event target.

The method has no effect if the provided event listener is not
registered to be executed at the specified event.

#### Returns

`void`

#### Overrides

[Window](Window.md).[unbindEventListener](Window.md#unbindeventlistener)

#### Defined in

[packages/core/src/window/ServerWindow.ts:198](https://github.com/seznam/ima/blob/16487954/packages/core/src/window/ServerWindow.ts#L198)
