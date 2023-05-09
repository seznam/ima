---
"@ima/react-page-renderer": patch
---

Fixed issue where context was not properly memoized. This triggered uninteded context updates and rerenders when no real value in the context actually changed.
Fixed issue where createContext received 2 arguments (Utils and object with context selector values) instead of variadic args.
