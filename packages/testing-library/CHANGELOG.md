# @ima/testing-library

## 20.0.0-rc.1

### Patch Changes

- 0437d18: RC release.

## 20.0.0-rc.0

### Major Changes

- 3f6ee97: Moved most of the default settings and environemnt config from the CIA template to the core. This means that most of the settings have defaults and don't need to be defined in the config.

  This is not necessarily a breaking change, but it is a major change because it changes the default behavior of the app.

### Patch Changes

- Updated dependencies [f9120bf]
- Updated dependencies [b2e0eee]
- Updated dependencies [cdb1471]
- Updated dependencies [01d15d8]
- Updated dependencies [cac7d53]
- Updated dependencies [a03390d]
- Updated dependencies [3f6ee97]
  - @ima/core@20.0.0-rc.0
  - @ima/server@20.0.0-rc.0
  - @ima/cli@20.0.0-rc.0
  - @ima/react-page-renderer@20.0.0-rc.0

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
