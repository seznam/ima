---
title: Dynamic Routes
description: Basic features > Routing > Dynamic Routes
---

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
