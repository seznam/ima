---
"@ima/cli": patch
"@ima/server": patch
---

Added new global env IMA_CLI_WATCH indicating dev command run
Server no longer deletes require cache during refresh in dev environments, rather this functionality is now connected to IMA_CLI_WATCH variable. This means that it only happens during local watch development.
