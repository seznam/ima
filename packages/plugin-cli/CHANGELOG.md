# Change Log

## 18.0.0-rc.18

### Patch Changes

- 3ab407a3: jsxRutime is now set to 'automatic' by default

## 18.0.0-rc.17

### Patch Changes

- 28a104fa: Minor tweaks to excludes in default configurations

## 18.0.0-rc.16

### Patch Changes

- 3e863bdf: Added support for include/exclude functions
  Plugin doesn't ignore _Suite_ files during build

## 18.0.0-rc.15

### Patch Changes

- d260949b: Added option to watch additional files during link command

## 18.0.0-rc.14

### Patch Changes

- 468ad70d: Fixed certain dependencies
  Updated tsconfig.json to reflect type globals defined in this monorepo
  Updated API to new version of @ima/hmr-client
- Updated dependencies [468ad70d]
- Updated dependencies [468ad70d]
  - @ima/dev-utils@18.0.0-rc.13

## 18.0.0-rc.13

### Patch Changes

- 976c4394: Added option to override default JS target

## 18.0.0-rc.12

### Patch Changes

- a34b793e: Dependency bump and cleanup

## 18.0.0-rc.11

### Patch Changes

- 0a2c8866: Fix render before hydration completed.

## 18.0.0-rc.10

### Patch Changes

- 97c8abfd: Added option to define custom jsxRuntime config
  Added option to exclude/include certain files in each output config. This fixes an issue where less and json files are distributed in all dist folders (instead of only one of those).

## 18.0.0-rc.9

### Patch Changes

- a9bb53b9: Added option to define custom jsxRuntime config
  Added option to exclude/include certain files in each output config. This fixes an issue where less and json files are distributed in all dist folders (instead of only one of those).

## 18.0.0-rc.8

### Patch Changes

- 0016d7ff: Added node, serverClient and config presets

## 18.0.0-rc.7

### Major Changes

- cc9894d2: Plugin config now has completely different configuration definition
  Link, dev and build commands are now more efficient and use less watchers for multiple bundle options
  Transformers option is now deprecated (they are part of the core replaced with type and bundle option)
  New CLI argument --clientServerConfig

## 18.0.0-rc.6

### Patch Changes

- 45603995: Changes the way link is handled which should be more performant and fix some issues with certain monorepositories.

## 18.0.0-rc.5

### Major Changes

- 4046f8b1: Renamed `BuildConfig` type to `ImaPluginConfig`
  Better output for build command
  Added new optional `name` argument to `ImaPluginConfig` (default preset configuration set this to output module type but can be anything you want). This is used only in the output commands.

## 18.0.0-rc.4

### Patch Changes

- 0e00e4f7: Fixed issue where swcTransformer didn't transform jsx filenames to js extensions

## 18.0.0-rc.3

### Patch Changes

- d6a4045f: Added support for pure esm modules

## 18.0.0-rc.2

### Patch Changes

- 1f8c6d4b: Added new package @ima/plugin-cli
- 49445893: Moved logger and time utility functions to @ima/dev-utils pkg
