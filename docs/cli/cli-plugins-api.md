---
title: 'CLI Plugins API'
description: 'CLI > CLI Plugins and their API'
---

The CLI comes with built-in support for plugins. Plugins are used to **extend** or **modify** existing webpack config very easily or even run some pre/post processing scripts during the build process.

The CLI plugin is usually a class or an object implementing `ImaCliPlugin` interface. This instance is then added to the [plugins](./ima.config.js.md#plugins) array field in the `ima.config.js`, which registers the plugin to the build process. Additionally to extending the webpack config, you have ability to provide additional custom CLI arguments.

## CLI Plugins API

Each plugin has to comply with the [following interface](https://github.com/seznam/ima/blob/next/packages/cli/src/types.ts#L56). Even though almost v everything method is not required and marked as optional, your plugin should implement at least one of the following methods in order to be of any use. Otherwise it would still work but the plugin would not do anything.

```typescript
/**
 * Interface for ima/cli plugins that can be defined in plugins field in ima.conf.js. These can be used
 * to extend functionality of default CLI with custom cli arguments and webpack config overrides.
 */
export interface ImaCliPlugin {
  /**
   * Plugin name, used mainly for better debugging messages.
   */
  readonly name: string;

  /**
   * Optional additional CLI arguments to extend the set of existing ones.
   */
  readonly cliArgs?: Partial<Record<ImaCliCommand, CommandBuilder>>;

  /**
   * Optional plugin hook to do some pre processing right after the cli args are processed
   * and the imaConfig is loaded, before the webpack config creation and compiler run.
   */
  preProcess?(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void>;

  /**
   * Called right before creating webpack configurations after preProcess call.
   * This hook lets you customize configuration contexts for each webpack config
   * that will be generated. This is usefull when you need to overrite configuration
   * contexts for values that are not editable anywhere else (like output folders).
   */
  prepareConfigurations?(
    configurations: ImaConfigurationContext[],
    imaConfig: ImaConfig,
    args: ImaCliArgs
  ): Promise<ImaConfigurationContext[]>;

  /**
   * Webpack callback function used by plugins to customize/extend ima webpack config before it's run.
   */
  webpack?(
    config: Configuration,
    ctx: ImaConfigurationContext,
    imaConfig: ImaConfig
  ): Promise<Configuration>;

  /**
   * Optional plugin hook to do some custom processing after the compilation has finished.
   * Attention! This hook runs only for build command.
   */
  postProcess?(args: ImaCliArgs, imaConfig: ImaConfig): Promise<void>;
}
```

## Creating a CLI plugin

In this section we're going to create custom plugin, which generates assets manifest json file. To achieve this we'll use [WebpackManifestPlugin](https://webpack.js.org/plugins/webpack-manifest-plugin/) and extend our webpack config. We'll also define some additional CLI arguments that will enable us to overwrite certain settings on demand.

First we're going to install the `webpack-manifest-plugin`:

```bash npm2yarn
npm install webpack-manifest-plugin -D
```

Then we need to define base class for our new CLI plugin. To make things easier we're going to work directly in the `ima.config.js` but in reality you'd be better of creating separate npm package for easier sharing between multiple IMA.js projects.

```js title=./ima.config.js
class CliManifestPlugin {
  name = 'CliManifestPlugin';

  webpack(config, ctx, imaConfig) {}
}

module.exports = {
  plugins: [new CliManifestPlugin()],
};
```

### Extending the webpack config

Now we're going to initialize our manifest plugin. But we only want to do this when we are building the final bundle using the `build` command. For that we can use the `ctx: ImaContext` variable, which contains multiple flags and values describing current build context. One of those values is `ctx.command` which can be either `dev` or `build`.

We are also going to make sure that we can provide options to our CLI plugin that are in this case passed directly to the webpack plugin.

```js title=./ima.config.js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

class CliManifestPlugin {
  //...
  #options = {};

  constructor(options) {
    this.#options = options;
  }

  webpack(config, ctx, imaConfig) {
    if (ctx.command === 'build') {
      config.plugins.push(new WebpackManifestPlugin(this.#options));
    }

    return config;
  }
  //...
}
```

:::tip

Feel free to print the `ctx` object into the console and examine it's properties.

Similarly to the `ctx` you can also use the `imaConfig` parameter, which contains loaded `ima.config.js` file. You can use this feature to have some additional custom plugin-specific definitions in the `ima.config.js` file too, or use existing settings for some additional functionality.

:::

We're now going to use these options and pass [seed](https://github.com/shellscape/webpack-manifest-plugin#seed) argument to the plugin. The `seed` object is used to share data between multiple manifest plugin instances (in our case multiple webpack compilations). This makes sure that the final `manifest.json` file contains paths to all generated assets and is not overwritten by each finished webpack compilation.


```js title=./ima.config.js
//...
// highlight-next-line
const manifestSeed = {};

module.exports = {
  // highlight-next-line
  plugins: [new CliManifestPlugin({ seed: manifestSeed })],
};
```

### Custom CLI arguments

There may be times you'd like to customize or enable/disable certain features on demand using CLI arguments. To demonstrate this we're going to define `manifestBasePath` CIL argument which will overwrite the [basePath](https://github.com/shellscape/webpack-manifest-plugin#basepath) plugin option.

You can define CLI arguments for each command separately, in our case, since the plugin does something only in `build` command, we're gonna do the same for the CLI arguments:


```js title=./ima.config.js
class CliManifestPlugin {
  //...
  cliArgs = {
    dev: undefined, // Dev args will go here
    build: {
      manifestBasePath: {
        desc: 'Overwrite basePath default value',
        type: 'string',
      },
    },
  };
  //...
}
```

The argument definition is passed directly to the `yargs` parser, so anything that [yargs options](https://yargs.js.org/docs/#api-reference-optionskey-opt) accept can be passed here. If you've done everything correctly you should even see the new argument in the command `--help` option:

```console
npx ima build --help

ima build

Build an application for production

Options:
// highlight-next-line
  --manifestBasePath  Overwrite basePath default value  [string]
```

### Accessing CLI arguments

CLI argument **values are merged into the `ctx` parameter**, so you can access them here. In our case we would like to extend the plugin options with the CLI override:

```js title=./ima.config.js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

class CliManifestPlugin {
  //...
  webpack(config, ctx, imaConfig) {
    if (ctx.command === 'build') {
      config.plugins.push(
        new WebpackManifestPlugin({
          ...this.#options,
          // highlight-next-line
          basePath: ctx.manifestBasePath ?? '',
        })
      );
    }

    return config;
  }
  //...
}
```

Running `npx ima build --manifestBasePath=path/prefix` should be reflected in the generated `manifest.json` file in the `./build` directory.

### Final results

Below is the entire content of the `ima.config.js` file we've been building so far that you can use as a reference.

```js title=./ima.config.js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

class CliManifestPlugin {
  #options = {};

  name = 'CliManifestPlugin';

  cliArgs = {
    dev: undefined, // Dev args will go here
    build: {
      manifestBasePath: {
        desc: 'Overwrite basePath default value',
        type: 'string',
      },
    },
  };

  constructor(options) {
    this.#options = options;
  }

  webpack(config, ctx, imaConfig) {
    if (ctx.command === 'build') {
      config.plugins.push(
        new WebpackManifestPlugin({
          ...this.#options,
          basePath: ctx.manifestBasePath ?? '',
        })
      );
    }

    return config;
  }
}

const manifestSeed = {};

module.exports = {
  plugins: [new CliManifestPlugin({ seed: manifestSeed })],
};
```

### Using TypeScript

Since the `@ima/cli` is written in TypeScript, there are [TypeScript definitions](./cli-plugins-api.md#plugins-api) you can use while defining your plugin. All types and interfaces are available as exports from the `@ima/cli` package while you can always have a look at our existing plugins, which are also written in TypeScript for an inspiration.

## Existing CLI plugins

Currently we maintain **3 distinct CLI plugins** that we actively use in our applications. These enables us to extend the feature set of the IMA.js CLI with additional functionality, which is not really suited to be available by default in the original CLI config, since their use is very situational. However you can almost certainly benefit from using these in your application.

Most of these plugins also provide additional functionality that can be used outside of the CLI plugin definition, but it is essential for it to work properly.

- [**AnalyzePlugin**](./plugins/analyze-plugin.md) - Pre-configures [bundle-stats-webpack-plugin](https://npmjs.com/package/bundle-stats-webpack-plugin) and [webpack-bundle-analyzer](https://npmjs.com/package/webpack-bundle-analyzer) webpack plugins for fast and easy bundle analyzing.
- [**ScrambleCSSPlugin**](./plugins/scramble-css-plugin.md) - Implements CSS class minimizer and uglifier that can be reverse-compiled at runtime (you can access classes using their original name).
- [**LessConstantsPlugin**](./plugins/less-constants-plugin.md) - Adds preprocessor which converts theme values defined in the JS file, to their LESS variable counterparts.
