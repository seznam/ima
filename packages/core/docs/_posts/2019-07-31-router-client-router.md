---
category: "router"
title: "ClientRouter"
---

## Classes

<dl>
<dt><a href="#ClientRouter">ClientRouter</a></dt>
<dd><p>The client-side implementation of the <code>Router</code> interface.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#CLICK">CLICK</a> : <code>string</code></dt>
<dd><p>Name of the event produced when the user clicks the page using the
mouse, or touches the page and the touch event is not stopped.</p>
</dd>
<dt><a href="#POP_STATE">POP_STATE</a> : <code>string</code></dt>
<dd><p>Name of the event fired when the user navigates back in the history.</p>
</dd>
<dt><a href="#MOUSE_LEFT_BUTTON">MOUSE_LEFT_BUTTON</a> : <code>number</code></dt>
<dd><p>The number used as the index of the mouse left button in DOM
<code>MouseEvent</code>s.</p>
</dd>
</dl>

## ClientRouter&nbsp;<a name="ClientRouter" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The client-side implementation of the <code>Router</code> interface.

**Kind**: global class  

* [ClientRouter](#ClientRouter)
    * [new ClientRouter(pageManager, factory, dispatcher, window)](#new_ClientRouter_new)
    * [._window](#ClientRouter+_window) : <code>Window</code>
    * [.init()](#ClientRouter+init)
    * [.getUrl()](#ClientRouter+getUrl)
    * [.getPath()](#ClientRouter+getPath)
    * [.listen()](#ClientRouter+listen)
    * [.redirect()](#ClientRouter+redirect)
    * [.route()](#ClientRouter+route)
    * [.handleError()](#ClientRouter+handleError)
    * [.handleNotFound()](#ClientRouter+handleNotFound)
    * [._handleFatalError(error)](#ClientRouter+_handleFatalError)
    * [._handleClick(event)](#ClientRouter+_handleClick)
    * [._getAnchorElement(target)](#ClientRouter+_getAnchorElement) ⇒ <code>Node</code>
    * [._isHashLink(targetUrl)](#ClientRouter+_isHashLink) ⇒ <code>boolean</code>
    * [._isSameDomain([url])](#ClientRouter+_isSameDomain) ⇒ <code>boolean</code>


* * *

### new ClientRouter(pageManager, factory, dispatcher, window)&nbsp;<a name="new_ClientRouter_new"></a>
Initializes the client-side router.


| Param | Type | Description |
| --- | --- | --- |
| pageManager | <code>PageManager</code> | The page manager handling UI rendering,        and transitions between pages if at the client side. |
| factory | <code>RouteFactory</code> | Factory for routes. |
| dispatcher | <code>Dispatcher</code> | Dispatcher fires events to app. |
| window | <code>Window</code> | The current global client-side APIs provider. |


* * *

### clientRouter.\_window : <code>Window</code>&nbsp;<a name="ClientRouter+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L69" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Helper for accessing the native client-side APIs.

**Kind**: instance property of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.init()&nbsp;<a name="ClientRouter+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L75" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.getUrl()&nbsp;<a name="ClientRouter+getUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L85" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.getPath()&nbsp;<a name="ClientRouter+getPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L92" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.listen()&nbsp;<a name="ClientRouter+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L99" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.redirect()&nbsp;<a name="ClientRouter+redirect" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L127" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.route()&nbsp;<a name="ClientRouter+route" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L145" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.handleError()&nbsp;<a name="ClientRouter+handleError" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L168" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.handleNotFound()&nbsp;<a name="ClientRouter+handleNotFound" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L195" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

* * *

### clientRouter.\_handleFatalError(error)&nbsp;<a name="ClientRouter+_handleFatalError" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L207" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handle a fatal error application state. IMA handle fatal error when IMA
handle error.

**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

| Param | Type |
| --- | --- |
| error | <code>Error</code> | 


* * *

### clientRouter.\_handleClick(event)&nbsp;<a name="ClientRouter+_handleClick" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L229" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles a click event. The method performs navigation to the target
location of the anchor (if it has one).

The navigation will be handled by the router if the protocol and domain
of the anchor's target location (href) is the same as the current,
otherwise the method results in a hard redirect.

**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>MouseEvent</code> | The click event. |


* * *

### clientRouter.\_getAnchorElement(target) ⇒ <code>Node</code>&nbsp;<a name="ClientRouter+_getAnchorElement" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L276" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The method determines whether an anchor element or a child of an anchor
element has been clicked, and if it was, the method returns anchor
element else null.

**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  

| Param | Type |
| --- | --- |
| target | <code>Node</code> | 


* * *

### clientRouter.\_isHashLink(targetUrl) ⇒ <code>boolean</code>&nbsp;<a name="ClientRouter+_isHashLink" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L303" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the provided target URL contains only an update of the
hash fragment of the current URL.

**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  
**Returns**: <code>boolean</code> - <code>true</code> if the navigation to target URL would
        result only in updating the hash fragment of the current URL.  

| Param | Type | Description |
| --- | --- | --- |
| targetUrl | <code>string</code> | The target URL. |


* * *

### clientRouter.\_isSameDomain([url]) ⇒ <code>boolean</code>&nbsp;<a name="ClientRouter+_isSameDomain" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L326" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the the protocol and domain of the provided URL are the
same as the current.

**Kind**: instance method of [<code>ClientRouter</code>](#ClientRouter)  
**Returns**: <code>boolean</code> - <code>true</code> if the protocol and domain of the
        provided URL are the same as the current.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The URL. |


* * *

## Events : <code>enum</code>&nbsp;<a name="Events" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Names of the DOM events the router responds to.

**Kind**: global enum  

* * *

## CLICK : <code>string</code>&nbsp;<a name="CLICK" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Name of the event produced when the user clicks the page using the
mouse, or touches the page and the touch event is not stopped.

**Kind**: global constant  

* * *

## POP\_STATE : <code>string</code>&nbsp;<a name="POP_STATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Name of the event fired when the user navigates back in the history.

**Kind**: global constant  

* * *

## MOUSE\_LEFT\_BUTTON : <code>number</code>&nbsp;<a name="MOUSE_LEFT_BUTTON" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/router/ClientRouter.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The number used as the index of the mouse left button in DOM
<code>MouseEvent</code>s.

**Kind**: global constant  

* * *

