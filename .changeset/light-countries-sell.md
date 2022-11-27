---
"@ima/cli": patch
---

Removed custom fastRefreshEntry point in favor of disabling the overlay completely
Added support for serving of in-memory static files in watch mode
Added new CLI args `writeToDisk` and `reactRefresh` to disable in-memory serving and react refresh
Replaced @gatsbyjs/webpack-hot-middleware fork with latest version of webpack-hot-middleware which now supports webpack5 officially
