---
id: "PageRenderer"
title: "Class: PageRenderer"
sidebar_label: "PageRenderer"
sidebar_position: 0
custom_edit_url: null
---

The page renderer is a utility for rendering the page at either the
client-side or the server-side, handling the differences in the environment.

## Constructors

### constructor

• **new PageRenderer**()

## Methods

### mount

▸ **mount**(`controller`, `view`, `pageResources`, `routeOptions`): `Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

Renders the page using the provided controller and view. The actual
behavior of this method differs at the client-side and the at
server-side in the following way:

At the server, the method first waits for all the resources to load, and
then renders the page to a string containing HTML markup to send to the
client.

At the client, the method uses the already available resources to render
the page into DOM, re-using the DOM created from the HTML markup send by
the server if possible. After this the method will re-render the page
every time another resource being loaded finishes its loading and
becomes available.

Note that the method renders the page at the client-side only after all
resources have been loaded if this is the first time this method is
invoked at the client.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `controller` | [`Controller`](Controller.md) | The current page controller. |
| `view` | `unknown` | The page's view. |
| `pageResources` | [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) | The resources for        the view loaded by the controller. |
| `routeOptions` | [`RouteOptions`](../modules.md#routeoptions) | The current route options. |

#### Returns

`Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

A promise that will resolve to information about the
        rendered page. The `status` will contain the HTTP status
        code to send to the client (at the server side) or determine the
        type of error page to navigate to (at the client side).

#### Defined in

[packages/core/src/page/renderer/PageRenderer.ts:42](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/PageRenderer.ts#L42)

___

### setState

▸ **setState**(`state`): `void`

Sets the provided state to the currently rendered view.

This method has no effect at the server-side.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | [`UnknownParameters`](../modules.md#unknownparameters) | The state to set to the currently        rendered view. |

#### Returns

`void`

#### Defined in

[packages/core/src/page/renderer/PageRenderer.ts:99](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/PageRenderer.ts#L99)

___

### unmount

▸ **unmount**(): `void`

Unmounts the view from the DOM.

This method has no effect at the server-side.

#### Returns

`void`

#### Defined in

[packages/core/src/page/renderer/PageRenderer.ts:87](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/PageRenderer.ts#L87)

___

### update

▸ **update**(`controller`, `view`, `resourcesUpdate`, `routeOptions`): `Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

Handles update of the current route that does not replace the current
controller and view.

The method will use the already available resource to update the
controller's state and the view immediately. After that, the method will
update the controller's state and view with every resource that becomes
resolved.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `controller` | [`Controller`](Controller.md) | The current page controller. |
| `view` | `unknown` | The page's view. |
| `resourcesUpdate` | [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) | The resources        that represent the update the of current state according to the        current route and its parameters. |
| `routeOptions` | [`RouteOptions`](../modules.md#routeoptions) | The current route options. |

#### Returns

`Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

A promise that will resolve to information about the
        rendered page. The `status` will contain the HTTP status
        code to send to the client (at the server side) or determine the
        type of error page to navigate to (at the client side).
        The `content` field will contain the rendered markup of
        the page at the server-side, or `null` at the client-side.

#### Defined in

[packages/core/src/page/renderer/PageRenderer.ts:73](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/PageRenderer.ts#L73)
