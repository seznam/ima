---
"@ima/server": patch
---

The instances of $Dispatcher, $Cache, $PageRenderer and $PageManager is cleared after server sending response. Clearing PageManager cause calling `destroy` lifecycle method of controller and extensions on server.
