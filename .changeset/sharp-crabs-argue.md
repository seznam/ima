---
"@ima/core": major
---

`extractParameters()` function in `DynamicRoute` now receives additional object argument, containing `query` and `path` (not modified path) for more control over extracted parameters.
**BREAKING CHANGE** the router now uses params returned from `extractParameters()` directly. It no longer automatically merges query params into the resulting object. If you want to preserve this behavior, merge the extracted route params with `query` object provided in the second argument.
