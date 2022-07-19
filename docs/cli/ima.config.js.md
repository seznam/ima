---
title: 'ima.config.js'
description: 'CLI > Customizing the build through ima.config.js'
---

To customize configuration of IMA.js, you can create a `ima.config.js` file in the root of your project (next to package.json).

`ima.config.js` is regular JavaScript file that is required during the build configuration initialization (in Node.js environment) and it is not included in the final application bundle.

An example of `ima.config.js` file can look something like this:

```js title=./ima.config.jsconst fs = require('fs');
const path = require('path');
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

## Webpack config customization

## i18n language files configuration

## Path aliases

## JSX Runtime
## PostCSS customization
## SWC customization
## Additional Options

### SourceMaps

The `sourceMaps` option enables source maps in the production build. Pass `true` or any other string value compatible with [webpack devtool](https://webpack.js.org/configuration/devtool/#devtool) option.

### DevServer Config

### Public path

### Image inline size limit

### Watch options

## Experiments

## CLI Plugins
