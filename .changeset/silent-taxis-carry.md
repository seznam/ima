---
"@ima/server": patch
---

Fixed issue with delete require.cache caching, which could resolve in problems where app.server.js file is not reloaded when vendors change.
Runner is now reloaded form filesystem on every refresh in watch mode, this resolves issue where you get OLD SSR version of the application during development upon refresh.
