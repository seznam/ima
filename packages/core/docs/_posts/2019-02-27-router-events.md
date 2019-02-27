---
category: "router"
title: "Events"
---

## Constants

<dl>
<dt><a href="#BEFORE_HANDLE_ROUTE">BEFORE_HANDLE_ROUTE</a> : <code>string</code></dt>
<dd><p>Router fire event <code>$IMA.$Router.beforeHandleRoute</code> before page
manager handle the route. Event&#39;s data contain
<code>{ params: Object&lt;string, string&gt;</code>, route: ima.router.Route,
path: string, options: Object&lt;string, *&gt;}}. The <code>path</code> is current
path, the <code>params</code> are params extracted from path, the
<code>route</code> is handle route for path and the <code>options</code> is route
additional options.</p>
</dd>
<dt><a href="#AFTER_HANDLE_ROUTE">AFTER_HANDLE_ROUTE</a> : <code>string</code></dt>
<dd><p>Router fire event <code>$IMA.$Router.afterHandleRoute</code> after page
manager handle the route. Event&#39;s data contain
<code>{response: Object&lt;string, <em>&gt;, params: Object&lt;string, string&gt;</code>,
route: ima.router.Route, path: string, options: Object&lt;string, </em>&gt;}}.
The <code>response</code> is page render result. The <code>path</code> is current
path, the <code>params</code> are params extracted from path, the
<code>route</code> is handle route for path and the <code>options</code> is route
additional options.</p>
</dd>
</dl>

## Events : <code>enum</code>&nbsp;<a name="Events" href="https://github.com/seznam/IMA.js-core/tree/0.16.3/router/Events.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Events constants, which is firing to app.

**Kind**: global enum  

* * *

## BEFORE\_HANDLE\_ROUTE : <code>string</code>&nbsp;<a name="BEFORE_HANDLE_ROUTE" href="https://github.com/seznam/IMA.js-core/tree/0.16.3/router/Events.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Router fire event <code>$IMA.$Router.beforeHandleRoute</code> before page
manager handle the route. Event's data contain
<code>{ params: Object<string, string></code>, route: ima.router.Route,
path: string, options: Object<string, *>}}. The <code>path</code> is current
path, the <code>params</code> are params extracted from path, the
<code>route</code> is handle route for path and the <code>options</code> is route
additional options.

**Kind**: global constant  

* * *

## AFTER\_HANDLE\_ROUTE : <code>string</code>&nbsp;<a name="AFTER_HANDLE_ROUTE" href="https://github.com/seznam/IMA.js-core/tree/0.16.3/router/Events.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Router fire event <code>$IMA.$Router.afterHandleRoute</code> after page
manager handle the route. Event's data contain
<code>{response: Object<string, *>, params: Object<string, string></code>,
route: ima.router.Route, path: string, options: Object<string, *>}}.
The <code>response</code> is page render result. The <code>path</code> is current
path, the <code>params</code> are params extracted from path, the
<code>route</code> is handle route for path and the <code>options</code> is route
additional options.

**Kind**: global constant  

* * *

