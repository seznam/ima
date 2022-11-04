---
title: Configuration options
description: Introduction > IMA.js application configuration options
---

IMA.js offers many ways to configure and customize your application to your needs.
Here's a list describing all possible configuration files and what they do.

## Build and environment configuration

:::info

Environment configuration is resolved on server and passed to the client settings under `config` param.

:::

- `gulpConfig.js` contains configuration for the gulp tasks we use to build and
  run your application.

- `app/main.js` is the bootstrap of your application. You don't need to concern
  yourself with this file usually.

- `app/build.js` specifies which JavaScript, JSX, Less CSS and language files
  your application consists of and should be included in your built
  application.

  ```javascript
  let js = ['./app/!(assets|gulp)/**/!(*Spec).{js,jsx}'];

  let less = [
    './app/assets/less/**/*.less',
    './app/component/**/*.less',
    './app/page/**/*.less'
  ];

  let languages = {
    en: ['./app/**/*EN.json']
  };
  ```

  > **Note:** Files can be specified by a filename expansion as you can see
  above.

  The file also specifies the 3rd party vendor libraries to link as ES2015
  modules in your application, separated into three groups: common (shared),
  server-side and client-side.

  ``` javascript
  let vendors = {
    common: ['ima'],

    server: [],

    client: []
  };
  ```

  Last thing configured in the `app/build.js` file is a list of compiled
  JavaScript and CSS files that should be specified in the main html markup.

  ```javascript
  let bundle = {
    js: ['...'],
    es: ['...'],
    css: ['...']
  };
  ```

- `app/environment.js` configures the server-side environment. Note that the
  `dev` and `test` environment configuration automatically inherits values from
  the `prod` environment (except for the `$Language` which has to be configured
  individually). This configuration is well described in the comments so see
  [the file](https://github.com/seznam/ima/blob/master/packages/create-ima-app/examples/hello/environment.js)
  for full reference.

## Application configuration

- `app/config/services.js` by default this file specifies how the fatal
  application errors should be handled at the client side. Also provides a way
  to configure other application-wide settings or 3rd party libraries
  (analytics, etc.).

- `app/config/routes.js` configures your router, mapping routes to the
  controllers and views in your application. For more information see the
  [Routing](../basic-features/routing/introduction.md) page.

- `app/config/settings.js` configures your application and IMA.js services. You
  can freely extend the configuration as you like except for the properties
  prefixed by dollar sign `$`.
  Note that, again, the `dev` and `test` environment configuration
  automatically inherits values from the `prod` environment.

- and finally, the `app/config/bind.js` configures the
  [Object container](../basic-features/object-container.md).

All of these files are necessary and must remain in their locations.
