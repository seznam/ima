# Change Log

## 19.0.0-rc.6

### Patch Changes

- 53adfb35a: Fixed BlankManagedRootView props

## 19.0.0-rc.5

### Patch Changes

- d9c2d7a3b: Fixed defaultCssClasses types, second argument should be optional

## 19.0.0-rc.4

### Minor Changes

- 6a6b996d4: Package source files now include source map files

### Patch Changes

- Updated dependencies [6a6b996d4]
  - @ima/helpers@19.0.0-rc.2

## 19.0.0-rc.3

### Patch Changes

- dc8d4b7ea: Fixed once hook parametr type

## 19.0.0-rc.2

### Major Changes

- 81a8605d5: Bump versions

### Patch Changes

- Updated dependencies [81a8605d5]
  - @ima/helpers@19.0.0-rc.1

## 19.0.0-rc.1

### Major Changes

- 97b006e65: Removed deprecated package entry points
- 28660d902: Fire method arguments are now in correct order.
- 4f7a4767f: Fixed numerous TS types in page renderer.
  Added types to ima react hooks.

  #### Breaking changes

  `isSSR` hook has been removed, use `window.isClient()` directly from `useComponentUtils()`.
  `useSettings` now returns undefined, when settings is not found when using `selector` namespace as an argument.
  All exports are now named exports, you need to update import to `ClientPageRenderer` in `bind.js` to `import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';`

## 19.0.0-rc.0

### Major Changes

- ceb4cbd12: Moved meta tags management to new PageMetaHandler in `@ima/core`.
- c0fe68ef3: IMA 19 Release

### Patch Changes

- Updated dependencies [2f789cdae]
- Updated dependencies [ceb4cbd12]
- Updated dependencies [ceb4cbd12]
- Updated dependencies [ceb4cbd12]
- Updated dependencies [464d307ae]
- Updated dependencies [961d65688]
- Updated dependencies [c0fe68ef3]
  - @ima/core@19.0.0-rc.0
  - @ima/helpers@19.0.0-rc.0

## 18.2.0

### Minor Changes

- a7de413a2: Replaced locale-loader with custom compilation process of language files, this fixes an issue where newly added language files are not visible by the webpack compile and requires restart with forced cache clear.
  Implemented custom solution for hot module replacement API for language files (HMR for language files should be much faster and only )

## 18.1.6

### Patch Changes

- 3df9b0521: Fix compatibility with `eslint-plugin-import`

## 18.1.5

### Patch Changes

- 34d729757: Return batchResolve to renderer
- abb9308ad: Update code style - return for batchPromise

## 18.1.4

### Patch Changes

- 6fdc663cd: Fix import of @ima/react-page-renderer in jest tests with `testEnvironment: 'jsdom'`

## 18.1.3

### Patch Changes

- f55268f97: Fix typescript types export

## 18.1.2

### Patch Changes

- 09c61ff3f: Added possibility to import from dist folder without specifying the bundle (cjs/esm/client/server). For example, you can change `import Renderer from '@ima/react-page-renderer/dist/esm/client/renderer/ClientPageRenderer'` to `import Renderer from '@ima/react-page-renderer/renderer/ClientPageRenderer'`.

## 18.1.1

### Patch Changes

- 9bd34c753: Fix trigger refCallback in ViewAdapter

## 18.1.0

### Minor Changes

- 1a53809e: Added server and client nodes to hydration error

## 18.0.1

### Patch Changes

- b71bb4a2: update esmj/emitter to 0.2.0
- 557ea21f: Revert pageState for renderer update

## 18.0.0

### Major Changes

- 91c4c409: New package react-page-renderer.

### Patch Changes

- 91c4c409: Dependency bump and cleanup
- 91c4c409: The status, send, setPageState and isResponseSent methods removed from $Response class. The $Router.redirect method throw internal redirect errors. Returns value from server.requestHandlerMiddleware has new page property with state, cache, cookie and headers.
- 91c4c409: Reverted strict mode
- 91c4c409: Fixed broken release
- 91c4c409: Fix render before hydration completed.
- 91c4c409: Fixed an issue where AFTER_HANDLE_ROUTE is called before app is mounted
- 91c4c409: Change order for renderer - setMetaParams before viewToDom
- 91c4c409: Added hydratation error callback
- 91c4c409: Fixed unintentional hydrate on SPA routing
- 91c4c409: Multiple fixes after TS core and react-page-renderer merge
- 91c4c409: Reverted removal of pageState return from client mount method
- 91c4c409: componentHelper fire - remove specific target condition
- 91c4c409: `ClientPageRenderer` method `mount` will no longer batch the state transactions
- 91c4c409: Added getDerivedStateFromError handler to ErrorBoundary
- 91c4c409: Changed peer dependencies for react&react-dom.
- 91c4c409: Changed fire syntax to use EventTarget
- 91c4c409: Fixed certain dependencies
  Updated tsconfig.json to reflect type globals defined in this monorepo
  Updated API to new version of @ima/hmr-client
- 91c4c409: Fixed error reporting on non-existing view container
- 91c4c409: Fixed tests
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
- Updated dependencies [91c4c409]
  - @ima/core@18.0.0
  - @ima/helpers@18.0.0

## 18.0.0-rc.28

### Patch Changes

- 464215fc: Added getDerivedStateFromError handler to ErrorBoundary

## 18.0.0-rc.27

### Patch Changes

- 7be00b16: Reverted removal of pageState return from client mount method

## 18.0.0-rc.26

### Patch Changes

- 5d622ae1: Change order for renderer - setMetaParams before viewToDom
- 84f819e0: Fixed tests

## 18.0.0-rc.25

### Patch Changes

- 4215623d: Fixed broken release

## 18.0.0-rc.24

### Patch Changes

- ffe933ab: Fixed an issue where AFTER_HANDLE_ROUTE is called before app is mounted

## 18.0.0-rc.23

### Patch Changes

- eb8a6ba7: Reverted strict mode

## 18.0.0-rc.22

### Patch Changes

- 38012f0a: Added hydratation error callback
- Updated dependencies [38012f0a]
  - @ima/core@18.0.0-rc.28

## 18.0.0-rc.21

### Patch Changes

- 468ad70d: Fixed certain dependencies
  Updated tsconfig.json to reflect type globals defined in this monorepo
  Updated API to new version of @ima/hmr-client
- Updated dependencies [34107bac]
- Updated dependencies [468ad70d]
  - @ima/core@18.0.0-rc.25

## 18.0.0-rc.20

### Patch Changes

- 8a2c9f1b: componentHelper fire - remove specific target condition
- Updated dependencies [4e4d79bc]
- Updated dependencies [94fee0c6]
  - @ima/core@18.0.0-rc.24

## 18.0.0-rc.19

### Patch Changes

- a34b793e: Dependency bump and cleanup
- Updated dependencies [a34b793e]
  - @ima/core@18.0.0-rc.23
  - @ima/dev-utils@18.0.0-rc.12

## 18.0.0-rc.18

### Patch Changes

- e3a8cfbd: `ClientPageRenderer` method `mount` will no longer batch the state transactions

## 18.0.0-rc.17

### Patch Changes

- 0a2c8866: Fix render before hydration completed.
- Updated dependencies [0a2c8866]
  - @ima/core@18.0.0-rc.22
  - @ima/dev-utils@18.0.0-rc.11

## 18.0.0-rc.16

### Patch Changes

- Changed peer dependencies for react&react-dom.

## 18.0.0-rc.15

### Patch Changes

- f9c7cd82: Response class refactor
- 4658f5c3: Fixed unintentional hydrate on SPA routing
- Updated dependencies [f9c7cd82]
  - @ima/core@18.0.0-rc.19

## 18.0.0-rc.14

### Patch Changes

- 032a880e: Fixed error reporting on non-existing view container

## 18.0.0-rc.13

### Patch Changes

- 550a61ad: Multiple fixes after TS core and react-page-renderer merge
- Updated dependencies [550a61ad]
  - @ima/core@18.0.0-rc.18

## 18.0.0-rc.12

### Patch Changes

- 4a3bef27: Changed fire syntax to use EventTarget

## 18.0.0-rc.11

### Major Changes

- 027bb17c: New package react-page-renderer.

### Patch Changes

- Updated dependencies [027bb17c]
  - @ima/core@18.0.0-rc.17

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.
