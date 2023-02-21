---
"@ima/core": major
---

Remove older, conflicting settings of `HttpAgent`, `withCredentials` and `headers`.

These settings started to conflict with newer `options.fetchOptions` settings `credentials` and `headers`. For clarity, we decided to only support the `fetchOptions` settings.

BREAKING CHANGE: `options.withCredentials` and `options.headers` are no longer followed. Use `options.fetchOptions.credentials` and `options.fetchOptions.headers` instead. For definition, see the native Fetch API. **Note**: for simplicity, `options.fetchOptions.headers` only accepts headers defined by an object, not a tuple or an instance of `Headers`.
