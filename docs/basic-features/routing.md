---
title: Routing
description: Basic features > Routing
---

Routing is an essential part of every application that displays multiple pages. It allows to develop each part of an application separately and add new parts instantly. As it happens to be in MVC frameworks, each route targets specific controller which takes control over what happens next after a route is matched.

![](/img/docs/diagram-router.png)

## Setting up Router

All routes in IMA.js are registered inside the `init` function in `app/config/routes.js`. Same `init` function can be found in `app/config/bind.js`. See [Object Container](./object-container#2-get) documentation for more information about the `oc.get()` function.

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

First argument passed to the `add()` method is **unique route name**. You will use this name when you'll be [creating a link](./routing#linking-to-routes).

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

Next 2 parameters are controller and view class. When a route is matched the assigned Controller goes through its full [lifecycle](./controller-lifecycle) and renders the [View](./views-and-components).

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

- `onlyUpdate` **{boolean\|Function}** - When only the parameters of the current route change an [`update` method](./controller-lifecycle#update-client) of the active controller will be invoked instead of re-instantiating the controller and view. The `update` method receives `prevParams` object containing - as the name suggests - previous route parameters. If you provide function to the `onlyUpdate` option; it receives 2 arguments (instances of previous **controller** and **view**) and it should return **boolean**.
- `autoScroll` **{boolean}** - Flag that signals whether the page should be scrolled to the top when the navigation occurs.
- `allowSPA` **{boolean}** - This flag can be used to make the route be always served from the server and never using the SPA even if the server is overloaded. This is useful for routes that use different document views (specified by the `documentView` option), for example for rendering the content of iframes.
- `documentView` **{?AbstractDocumentView}**.
- `managedRootView` **{?function(new: React.Component)}**.
- `viewAdapter` **{?function(new: React.Component)}**.

## Linking to routes

Creating links is done via the `link()` method on Router. Inside the **Views** and **Components** you can use helper function `this.link()` inherited from `ima/page/AbstractComponent` or `ima/page/AbstractPureComponent`.

> **Note:** Under the hood, `this.link()` is only alias for `this.utils.$Router.link`, where  `this.utils` is taken from `this.context.$Utils`.
>
> For more information about `this.utils` and `$Utils` objects, take a look at the [React Context](./rendering-process#react-context) in the documentation.

```jsx
render() {
  const { user, order } = this.props;

  const orderLink = this.link('order-detail', {
    userId: user.id,
    orderId: order.id
  });

  return <a href={orderLink}>View order</a>
}
```

Linking in **Controllers** requires a few more steps but still is manageable. First you import **Router** via dependencies.

> **Note:** For more info about Dependency Injection see [Object Container](./object-container).

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

## Dynamic routes

Dynamic routes allows you to really take control of **route matching**, **parameters parsing** and **generation of router links**.

They are really powerful and can help you cover those edge cases that cannot be done using regular string defined routes. This can be done by defining custom route matcher in form of a regular expression and custom functions to parse router params from path and, the other way, from route params to path.

> **Note:** The power of dynamic routes comes at a cost. You have to be really sure to define your matchers and function overrides correctly, so you don't end up with false positive route matches. We advise to cover these matches heavily with tests in order to prevent potential failures.

Dynamic routes can be created just like the regular (static routes). The only thing that's different is the `pathExpression`, which is now object consisting of three keys: `matcher`, `toPath` and `extractParameters`:

```javascript
const POST_MATCHER = /([\w-]+)?\/?([\w-]+)?\/post\/(\d+)/i;

router.add('post', {
  matcher: POST_MATCHER,
  extractParameters: path => {
    const parsedPath = POST_MATCHER.exec(path);

    return {
      category: parsedPath[1],
      subcategory: parsedPath[2],
      itemId: parsedPath[3]
    };
  },
  toPath: params => {
    const { category, subcategory, itemId } = params;

    return [category, subcategory, itemId].filter(i => !!i).join('/');
  }
}, UserController, UserView);
```

### PathExpression fields

- `matcher` **{RegExp}** - Regular expression used in route matching. The router tries to match path, stripped from trailing slashes, against this regular expression when trying to match routes to current router path.
- `extractParameters` **{function(string): string}** - Function override used to extract route params from given path. It receives path stripped from trailing slashes as argument. Potential query params are extracted automatically
- `toPath` **{function(Object<string, (number|string)>): object}** - Function override used to create path from given params. It is used mainly in router link creation. It is a good practice to **append any unused params as query params** to the path (you can use static `AbstractRoute.pairsToQuery` helper function to do that).

## Using middlewares

When setting up your routes in `app/config/routes.js` you can also use **router** and **route** middlewares. Middlewares are simple functions that run before/after extraction of route parameters and receive `params` and `locals` variables as their arguments. `params` specifically allows you to modify route params while `locals` is used to pass data between middlewares. Additionally `locals` always contain following keys:

 - `locals.route` - Object, which is equal to currently matched route.
 - `locals.action` - An action object describing what triggered this routing.

> **Note:** Since you have access to the object container (`oc`), you can basically do anything you want in the middlewares. You can easily define authentication middlewares or other restricted-access middlewares since throwing error from the middlewares works as expected.

Middlewares can be defined globally using the `use` method, or as the last argument in the `add` method, which accepts array of middleware functions:

```javascript
import { RouteNames } from '@ima/core';
import HomeController from 'app/page/home/HomeController';
import HomeView from 'app/page/home/HomeView';

export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router
    .use(async (params, locals) => {
      console.log('Matched current route object', locals.route);
      console.log('Global middleware', params, locals);
    });
    .add('home', '/', HomeController, HomeView, {}, [
      async (params, locals) => {
        locals.homeMiddleware = 0;
      },
      async (params, locals) => {
        locals.homeMiddleware++;
      }
    ])
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
}
```

### Middleware execution order

Middleware functions are resolved **from top to bottom sequentially**. In case of the code above, when routing to `home` route, following things would have happened:

 1. **Global middlewares** defined above currently matched route are executed (in this case we have only one global middleware, defined above all routes, so it will be executed for every other route).
 2. **Params extraction** from current path happens based on the matched route.
 3. **Local route** middlewares are executed (with newly extracted route params).

> **Note:** In case of an **error** or not **found page**, the execution order is still **the same**, meaning the global and route middlewares are executed as with any other route.
>
> There's only one exception, since the `locals` object is reset to an empty object before route handling, if an error occurs during route handling and execution is internally passed to error handling (displaying error page), the locals object may retain values that were there for the previous route matching. However the `locals.route` object will still be up to date and equal to currently routed route (error in this case).
