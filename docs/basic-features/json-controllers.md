---
title: JSON Controllers
description: Basic features > JSON Controllers and Server-Only Code
---

# JSON Controllers and Server-Only Code

IMA.js supports server-only controllers that can return JSON responses directly, without rendering HTML. This is achieved by setting the `$responseType` to `'json'` on the controller.

This feature is useful for API-like routes within your IMA application. By using `'use server'` directive, you can optimize bundle size by preventing server-specific code from being shipped to the client.

## Setting Up a JSON Controller

To create a server-only JSON controller:

1. Add the `'use server'` directive at the top of your controller file *(optional but recommended)*.
2. Set the static `$responseType` property to `'json'` on your controller class.
3. Implement the `load` method to return the JSON data. **Everything returned from the `load` method will be sent as JSON response.**

### Example

```javascript
'use server';

import { AbstractController, GenericError } from '@ima/core';

export default class JsonController extends AbstractController {
  static $responseType = 'json';

  async load() {
    return {
      data: 'This is JSON data from the server',
    };
  }
}
```

## Routing

Define routes for your JSON controllers as usual, but they will now return JSON instead of HTML.

```javascript
export const initRoutes = (ns, oc, routesConfig, router) =>
  router
    .add('json', '/json', JSONController, () => null);
```

:::tip
Use anonymous function that returns `null` to avoid creating a view for the controller.
:::

When accessing `/json`, the server will respond with JSON from the `load` method.

## The 'use server' Directive

The `'use server'` directive indicates that the file contains server-only code. During the build process:

- On the server bundle, the code remains intact.
- On the client bundle, the code is stubbed out:
  - Controller `load` methods throw a 404 error if called.
  - Other exports are replaced with stubs that throw errors when invoked.

This prevents server-only logic from leaking to the client and reduces bundle size.

### Current Limitations

- While this works for any file in the bundle, the primary use case is for JSON controllers.
- It stubs any exports from the file, removing implementations in client bundles.
- Ensure routes using these controllers are properly configured in your router.

### Error Handling

If a client attempts to load a server-only controller, it will throw a `GenericError` with a 404 status.

For more details on error handling, see [error-handling.md](./error-handling.md).

## Best Practices

- Use this for API endpoints within your Application.
- Combine with authentication and authorization as needed.
- Test server and client behaviors separately.

This feature enhances IMA.js's flexibility for mixed SSR and API scenarios while maintaining optimal client bundles.
