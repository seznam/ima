---
"@ima/plugin-cli": minor
---

When parsing configuration file the plugin now searches for ima-plugin.config.js files recursively up to filesystem root. This allows to have one custom config file for monorepositories and removes the need of duplicating same config across all package directories
