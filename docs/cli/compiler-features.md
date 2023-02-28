---
title: 'Compiler features'
description: 'CLI > Compiler features'
---

The IMA.js CLI uses [webpack](https://webpack.js.org/) behind the scenes to **compile**, **minify** and **run** the application in **dev mode**. It comes pre-configured with some options, plugins and loaders, which are described in the following sections.


## Server and client bundles

The CLI creates 3 separate bundles (*2 in dev mode for performance reasons*) with their own configurations. One `server` bundle (used in express for SSR) and two client bundles - `client` and `client.es`, where one targets the `es2018` and the other `es2022` version of the javascript.

This can be further customized using the [**`disableLegacyBuilt` option in `ima.config.js`**](./ima.config.js.md#disablelegacybuild).

:::tip

To make the CLI build **both es versions** in dev mode, run it with `npx ima dev --legacy` option.

Keep in mind that [hot module replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/) is configured to work only with the latest es version (manual browser reload is required to see any changes on the legacy version).

:::

## Filesystem Cache

The webpack [filesystem cache](https://webpack.js.org/configuration/cache/#cache) feature is enabled by default to improve consecutive build times in development and production mode.

The CLI automatically generates cache key based on used set of CLI options, which somehow affect the produced output. Not all options affect cache key generation, however you may notice that sometimes the build speeds can behave as if there is no filesystem cache. To see which options affect the cache key generation, [take a look at the `createCacheKey()` function](https://github.com/seznam/ima/blob/next/packages/cli/src/webpack/utils.ts#L154).

:::note

Note that each command and bundle maintains it's own set of coexisting cache. To clear the cache, use `--clearCache` option in `build` or `dev` commands.

:::

## JavaScript/React

To bundle JS files we opted to use [swc](https://swc.rs/), a Rust-based JavaScript compiler. This decision was based on our results from testing and measuring build times, where we saw 2-3 times the speed benefit (depending on the application size) of using swc over babel compiler.

By default the application **compiles both**, the **application files** (sourced from `./app` folder) and **vendor files** (sourced from `./node_modules` directory) to make sure that it can run in targeted environments without any issues.

The swc compiler is configured to leverage the power of "env" functionality (preset-env in babel), in combination with [core-js](https://github.com/zloirock/core-js) to **automatically polyfill missing APIs** that are used throughout the codebase, that the targeted environment doesn't support.

This configuration can be easily customized using [swc option in ima.config.js](./ima.config.js#swc).

:::note

This means that you can write your code **using the latest and greatest from the ECMAscript language** and the swc makes sure to compile these features down to the latest supported syntax or automatically inject core-js polyfills.

:::

:::warning

Keep in mind that overuse of these may result in larger JS bundles due to the need to inject more core-js polyfills. Also browser APIs like for example `AbortController` or `fetch` are not handled by the core-js and must be included manually. [See polyfills in advanced features section](./advanced-features#polyfilljs).

:::

### React

In dev we use the development version of react library (for better debugging) and `react-refresh` for HMR. This is switched to production for production builds. By default the compiler is configured to work with [automatic](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) JSX runtime, so there's no need to import `react` library at top of every jsx file. This can be changed to `classic` in [ima.config.js](./ima.config.js.md#jsxruntime).

## Typescript

From IMA.js v18 we introduced **support for Typescript in your application code**. To enable it, first you need to add `typescript` to your app dependencies:

```bash npm2yarn
npm i -D typescript
```

Now create `tsconfig.json` file (that may look something like this):

```json title=./tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "target": "ES2022",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ES2022",
    "moduleResolution": "Node16",
    "strict": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "outDir": "./build/ts-cache",
    "paths": {
      "app/*": [
        "app/*"
      ],
    }
  },
  "include": ["./app/**/*"],
  "exclude": ["./**/__tests__"]
}
```

:::tip

You can also easily create a typescript base IMA.js application using `--typescript` cli argument when running `create-ima-app` command:

```bash npm2yarn
npx create-ima-app ~/Desktop/ima-ts --typescript
```

:::

When CLI detects existence of the `tsconfig.json` file, it automatically starts **type checking** and **compiling** files with `*.ts` and `*.tsx` extensions.

Keep in mind that the code is still compiled using [swc](https://swc.rs/), the same way JS code is. This means that certain settings in `tsconfig.json` only applies to type checking (like `target`, `moduleResolution`, etc.), but compilation uses it's own settings to match the JS code.

:::note

You will also probably need to install additional `@types/*` type definition libs to ensure proper support, like react types:

```bash npm2yarn
npm i -D @types/react @types/react-dom
```

:::


## CSS/LESS

There's built in support for CSS and LESS preprocessor. Both of these have the same featureset. To use any CSS you have to import the files anywhere in your application. These imports are then combined and extracted to single `app.css` file.

:::tip

`./app/main.js` is a good place to use for global CSS files, since it is an entry point to IMA.js application and these imports will be included at top of the built `app.css` file.

:::


### CSS Modules
Both loaders fully support [CSS Modules](https://github.com/css-modules/css-modules) for files with `*.modules.css` or `*.modules.less` postfixes, with `local` as default scoping.

```less title=./app/page/home/home.module.less
:global {
  :root: {
    --bg-color: #fff;
  }
}

.home {
  background: var(--bg-color);
}
```

```jsx title=./app/page/home/Home.jsx
import styles from './home.module.less';

function Home() {
  return
    <div className={styles.home}>HomePage</div>
  );
}
```

### globals.less

This file is located at `./app/less/globals.less` and it is automatically imported on top of every other processed LESS file. It allows you to easily share globals across less files.

:::tip

Use this file to import other **mixins** and **global variables** which are then available in all other *.less files automatically, without the need to import them explicitly.

```less title=./app/less/globals.less
@import './mixins/*.less';

@global-red: red;
```

```less title=./app/less/app.less
body {
  // No direct import of 'globals.less' is needed.
  background: @global-red;
}
```

:::

### Glob less imports
The `less-loader` uses [less-plugin-glob](https://github.com/just-boris/less-plugin-glob) by default in it's configuration. This means that glob imports are fully supported.

```less title=./app/less/app.less
@import './mixins/*.less';

/* Non-relative imports are resolved through node resolver. */
@import "@ima/**/atoms/**/*.less";
@import "@ima/**/molecules/**/*.less";
@import "@ima/**/organisms/**/*.less";
```

### PostCSS

IMA.js has built-in support for [PostCSS](https://postcss.org/) during CSS/LESS compilation.

Out of the box without any additional configuration, it comes pre-configured with following plugins:
1. [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes#readme) - tries to fix all known flexbox issues.
2. [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) - converts modern CSS back into something the old browsers can understand (back to IE11). It comes with: `autoprefixer`, `stage 3` and `custom-properties: false` features.

All these features can be easily customized using `postcss` option in [ima.config.js](./ima.config.js.md/#postcss).

## Assets

All other assets are either **inlined** as **base64 encoded string** or copied to the `./build/static/media` folder, where default import represents assets's public URL.

### Images

Images (bmp, gif, jpeg, png, webp, svg) are automatically inlined if their size is below `imageInlineSizeLimit`, which can be configured in [ima.config.js](./ima.config.js.md#imageinlinesizelimit), with default value of **8Kb**. Images exceeding this size limit are copied to the static media folder and import return's their public URL.

To enforce either one of the two modes, you can use `?external` or `?inline` query parameter in the import path:

```js
// This always converts the image to base64 encoded string and inlines it.
import InlineImage from './image.png?inline';

// This always returns image public URL, no matter it's size
import ImageURL from './image.png?external';
```

### Text files

When you import one of these text files - csv, txt, html, you receive their contents. Similarly to the images, you can enforce getting their public URL by using the `?external` query parameter.

```js
// Returns file contents in the default import
import IndexSource from './index.html';

// Returns the file public URL
import IndexURL from './index.html?external';
```

### `./app/public` folder

Everything in this folder is copied to the `./build/static/public` and available through the express static files route (`http://localhost:3001/static/public/`).

## Compression

When you built the application bundle, all static assets are additionally compressed using `brotli` and `gzip` compression (with `.br` and `.gz` extensions respectively). To customize this behavior, take a look at [ima.config.js](./ima.config.js.md#compress) configuration section.


## Languages

The [language files](ima.config.js.md#languages) are compile using [messageformat](http://messageformat.github.io/messageformat/) library.
