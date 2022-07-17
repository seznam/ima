# @ima/hmr-client
> `@ima/cli` webpack HMR and `@ima/error-overlay` companion client.

Creates **event emitter** on client window `window.__IMA_HMR`, which servers as a communication interface between `@ima/error-overlay`, `webpack-hot-middleware` and the application. It also manages the HMR indicator rendering (little IMA icon in bottom right corner) and HMR reconnections.

## Description

The companion script is injected at the top of the client entry point in the webpack configuration, which then initializes the event emitter on `window.__IMA_HMR` upon application load.

Additionally the package provides custom module for `@pmmmwh/react-refresh-webpack-plugin` (available as default entry point), that noops all the refresh-plugin callback methods in order to disable the ability of the plugin to display runtime and compile error overlays. This is because we have our own handler for these in form of `@ima/error-overlay`.

## Usage

### HMR client
The HMR client entry point is injected as additional file (*ideally at the topmost position!*) to the client entry point. You can also customize the dev server configuration through webpack query params syntax.

```javascript
// webpack.config.js
module.exports = {
  // ...
  entry: {
    client: [
      `@ima/hmr-client/dist/imaHmrClient?${new URLSearchParams({
        port: 3101,
        hostname: 'localhost',
        publicUrl: 'http://localhost:3101'
      }).toString()}`,
      './app/main.js',
    ]
  }
  // ...
}
```

These options should match the actual dev server configuration since the HMR client uses them to connect to the `webpack-hot-middleware` event source.

### Fast Refresh client
To disable existing error overlay functionality of the `@pmmmwh/react-refresh-webpack-plugin` plugin, pass the `@ima/hmr-client` entry to the `module` option during initialization.:

```javascript
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        module: '@ima/hmr-client',
        sockIntegration: 'whm',
      },
    }),
  ]
  // ...
}
```

This intercepts the plugin error handling methods and noops them. Essentially disabling the default error overlay, since there's currently no other method to do that.


## `window.__IMA_HMR` interface

The interface is fairly simple providing just 2 methods to emit and start listening to certain events.

#### `on(eventName: EventName, listener: Listener): void;`
#### `emit(eventName: EventName, data?: ListenerData): void;`

There are 3 events you can listen to/emit:
- `error` - used to emit and listen to current runtime/compile errors. The listener data format is: `{ error?: StatsError | Error; type: 'compile' | 'runtime'; }`.
- `clear` - called to clear existing errors and close currently visible error-overlay (usually from ima side to clear resolved runtime errors).
- `close` - called when user closes currently visible error-overlay.

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
