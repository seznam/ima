---
"@ima/core": minor
---

Added support for async controller and view imports in routing
Added `get` public method to `Router` for getting route handlers
Added `preload` public method to `Route` class, for async view and controllers preloading. Can be used in conjunction with the new `get` method for getting specific route handlers (routes) from `Router`.
