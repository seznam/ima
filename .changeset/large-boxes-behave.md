---
"@ima/core": patch
---

Used baseUrl + path for params parsing, instead of full current url. This fixes issue where path is already different (redirect) than currently routed URL, which results in invalid params.
