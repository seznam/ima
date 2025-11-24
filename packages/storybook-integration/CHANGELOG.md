# Change Log

## 20.0.0

### Major Changes

- 8b10a9b: Follow v20.0.0 migration guide [here](https://imajs.io/migration/migration-20.0.0).

### Patch Changes

- 30c7410: Re-release with storybook fix
- 0437d18: RC release.
- 9b52dcc: Await async ima methods in storybook loader, add awaits for more methods which can be async in future

## 20.0.0-rc.3

### Patch Changes

- 0437d18: RC release.

## 20.0.0-rc.2

### Patch Changes

- 30c7410: Re-release with storybook fix

## 20.0.0-rc.1

### Patch Changes

- 9b52dcc: Await async ima methods in storybook loader, add awaits for more methods which can be async in future
- Updated dependencies [fcb8017]
  - @ima/dev-utils@20.0.0-rc.0

## 20.0.0-rc.0

### Patch Changes

- Updated dependencies [f9120bf]
- Updated dependencies [b2e0eee]
- Updated dependencies [01d15d8]
- Updated dependencies [cac7d53]
- Updated dependencies [a03390d]
- Updated dependencies [3f6ee97]
  - @ima/core@20.0.0-rc.0
  - @ima/cli@20.0.0-rc.0
  - @ima/react-page-renderer@20.0.0-rc.0

## 19.6.3

### Patch Changes

- 6d8e60c: Fixed compatibility issues with findRules function after new additions to webpack config in @ima/cli@19.9.0

## 19.6.2

### Patch Changes

- 25a1777: Added support for custom event targets in Router's listen methods. This enables better control over routing behavior by allowing you to:
  - Scope navigation handling to specific parts of your application
  - Handle multiple independent routed sections on a page
  - Better integrate IMA.js routing into existing applications

  Changes:
  - Modified `listen(target?: EventTarget)` method to allow for optional target
  - Modified `unlisten(target?: EventTarget)` method to allow for optional target
  - Added new `unlistenAll()` method to cleanup all event listeners at once

## 19.6.1

### Patch Changes

- 03d109ad6: Fix some typing errors.

## 19.6.0

### Minor Changes

- 7bcbf6d71: Added support for imaInitializers. These allow you to register multiple boot config overrides across multiple packages and execute them all.

### Patch Changes

- 7bcbf6d71: Changed default tsconfig to isolated modules, which required some export adjustments

## 19.5.2

### Patch Changes

- 5a8a5bdd2: Moved chalk@4 to dependencies from peerDependencies, to prevent installation of unsupported versions
- 207e74052: Storybook build will not crash if build folder does not exist yet

## 19.5.1

### Patch Changes

- 2c0d4f63f: Cleans build folder before running and adds option to disable chosen plugins for storybook builds (in case they don't play well with Storybook).

## 19.5.0

### Minor Changes

- 99ac71723: Removed `require` from `exports` fields since it is not supported by this package (module-only)
  Added exports to `.` path -> `@ima/storybook-integration` is now a valid import path, which exports utilities and decorators that can be used in your stories.
  Updated README.md with usafe information on `isStorybook` helper and other utilities and decorators.

## 19.4.0

### Minor Changes

- ff203f7b2: Ima now uses better mock args to generate storybook webpack config based on storybookconfig type, additionally we replace storybook with our custom minimizers to better match production env

## 19.3.0

### Minor Changes

- 357a5d000: $Debug, $App, $Version revival settings are now taken from app env settings

## 19.2.0

### Minor Changes

- 00c929e51: Fixed issue where in certain situations you could get $Debug error in storybook previews
  Added new export `@ima/storybook-integration/helpers` which contains helper functions you can use in your stories. Currently it contains `isStorybook` function export, that can be used in your components code to execute some part specifically only on the storybook screen.

## 19.1.0

### Minor Changes

- 61c2cbb88: Added storybook args as last argument to boot init functions
  Added types to parameters for autocomplete. Add `"types": ["./node_modules/@ima/storybook-integration/dist/types.d.ts"],` to your `tsconfig.json`

## 19.0.1

### Patch Changes

- 2323c6a13: Updated dependencies to use non-rc version ranges

## 19.0.0

### Major Changes

- 2fbf66925: Initial version of storybook-integration

### Patch Changes

- dc676bf01: Fixed presets.js export
- 40d122db3: Revival settings are now initialized during built time (still can be overriden using params)

## 19.0.0-rc.3

### Patch Changes

- dc676bf01: Fixed presets.js export

## 19.0.0-rc.2

### Patch Changes

- 40d122db3: Revival settings are now initialized during built time (still can be overriden using params)

## 19.0.0-rc.1

### Major Changes

- 2fbf66925: Initial version of storybook-integration
