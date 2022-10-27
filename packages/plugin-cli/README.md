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

The plugin works **without the need to provide custom ima-plugin.config.js** and covers most cases where:
 - `npm run [build|dev|link]` - generates two bundles, one in cjs and other in esm. Use this for almost any plugin that doesn't need server/client specific bundles.
 - `npm run [build|dev|link] --clientServerBundle` - this generates code in cjs and two bundles in esm, where you can drop client/server specific syntax using pragma comments.

### Custom `ima-plugin.config.js`
You can always provide custom ima-plugin.config.js where you can either extend one of the provided default configurations or create completely new one:

```js
// ima-plugin.config.js

// Use one of the default provided configurations
const {
  defaultConfig,
  clientServerConfig,
  typescriptDeclarationsPlugin
} = require('@ima/plugin-cli');

/**
 * Or create custom config. You can export an array of configuration objects to support multiple configurations.
 *
 * @type import('@ima/plugin-cli').ImaPluginConfig
 */
module.exports = {
  inputDir: './src',
  output: [
    {
      dir: './dist/esm',
      format: 'es6',
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
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
