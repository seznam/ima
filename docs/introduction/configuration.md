---
title: Configuration options
description: Introduction > IMA.js application configuration options
---

IMA.js offers many ways to configure and customize your application to your needs.

Make sure this file is included in your `tsconfig.json`. This will provide proper type-checking and autocomplete for your custom environments within the IMA.js application.

Here's a list describing all possible configuration files and what they do.

## Build and environment configuration

:::info

Environment configuration is resolved on server and passed to the client settings under `config` param.

:::

- `app/main.js` is the bootstrap of your application, initializing your application. You don't need to concern yourself with this file usually.

- `server/config/environment.js` configures the server-side environment. Note that the
  `dev` and `test` environment configuration automatically inherits values from
  the `prod` environment. This configuration is well-described in the comments, so see
  [the file](https://github.com/seznam/ima/blob/master/packages/create-ima-app/template/common/server/config/environment.js)
  for a full reference.

## Application configuration

- `app/config/services.js` by default this file specifies how the fatal
  application errors should be handled at the client side. It also provides a way
  to configure other application-wide settings or 3rd party libraries
  (analytics, etc.).

- `app/config/routes.js` configures your router, mapping routes to the
  controllers and views in your application. For more information, see the
  [Routing](../basic-features/routing/introduction.md) page.

- `app/config/settings.js` configures your application and IMA.js services. You
  can freely extend the configuration as you like except for the properties
  prefixed by a dollar sign `$`.
  Note that, again, the `dev` and `test` environment configuration
  automatically inherits values from the `prod` environment.

- `app/config/bind.js` configures the
  [Object container](../basic-features/object-container.md).

All of these files are necessary and must remain in their locations.

## Environments

By default, IMA.js comes with three predefined environments: `prod`, `dev`, and `test`. The application automatically selects one based on the `NODE_ENV` environment variable. The `dev` and `test` environments inherit settings from the `prod` environment, allowing you to only specify the differences.

For more complex use cases, for example, if you need `beta` or `stage` environments that are built with `NODE_ENV=production` but use a different set of configurations, you can use the `IMA_ENV` environment variable.

The `IMA_ENV` variable has precedence over `NODE_ENV` when determining which configuration to load from your `environment.js` and `config/settings.js` files.

For example, to run your application using a `beta` environment configuration, you would define it in `environment.js` and `config/settings.js`, and then run your application like this:

```sh
ima build && IMA_ENV=beta NODE_ENV=production ima start
```

### TypeScript support

When using TypeScript and defining custom environments, you'll need to update IMA.js's type definitions to include your new environments. This can be achieved using module augmentation.

First, create a new type definition file, for example `types/ima-environment.d.ts`, and add the following content, replacing `beta` and `stage` with your custom environment names:

```typescript
// types/ima-environment.d.ts
import {
  Environment,
  Settings,
} from '@ima/core';
import type { PartialDeep } from 'type-fest';

declare module '@ima/core' {
  interface AppEnvironment {
    beta?: PartialDeep<Environment>;
    stage?: PartialDeep<Environment>;
  }

  interface AppSettings {
    beta?: PartialDeep<Settings>;
    stage?: PartialDeep<Settings>;
  }
}

// This is needed to not completely override the core types
export {};
```
