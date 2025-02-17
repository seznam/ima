# @ima/testing-library

## 19.11.1

### Patch Changes

- 5c50ea4: Fix Windows compatibility when using this package as a Jest preset

## 19.11.0

### Minor Changes

- 550793a9f: Add `renderHookWithContext`, see the [docs](https://imajs.io/basic-features/testing/#renderhookwithcontext) for more details.

## 19.10.0

### Minor Changes

- cd24e835d: Throw an error when JSDOM HTML template render failed. This can be potentially a **BREAKING CHANGE** if your tests are already using a broken HTML template in JSDOM. Until now, you might not have even noticed the problem until you had a test accessing specific context features that required a proper HTML template.

## 19.9.0

### Minor Changes

- 371ca1f20: Add client configuration options `beforeInitImaApp`, `beforeRenderWithContext` and `afterRenderWithContext` to be able to specify additional logic, which will be called in the specific times.

## 19.8.0

### Minor Changes

- 03d109ad6: Init new module, see README.md for more info.
