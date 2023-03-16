---
"@ima/core": patch
---

Spreaded extensions are now correctly added to controller extensions map. This means that you can access those extensions using their constructor `this.getExtension(LoginExtension)` as you would while not using "spread" functionality.
