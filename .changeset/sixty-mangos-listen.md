---
"@ima/core": patch
---

Add option for caching failed requests.

- **What** Add the caching option to the _proxyRejected() method. Extended httpAgentRequestOptions with flag cacheFailedRequest
- **Why** Prevent mishmashdom errors by caching failed requests on the server.
- **How** None.
