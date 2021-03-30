---
category: "page/state"
title: "API - Events"
menuTitle: "Events"
---

## Constants

<dl>
<dt><a href="#BEFORE_CHANGE_STATE">BEFORE_CHANGE_STATE</a> : <code>string</code></dt>
<dd><p>PateStateManager fire event <code>$IMA.$PageStateManager.beforeChangeState</code> before
state is patched. Event&#39;s data contain
<code>{ oldState: Object<string, *>, newState: Object<string, *>,
pathState:  Object<string, *> </code>}.</p>
</dd>
<dt><a href="#AFTER_CHANGE_STATE">AFTER_CHANGE_STATE</a> : <code>string</code></dt>
<dd><p>PateStateManager fire event <code>$IMA.$PageStateManager.afterChangeState</code> after state
is patched. Event&#39;s data contain <code>{newState: Object<string, *></code>}.</p>
</dd>
</dl>

## Events : <code>enum</code>&nbsp;<a name="Events" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/Events.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Events constants, which is firing to app.

**Kind**: global enum  

* * *

## BEFORE\_CHANGE\_STATE : <code>string</code>&nbsp;<a name="BEFORE_CHANGE_STATE" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/Events.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
PateStateManager fire event <code>$IMA.$PageStateManager.beforeChangeState</code> before
state is patched. Event's data contain
<code>{ oldState: Object<string, *>, newState: Object<string, *>,
pathState:  Object<string, *> </code>}.

**Kind**: global constant  

* * *

## AFTER\_CHANGE\_STATE : <code>string</code>&nbsp;<a name="AFTER_CHANGE_STATE" href="https://github.com/seznam/ima/blob/v17.9.0/packages/core/src/page/state/Events.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
PateStateManager fire event <code>$IMA.$PageStateManager.afterChangeState</code> after state
is patched. Event's data contain <code>{newState: Object<string, *></code>}.

**Kind**: global constant  

* * *

