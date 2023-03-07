---
"@ima/cli": patch
---

Fixed issue where ManifestPlugin produced manifest.json file without client assets. This could resolve in error where application loads without and JS and CSS assets and is not revived.
