---
"@ima/react-page-renderer": minor
"create-ima-app": minor
"@ima/hmr-client": minor
"@ima/server": minor
"@ima/core": minor
"@ima/cli": minor
---

Replaced locale-loader with custom compilation process of language files, this fixes an issue where newly added language files are not visible by the webpack compile and requires restart with forced cache clear.
Implemented custom solution for hot module replacement API for language files (HMR for language files should be much faster and only )
