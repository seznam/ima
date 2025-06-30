---
"@ima/core": patch
---

Add option for caching failed requests.

- **What** Add the caching option of failed requests to the _proxyRejected() method. Extended httpAgentRequestOptions with flag cacheFailedRequest to signalize if the failed request should be cached.
- **Why** Prevent mishmashdom errors by caching failed requests on the server.
- **How** None.
