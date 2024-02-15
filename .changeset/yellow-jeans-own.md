---
"@ima/core": minor
---

Added new `responseType` to `HttpAgentRequestOptions` which enables you to specify proxy response type. This serves as an alternative to existing solution, which parses JSON, null or fallbacks to text. Use this for other response types like globs, arrayBuffers or formData
