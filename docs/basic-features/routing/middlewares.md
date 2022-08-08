---
title: Middlewares
description: Basic features > Routing > Middlewares
---

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
