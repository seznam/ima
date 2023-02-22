---
"@ima/core": minor
---

Controller and Extension event bus methods can be targeted with prefix. Prefix is set by public field in controller/extension class e.g. `eventBusMethodPrefix = 'fireEventPrefix';`. Event is then `fireEventPrefix.eventName`.
