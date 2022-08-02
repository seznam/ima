---
title: Http Agent
description: Basic features > Http Agent
---

TBD Http Agent description.

## Cancellable requests

Http Agent supports cancellable requests using [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

The whole AbortController can be provided in the request options. This is preferred way of usage as it allows to cancell the request outside the HttpAgent as well as inside of the HttpAgent when the request timeouts.

```javascript
// Using HttpAgent with AbortController
//

const controller = new AbortController();

const options = {
  abortController: controller,
};

httpAgent.get('<uri>', '<data>', options);

controller.abort(); //Cancelling request outside of HttpAgent.
//controller.abort('Reason X'); //Request can also be cancelled with reason.

// ...
```

If only `AbortSignal` is provided in `options.fetchOptions.signal`, request can be cancelled outside of Http Agent, but it won't be cancelled on timeout.

```javascript
// Using HttpAgent with AbortSignal in options.fetchOptions
//

const controller = new AbortController();

const options = {
  fetchOptions: {
    signal: controller.signal,
  }
};

httpAgent.get('<uri>', '<data>', options);

controller.abort('Reason X'); //Request can be cancelled with or without reason.
// ...
```

If external cancelling is not required, AbortController or Signal don't have to be included in the options. In this case HttpAgent creates it's own AbortController to be used on request timeout.
