---
"create-ima-app": minor
"@ima/core": minor
---

Added new settings `validateCookies` to enable/disable cookie validation. It validates cookie options and request url before saving cookie or sending it to the server. This means that path, subdomain and secure options must match between the request url and the cookie, otherwise the cookie is not saved or sent.
