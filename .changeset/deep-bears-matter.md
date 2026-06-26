---
"@ima/core": minor
---

Add middleware pipeline control tokens to `AbstractRouter`

Two new exported symbols from `@ima/core`:

- `MIDDLEWARE_ABORT_ROUTE` — pass to `next()` in a 3-argument middleware to stop all remaining middlewares and skip the route handler. Only honoured in `route()`; ignored in `handleError()` and `handleNotFound()` so a misbehaving global middleware cannot prevent error/404 pages from rendering.
- `MIDDLEWARE_STOP_PROPAGATION` — pass to `next()` to stop remaining middlewares in the current batch while still proceeding to the route handler.

The `_runMiddlewares()` return type changes from `Promise<boolean>` to `Promise<typeof MIDDLEWARE_ABORT_ROUTE | void>`.
