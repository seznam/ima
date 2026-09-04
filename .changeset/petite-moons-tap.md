---
"@ima/testing-library": minor
"create-ima-app": patch
---

Add RTL-backed integration testing utilities to `@ima/testing-library`.

- **What** Add the `@ima/testing-library/integration` entry point with `initImaApp`, `clearImaApp`, and tracked AOP helpers. Integration boot loads the mapped `app/main`, renders and updates IMA page views through React Testing Library, supports shared hooks under `setImaTestingLibraryClientConfig({ integration })`, and restores React roots, browser shims, timers, assertions, event listeners, object-container state, and AOP hooks during cleanup. The integration binding points `$PageRenderer` at the React Testing Library implementation, which transfers root ownership only after successful renders, releases owned roots, and restores the original server markup before another application uses the same Jest environment. Overlapping cleanup calls are queued so the next application cannot boot against partially destroyed state. `setImaTestingLibraryServerConfig({ environment })` now defaults to `test` and is applied through `IMA_ENV` around a deferred `@ima/server` import, and new `create-ima-app` projects use the shared integration utilities.
- **Why** Integration tests can reuse the JSDOM initialized by the existing Jest preset and consistently select their configured IMA environment instead of depending on `NODE_ENV` or module import order.
- **How** Replace `@ima/plugin-testing-integration` imports with `@ima/testing-library/integration`, configure server-time values through `@ima/testing-library/server`, and move runtime hooks to the `integration` key of `setImaTestingLibraryClientConfig`. Because `environment` now defaults to `test` and is applied as `IMA_ENV`, projects that selected the environment through an `IMA_ENV` variable have to pass the same value to `setImaTestingLibraryServerConfig`. Awaiting `clearImaApp` is recommended, but not required, because the next `initImaApp` waits for pending cleanup.
