---
"@ima/cli": minor
---

Added support for `tsconfig.build.json` config file, which is prioritized for tsChecker plugin in webpack. This allows to have separate tsconfig for build and code editor, which let's you opt out of checking some files not needed for build.
