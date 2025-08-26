---
"@ima/core": patch
---

Fix caching of failed requests

- **What** Remove caching instance of GenericError object. Instead we are now caching only its data and alter, after getting the data from cache, we create instance of GenericError and reject it.
- **What** Serializing of cache modified GenericError instance, that was no longer an error, so was not rejected by following requests.
- **What** Nothing.
