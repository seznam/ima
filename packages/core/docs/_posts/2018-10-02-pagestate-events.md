---
category: "page/state"
title: "Events"
---

## Constants

<dl>
<dt><a href="#BEFORE_CHANGE_STATE">BEFORE_CHANGE_STATE</a> : <code>string</code></dt>
<dd><p>PateStateManager fire event <code>$IMA.$Dispatcher.beforeChangeState</code> before
state is patched. Event&#39;s data contain
<code>{ oldState: Object&lt;string, <em>&gt;, newState: Object&lt;string, </em>&gt;,
pathState:  Object&lt;string, *&gt; </code>}.</p>
</dd>
<dt><a href="#AFTER_CHANGE_STATE">AFTER_CHANGE_STATE</a> : <code>string</code></dt>
<dd><p>Router fire event <code>$IMA.$Dispatcher.afterChangeState</code> after state
is patched. Event&#39;s data contain <code>{newState: Object&lt;string, *&gt;</code>.</p>
</dd>
</dl>

## Events : <code>enum</code>&nbsp;<a name="Events" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/page/state/Events.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Events constants, which is firing to app.

**Kind**: global enum  

* * *

## BEFORE_CHANGE_STATE : <code>string</code>&nbsp;<a name="BEFORE_CHANGE_STATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/page/state/Events.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
PateStateManager fire event <code>$IMA.$Dispatcher.beforeChangeState</code> before
state is patched. Event's data contain
<code>{ oldState: Object<string, *>, newState: Object<string, *>,
pathState:  Object<string, *> </code>}.

**Kind**: global constant  

* * *

## AFTER_CHANGE_STATE : <code>string</code>&nbsp;<a name="AFTER_CHANGE_STATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.5/page/state/Events.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Router fire event <code>$IMA.$Dispatcher.afterChangeState</code> after state
is patched. Event's data contain <code>{newState: Object<string, *></code>.

**Kind**: global constant  

* * *

