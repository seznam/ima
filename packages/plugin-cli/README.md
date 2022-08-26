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

```
npx ima-plugin dev
npx ima-plugin build
npx ima-plugin link [target-project]
npx ima-plugin --help
```

Create `ima-plugin.config.js` file in the root of your plugin directory and export some configuration:

```js
// ima-plugin.config.js

const { swcTransformer, typescriptDeclarationsPlugin } = require('@ima/plugin-cli');

module.exports = {
  input: './src',
  output: './dist',
  transforms: [
    [swcTransformer({
      module: {
        type: 'es6',
      },
      jsc: {
        target: 'es2022',
        parser: {
          syntax: 'ecmascript',
          jsx: true
        },
      },
    }),
    {
      test: /\.(js|jsx)$/
    }
    ]
  ],
  plugins: [
    typescriptDeclarationsPlugin({
      additionalArgs: ['--skipLibCheck'
      ],
    }),
  ],
};
```

### Pre-configured configurations

This package also exports 3 pre-configured `ima-plugin.config.js` configurations, which you can use in your plugins without a need to create your own.

```js
const { createConfig } = require('@ima/plugin-cli');

module.exports = createConfig();
```

- `createConfig(type = 'es6')` - Creates basic configuration that exports only one bundle (used at server and client)
- `createClientServerConfig(type = 'es6')` - Creates configuration which exports client and server specific bundles. Supports JSX/TSX, preprocess pragma comments.

> **Note:** You can override module `type` using the first argument and export other types of module syntax. For example use `commonjs` for Node-specific packages.

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
