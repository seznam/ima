---
"create-ima-app": minor
"@ima/cli": minor
---

Added support for .avif and .ico image imports.
Added global.d.ts file to @ima/cli, declaring types for supported webpack imports (images, html files, etc.). To use this add `/// <reference types="@ima/cli/global" />` to your app type definitions.
