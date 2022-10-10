---
"@ima/core": major
"create-ima-app": major
"@ima/react-page-renderer": major
---

**BREAKING CHANGE** `getMetaName`, `getMetaProperty` and `getLink` meta manager methods now return an object with attributes instead of a string.
`setMeta*` meta manager methods accept third arg for additional meta attrs
Meta attrs are stored as an object
Multiple meta attrs can be set
Meta tags are now synced after route change

