---
"@ima/cli": patch
"@ima/plugin-cli": patch
"create-ima-app": patch
---

Update SWC and its Jest plugin to compatible versions.

- **What?** Upgrade `@swc/core` to `^1.16.2` in `@ima/cli` and `@ima/plugin-cli`, update `@swc-contrib/mut-cjs-exports` to `^16.0.0` in the workspace root and shared `create-ima-app` template, and remove the temporary SWC 1.15 constraints.
- **Why?** Fix the Wasm compatibility mismatch between SWC and Jest's mutable CommonJS exports plugin without keeping SWC on the 1.15 release line.
- **How?** Existing apps using `@swc-contrib/mut-cjs-exports` must update it to `^16.0.0` when upgrading to SWC 1.16. Update any explicit `@swc/core` constraints to `^1.16.2` and reinstall dependencies. Clear Jest's cache with `jest --clearCache` if it still uses the old transform.
