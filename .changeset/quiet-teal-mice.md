---
"@ima/cli": patch
---

Switch from `filesystem` to `memory` webpack cache configuration. The filesystem cache was causing issues with webpack v5.100.0+, which led to `ima dev` command failing if a cache from a previous run existed and files in node_modules were changed. We might consider switching back to `filesystem` cache once we figure out the root cause of the issue.
