---
"create-ima-app": minor
"@ima/cli": minor
---

Replaced locale-loader with custom compilation process of language files
This fixes an issue where newly added language files are not visible by the webpack compile and requires restart with forced cache clear.
