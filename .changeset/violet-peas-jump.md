---
"@ima/cli": patch
---

CLI now returns exit code 1 when unexpected error occurs, allowing it to be processed further by other tools. Was previously incorrectly returning exit code 0 no matter the situation.
