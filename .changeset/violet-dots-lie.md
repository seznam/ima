---
"@ima/core": patch
---

- Added `response` to `getParams()` in HttpProxy error responses
- Always parse not OK responses as `json()` when response headers content-type is `application/json`
