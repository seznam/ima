---
"@ima/plugin-cli": minor
---

Add package.json link to additionalWatchPaths

- **What** The `package.json` file is now added to the `additionalWatchPaths`.
- **Why** This allows the CLI to watch for changes in the package configuration, such as updates to the `bin` key or other package metadata and fixes use-case with new packages that could not be used in projects due to missing `package.json`.
- **How** Nothing, just if your plugin uses `additionalWatchPaths` it will now include the `package.json` file automatically.
