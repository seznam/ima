---
id: "StateEvents"
title: "Enumeration: StateEvents"
sidebar_label: "StateEvents"
sidebar_position: 0
custom_edit_url: null
---

Events constants, which is firing to app.

## Enumeration Members

### AFTER\_CHANGE\_STATE

• **AFTER\_CHANGE\_STATE** = ``"$IMA.$PageStateManager.afterChangeState"``

PateStateManager fire event `$IMA.$PageStateManager.afterChangeState` after state
is patched. Event's data contain `{newState: Object<string, *>}`.

#### Defined in

[packages/core/src/page/state/Events.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/Events.ts#L17)

___

### BEFORE\_CHANGE\_STATE

• **BEFORE\_CHANGE\_STATE** = ``"$IMA.$PageStateManager.beforeChangeState"``

PateStateManager fire event `$IMA.$PageStateManager.beforeChangeState` before
state is patched. Event's data contain
`{ oldState: Object<string, *>, newState: Object<string, *>,
pathState:  Object<string, *> }`.

#### Defined in

[packages/core/src/page/state/Events.ts:11](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/state/Events.ts#L11)
