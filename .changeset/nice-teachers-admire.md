---
"@ima/react-page-renderer": minor
"@ima/core": minor
---

Added `autoYield` mechanism to ima which improve browser responsiveness and core web vitals metrics. The micro tasks are divide into macro tasks if it needs it. In the `PageRenderer` is updated logic for batching updates during page loading phase which is still experimental.
