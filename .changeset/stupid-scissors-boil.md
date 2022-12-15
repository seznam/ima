---
"@ima/hmr-client": major
---

Completely rewritten HMR client from the group up, completely replacing webpack-hot-middleware/client implementation
Removed rollup, plugin is now built using only `tsc`
The HMR is still not perfect but now more stable during IMA.js specific files changes (it now properly destroys old app before creating new one)
Refactored multiple existing components and added better HMR logging
