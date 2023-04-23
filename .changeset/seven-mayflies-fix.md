---
"@ima/core": major
---

Replace custom URL parsing methods in `AbstractRoute`, `StaticRoute` and `DynamicRoute` with combination of native URL and URLSearchParams.
Removed `pairsToQuery`, `paramsToQuery`, `getQuery`, `decodeURIParameter` static methods on `AbstractRoute`. These have been replaced with combination of native `URL` and `URLSearchParams` interfaces.
`getTrimmedPath` static method in `AbstractRoute` is now instance method.

#### Breaking Changes

Url query params with no value (`?param=`) are no longer extracted as `{ param: true }`, but as `{ param: '' }`. Please update your code to check for `key` presence in these cases rather than `true` value.
Parsing of semi-colons inside query params is not supported (as a result of using `URLSearchParams`)
