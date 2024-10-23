---
"@ima/core": patch
---

Fixed cookie parsing from setCookie header when multiple cookies were sent to server. Previously only the first cookie was parsed while multiple set-cookies could alter the cookie settings
