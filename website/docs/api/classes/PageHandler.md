---
id: "PageHandler"
title: "Class: PageHandler"
sidebar_label: "PageHandler"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- **`PageHandler`**

  ↳ [`PageHandlerRegistry`](PageHandlerRegistry.md)

  ↳ [`PageNavigationHandler`](PageNavigationHandler.md)

## Constructors

### constructor

• **new PageHandler**()

## Methods

### destroy

▸ **destroy**(): `void`

Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

#### Returns

`void`

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
| `managedPage` | ``null`` \| `ManagedPage` | The currently managed page. |
| `previousManagedPage` | `ManagedPage` | The data of the page that was        previously managed. |
| `action` | `PageAction` | An action object describing what triggered the routing. |

#### Returns

`void`

#### Defined in

[packages/core/src/page/handler/PageHandler.ts:40](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandler.ts#L40)

___

### handlePreManagedState

▸ **handlePreManagedState**(`managedPage`, `nextManagedPage`, `action`): `void`

Called before a PageManager starts to transition from previous page to
a new one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `managedPage` | ``null`` \| `ManagedPage` | The currently managed page - soon-to-be        previously managed page. |
| `nextManagedPage` | `ManagedPage` | The data of the page that's about to        be managed. |
| `action` | `PageAction` | An action object describing what triggered the routing. |

#### Returns

`void`

#### Defined in

[packages/core/src/page/handler/PageHandler.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandler.ts#L23)

___

### init

▸ **init**(): `void`

Initializes the page handler.

#### Returns

`void`

#### Defined in

[packages/core/src/page/handler/PageHandler.ts:9](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/handler/PageHandler.ts#L9)
