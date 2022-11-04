---
id: "RendererEvents"
title: "Enumeration: RendererEvents"
sidebar_label: "RendererEvents"
sidebar_position: 0
custom_edit_url: null
---

Events constants, which is firing to app.

## Enumeration Members

### ERROR

• **ERROR** = ``"$IMA.$PageRenderer.error"``

PageRenderer fires event `$IMA.$PageRenderer.error` when there is
no _viewContainer in _renderToDOM method. Event's data contain
`{message: string}`.

#### Defined in

[packages/core/src/page/renderer/Events.ts:31](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/Events.ts#L31)

___

### MOUNTED

• **MOUNTED** = ``"$IMA.$PageRenderer.mounted"``

PageRenderer fires event `$IMA.$PageRenderer.mounted` after
current page view is mounted to the DOM. Event's data contain
`{type: string}`.

#### Defined in

[packages/core/src/page/renderer/Events.ts:10](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/Events.ts#L10)

___

### UNMOUNTED

• **UNMOUNTED** = ``"$IMA.$PageRenderer.unmounted"``

PageRenderer fires event `$IMA.$PageRenderer.unmounted` after current view is
unmounted from the DOM. Event's data contain
`{type: string}`.

#### Defined in

[packages/core/src/page/renderer/Events.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/Events.ts#L24)

___

### UPDATED

• **UPDATED** = ``"$IMA.$PageRenderer.updated"``

PageRenderer fires event `$IMA.$PageRenderer.updated` after
current state is updated in the DOM. Event's data contain
`{state: Object<string, *>}`.

#### Defined in

[packages/core/src/page/renderer/Events.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/Events.ts#L17)
