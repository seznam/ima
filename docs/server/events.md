---
title: 'Events'
description: 'Server > Events'
---

The IMA.js server exposes `emitter` and `Event` objects that can be used to handle events and adjust the server behavior.

You can listen to any of the events below by calling `emitter.on(eventName, event => {})`. See the [`@esmj/emitter` documentation](https://github.com/mjancarik/esmj-emitter) for more details.

> **Note:** All IMA server events have built-in [Performance Tracking](./performance-tracking.md) support. You can access the performance tracker via `event.context.perf` to measure and monitor your server operations.

## Special Events

### `CreateBootConfig`

Emitted within `Event.Request` after `event.context.bootConfig` is initialized. You can modify the boot config here.

Example:

```javascript
emitter.on(Event.CreateBootConfig, ({ req, context }) => {
	const { bootConfig } = context;

	bootConfig.settings.$App = {
		...bootConfig.settings.$App,
        isWebPSupported: req?.headers?.accept?.includes('image/webp'),
	};
});
```

### `CreateImaApp`

Emitted within `Event.Request` after `event.context.app` is initialized. You can modify the app here.

### `CreateContentVariables`

Emitted within `Event.BeforeResponse` after `event.context.response.page` is initialized, but before the content variables are propagated into the response content. You can modify the content variables here.

Example:

```javascript
emitter.on(Event.CreateContentVariables, event => {
    const preconnectLink = '<link rel="preconnect" href="https://github.com/" />';

    return {
        ...event.result,
        meta: `${event.result?.meta || ''}\n${preconnectLink}`
    };
});
```


## Error Events

If an error occurs during the request/response processing, the server emits the events below.

### `BeforeError`

Emitted before the error is processed.

### `Error`

Emitted after the error is rendered.

### `AfterError`

Emitted after `event.context.response` is initialized with the error content.

## Lifecycle Events

The events below are emitted in the order they are listed.

### `BeforeRequest`

Emitted before the request is processed. You can still stop IMA.js from processing the request by calling `event.preventDefault()`.

### `Request`

Emitted after the server decides how to process the request. It chooses between SSR, SPA, or a static client/server error page. **This is an internal event and you cannot listen to this event.** Your listener will not be called even if you try. You should listen to `Event.AfterRequest` instead.

### `AfterRequest`

Emitted after `event.context.response` is initialized. You can modify the response object here before the content variables get evaluated.

### `BeforeResponse`

Emitted after the content variables are propagated into the response content. You can still modify the response object here.

### `Response`

Emitted after the response is sent to the client. You can do some post-processing here.

### `AfterResponse`

Emitted after the response cleanup. This is the place to do your own cleanup.

### `AfterResponseSend`

The last event emitted after the response is sent to the client. It is guaranteed that this event will be emitted even if the response sending fails. This is your last chance to do something after the response is sent.

## Performance Tracking with Events

All IMA server events have access to the performance tracker through `event.context.perf`. This allows you to measure and monitor your operations:

```javascript
import { Event } from '@ima/server';

emitter.on(Event.BeforeRequest, async (event) => {
  const { perf } = event.context;

  // Track custom operations
  perf.start('database.connect');
  await connectToDatabase();
  perf.end('database.connect');

  // Wrap functions for automatic tracking
  const trackedQuery = perf.wrap('database.query', queryFn);
  const users = await trackedQuery('SELECT * FROM users');
});
```

See [Performance Tracking](./performance-tracking.md) for complete documentation.
