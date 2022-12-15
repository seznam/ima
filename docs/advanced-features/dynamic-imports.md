---
title: 'Dynamic imports'
description: 'Advanced Features > Dynamic imports and lazy loading'
---

## Dynamic imports
## Preloading and prefetching

Since we're using webpack, to built the application, it already has support for [inline directives](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules) for preloading and prefetching. Using this comment:

```js
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```

will result in`<link rel="prefetch" href="login-modal-chunk.js">` being appended in the head of the page. For more information about

## React suspense

[Suspense](https://reactjs.org/docs/react-api.html#reactsuspense) currently **doesn't support SSR**. However you can use it to load client-side react components. Don't forget to add proper handlers so it only gets rendered on client, since SSR will result in an hydratation error.
