---
layout: "docs"
title: "Docs - Routing"
---

Routing is an essential part of every application that displays multiple pages. It allows to develop each part of an application separately and add new parts instantly. As it happens to be in MVC frameworks, each route targets specific controller which takes control over what happens next after a route is matched.

<div class="image is-padded-with-shadow">
  <img src="{{ '/img/docs/diagram-router.png?v=' | append: site.github.build_revision | relative_url }}" />
</div>

## Setting up Router

All routes in IMA.js are registered inside the `init` function in `app/config/routes.js`. Same `init` function can be found in `app/config/bind.js`. See [Object Container](/docs/object-container#2-get) documentation for more information about the `oc.get()` function.

```javascript
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

### 1. Route name

First argument passed to the `add()` method is **unique route name**. You will use this name when you'll be [creating a link](/docs/routing#linking-to-routes).

### 2. Route path and parameters

Second argument is a path to be matched. Inside the URL you can use parameter substituions. Parameter name can contain only letters `a-zA-Z`, numbers `0-9`, underscores `_` and hyphens `-` and is preceeded by colon `:`.

```javascript
router.add('order-detail', '/user/:userId/orders/:orderId', OrderController, OrderView);
```

The `userId` and `orderId` parameters are then accessible in `OrderController` via `this.params`.

```javascript
import { AbstractController } from '@ima/core';

class OrderController extends AbstractController {

  // ... Probably construct() with userService and orderSerivce dependencies

  load() {
    let userPromise = this._userService.getUser(this.params.userId);
    let orderPromise = this._orderService.getOrder(this.params.orderId);

    return {
      user: userPromise,
      order: orderPromise
    }
  }
}
```

Parameters can also be marked as optional by placing question mark `?` after the colon `:`.
> **Note:** Optional parameters can be placed only after the last slash. Doing otherwise can cause unexpected behavior.

```javascript
router.add('user-detail', '/profile/:?userId', UserController, UserView);
```

### 3. Controller and View

Next 2 parameters are controller and view class. When a route is matched the assigned Controller goes through its full [lifecycle](/docs/controller-lifecycle) and renders the [View](/docs/views-and-components).

### 4. Options

The last parameter are options for the route.

```javascript
{
  onlyUpdate: false,
  autoScroll: true,
  allowSPA: true,
  documentView: null,
  managedRootView: null,
  viewAdapter: null
}
```

- `onlyUpdate` **{boolean\|Function}** - When only the parameters of the current route change an [`update` method](/docs/controller-lifecycle#update-client) of the active controller will be invoked instead of re-instantiating the controller and view. The `update` method receives `prevParams` object containing - as the name suggests - previous route parameters. If you provide function to the `onlyUpdate` option; it receives 2 arguments (instances of previous **controller** and **view**) and it should return **boolean**. 
- `autoScroll` **{boolean}** - Flag that signals whether the page should be scrolled to the top when the navigation occurs.
- `allowSPA` **{boolean}** - This flag can be used to make the route be always served from the server and never using the SPA even if the server is overloaded. This is useful for routes that use different document views (specified by the `documentView` option), for example for rendering the content of iframes.
- `documentView` **{?AbstractDocumentView}**.
- `managedRootView` **{?function(new: React.Component)}**.
- `viewAdapter` **{?function(new: React.Component)}**.

## Linking to routes

Creating links is done via the `link()` method on Router. Inside the **Views** and **Components** you can use helper function `this.link()` inherited from `ima/page/AbstractComponent` or `ima/page/AbstractPureComponent`. 

> **Note:** Under the hood, `this.link()` is only alias for `this.utils.$Router.link`, where  `this.utils` is taken from `this.context.$Utils`.
>
> For more information about `this.utils` and `$Utils` objects, take a look at the [React Context](/docs/rendering-process#react-context) in the documentation.

```jsx
render() {
  const { user, order } = this.props;

  const orderLink = this.link('order-detail', {
    userId: user.id,
    orderId: order.id
  });

  return <a href={orderLink}>View order</a>
}
```

Linking in **Controllers** requires a few more steps but still is manageable. First you import **Router** via dependencies. 

> **Note:** For more info about Dependency Injection see [Object Container](/docs/object-container).

```javascript
import { AbstractController } from '@ima/core';

export default class DetailController extends AbstractController {

  static get $dependencies() {
    return [
      '$Router'
    ];
  }

  constructor(router) {
    this._router = router;
  }
```

Then you're free to use `this._router.link()` method as you wish, an example would be:

```javascript
load() {
  const detailLink = this._router.link('order-detail', {
    userId: user.id,
    orderId: order.id
  });

  return { detailLink };
}
```
