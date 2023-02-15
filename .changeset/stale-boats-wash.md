---
"@ima/react-page-renderer": major
"@ima/core": major
"create-ima-app": major
---

Fixed numerous TS types in page renderer.
Added types to ima react hooks.

#### Breaking changes

`isSSR` hook has been removed, use `window.isClient()` directly from `useComponentUtils()`.
`useSettings` now returns undefined, when settings is not found when using `selector` namespace as an argument.
All exports are now named exports, you need to update import to `ClientPageRenderer` in `bind.js` to `import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';`
`Route` alias export has been replaced with `StaticRoute` export.
