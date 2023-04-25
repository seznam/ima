---
"@ima/server": patch
"@ima/core": patch
---

Fixed incorrectly rendered meta properties, where they would render as `<meta name="og:title" property="Test Page" /> instead of `<meta property="og:title" content="Test Page" />`.
