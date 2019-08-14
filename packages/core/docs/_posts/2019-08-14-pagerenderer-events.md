---
category: "page/renderer"
title: "Events"
---

## Constants

<dl>
<dt><a href="#MOUNTED">MOUNTED</a> : <code>string</code></dt>
<dd><p>PageRenderer fire event <code>$IMA.$PageRenderer.mounted</code> after
current page view is mounted to the DOM. Event&#39;s data contain
<code>{type: string</code>}.</p>
</dd>
<dt><a href="#UPDATED">UPDATED</a> : <code>string</code></dt>
<dd><p>PageRenderer fire event <code>$IMA.$PageRenderer.updated</code> after
current state is updated in the DOM. Event&#39;s data contain
<code>{state: Object<string, *></code>}.</p>
</dd>
<dt><a href="#UNMOUNTED">UNMOUNTED</a> : <code>string</code></dt>
<dd><p>PageRenderer fire event <code>$IMA.$PageRenderer.unmounted</code> after current view is
unmounted from the DOM. Event&#39;s data contain
<code>{type: string</code>}.</p>
</dd>
</dl>

## Events : <code>enum</code>&nbsp;<a name="Events" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/page/renderer/Events.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Events constants, which is firing to app.

**Kind**: global enum  

* * *

## MOUNTED : <code>string</code>&nbsp;<a name="MOUNTED" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/page/renderer/Events.js#L15" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
PageRenderer fire event <code>$IMA.$PageRenderer.mounted</code> after
current page view is mounted to the DOM. Event's data contain
<code>{type: string</code>}.

**Kind**: global constant  

* * *

## UPDATED : <code>string</code>&nbsp;<a name="UPDATED" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/page/renderer/Events.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
PageRenderer fire event <code>$IMA.$PageRenderer.updated</code> after
current state is updated in the DOM. Event's data contain
<code>{state: Object<string, *></code>}.

**Kind**: global constant  

* * *

## UNMOUNTED : <code>string</code>&nbsp;<a name="UNMOUNTED" href="https://github.com/seznam/IMA.js-core/tree/0.16.10/page/renderer/Events.js#L35" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
PageRenderer fire event <code>$IMA.$PageRenderer.unmounted</code> after current view is
unmounted from the DOM. Event's data contain
<code>{type: string</code>}.

**Kind**: global constant  

* * *

