---
"@ima/core": minor
---

Observable

- **What?** Change `Observable` to resemble the structure and usage of `Dispatcher` more closely - use the abstract class for typing `Utils`, use method overloading the same way, etc. Remove typo in `registerPersistenEvent` method name and rename to `registerPersistentEvent` (note the `t`). Old method has been retained for backwards compatibility and marked as deprecated, it will be removed in the next major version.
- **Why?** Avoid typing issues and potential grief with correctly-but-incorrectly named method.
- **How?** Please migrate from `registerPersistenEvent` to `registerPersistentMethod`.


