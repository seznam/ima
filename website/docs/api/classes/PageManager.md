---
id: "PageManager"
title: "Class: PageManager"
sidebar_label: "PageManager"
sidebar_position: 0
custom_edit_url: null
---

The page manager is a utility for managing the current controller and its
view.

## Hierarchy

- **`PageManager`**

  ↳ [`AbstractPageManager`](AbstractPageManager.md)

## Constructors

### constructor

• **new PageManager**()

## Methods

### destroy

▸ **destroy**(): `Promise`<`unknown`\>

Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/core/src/page/manager/PageManager.ts:57](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/PageManager.ts#L57)

___

### init

▸ **init**(): `void`

Initializes the page manager.

#### Returns

`void`

#### Defined in

[packages/core/src/page/manager/PageManager.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/PageManager.ts#L26)

___

### manage

▸ **manage**(`args`): `Promise`<`unknown`\>

Starts to manage the provided controller and its view. The manager
stops the management of any previously managed controller and view.

The controller and view will be initialized and rendered either into the
UI (at the client-side) or to the response to send to the client (at the
server-side).

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `ManageArgs` |

#### Returns

`Promise`<`unknown`\>

A promise that will resolve to information about the rendered page.
        The `status` will contain the HTTP status code to send to the
        client (at the server side) or determine the type of error page
        to navigate to (at the client side).

#### Defined in

[packages/core/src/page/manager/PageManager.ts:49](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/PageManager.ts#L49)
