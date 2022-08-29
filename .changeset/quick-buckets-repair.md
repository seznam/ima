---
"@ima/cli": patch
"create-ima-app": patch
"@ima/error-overlay": patch
---

Changed compression option to compress in ima.config.js, it is now boolean to disable/enable compression for production assets
Added `express-static-gzip` middleware to create-ima-app template, to support serving compressed assets
Fixed @swc/core to v1.2.230, since later versions contain error with preset env
