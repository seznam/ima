---
id: "RouterEvents"
title: "Enumeration: RouterEvents"
sidebar_label: "RouterEvents"
sidebar_position: 0
custom_edit_url: null
---

Events constants, which is firing to app.

## Enumeration Members

### AFTER\_HANDLE\_ROUTE

• **AFTER\_HANDLE\_ROUTE** = ``"$IMA.$Router.afterHandleRoute"``

Router fire event `$IMA.$Router.afterHandleRoute` after page
manager handle the route. Event's data contain
`{response: Object<string, *>, params: Object<string, string>`,
route: ima.core.router.AbstractRoute, path: string, options: Object<string, *>}}.
The `response` is page render result. The `path` is current
path, the `params` are params extracted from path, the
`route` is handle route for path and the `options` is route
additional options.

#### Defined in

[packages/core/src/router/Events.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Events.ts#L26)

___

### BEFORE\_HANDLE\_ROUTE

• **BEFORE\_HANDLE\_ROUTE** = ``"$IMA.$Router.beforeHandleRoute"``

Router fire event `$IMA.$Router.beforeHandleRoute` before page
manager handle the route. Event's data contain
`{ params: Object<string, string>`, route: ima.core.router.AbstractRoute,
path: string, options: Object<string, *>}}. The `path` is current
path, the `params` are params extracted from path, the
`route` is handle route for path and the `options` is route
additional options.

#### Defined in

[packages/core/src/router/Events.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Events.ts#L14)
