---
id: "PageNavigationHandler"
title: "Class: PageNavigationHandler"
sidebar_label: "PageNavigationHandler"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- [`PageHandler`](PageHandler.md)

  ↳ **`PageNavigationHandler`**

## Constructors

### constructor

• **new PageNavigationHandler**(`window`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `window` | [`Window`](Window.md) | The utility for manipulating the global context        and global client-side-specific APIs. |

#### Overrides

[PageHandler](PageHandler.md).[constructor](PageHandler.md#constructor)

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:18](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L18)

## Properties

### \_window

• `Private` **\_window**: [`Window`](Window.md)

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:8](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L8)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): typeof [`Window`](Window.md)[]

#### Returns

typeof [`Window`](Window.md)[]

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:10](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L10)

## Methods

### \_saveScrollHistory

▸ **_saveScrollHistory**(): `void`

Save user's scroll state to history.

Replace scroll values in current state for actual scroll values in
document.

#### Returns

`void`

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:96](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L96)

___

### \_scrollTo

▸ **_scrollTo**(`__namedParameters`): `void`

Scrolls to give coordinates on a page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`void`

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:113](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L113)

___

### \_setAddressBar

▸ **_setAddressBar**(`url`, `isRedirection`): `void`

Sets the provided URL to the browser's address bar by pushing or replacing a new
state to the history.

The state object pushed to or replaced in the history will be an object with the
following structure: `{url: string}`. The `url` field will
be set to the provided URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL. |
| `isRedirection` | `boolean` | If replaceState should be used instead of pushState. |

#### Returns

`void`

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:130](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L130)

___

### destroy

▸ **destroy**(): `void`

Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

#### Returns

`void`

#### Inherited from

[PageHandler](PageHandler.md).[destroy](PageHandler.md#destroy)

#### Defined in

[packages/core/src/page/handler/PageHandler.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandler.ts#L52)

___

### handlePostManagedState

▸ **handlePostManagedState**(`managedPage`, `previousManagedPage`, `action`): `void`

Called after a PageManager finishes transition from previous page to
a new one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `managedPage` | `ManagedPage` | The currently managed page. |
| `previousManagedPage` | `ManagedPage` | The data of the page that was        previously managed. |
| `action` | `PageAction` | An action object describing what triggered the routing. |

#### Returns

`void`

#### Overrides

[PageHandler](PageHandler.md).[handlePostManagedState](PageHandler.md#handlepostmanagedstate)

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:72](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L72)

___

### handlePreManagedState

▸ **handlePreManagedState**(`managedPage`, `nextManagedPage`, `action`): `void`

Called before a PageManager starts to transition from previous page to
a new one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `managedPage` | `ManagedPage` | The currently managed page - soon-to-be        previously managed page. |
| `nextManagedPage` | `ManagedPage` | The data of the page that's about to        be managed. |
| `action` | `PageAction` | An action object describing what triggered the routing. |

#### Returns

`void`

#### Overrides

[PageHandler](PageHandler.md).[handlePreManagedState](PageHandler.md#handlepremanagedstate)

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L43)

___

### init

▸ **init**(): `void`

Initializes the page handler.

#### Returns

`void`

#### Overrides

[PageHandler](PageHandler.md).[init](PageHandler.md#init)

#### Defined in

[packages/core/src/page/handler/PageNavigationHandler.ts:31](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageNavigationHandler.ts#L31)
