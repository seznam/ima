---
"@ima/core": patch
"create-ima-app": patch
---

Removed bundling of `shippedProposals`, this can still be enabled through ima.config.js if desired.
Updated @ima/react-hooks dependency to latest version.
Vendor files are not being processed through swc from now only, except filenames under `@ima` namespace and any additional paths defined in the `transformVendorPaths` ima.config.js option.
