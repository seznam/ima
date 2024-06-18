---
"@ima/react-page-renderer": minor
"@ima/core": minor
---

Adds flag `batchResolveNoTransaction` as a new `PageRendererSettings`. When it is true, transaction is not used in load phase to avoid getting obsolete state from getState.
