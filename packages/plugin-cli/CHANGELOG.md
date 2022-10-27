# Change Log

## 18.0.0-rc.7

### Major Changes

- cc9894d2: Plugin config now has completely different configuration definition
  Link, dev and build commands are now more efficient and use less watchers for multiple bundle options
  Transformers option is now deprecated (they are part of the core replaced with type and bundle option)
  New CLI argument --clientServerBundle

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
