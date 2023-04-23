---
"create-ima-app": minor
"@ima/core": minor
"@ima/cli": minor
---

Added new `next` callback to router middleware functions
Fixed `RouteOptions` type definitiona across routing-related classes
Added middleware execution timeout => all middlewares must execute within this defined timeframe (defaults to 30s). This can be customized using `$Router.middlewareTimeout` app settings
