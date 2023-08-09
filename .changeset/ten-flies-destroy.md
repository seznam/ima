---
"@ima/server": patch
---

Fixed issue where non-string meta values were being sanitized through encodeHTMLEntities, which resulted in server error.
