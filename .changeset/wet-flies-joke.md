---
"@ima/plugin-cli": minor
---

 - `typescriptDeclarationsPlugin` now accepts optional `tsConfigPath`, which allows you to specify a custom path to your `tsconfig.json` file.
 - `typescriptDeclarationsPlugin` now by default tries to resolve `tsconfig.build.json` before `tsconfig.json`, if it exists.
 - `typescriptDeclarationsPlugin` can now trigger `exit 1` when types are not correctly generated, instead of silently ignoring the error. This can be enabled by setting `failOnTypeErrors` to `true`.
 - All FS operations in `dev` and `link` mode are now batched with a debounce of 150ms, which should improve performance when working with a large number of files. The output is also batched and simplified, which should significantly reduce the output noise.
