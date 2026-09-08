---
"@ima/cli": patch
"@ima/plugin-cli": patch
"create-ima-app": patch
---

Keep SWC on the 1.15 release line.

- **What** Constrain `@swc/core` to `~1.15.1` in `@ima/cli`, `@ima/plugin-cli`, and the shared `create-ima-app` template for JavaScript and TypeScript apps, and align the workspace root and lockfile with the same release line.
- **Why** Prevent later SWC minor releases from being installed automatically and breaking Jest's `@swc-contrib/mut-cjs-exports` Wasm transform in generated apps.
- **How** Nothing.
