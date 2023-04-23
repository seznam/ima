---
"@ima/core": minor
---

Router middlewares now support `next` callback, which when defined, has to be called, otherwise the middleware will eventually timeout and not proceed any further. This enables some additional features, where you are able to stop route processing by not calling the next functio if desired.
Middlewares can now return object value, which will be merged to the locals object, received as a second argument in middleware function
