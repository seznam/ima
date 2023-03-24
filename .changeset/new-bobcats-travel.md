---
"create-ima-app": major
"@ima/server": major
---

Migrated urlParser middleware to ima server BeforeRequest hook
  #### Breaking Change
  Remove `urlParser` middleware from `app.js`, it is now part of `renderApp` middleware.
