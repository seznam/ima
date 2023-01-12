---
title: Data fetching
description: Basic features > Data fetching with HttpAgent
---

`HttpAgent` allows you to isomorphically fetch data in IMA.js applications. It is a simple wrapper around native `fetch` with additional features like caching, proxy support and others.

## Cancellable requests

The HttpAgent has support for [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel requests in native way. There are **two ways** you can provide custom instance of AbortController to the HttpAgent, where each has it's own benefits.


### options.abortController

Using this approach has the added benefit of `HttpAgent` being able to additionally **reuse** this controller **for cancelation of timeout requests**.

```javascript
const controller = new AbortController();

httpAgent.get('<uri>', '<data>', {
  abortController: controller,
});

// Cancel the request
controller.abort();
```

:::info

If you don't provide custom instance of `AbortController` the agent uses it's own instance internally to cancel running timeout requests.

:::

### options.fetchOptions.signal

This approach is more similar to native fetch definition. However since currently you can only provide one `signal` to fetch request and we don't have access to the `controller` instance (from within the HttpAgent), we are unable to abort time out requests in this case.

```javascript
const controller = new AbortController();

httpAgent.get('<uri>', '<data>', {
  fetchOptions: {
    signal: controller.signal,
  }
});

// Cancel the request
controller.abort();
```

:::note

The time out requests still throw the same timeout error, however they are not canceled (aborted). This is the only difference between the two forementioned methods.

:::
