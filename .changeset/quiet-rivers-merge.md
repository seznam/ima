---
"@ima/cli": patch
---

Fix race condition in `parseLanguageFiles` where language files sharing the same dictionary key (e.g. multiple `buttonsEN.json` files in different directories) could overwrite each other instead of being deep-merged. File reads still run in parallel, but the merge into the shared messages dictionary is now performed sequentially after all reads complete.
