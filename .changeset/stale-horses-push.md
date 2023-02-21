---
"@ima/core": major
---

Remove older, conflicting settings of `HttpAgent`, `withCredentials`, `headers`, and `listeners`. The first two now conflict with the newer `options.fetchOptions`, the last one is no longer used for anything.

#### Breaking changes

`options.withCredentials` and `options.headers` are no longer followed. Use `options.fetchOptions.credentials` and `options.fetchOptions.headers` instead. For definition, see the native Fetch API. **Note**: for simplicity, `options.fetchOptions.headers` only accepts headers defined by an object, not a tuple or an instance of `Headers`.

`options.listeners` no longer supported.
