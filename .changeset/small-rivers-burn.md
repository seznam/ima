---
"@ima/testing-library": minor
---

Throw an error when JSDOM HTML template render failed. This can be potentially a **BREAKING CHANGE** if your tests are already using a broken HTML template in JSDOM. Until now, you might not have even noticed the problem until you had a test accessing specific context features that required a proper HTML template.
