---
"@ima/server": patch
---

Use `applicationFolder` to reference to application root everywhere. Until now, sometimes we would refer to `applicationFolder` as root, while other times we refered to `process.cwd()`, which caused some inconsistencies and it was not usable outside of tests scope (which is a reason why this was implemented in a first place).
