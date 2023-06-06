# Change Log

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
