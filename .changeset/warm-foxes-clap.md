---
"@ima/server": patch
---

Pass request object to `getThreats` (from `@esmj/monitor`) to cache the threats evaluation per request. If you call `getThreats(req)` in your own code, you'll now receive the same threats object as `event.threats` instead of a freshly re-evaluated one.
