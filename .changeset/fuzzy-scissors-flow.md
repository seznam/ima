---
"@ima/hmr-client": patch
"@ima/core": patch
---

Fixed async issue in HMR, where IMA app could be re-rendered before the old instance finished cleanup.
