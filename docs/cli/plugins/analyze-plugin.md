---
title: 'Analyze Plugin'
description: 'CLI > CLI Plugins and their API > Analyze Plugin'
---

Pre-configures [bundle-stats-webpack-plugin](https://npmjs.com/package/bundle-stats-webpack-plugin) and [webpack-bundle-analyzer](https://npmjs.com/package/webpack-bundle-analyzer) webpack plugins for fast and easy bundle analyzing.

This plugin provides easy way to **analyze webpack bundle**. Apart from pre-configuring the forementioned plugins, it also outputs `stats.json` file which can be used in multiple other online webpack bundle analyzer tools. For example:

 - [Webpack Chart](https://alexkuz.github.io/webpack-chart/) - interactive pie chart
 - [Webpack Visualizer](https://chrisbateman.github.io/webpack-visualizer/) - visualize and analyze bundle
 - [Bundle optimize helper](https://webpack.jakoblind.no/optimize/) - analyze and optimize bundle
 - [Statoscope](https://statoscope.tech/) - detailed webpack stats analyzer

:::note

The plugin also prints these links directly into the console when the build finishes, for easier acces.

:::

## Installation

```bash npm2yarn
npm install @ima/cli-plugin-analyze -D
```

## Usage

```js title=./ima.config.js
const { AnalyzePlugin } = require('@ima/cli-plugin-analyze');

/**
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  plugins: [new AnalyzePlugin()],
};
```

## CLI Arguments

### --analyze

> `client | client.es | server`

Run the ima build command with `--analyze` argument and pick one of the three produced bundles you want to analyze. For example: `npx ima build --analyze=client`.

## Options

```ts
new AnalyzePlugin(options: {
  open?: boolean;
  bundleStatsOptions?: BundleStatsWebpackPlugin.Options;
  bundleAnalyzerOptions?: BundleAnalyzerPlugin.Options;
});
```

### open

> `boolean = true`

Set to false if you don't want to automatically open the browser window with the html reports when the build finishes.

### bundleStatsOptions

> `object`

Pass any option that the `BundleStatsWebpackPlugin` accepts. These are then merged with some of our custom defaults.

### bundleAnalyzerOptions

> `object`

Pass any option that the `BundleAnalyzerPlugin` accepts. These are then merged with some of our custom defaults.
