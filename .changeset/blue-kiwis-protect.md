---
"@ima/core": patch
"@ima/react-page-renderer": patch
"@ima/server": patch
---

The status, send, setPageState and isResponseSent methods removed from $Response class. The $Router.redirect method throw internal redirect errors. Returns value from server.requestHandlerMiddleware has new page property with state, cache, cookie and headers.
