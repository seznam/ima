---
title: 'Additional features'
description: 'CLI > Advanced CLI techniques and other features'
---

This section describes multiple additional features that are either directly provided by the CLI or indirectly with the help of additional development packages `@ima/hmr-client`, `@ima/error-overlay`, `@ima/dev-utils`.

## Polyfills

Sometimes you may need to include additional custom polyfills to fully support your application in multiple environments. There are multiple ways to achieve this.

### Static files in `public` folder

The easies way, is to put your polyfill files directly into the [app/public](./compiler-features.md#apppublic-folder) folder and load them either by extending the `$Source` configuration in the [app environment](https://github.com/seznam/ima/blob/next/packages/create-ima-app/template/server/config/environment.js#L29) or customizing the application's `DocumentView.jsx` and `spa.html` templates with custom script tags:

```jsx title=./app/document/DocumentView.jsx
{/* ... */}
<body>
  <script src='/static/public/custom-polyfill.js' />
  <div
    id={this.constructor.masterElementId}
    dangerouslySetInnerHTML={{ __html: this.props.page }}
  />
  <script
    id='revivalSettings'
    dangerouslySetInnerHTML={{ __html: this.props.revivalSettings }}
  />
</body>
{/* ... */}
```

### Importing polyfills at top of the `main.js` file

Additionally you can import (or put) polyfills at the top of the `./app/main.js` entry point.

```js title=./app/main.js
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import './less/app.less';

import * as ima from '@ima/core';
import initBindApp from 'app/config/bind';
//...
```

### Optional `polyfill.js` and `polyfill.es.js` entry points

Lastly there are special `polyfill.js` and `polyfill.es.js` files that you can create in the root of the `app` directory. These, when bundled through webpack are available as separate JS files and are not part of the final `app.bundle.js` file.

As with the previous option, you can either import the polyfills from the `node_modules` packages, or use their source code directly, by copying it into this file.

:::info

Both files are **optional**, this means that you can use, either one of those or don't use them at all. Similarly to the first option, don't forget to add the newly generated polyfill.js files somewhere in the source, so they are loaded on app startup.

:::

## IMA.js Runtime

In the [Compiler features](./compiler-features.md#server-and-client-bundles) section, we mentioned that the CLI is compiling 3 separate bundles, mainly two distinct client bundles, where each targets certain `ECMAScript` version. This approach has 2 main advantages:

1. We're still able to support pretty much **every currently supported browser version** (in case of the `es2018` version).
2. We're also serving the latest native version to the modern browsers that support's it (`es2024` version). This **bundle is also much smaller** since it contains very low amount of `core-js` polyfills and should have **better performance**, because native implementations of existing APIs are usually faster than provided polyfills.

You can customize source files for both versions in the `$Source` option of the [app environment](https://github.com/seznam/ima/blob/next/packages/create-ima-app/template/server/config/environment.js#L29) configuration file. This sources definition is then used by the IMA.js Runner, which then **chooses** (*on the client side before app init*) **the most suitable version** for the current browser environment and **injects associated scripts into the DOM**.

This is done by executing few small scripts, where each script target's certain ECMAScript feature. Based on these results, the runner injects the best version of client bundle suitable for that concrete browser environment. It also makes sure to wait until all scripts have loaded before executing the webpack runtime.

This makes sure that all external scripts that the app depends on (*languages*) are loaded correctly before it's execution and allows them to be loaded `async` to **improve page load times**.

### `runner.ejs`

The [IMA.js runner](https://github.com/seznam/ima/blob/next/packages/core/polyfill/runner.ejs) is simple snippet of JS code, that is injected into the page automatically within the app `revivalSettings`. It can be completely customizable by defining the runner overrides on the client window before it is injected into the DOM. It will then merge any existing overrides to the original runner before it's execution.

:::info

The runner script is intentionally written in es5 compatible syntax to make sure, that it can be executed on any environment and report using `onUnsupported` callback, when current browser can't even interpret the `es2018` version of the bundle. In this case the application then runs in **MPA** mode

:::


#### Extending default script

As mentioned before the runner script is fully extensible. For example to implement custom `onUnsupported()` and `onError()` callbacks, you'd do something like this:


```jsx title=./app/document/DocumentView.jsx
<body>
  {/* ... */}
  <script>
    window.$IMA = window.$IMA || {};
    window.$IMA.$Runner = {
      /**
       * Optional onError handler. It is triggered in case the runtime
       * code fails to run the application.
       */
      onError: function (error) {
        throw new Error(error);
      },

      /**
       * Optional onUnsupported handler. It is triggered in case tests
       * for es and legacy version fails, which means that the APP runtime
       * code is never executed.
       */
      onUnsupported: function() {
        // Hit analytics with unsupported browser info
      },
    }
  </script>
  <script
    id='revivalSettings'
    dangerouslySetInnerHTML={{ __html: this.props.revivalSettings }}
  />
</body>
{/* ... */}
```

**Don't forget to apply the same changes to the `spa.html`**, otherwise only SSR rendered pages will contain this override.

:::note

Since you will usually never want to change anything on the IMA.js Runner (apart from the previously mentioned callbacks), we won't go much deeper into it's the [source code](https://github.com/seznam/ima/blob/next/packages/core/polyfill/runner.ejs). You can always [check it here](https://github.com/seznam/ima/blob/next/packages/core/polyfill/runner.ejs) and use it as a reference for custom overrides.

However simply keeping your `@ima/*` dependencies up to will make sure, that you always receive the latest version of the runner script, which may evolve overtime.

:::

### GenerateRuntimePlugin

Since the `webpack` runtime is unique for every built, usually quite small, have to be loaded synchronously (*which can impact the page load performance*) and you would need to manually handle loading it's source code to the DOM, we have created [GenerateRuntimePlugin](https://github.com/seznam/ima/blob/next/packages/cli/src/webpack/plugins/GenerateRunnerPlugin/index.ts) to solve these issues.

This plugin takes care of automatically generating the runtime consisting of the IMA.js runner code and webpack runtime (for both client bundles), which is then **injected directly into the SPA template or SSR rendered html page**. This means that you really don't have to worry about the existence of IMA.js runtime (while it's good to know that it does exist), since the framework handles all the hard work for you.

It also comes with some performance benefits, since inlining these small scripts directly into the HTML removes the need to load additional 2 scripts synchronously, after browser parses the initial DOM.

## Dev server

When you run your app using `npx ima dev` command, apart from building your application in development mode with HMR and all other dev features enabled, the CLI also starts companion express server - the dev server.

By default it runs on `http://localhost:3101` (this can be customized through [ima.config.js](./ima.config.js.md#devserver) or [CLI options](./cli.md#dev-server-options)) and defines middlewares that are used mainly by the `@ima/error-overlay` (to properly display parsed error code snippets). Additionally it uses [webpack-hot-middleware](https://www.npmjs.com/package/webpack-hot-middleware) and [webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware) to **enable support for HMR**.

![](/img/docs/cli-error-overlay.jpg)


Using separate small server to host these middleware doesn't force us to define them directly on the app server, which could essentially produce some errors in certain situations.

:::note

Usually you don't have to think about the dev server during development and can simply pretend that it doesn't exist, since it is handled entirely by the CLI scripts. You can always have a [look at the source code](https://github.com/seznam/ima/blob/next/packages/cli/src/dev-server/devServer.ts) to learn more.

:::note
