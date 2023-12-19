---
"@ima/helpers": patch
---

fix for assignRecursively - use deepClone for arrays instead of slice, so any modifications in the assignRecursively result newly NOT mutate the other results
