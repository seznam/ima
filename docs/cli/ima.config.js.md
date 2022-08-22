---
title: 'ima.config.js'
description: 'CLI > Customizing the build through ima.config.js'
---

To additionally customize the build configuration of IMA.js, you can create a `ima.config.js` file in the root of your project (next to package.json).

`ima.config.js` is regular JavaScript module that is loaded during the build configuration initialization (in Node.js environment) and **it is not included in the final application bundle**.

An example of `ima.config.js` file can look something like this:

```js title=./ima.config.js
const postcssUnmq = require('postcss-unmq');
const { AnalyzePlugin } = require('@ima/cli');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  publicPath: '/public/',
  watchOptions: {
    ignored: /(node_modules|build|.husky|_templates|.git)\/(?!@ima).*/
  },
  plugins: [
    new AnalyzePlugin()
  ],
  webpack: async (config, ctx) => {
    // Enable webpack infrastructure logging
    if (ctx.command === 'dev') {
      config.infrastructureLogging = 'info';
    }

    return config;
  },
  postcss: (config, ctx) => {
    config.postcssOptions.plugins.push(postcssUnmq({ width: 540 }));

    return config;
  },
  languages: {
    cs: [
      './node_modules/@ima/**/*CS.json',
      './app/**/*CS.json'
    ],
    en: [
      './node_modules/@ima/**/*EN.json',
      './app/**/*EN.json'
    ]
  }
};
```


:::tip

Use the `@type` jsdoc annotation to enable ts-types code completions.

:::

## Configuration options

The `ima.config.js` file should export an object with any combination of the following configuration options.


### webpack

> `async function(config, ctx, imaConfig): config`

This is the most advanced and versatile configuration option, allowing you to change the generated webpack configuration directly before it's passed to the compiler. This function is executed last in the whole configuration pipeline, meaning that all default configurations and CLI plugin configurations are already merged into the config value. This allows you to completely customize the final config form.

The function receives **3 arguments** and has to always return (mutated) config object:
 - `config` - webpack configuration object (just like the one you usually define in webpack.config.js).
 - `ctx` - current configuration context. As we mentioned in the [compiler features](./compiler-features#server-and-client-bundles), the app builds 3 different bundles. Using `ctx.name` you can find out which configuration you are currently editting. There are many additional values that help you identify current build state. You can use these to further customize the config only in some cases or for certain bundles. For more information take a look at the [argument type](https://github.com/seznam/ima/blob/packages/cli/src/types.ts#L47).
 - `imaConfig` - loaded `ima.config.js` file, with defaults.

The following example turns on minification for server bundle for build command:

```js title=./ima.config.js
/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  webpack: async (config, ctx) => {
    if (ctx.command === 'build' && ctx.name === 'server') {
      config.optimization.minimize = true;
    }

    return config;
  },
};
```

### swc
> `async function(swcLoaderOptions, ctx): swcLoaderOptions`

Similarly to `webpack`, this function is executed with the `swc-loader` [default options](https://github.com/seznam/ima/blob/packages/cli/src/webpack/config.ts#L401) and it's result is then passed to the loader itself. This allows you to customize the swc compiler options in easier and more direct way than you'd have to do when using the `webpack` option.

For example, to disable bundling of core-js files for the ECMAScript proposals, you would do the following:

```js title=./ima.config.js
/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  swc: async (swcLoaderOptions, ctx) => {
    swcLoaderOptions.env.shippedProposals = false;

    return swcLoaderOptions;
  },
};
```

:::note

To see all possible options the swc compiler supports, take a look at the [documentation](https://swc.rs/docs/configuration/compilation).

:::

### postcss
> `async function(postCssLoaderOptions, ctx): postCssLoaderOptions`

Lastly, this function is used to customize the `postcss-loader` options. Among the rest you can easily define **custom PostCSS plugins** or completely overwrite the [default set](./compiler-features.md#postcss):

```js title=./ima.config.js
const postcssUnmq = require('postcss-unmq');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  swc: async (postCssLoaderOptions, ctx) => {
    postCssLoaderOptions.postcssOptions.plugins.push(
      postcssUnmq({ width: 540 })
    );

    return postCssLoaderOptions;
  },
};
```

:::info

The webpack configuration intentionally ignores any **.postcssrc** configuration files to prevent potential conflicts with multiple config files.

:::

### languages

> `object`

**i18n** language files configuration. The `language` option expects an object with key/value pairs, where key represents the language and value an array of [messageformat](http://messageformat.github.io/messageformat/) compliant JSON files. For more information about localization, see the [dictionary](../basic-features/dictionary) section.

:::note

**Globs** are fully supported and resolved through [globby](https://www.npmjs.com/package/globby) npm package.

:::

```js title=./ima.config.js
/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  languages: {
    cs: [
      './node_modules/@ima/**/*CS.json',
      './node_modules/@cns/**/*CS.json',
      './app/**/*CS.json'
    ],
    en: [
      './node_modules/@ima/**/*EN.json',
      './node_modules/@cns/**/*EN.json',
      './app/**/*EN.json'
    ]
  }
}
```

### jsxRuntime

> `'classic' | 'automatic' = 'automatic'`

Use `jsxRuntime` option to enable `classic` or `automatic` mode for jsx transformations. For more information see [Introducing the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

### webpackAliases

> `object`

The `webpackAliases` options is passed directly to the webpack [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias) configuration. You can use this to define additional path aliases to the already existing `app/*` alias, which points to the `./app` directory.

To have the ability to use absolute paths, which are resolved from the `./app/components` and `./app/pages` directory:

```javascript
import Home from 'components/home/Home';
import DetailView from 'pages/detail/DetailView';
```

The  `webpackAliases` option configuration could look something like this:

```javascript title=./ima.config.js
const path = require('path');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  webpackAliases: {
    'components': path.resolve('./app/components'),
    'pages': path.resolve('./app/pages'),
  };
};
```

### sourceMaps

> `boolean | string = false`

The `sourceMaps` option enables source maps in the production build. Use `true` for `'source-map'` or any other string value compatible with [webpack devtool](https://webpack.js.org/configuration/devtool/#devtool) option.

### devServer

> `object`

Similarly to the [CLI options](./cli#dev-server-options), you can use the `devServer` option to override defaults for our [companion dev server](./advanced-features.md#dev-server).


```javascript title=./ima.config.js
/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  devServer: {
    port: 3101;
    hostname: 'localhost';
    publicUrl: 'http://localhost:3101';
  };
};
```

:::note

The CLI arguments always take precedence over any other configurations.

:::

### publicPath

> `string = '/'`

The `publicPath` option is used to specify base path for all asses within the application. (see more at [webpack public path](https://webpack.js.org/guides/public-path/)).

:::tip

Use this option for example in cases of asset upload to CDN, when the CDN URL is known beforehand (the public path can't be changed after the app is already built).

If you want to serve your static files on different route (default is `/static`), customize the `staticFolder` option in `./server/config/environment.js` file and change `publicPath` option accordinly:

```javascript title=./server/config/environment.js
module.exports = (() => {
  return {
    prod: {
      $Server: {
        /**
         * The built static files are served on the
         * http://localhost:3001/pro/static base url
         */
        staticFolder: '/pro/static',
      }
    }
  }
});
```

```javascript title=./ima.config.js
/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  /**
   * We already serve from static folder, so it is included in the
   * final baseURL and we just need to add the `pro` prefix.
   */
  publicPath: '/pro/',
};
```

:::

### compress

> `boolean = true`

Enables brotli and gzip compression for production assets (in build command). Set to false to disable this feature.

### imageInlineSizeLimit

> `number = 8192`

The `imageInlineSizeLimit` configuration option is already described in the [compiler features](./compiler-features#images) section. Essentially it's a image size threshold for it's automatic inlining as a base64 string.

### disableLegacyBuild

> `boolean`

Set to true to disable building of the `client` bundle (older ECMAScript target).

**Don't forget** to remove `script` sources from the `$Source` option in [app environment](https://github.com/seznam/ima/blob/next/packages/create-ima-app/template/server/config/environment.js#31) config

:::caution

The application will now only execute the modern version of the client bundle (`client.es`), meaning that the it will only work on the latest versions of modern browsers.

This can be usefull if you're building an app, where you are able to set constrains for the supported browsers (e.g. internal admin page).

:::

### watchOptions

> `object`

`watchOptions` is an object, passed to the webpack watch compiler. You can customize `watchOptions.ignored` files settings or `watchOptions.aggregateTimeout` if you have any issues with the default values.

For more information visit the [webpack documentation](https://webpack.js.org/configuration/watch/#watchoptions).

:::tip

If you have any issues with webpack compilation launching multiple times per one file save, try to increase the `watchOptions.aggregateTimeout` number and see if it helps.

:::

### experiments

> `object`

This is a place where you can enable IMA.js configuration experiments. Don't confuse this with the webpack experiments field, this is used only for our potential future configuration updates or changes, which may be enabled by default in the future (much like webpack does).

Currently there's only one running experiment option `experiments.css`, that uses webpack native CSS support which completely replaces the `css-loader` and `mini-css-extract-plugin` libraries.

### plugins

> `ImaCliPlugin[]`

Array of IMA.js CLI plugin instances. For more information about CLI plugins, see [Plugins API](./plugins-api.md) section.
