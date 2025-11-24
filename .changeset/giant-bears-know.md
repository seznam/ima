---
"@ima/core": major
"@ima/server": major
---

### Asynchronous application bootstrap

The application bootstrap process has been refactored to be fully asynchronous.

**BREAKING CHANGE:** The entire application bootstrap process is now asynchronous.

- The `bootstrap.run()` method now returns a `Promise`.
- The client-side `bootClientApp()` and `reviveClientApp()` functions are now `async` and must be `await`ed.
- On the server-side, the application initialization is also asynchronous. If you have custom hooks for `CreateImaApp` or `Request` events, they may need to be updated to handle asynchronous operations.
