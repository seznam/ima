---
"@ima/server": major
---

#### Breaking changes

Dropped support for direct `response.contentVariables` mutations, use `event.result` and return in `CreateContentVariables` event.
Dropped support for `$Source`, `$RevivalSettings`, `$RevivalCache`, `$Runner`, `$Styles`, `$Scripts` content variables. These have been replaced by their `lowerFirst` counter-parts `source`, `revivalSettings`, `revivalCache`, `runner`, `styles`, `scripts`, while `$Scripts` support have been dropped completely.
