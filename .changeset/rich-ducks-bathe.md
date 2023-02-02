---
"create-ima-app": major
"@ima/server": major
"@ima/core": major
---

Added new iterator functions to MetaManager.
Added ability to set additional attributes for meta tags/links in meta manager.
Meta values/attributes with null/undefined values are not rendered, other values are converted to string.

#### Breaking changes

Rewritten meta tag management in SPA mode, all MetaManager managed tags are removed between pages while new page contains only those currently defined using `setMetaParams` function in app controller. This should make meta tags rendering more deterministic, while fixing situations where old meta tags might be left on the page indefinitely if not cleaner properly.
MetaManager get* methods now always return object with key=value pairs of their set value. This should make settings additional meta attributes in loops much easier (for example: `getMetaProperty('og:title');` -> `{ property: 'property-value' });`)
`$Source` env variable has been renamed to `$Resources`.
