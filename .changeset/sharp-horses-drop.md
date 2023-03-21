---
"@ima/core": major
---

Multiple changes in router route handling and page manager with a goal of implementing ability to cancel running handlers before handling a new ones. This results in much more stable routing specifically when using async routes. Each route should now be executed "sequentially" where BEFORE/AFTER_HANDLE_ROUTE router events should always fire in correct order. Also if you quickly move between different routes, without them finishing loading, the page manager is able to cancel it's executing mid handling and continue with a new route, which results in faster and more stable routing. While this change is essentially not a breaking change, since it only changes our internal API, it could possibly result in some new behaviour.
Added `BEFORE_ASYNC_ROUTE` and `AFTER_ASYNC_ROUTE` which you can use to implement custom loaders when routing between async routes (or use it for any other handling).
