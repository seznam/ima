---
title: Async Routing
description: Basic features > Routing > Async Routing
---

Async routing allows you to split views and controllers into separate bundes and load them dynamically. This can be usefull for some specific routes, that are not visited regularly and contain large amounts of unique code.

To take advantage of this feature, you simply wrap your [`controller`](./introduction.md#controller) and [`view`](./introduction.md#view) arguments into `async` function which calls a dynamic import():


```javascript title=./app/config/routes.js
import { RouteNames } from '@ima/core';

export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router
    .add(
      'home',
      '/',
      // highlight-next-line
      async() => import('app/page/home/HomeController'),
      // highlight-next-line
      async() => import('app/page/home/HomeView')
    )
}
```

:::tip

When using **default exports**, you don't have to explicitly set the import promise to the default export, the router does this by default.

However when using named exports you need to let the router know, where is the controller/view located in the resolved promise:


```javascript
async() => import('app/page/home/HomeView').then(module => module.HomeView);
```

:::


## Merging view and controller imports into one

Since the method above produces 2 separate JS chunk files (can depend on the actual environment). If you have really small controller and view files, you can help webpack in creating only one small chunk file which usually loads faster.

This can be done by exporting view and controller from the same file:

```javascript title=./app/page/home/index.js
export { default as HomeView } from './HomeView';
export { default as HomeController } from './HomeController';
```

And then merging those two dynamic imports into one:

```javascript title=./app/config/routes.js
import { RouteNames } from '@ima/core';

const homeModules = async () => import('app/page/home');

export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router
    .add(
      'home',
      '/',
      // highlight-next-line
      async () => homeModules().then(module => module.HomeController),
      // highlight-next-line
      async () => homeModules().then(module => module.HomeView)
    )
}
```

## Preloading routeHandlers

Each route handler exposes `preload()` method, which can be used to programatically trigger preload of the dynamic imports for specific route.

:::tip

Use this in situations when the browser is idle and you want to preload some specific route handlers that the user will probably go next. This speeds up the responsiveness of your application dramatically.

:::

To call the `preload()` method, [you first need to get access](./introduction.md#generating-links-outside-of-app-components) to the `Router` instance (we can use `useComponentUtils` hook in this example) and then you can use `getRouteHandler()` method to get specific route handler instance. After that just call `preload()` on this handler:

```jsx title=./app/config/routes.js
import { useComponentUtils } from '@ima/react-hooks';

export default function Card() {
  const { $Router } = useComponentUtils();
  const homeRouteHandler = $Router.getRouteHandler('home');

  useEffect(() => {
    // highlight-next-line
    homeRouteHandler.preload();
  }, [])

  return (
    <a href={$Router.link('home')}>Home</a>
  );
}
```

The method returns a promise, which resolves to tuple of `[controller, view]` instances.

### Prefetching/Preloading modules

As with the [dynamic imports](../../advanced-features/dynamic-imports.md), you can also use [webpack directives](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules) for prefetching and preloading. Simply use the inline commend as it is mentioned in the [webpack documentation](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules).

```javascript title=./app/config/routes.js
// ...
async() => import(/* webpackPrefetch: true */ 'app/page/home/HomeController'),
async() => import(/* webpackPreload: true */ 'app/page/home/HomeView')
// ...
```
