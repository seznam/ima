---
"@ima/plugin-cli": patch
---

Updated `defaultConfig` and `clientServerConfig` to bundle less/css files into seperate directory in dist and all other assets are now bundled into each bundle version (esm/cjs/client/server). This fixes an issue, where some essential json files were not available in the cjs bundle.
