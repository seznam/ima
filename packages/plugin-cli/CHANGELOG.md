# Change Log

## 19.0.0-rc.3

### Minor Changes

- 168fa6d6a: Added ability to enable/disable soure maps generation using `sourceMaps` option in `ima-plugin.config.js` configuration file.
  Added ability to add new custom transformers using `transformers` option in `ima-plugin.config.js` configuration file.

## 19.0.0-rc.2

### Minor Changes

- 6a6b996d4: All swc transformations now produce source map files alongside transformed files.

## 19.0.0-rc.1

### Major Changes

- 81a8605d5: Bump versions

### Patch Changes

- Updated dependencies [81a8605d5]
  - @ima/dev-utils@19.0.0-rc.2

## 19.0.0-rc.0

### Major Changes

- c0fe68ef3: IMA 19 Release

### Patch Changes

- Updated dependencies [073adb5d5]
- Updated dependencies [c0fe68ef3]
  - @ima/dev-utils@19.0.0-rc.0

## 18.1.1

### Patch Changes

- 3be28045d: Fixed windows specific errors in package building

## 18.1.0

### Minor Changes

- 4342d6e60: Add support for `ImaPluginConfig.output.exclude`, which works just like inverted `include`

### Patch Changes

- 4342d6e60: Updated `defaultConfig` and `clientServerConfig` to bundle less/css files into seperate directory in dist and all other assets are now bundled into each bundle version (esm/cjs/client/server). This fixes an issue, where some essential json files were not available in the cjs bundle.

## 18.0.0

### Major Changes

- 91c4c409: Renamed `BuildConfig` type to `ImaPluginConfig`
  Better output for build command
  Added new optional `name` argument to `ImaPluginConfig` (default preset configuration set this to output module type but can be anything you want). This is used only in the output commands.
- 91c4c409: Plugin config now has completely different configuration definition
  Link, dev and build commands are now more efficient and use less watchers for multiple bundle options
  Transformers option is now deprecated (they are part of the core replaced with type and bundle option)
  New CLI argument --clientServerConfig

### Patch Changes

- 91c4c409: Dependency bump and cleanup
- 91c4c409: Fixed issue where swcTransformer didn't transform jsx filenames to js extensions
- 91c4c409: Added option to define custom jsxRuntime config
  Added option to exclude/include certain files in each output config. This fixes an issue where less and json files are distributed in all dist folders (instead of only one of those).
- 91c4c409: Fix render before hydration completed.
- 91c4c409: Added node, serverClient and config presets
- 91c4c409: Added support for pure esm modules
- 91c4c409: Added option to define custom jsxRuntime config
  Added option to exclude/include certain files in each output config. This fixes an issue where less and json files are distributed in all dist folders (instead of only one of those).
- 91c4c409: Added support for include/exclude functions
  Plugin doesn't ignore _Suite_ files during build
- 91c4c409: Added option to override default JS target
- 91c4c409: Changes the way link is handled which should be more performant and fix some issues with certain monorepositories.
- 91c4c409: Added option to watch additional files during link command
- 91c4c409: jsxRutime is now set to 'automatic' by default
- 91c4c409: Added new package @ima/plugin-cli
- 91c4c409: Fixed certain dependencies
  Updated tsconfig.json to reflect type globals defined in this monorepo
  Updated API to new version of @ima/hmr-client
- 91c4c409: Moved logger and time utility functions to @ima/dev-utils pkg
- 91c4c409: Minor tweaks to excludes in default configurations
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
- Updated dependencies [91c4c409]
  - @ima/dev-utils@18.0.0

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
