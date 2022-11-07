---
title: Dynamic Routes
description: Basic features > Routing > Dynamic Routes
---

Dynamic routes allows you to really take control of **route matching**, **parameters parsing** and **generation of router links**.

They are really powerful and can help you cover those edge cases that cannot be done using [regular string defined routes](./introduction.md#setting-up-router).

This can be achieved by defining **custom route matcher** in form of a **regular expression** and custom functions to parse router params from path and, the other way, from route params to path.

:::note

The power of dynamic routes comes at a cost. You have to be really sure to define your matchers and function overrides correctly, so you don't end up with false positive route matches. We advise to cover these matches heavily with tests in order to prevent potential failures.

:::

## Creating Dynamic Routes

Dynamic routes can be created just like the regular (static routes). The only thing that's different is the [`pathExpression`](./introduction.md#pathexpression) positional argument, which is now object with three properties: `matcher`, `toPath` and `extractParameters`.

The following example parses `/category/subcategory/post/124` url formats with optional categories, and exract them along with the post `itemId`:

```js title=./app/config/routes.js
import { AbstractRoute } from '@ima/core';

import PostController from 'app/page/post/PostController';
import PostView from 'app/page/post/PostView';

const POST_MATCHER = /([\w-]+)?\/?([\w-]+)?\/post\/(\d+)/i;

export let init = (ns, oc, config) => {
  const router = oc.get('$Router');

  router.add(
    'post',
    {
      matcher: POST_MATCHER,
      extractParameters: path => {
        const [match, category, subcategory, itemId] = POST_MATCHER.exec(path);

        return {
          category,
          subcategory,
          itemId,
        };
      },
      toPath: params => {
        const { category, subcategory, itemId, ...restParams } = params;

        return [category, subcategory, itemId].filter(i => !!i).join('/') +
          AbstractRoute.paramsToQuery(restParams);
      }
    },
    PostController,
    PostView
  );
}
```

:::info

Notice that in the `toPath` function, we're appending other unused params to the final path as query params. This is to mimic the same functionality as the [`StaticRoutes`](../../api/classes/StaticRoute.md) provide by default.

To make this process easier you can use the `AbstractRoute.paramsToQuery()` helper method, which filters and transforms object key-value pairs to query params string.

:::

### matcher

> `RegExp`

Regular expression used in route matching. The router tries to match **path**, **stripped from trailing slashes**, against this regular expression.

### extractParameters

> `function(string): Object<string, (number|string)>`

Function used to extract route params from given path. It receives path stripped from trailing slashes and query params as first argument. If the path contains any query params, **they are extracted automatically** and merged with the final params object this function returns.

### toPath

> `function(Object<string, (number|string)>): object`

Function used to create path from given params (including query params). It is used mainly in the [router link creation](./introduction.md#linking-between-routes).

:::note

It is a good practice to **append any unused params as query params** to the path (you can use the static `AbstractRoute.paramsToQuery()` static helper to do that).

:::
