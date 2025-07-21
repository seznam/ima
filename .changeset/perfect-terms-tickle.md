---
"@ima/core": minor
---

Observable

- **What?** Change `Observable` to resemble the structure and usage of `Dispatcher` more closely - use the abstract class for typing `Utils`, use method overloading the same way, etc. Remove typo in `registerPersistenEvent` method name and rename to `registerPersistentEvent` (note the `t`).
- **Why?** Avoid typing issues and potential grief with correctly-but-incorrectly named method.
- **How?** Change from `registerPersistenEvent` to `registerPersistentMethod`.


