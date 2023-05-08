---
"@ima/cli": minor
---

Added support for `prepareConfigurations` in ima.config.js
Moved many more configuration variables to ima configuration context from the config.ts file. This allows for more flexibility in the `prepareConfigurations` function and easier customization without the need to customize generated webpack config.
