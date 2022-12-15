---
"@ima/cli": patch
"create-ima-app": patch
"@ima/server": patch
---

Added ManifestPlugin, that generates manifest.json files containing map to sources which should be injected to web app upon load.
$Source definition is no longer defined, it is generated automatically using generated manifest.json file. This can still be customized using custom definition of $Source function.
Added support for content hashes
