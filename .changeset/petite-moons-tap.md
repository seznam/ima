---
"@ima/testing-library": minor
---

Add integration testing utilities with `initImaApp`, `clearImaApp`, and `setIntegrationConfig`

- **What** Added a new `./integration` export from `@ima/testing-library` with `initImaApp`, `clearImaApp`, `setIntegrationConfig`, `getIntegrationConfig`, `aop`, `unAopAll`, `hookName`, and `createHook`. Extracted shared `bootImaApp` and `validateJsdomEnvironment` helpers into a new `boot.ts` module and re-used them in the existing RTL `initImaApp`. Added ambient type declaration for `to-aop`. Integration boot now propagates the configured `$Env` to both `window.$IMA` and global `$IMA`, lets the server-side HTML template use an explicit environment, and restores timer/assert/AOP hooks when initialization fails. `create-ima-app` now generates its integration test against `@ima/testing-library/integration`.
- **Why** Integration tests need to boot the real IMA application (loaded dynamically from a configurable path) instead of a mocked `app/main`, run with a live router, wrap global timers for cleanup, and support per-suite boot config overrides — capabilities not covered by the existing unit-test `initImaApp`. Environment selection and failed-start cleanup must be deterministic so tests do not silently resolve production settings or leak global state into later suites.
- **How** Nothing.
