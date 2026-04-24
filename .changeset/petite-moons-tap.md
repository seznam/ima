---
"@ima/testing-library": minor
---

Add integration testing utilities with `initImaApp`, `clearImaApp`, and `setIntegrationConfig`

- **What** Added a new `./integration` export from `@ima/testing-library` with `initImaApp`, `clearImaApp`, `setIntegrationConfig`, `getIntegrationConfig`, `aop`, `unAopAll`, `hookName`, and `createHook`. Added `./jest-preset-integration/jest-preset` export providing a Jest preset for integration tests that omits the `app/main` module name mapper. Extracted shared `bootImaApp` and `validateJsdomEnvironment` helpers into a new `boot.ts` module and re-used them in the existing RTL `initImaApp`. Added ambient type declaration for `to-aop`.
- **Why** Integration tests need to boot the real IMA application (loaded dynamically from a configurable path) instead of a mocked `app/main`, run with a live router, wrap global timers for cleanup, and support per-suite boot config overrides — capabilities not covered by the existing unit-test `initImaApp`.
- **How** Nothing.
