---
"@ima/react-page-renderer": patch
"create-ima-app": patch
---

Added possibility to import from dist folder without specifying the bundle (cjs/esm/client/server). For example, you can change `import Renderer from '@ima/react-page-renderer/dist/esm/client/renderer/ClientPageRenderer'` to `import Renderer from '@ima/react-page-renderer/renderer/ClientPageRenderer'`.
