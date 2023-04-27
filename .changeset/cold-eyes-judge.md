---
"@ima/core": patch
---

Don't call preManage on `PageNavigationHandler` on first call. This is not needed since it handles correct browser behavior in SPA mode, but the behavior is correctly set on the first call.
Reverted inclusion of hash arguments in initial routing, introduced in previous patch version.
