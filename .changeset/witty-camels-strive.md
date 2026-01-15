---
"@ima/server": patch
---

Fix $Language property resolution in server environment where adding the default '//*:*' value could override custom configurations due to incorrect merge order. Fix $IMA.$Root property resolution on client where default $Language settings were overriding all other language configurations instead of serving as fallback.
