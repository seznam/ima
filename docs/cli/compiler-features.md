---
title: 'Compiler Features'
description: 'CLI > Compiler Features'
---

The IMA.js CLI uses [webpack](https://webpack.js.org/) behind the scenes to **compile**, **minify** and run te application in **dev mode**. It comes pre-configured with some options, plugins and loaders which are described in the following sections.

## Server and client bundles

The CLI creates in total of 3 (*2 in dev mode for performance reasons*) webpack compiler instances with their own configurations. One `server` bundle (used in express for SSR) and two client bundles - `client` and `client.es`, where one targets the es11 and the other es13 version of the javascript.

:::tip

To make the CLI build **both es versions** in dev mode, run it with `npx ima dev --legacy` option.

Keep in mind that [hot module replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/) is configured to work only with the latest es version (manual browser reloads are required to see any changes on legacy version).

:::

## JavaScript/React

To bundle JS files we opted to use [swc](https://swc.rs/), which is Rust-based JS compiler. This decision was based on results from testing and measuring build times mainly on larger applications, where we saw 2-3 times the speed benefit of using swc over babel compiler.

By default the application compiles both, the application files (sourced from `./app` folder) and vendor files (sourced from `./node_modules` directory) to make sure that it can run in targeted environments without any issues.

The swc compiler is configured to leverage the power of "env" functionality (preset-env in babel), in combination with [core-js](https://github.com/zloirock/core-js) to **automatically polyfill missing APIs** that are used throughout the codebase, but the targeted environment doesn't support them. This also includes [future ECMAscript proposals](https://github.com/zloirock/core-js#ecmascript-proposals) but in this case **only for the application bundle**.

This configuration can be easily customized using swc field in [ima.config.js](./ima.config.js).

:::tip

This means that you can write your code **using the latest and greatest from the ECMAscript language**, even proposals and the swc makes sure to compile these features down to the latest supported syntax or automatically inject core-js polyfills.

:::

:::warning

Keep in mind that overuse of these may result in larger JS bundles due to the need to inject more core-js polyfills. Also browser APIs like for example `AbortController` or `fetch` are not handled by the core-js and must be included manually. [See polyfills in advanced features section](./advanced-features).

:::

### React

In dev we use the development version of react library (for better debugging) and `react-refresh` for HMR. This is switched to production for production builds. By default the compiler is configured to work with [automatic](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) JSX runtime, so there's no need to import `react` library at top of every jsx file. This can be changed to `classic` in [ima.config.js](./ima.config.js).


## CSS/LESS

There's built in support for CSS and LESS preprocessor. Both of these have the same features and both support [**CSS Modules**](https://github.com/css-modules/css-modules) for files with `*.modules.css` or `*.modules.less` postfixes.

To use any CSS you have to import the files anywhere in your application. These imports are then extracted to single css `app.css` file.

:::tip

`./app/main.js` is a good place to use for global CSS files, since it is an entry point to IMA.js application and these imports will be included at top of the builded `app.css` file.

:::

### `extend-less-loader`

The LESS pipeline uses additional custom loader which enables 2 main features:

1. **Glob imports** - these are resolved through `globby` npm package, so any syntax this package can parse is fully supported:

```less title=./app/less/app.less
@import './mixins/*.less';

/* Non-relative imports are resolved through node resolver. */
@import "@ima/**/atoms/**/*.less";
@import "@ima/**/molecules/**/*.less";
@import "@ima/**/organisms/**/*.less";
```

2. **`globals.less`** - this file is located at `./app/less/globals.less` directory and it is automatically imported on top of every processed LESS file. This means that if you have some mixins or file with global variables, you can import or define these directly in the `globals.less` file. After that you don't need to import these manually in other `*.less` files in case you want to use them, since they're injected automatically.

### PostCSS

IMA.js has built-in support for PostCSS during CSS/LESS compilation.

Out of the box without any additional configuration, it comes pre-configured with following plugins:
1. [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes#readme) - tries to fix all known flexbox issues.
2. [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) - converts modern CSS back into something the old browsers can understand (back to IE11). It comes with: `autoprefixer`, `stage 3` and `custom-properties: false` features.

All these features can be easily customized using `postcss` field in [ima.config.js](./ima.config.js).

## Assets

All other assets are either inlined (base64 encoded) or copied to the `./build/static/media` folder, where import represents public url to this asset.

### Images

Images (bmp, gif, jpeg, png, webp, svg) are automatically inlined if their size is below `imageInlineSizeLimit` which can be configured in [ima.config.js](./ima.config.js) with default value of 8Kb. Images exceeding this size limit are copied to the static media folder and import return's their public URL.

To enforce either one of the two modes, you can use `?external` or `?internal` query parametr in the import path:

```js
// This always converts the image to base64 and inlines it.
import InlineImage from './image.png?inline';

// This always returns image public URl, no matter it's size
import ImageURL from './image.png?external';
```

### Other text files

When you import one of these text files (csv, txt, html), you receive their file contents. Similarly to the images, you can enforce getting their public URL by using the `?external` query parametr.

```js
// Returns file contents in the default import
import IndexSource from './index.html';

// Returns the file public URL
import IndexURL from './index.html?external';
```

### `./app/public` folder

Everything placed into this folder is copied to the `./build/static/public` and available through the express static files route (`http://localhost:3001/static/public`).

## Compression

When you built the application bundle, all static assets are additionally compressed using `brotli` and `gzip` compression. To customize the selection of compression algorithms, take a look [ima.config.js](./ima.config.js) configuration section.
