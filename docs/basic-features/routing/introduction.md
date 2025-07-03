---
title: Introduction
description: Basic features > Routing > Introduction
---

Routing is an essential part of every application that displays multiple pages. It allows to develop each part of an application separately and add new parts instantly. As it happens to be in MVC frameworks, each route targets specific controller which takes control over what happens next after a route is matched.

![](/img/docs/diagram-router.png)

## Setting up Router

All routes in IMA.js are registered inside the `init` function in `app/config/routes.js`. Same `init` function can be found in `app/config/bind.js`. See [Object Container](../object-container.md) documentation for more information about the `oc.get()` function.

Usually you should be oke with simple string defined [StaticRoutes](../../api/classes/ima_core.StaticRoute.md) (the ones defined below), but the router also has support for more advanced and powerful [DynamicRoutes](../../api/classes/ima_core.DynamicRoute.md). For more information about these see the [next section](./dynamic-routes.md).

```javascript title=./app/config/routes.js
import { RouteNames } from '@ima/core';

import HomeController from 'app/page/home/HomeController';
import HomeView from 'app/page/home/HomeView';

export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router
    .add('home', '/', HomeController, HomeView)
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
}
```

The router `add` method has following signature:

```javascript
add(name, pathExpression, controller, view, options = undefined);
```

### name

> `string`

This argument represents **unique route name**. You can use this name when [linking between routes](./introduction.md#linking-between-routes) or getting the `route` instance using `getRouteHandler()` method.

### pathExpression

> `string | object`

This can be either `object` for [dynamic routes](./dynamic-routes.md) or `string` representing route path. The pathExpression supports **[parameter substitutions](./introduction.md#route-params-substitutions)


### controller

> `string | function`

Route assigned **[Controller](../controller-lifecycle.md)** class (can be a string alias, referring to the controller registered in the [Object Container](../object-container.md)). It goes through its full [lifecycle](../controller-lifecycle.md) and renders the [View](../views-and-components.md).

### view

> `string | function`

Route assigned **[View](../views-and-components.md)** class (also can be a string alias, referring to the view registered in the [Object Container](../object-container.md)). Rendered by the route controller.

### options

> `object = undefined`

These are optional, however it accepts object with following properties and their respective defaults:

```javascript
{
  onlyUpdate: false,
  autoScroll: true,
  allowSPA: true,
  documentView: null,
  managedRootView: null,
  viewAdapter: null,
  middlewares: []
}
```

#### onlyUpdate

> `boolean | function = false`

When only the parameters of the current route change an [`update` method](../controller-lifecycle.md#update-client) of the active controller will be invoked instead of re-instantiating the controller and view. The `update` method receives `prevParams` object containing - as the name suggests - previous route parameters.

If you provide function to the `onlyUpdate` option; it receives 2 arguments (instances of previous **controller** and **view**) and it should return **boolean**.

#### autoScroll

> `boolean = true`

Determines whether the page should be **scrolled to the top** when the navigation occurs.

#### allowSPA

> `boolean = true`

Can be used to make the route to be always served from the server and never using the SPA (when disabled) even if the server is overloaded.

This is useful for routes that use different document views (specified by the `documentView` option), for example for rendering the content of iframes.

#### documentView

> `AbstractDocumentView = null`

Custom [DocumentView](../rendering-process.md#documentview), should extend the `AbstractDocumentView` from `@ima/core`.

#### managedRootView

> `function = null`

Custom `ManagedRootView` component, for more information see [rendering process](../rendering-process.md#managedrootview).

#### viewAdapter

> `function = null`

Custom `ViewAdapter` component, for more information see [rendering process](../rendering-process.md#viewadapter).

#### middlewares

> `function[] = []`

Array of route-specific middlewares. See the [middlewares](../routing/middlewares.md) section for more information.

## Route params substitutions

The parameter name can contain only letters `a-zA-Z`, numbers `0-9`, underscores `_` and hyphens `-` and is preceded by colon `:`.

```javascript
router.add(
  'order-detail',
  // highlight-next-line
  '/user/:userId/orders/:orderId',
  OrderController,
  OrderView
);
```

The `userId` and `orderId` parameters are then accessible in `OrderController` via `this.params`:

```javascript
import { AbstractController } from '@ima/core';

class OrderController extends AbstractController {
  load() {
    // highlight-next-line
    const userPromise = this._userService.get(this.params.userId);
    // highlight-next-line
    const orderPromise = this._orderService.get(this.params.orderId);

    return {
      user: userPromise,
      order: orderPromise
    }
  }
}
```

### Optional parameters

Parameters can also be marked as **optional** by placing question mark `?` after the colon `:`.

```javascript
router.add(
  'user-detail',
  // highlight-next-line
  '/profile/:?userId',
  UserController,
  UserView
);
```

:::caution

Optional parameters can be **placed only after the last slash**. Doing otherwise can cause unexpected behavior.

:::

## Linking between routes

URLs to routes can be generated via the `Router.link()` public method. These can be then used in ordinary anchor tags and IMA.js makes sure, **to handle the site routing in SPA mode**, rather than doing redirect/reload of the whole page.

```jsx
import { AbstractComponent } from '@ima/react-page-renderer';

class OrderView extends AbstractComponent {
  render() {
    const { user, order } = this.props;

    const orderLink = this.link('order-detail', {
      userId: user.id,
      orderId: order.id
    });

    return <a href={orderLink}>View order</a>
  }
}
```

This is done by listening to window `popstate` and `click` events and reacting accordingly (in the `listen` method of [ClientRouter](https://github.com/seznam/ima/blob/next/packages/core/src/router/ClientRouter.js#L113), which is called by IMA.js on client during app init). If the handled URL is not valid registered app route, it is handled normally (e.g you are redirected to the target URL).

:::tip

You can use `this.link` helper method in IMA.js abstract component or the `useLink` hook from the [@ima/react-hooks](https://github.com/seznam/IMA.js-plugins/tree/master/packages/react-hooks) plugin in your components and views to generate router links.

:::

:::note

Under the hood, `this.link()` is only alias for `this.utils.$Router.link`, where  `this.utils` is taken from `this.context.$Utils`.

For more information about `this.utils` and `$Utils` objects, take a look at the [React Context](../rendering-process.md#react-context) in the documentation.

:::

### Generating links outside of app components

Linking in **Controllers**, **Extensions**, **Helpers** and other [Object Container](../object-container.md) classes requires you to import `Router` using [dependency injection](../object-container.md#1-dependency-injection). To do that you can either use `Router` class in the dependency array, or `$Router` string alias:

```javascript
import { AbstractController } from '@ima/core';

export default class DetailController extends AbstractController {
  static get $dependencies() {
    return ['$Router'];
  }

  constructor(router) {
    this._router = router;
  }

  load() {
    // ...
  }
}
```

Then you get `Router` instance as the constructor's first argument, which gives you access to it's `link` public method (and many others), that you can use to generate your desired route URL:

```javascript
load() {
  const detailLink = this._router.link('order-detail', {
    userId: user.id,
    orderId: order.id
  });

  return { detailLink };
}
```

## Error and NotFound route names

There are two special route names that `@ima/core` exports: `RouteNames.ERROR`, `RouteNames.NOT_FOUND`. You can use these constants to provide custom views and controllers for error handling pages.


```javascript title=./app/config/routes.js
import { RouteNames } from '@ima/core';

import { ErrorController, ErrorView } from 'app/page/error';
import { NotFoundController, NotFoundView } from 'app/page/not-found';

export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router
    .add('home', '/', HomeController, HomeView)
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
}
```

## Redirects

In addition to the `link` method mentioned above (which handles URL generation for given routes), you can use `Router.redirect()` method to **redirect directly to the targeted URL**.

This URL can be either existing app route or external URL. As with links, in this case you also get SPA routing, in case of redirection to different IMA.js app route.


```javascript
import { AbstractController, Router } from '@ima/core';

export default class DetailController extends AbstractController {
  static get $dependencies() {
    return [
      Router // We're using class descriptor in this case for DI
    ];
  }

  constructor(router) {
    this._router = router;
  }

  init() {
      // highlight-next-line
    this._router.redirect(
      // highlight-next-line
      this._router.link('order-detail', {
      // highlight-next-line
        userId: user.id,
      // highlight-next-line
        orderId: order.id
      // highlight-next-line
      });
      // highlight-next-line
    );
  }
}
```

:::info

On client side, redirections are handled by simply changing the `window.location.href`, while on server you're using the express native `res.redirect` method.

:::

### Method signature

The redirect method has following signature, while the options object is **available only on server side**:

```javascript
redirect(
  url = '',
  options = {} // Available only on server side
)
```

### url

> `string`

Target redirect URL.

### options

> `object = {}`

Additional options, used to customize redirect server response.

```javascript
{
  httpStatus: 302,
  headers: undefined,
}
```

#### httpStatus

> `number = 302`

Custom redirect http status code.

#### headers

> `object = undefined`

Custom response headers.

## Custom client router listener root element

By default, the router listens for navigation events (clicks on links and browser history changes) on the window object. However, you can also specify custom elements to listen on within the initialization function in `main.js`:

```javascript
ima
  .onLoad()
  .then(() => {
    // Listen for navigation events within specific elements
    const appRoot = document.querySelector('#my-app-root');

    ima.reviveClientApp(getInitialAppConfigFunctions(), appRoot);
  })
  .catch(error => {
    if ($Debug && typeof window !== 'undefined') {
      window.__IMA_HMR?.emitter?.emit('error', { error });
      console.error(error);
    }
  });
```

This is particularly useful when you want to:
- Scope navigation handling to specific parts of your application
- Have multiple independent routed sections on a page
- Integrate IMA.js routing into an existing application
- Handle routing in modals or other isolated UI components

The router will handle clicks on links (`<a>` elements) and popstate events within the specified elements, while ignoring navigation events outside of them. You can add multiple listener roots and manage them independently.

:::info
When cleaning up your application (for example during unmounting) in a non-standard way, make sure to call `unlistenAll()` to properly remove all event listeners. In the default state the  `unlistenAll()` method is called automatically when the instance is destroyed.
:::
