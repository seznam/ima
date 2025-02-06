---
"@ima/server": patch
---

The ima app instance must be always cleared before storing for next usage. We fixed edge case specific error which could lead to zombie app.
