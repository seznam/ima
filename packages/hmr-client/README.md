<p align="center">
  <img height="130" src="https://imajs.io/img/logo.svg">
</p>

<h1 align="center">@ima/hmr-client</h1>
  <p align="center"><i><code>@ima/cli</code> webpack HMR and <code>@ima/error-overlay</code> companion client.</i>
</p>

---

Apart from connecting to `webpack-hot-middleware` SSE on the dev server, it initializes `window.__IMA_HMR` object that serves as an API  for proper handling of HMR on IMA.js applications and controling `@ima/error-overlay`. It also manages rendering of the HMR Indicator icon in the lower right corner of the screen.

## Description

The companion script is injected at the top of the entry points in the webpack configuration, which then initializes the event emitter, event source and indicator singletons on the `window.__IMA_HMR` upon application load (see interface description below).

This client code directly replaces the ones used in `webpack-hot-middleware`, however we are still using `webpack-hot-middleware` on the server-side to send compilation events using SSE EventSource.

In combination with `webpack-dev-middleware` (which sends `hot*` update files to the application) and events from `webpack-hot-middleware` SSE, the client is using the webpack's [Hot Module API](https://webpack.js.org/api/hot-module-replacement/#module-api) to apply new hot updates to the client's source code. Additionally, it proxies compilation errors to error overlay and manages the HMR indicator icon in the lower right corner.

## Usage

Use this package as an entry point in your webpack configuration (*ideally at the topmost position on every additional entry point separately!*). You can also customize some additional configuration that is passed to the client during initialization. Only `name` is required, other options have their defaults.

```javascript
// webpack.config.js
module.exports = {
  // ...
  entry: {
    client: [
      `@ima/hmr-client?${new URLSearchParams({
        name: 'client', // required
        noInfo: 'false',
        reload: 'true',
        timeout: '3000',
        reactRefresh: 'true',
        port: '3101',
        hostname: 'localhost',
        publicUrl: 'http://localhost:3101',
      }).toString()}`,
      './app/main.js',
    ]
  }
  // ...
}
```

These options should match the actual dev server configuration since the HMR client uses them to connect to the `webpack-hot-middleware` event source.

## `window.__IMA_HMR` interface

```typescript
import { Emitter } from '@esmj/emitter';

interface Window {
  __IMA_HMR: {
    emitter?: Emitter;
    eventSource?: EventSourceWrapper;
    indicator?: IndicatorWrapper;
  };
}
```

### emitter

> `Emitter`

@esmj/emitter used to emit messages across application, error-overlay and hmr-client. It has 2 public methods:

- `on(eventName: EventName, listener: Listener): void;` - use to listen on events (`'error' | 'clear' | 'close' | 'destroy'`)
- `emit(eventName: EventName, data?: ListenerData): void;` - use to emit events, only `'error'` event is expected to pass any data in following form `{ error: {} }`.
  - `error` - Send error object to ErrorOverlay.
  - `clear` - Clear all currently displayed errors in ErrorOverlay.
  - `close` - Close ErrorOverlay externally.
  - `destroy` - Destroy IMA.js application (destroys current instance before new one is created during HMR).


### eventSource

> `EventSourceWrapper`

Singleton wrapper around `webpack-hot-middleware` SSE EventSource. You can use `addListener` public method to add custom listeners to the SSE events.

- `addListener(name: string, listener: EventSourceListener)` - where `name` corresponds to the `name` value passed in webpack.config query params. This allows support for MultiComplier webpack instances.

### indicator

> `IndicatorWrapper`

Use to manage HMR State Indicator icon, has 2 public methods:

 - `create(state: 'invalid' | 'loading' = 'loading'): void` - Adds icon to the DOM in on of the selected visual states.
 - `destroy(): void` - Removes Icon from the DOM.

---

This package is part of the IMA.js application stack, see [imajs.io](https://imajs.io/) for more info about the whole project.
