---
"@ima/server": major
---

Default resources in $Resources now produce styles and esStyles fields. This does not necessarily mean which should be loaded on which es version, but what bundle produced those styles. This also means that without any custom configuration, all styles should now be under `esStyles` key, since they are built in client.es webpack bundle.
#### BREAKING CHANGE
  The package now provides named exports, the deafult export has been replaced with named `createIMAServer` function.
