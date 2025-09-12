---
"@ima/plugin-cli": major
---

Updated `chokidar` to version 4. This comes with breaking change where globs are NO LONGER SUPPORTED, in the `additionalWatchPaths` option. Just use base paths to directories, all their contents will be watched automatically or paths to files.
