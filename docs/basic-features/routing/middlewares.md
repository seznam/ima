---
title: Middlewares
description: Basic features > Routing > Middlewares
---

Middlewares are simple functions that run before/after route handlers. They can be used to restrict access to certain set of routes or act based on parsed route params.

There are two types of middleware **global** and **local**. As the names suggest the first one is defined globally on the router instance using `use()` method and the second type is bound to specific route and is defined in the route `options.middlewares` property.

```javascript title=./app/config/routes.js
// The imports are stripped for compactness.
export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router
    .use(async (params, locals) => {
      console.log('Global middleware', params, locals, locals.route, locals.action);
      locals.counter = 0;
    });
    .add('home', '/', HomeController, HomeView, {
      middlewares: [
        async (params, locals, next) => {
          next({ counter: counter++ });
        }
      ]
    })
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
}
```

:::tip

Since you have access to the object container (`oc`), you can basically do anything you want in the middlewares.

You can easily define authentication middlewares or access-restricting middlewares since throwing an error from the middleware is handled the same way as any other error in the application.

:::

## Function arguments

Each middleware can be **async** and the functions can use up to three arguments: `params`, `locals` and `next`. `params` specifically allows you to modify route params, `locals` is used to pass data between middlewares and `next` callback provides additional

### params

> `object = {}`

Contains route params extracted by the **currently matched route handler**. Can be empty if there was no route match before execution of concrete middleware.

### locals

> `RouteLocals = {}`

Mutable object you can use to pass data between middlewares. It is passed across all middlewares, so anything you define here, is available in following middleware functions.

:::tip

In addition to mutating the original object, you can also **return object values from middlewares** or pass them as an argument in the `next()` function. These are then merged into the `locals` upon it's execution.

```js
async (params, locals) => {
  locals.counter++;
}

// or

async (params, locals) => {
  return { counter: counter++ };
}

// or

async (params, locals, next) => {
  next({ counter: counter++ });
}
```

:::

Additionally it always contains following keys:

#### route

> `AbstractRoute`

Instance of currently matched route.

#### action

> `RouteAction = {}`

An action object describing what triggered this routing (can be empty).

### next

> `(result?: object) => void`

When called, this function (as the name suggest) allows you to continue with execution of other route handlers. Apart from other frameworks that use similar feature, when you define `next` argument in your middleware, **you have to execute it in order to continue**. Otherwise the router will not proceed any further even if the middleware function content finished it's execution.

This is intentional as it allows you to have more control over the middleware execution and gives you ability to stop the routing process completely.

:::tip
This is can be usefull in situations when for example you want to do a redirect, which is synchronous but takes a while until the window is reloaded. Without stopping the middleware execution (by defining the `next` callback and not calling it), you could get a glimpse of Error Page that is rendered before the redirect takes places, because the router continued it's processing.

```js
async (params, locals, next) => {
  if (await oc.get('User').isLoggedIn()) {
    // Continue normally
    return next();
  }

  // Stop execution by not calling `next()` and do a redirect
  oc.get('$Router').redirect('/');
}
```
:::

## Execution order

Middleware functions are resolved **from top to bottom sequentially**. In case of the code above, when routing to `home` route, following things would have happened:

 1. **Global middlewares** defined above currently matched route are executed (in this case we have only one global middleware, defined above all routes).
 2. **Params extraction** from currently matched route handler (home) is executed.
 3. **Local route** middlewares are executed (with newly extracted route params).

In case of an **error** or not **found page**, the execution order is still **the same**, meaning the global and route middlewares are executed as with any other route.

:::caution

There's only one exception, since the `locals` object is cleared to an empty object before route handling, if an error occurs during route handling and execution is internally passed to error handling (displaying error page), the locals object may retain values that were there for the previous route matching. However the `locals.route` object will still be up to date and equal to currently routed route (error in this case).

:::

## Execution timeout

To prevent middlewares from freezing the application, for example when the middlewares takes too long to execute, we've implemented execution timeout, which prevents them from running indefinitely.

You can **customize the timeout value** in app settings:

```js title="./app/config/settings.js"
export default (ns, oc, config) => {
  return {
    prod: {
      $Router: {
        middlewareTimeout: 30000, // ms
      },
    },
  };
};
```
