<p align="center">
  <img height="130" src="https://imajs.io/img/imajs-logo.png">
</p>

<h1 align="center">@ima/plugin-cli</h1>
  <p align="center"><i><code>@ima/plugin-cli</code> takes care of building, linking and watching IMA.js plugins.</i>
</p>

---

Small CLI wrapper around swc with few other plugins (typescript support), which takes care of building, watching and linking IMA.js plugins.

## Installation

```
npm install @ima/plugin-cli --save-dev
```


## Usage

Run following commands from the root of your plugin directory.

```
npx ima-plugin dev
npx ima-plugin build
npx ima-plugin link [target-project]
npx ima-plugin --help
```

The plugin works **without the need to provide custom ima-plugin.config.js**. There are 3 configuration presets that should cover most situations, which can be forced using CLI args:
 - `npm run [build|dev|link]` - generates two bundles, one in cjs and other in esm. Use this for almost any plugin that doesn't need server/client specific bundles.
 - `npm run [build|dev|link] --nodeConfig` - generates only cjs bundle (in ./dist directory), useful for CLI and node plugins.
 - `npm run [build|dev|link] --clientServerConfig` - generates code in cjs and two bundles in esm, where you can drop client/server specific syntax using pragma comments.

### jsxRuntime
You can override used React jsxRuntime to `classic` or newer `automatic` using `jsxRuntime` config option, or `-j=automatic` or `--jsxRuntime=classic` CLI argument.

### additionalWatchPaths
Optional array type option, which can be used to add additional watch paths to link command. This is useful if you want to watch and copy additional files outside of the `inputDir`.

### Custom `ima-plugin.config.js`
You can always provide custom ima-plugin.config.js where you can either extend one of the provided default configurations or create completely new one:

```js
// ima-plugin.config.js

// Use one of the default provided configurations
const {
  defaultConfig, // corresponds with CLI options described above
  clientServerConfig, // corresponds with CLI options described above
  nodeConfig, // corresponds with CLI options described above
  preprocessTransformer,
  swcTransformer,
  typescriptDeclarationsPlugin
} = require('@ima/plugin-cli');

/**
 * Or create custom config. You can export an array of configuration objects to support multiple configurations.
 *
 * @type import('@ima/plugin-cli').ImaPluginConfig
 */
module.exports = {
  inputDir: './src',
  jsxRuntime: 'classic', // 'classic' or 'automatic' JSX runtime settings
  sourceMaps: true, // enabled by default
  /**
   * Optionally create additional transformers. There are 2 transformers
   * that plugin CLI exports - preprocessTransformer (for removing code
   * parts based on @if/@else pragma comments), swcTransformer (runs
   * JS code through swc/core transform).
   *
   * '...' -> this placeholder is replaced with default set of transformers.
   * This allows you to easily extend default configuration without the need
   * to re-define it again manually.
   *
   * You can also always opt out of using '...', in that case, default
   * transformers are not used, only the ones defined in the `transformers`
   * field below.
   */
  transformers: [
    preprocessTransformer({
      context: {
        production: true,
        development: false,
      },
    }),
    '...',
  ],
  output: [
    {
      dir: './dist/esm',
      format: 'es6',
      /**
       * Since we want to handle less/css files separately, we can exclude them
       * from this output dir. This extends the root `exclude` definition.
       * When the option is not defined, it copies all files to the dist folder.
       */
      exclude: /\.(less|css)$/i
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
      exclude: /\.(less|css)$/i
    },
    {
      dir: './dist/less',
      format: 'es6',
      // Here we can have an individual bundle just for less/css files.
      include: /\.(less|css)$/i
    },
  ],
  plugins: [
    typescriptDeclarationsPlugin({ additionalArgs: ['--skipLibCheck'] }),
  ],
  exclude: [
    '**/__tests__/**',
    '**/node_modules/**',
    '**/dist/**',
    '**/typings/**',
    '**/.DS_Store/**',
    'tsconfig.tsbuildinfo',
  ],
  /**
   * Optional, this adds additional glob paths to link watcher for files
   * which are also watched for changes and copied to the linked directory.
   * (Works only with `link` command).
   */
  additionalWatchPaths: ['./transform/**/*', './polyfill/**/*'],
};
```

### `package.json` entry points

When a plugin is built using this cli, it should provide following entry points in the `package.json` file:

```json
"main": "./dist/cjs/index.js",
"module": "./dist/esm/index.js",
```

And in case of server/client specific bundles:

```json
"main": "./dist/cjs/index.js",
"module": "./dist/esm/server/index.js",
"browser": "./dist/esm/client/index.js",
```

This makes sure that webpack uses correct entry points for each bundle, where the priorities are defined as:
- `module` -> `main` for **server** bundle (we always prefer esm as it enables better code analysis and tree-shaking)
- `browser` -> `module` -> `main` for **client** bundle

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
