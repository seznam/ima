---
category: "window"
title: "Window"
---

## Window&nbsp;<a name="Window" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Window](#Window)
    * [.isClient()](#Window+isClient) ⇒ <code>boolean</code>
    * [.isCookieEnabled()](#Window+isCookieEnabled) ⇒ <code>boolean</code>
    * [.hasSessionStorage()](#Window+hasSessionStorage) ⇒ <code>boolean</code>
    * [.setTitle(title)](#Window+setTitle)
    * ~~[.getWebSocket()](#Window+getWebSocket) ⇒ <code>function</code>~~
    * [.getWindow()](#Window+getWindow) ⇒ <code>undefined</code> \| [<code>Window</code>](#Window)
    * [.getDocument()](#Window+getDocument) ⇒ <code>undefined</code> \| <code>Document</code>
    * [.getScrollX()](#Window+getScrollX) ⇒ <code>number</code>
    * [.getScrollY()](#Window+getScrollY) ⇒ <code>number</code>
    * [.scrollTo(x, y)](#Window+scrollTo)
    * [.getDomain()](#Window+getDomain) ⇒ <code>string</code>
    * [.getHost()](#Window+getHost) ⇒ <code>string</code>
    * [.getPath()](#Window+getPath) ⇒ <code>string</code>
    * [.getUrl()](#Window+getUrl) ⇒ <code>string</code>
    * [.getBody()](#Window+getBody) ⇒ <code>undefined</code> \| <code>HTMLBodyElement</code>
    * [.getElementById(id)](#Window+getElementById) ⇒ <code>HTMLElement</code>
    * [.getHistoryState()](#Window+getHistoryState) ⇒ <code>Object</code>
    * [.querySelector(selector)](#Window+querySelector) ⇒ <code>HTMLElement</code>
    * [.querySelectorAll(selector)](#Window+querySelectorAll) ⇒ <code>NodeList</code>
    * [.redirect(url)](#Window+redirect)
    * [.pushState(state, title, url)](#Window+pushState)
    * [.replaceState(state, title, [url])](#Window+replaceState)
    * [.createCustomEvent(name, options)](#Window+createCustomEvent) ⇒ <code>CustomEvent</code>
    * [.bindEventListener(eventTarget, event, listener, [useCapture])](#Window+bindEventListener)
    * [.unbindEventListener(eventTarget, event, listener, [useCapture])](#Window+unbindEventListener)


* * *

### window.isClient() ⇒ <code>boolean</code>&nbsp;<a name="Window+isClient" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L14" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns <code>true</code> if invoked at the client side.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>boolean</code> - <code>true</code> if invoked at the client side.  

* * *

### window.isCookieEnabled() ⇒ <code>boolean</code>&nbsp;<a name="Window+isCookieEnabled" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns <code>true</code> if the cookies are set and processed with every
HTTP request and response automatically by the environment.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>boolean</code> - <code>true</code> if cookies are handled automatically by
        the environment.  

* * *

### window.hasSessionStorage() ⇒ <code>boolean</code>&nbsp;<a name="Window+hasSessionStorage" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns <code>true</code> if the session storage is supported.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>boolean</code> - <code>true</code> if the session storage is supported.  

* * *

### window.setTitle(title)&nbsp;<a name="Window+setTitle" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the new page title of the document.

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The new page title. |


* * *

### ~~window.getWebSocket() ⇒ <code>function</code>~~&nbsp;<a name="Window+getWebSocket" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L49" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
***Deprecated***

Returns the current <code>WebSocket</code> implementation to use.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>function</code> - The current <code>WebSocket</code>
        implementation.  

* * *

### window.getWindow() ⇒ <code>undefined</code> \| [<code>Window</code>](#Window)&nbsp;<a name="Window+getWindow" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L59" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the native <code>window</code> object representing the global context
at the client-side. The method returns <code>undefined</code> if used at the
server-side.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>undefined</code> \| [<code>Window</code>](#Window) - The <code>window</code> object at the
        client-side, or <code>undefined</code> at the server-side.  

* * *

### window.getDocument() ⇒ <code>undefined</code> \| <code>Document</code>&nbsp;<a name="Window+getDocument" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L70" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the native <code>document</code> object representing any web page loaded
in the browser and serves as an entry point into the web page's content
which is the DOM tree at the client-side. The method returns <code>undefined</code>
if used at the server-side.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>undefined</code> \| <code>Document</code> - The <code>document</code> object at the
        client-side, or <code>undefined</code> at the server-side.  

* * *

### window.getScrollX() ⇒ <code>number</code>&nbsp;<a name="Window+getScrollX" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L78" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the number of pixels the viewport is scrolled horizontally.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>number</code> - The number of pixels the viewport is scrolled
        horizontally.  

* * *

### window.getScrollY() ⇒ <code>number</code>&nbsp;<a name="Window+getScrollY" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the number of pixels the document is scrolled vertically.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>number</code> - The number of pixels the document is scrolled
        vertically.  

* * *

### window.scrollTo(x, y)&nbsp;<a name="Window+scrollTo" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L94" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Scrolls the viewport to the specified location (if possible).

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Horizontal scroll offset in pixels. |
| y | <code>number</code> | Vertical scroll offset in pixels. |


* * *

### window.getDomain() ⇒ <code>string</code>&nbsp;<a name="Window+getDomain" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L102" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the domain of the current document's URL as
<code>`${protocol</code>://${host}`}.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>string</code> - The current domain.  

* * *

### window.getHost() ⇒ <code>string</code>&nbsp;<a name="Window+getHost" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the application's host.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>string</code> - The current host.  

* * *

### window.getPath() ⇒ <code>string</code>&nbsp;<a name="Window+getPath" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L116" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the path part of the current URL, including the query string.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>string</code> - The path and query string parts of the current URL.  

* * *

### window.getUrl() ⇒ <code>string</code>&nbsp;<a name="Window+getUrl" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L123" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current document's URL.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>string</code> - The current document's URL.  

* * *

### window.getBody() ⇒ <code>undefined</code> \| <code>HTMLBodyElement</code>&nbsp;<a name="Window+getBody" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L132" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the document's body element. The method returns
<code>undefined</code> if invoked at the server-side.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>undefined</code> \| <code>HTMLBodyElement</code> - The document's body element, or
        <code>undefined</code> if invoked at the server side.  

* * *

### window.getElementById(id) ⇒ <code>HTMLElement</code>&nbsp;<a name="Window+getElementById" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L141" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the HTML element with the specified <code>id</code> attribute value.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>HTMLElement</code> - The element with the specified id, or
        <code>null</code> if no such element exists.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The value of the <code>id</code> attribute to look for. |


* * *

### window.getHistoryState() ⇒ <code>Object</code>&nbsp;<a name="Window+getHistoryState" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L148" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the history state.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>Object</code> - The current history state  

* * *

### window.querySelector(selector) ⇒ <code>HTMLElement</code>&nbsp;<a name="Window+querySelector" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L157" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the first element matching the specified CSS 3 selector.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>HTMLElement</code> - The first element matching the CSS selector or
        <code>null</code> if no such element exists.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | The CSS selector. |


* * *

### window.querySelectorAll(selector) ⇒ <code>NodeList</code>&nbsp;<a name="Window+querySelectorAll" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L167" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns a node list of all elements matching the specified CSS 3
selector.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>NodeList</code> - A node list containing all elements matching the
        specified CSS selector.  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | The CSS selector. |


* * *

### window.redirect(url)&nbsp;<a name="Window+redirect" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L175" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Performs a hard redirect (discarding the current JavaScript state) to
the specified URL.

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to which the browser will be redirected. |


* * *

### window.pushState(state, title, url)&nbsp;<a name="Window+pushState" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L187" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Pushes a new state to the browser history. The method has no effect if
the current browser does not support the history API (IE9).

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object.&lt;string, \*&gt;</code> | A state object associated with the        history item, preferably representing the page state. |
| title | <code>string</code> | The page title related to the state. Note that        this parameter is ignored by some browsers. |
| url | <code>string</code> | The new URL at which the state is available. |


* * *

### window.replaceState(state, title, [url])&nbsp;<a name="Window+replaceState" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L199" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Replaces the current history entry. The method has no effect if the
current browser does not support the history API (IE9).

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| state | <code>Object.&lt;string, \*&gt;</code> |  | A state object associated with the        history item, preferably representing the page state. |
| title | <code>string</code> |  | The page title related to the state. Note that        this parameter is ignored by some browsers. |
| [url] | <code>string</code> | <code>null</code> | The new URL at which the state is available. |


* * *

### window.createCustomEvent(name, options) ⇒ <code>CustomEvent</code>&nbsp;<a name="Window+createCustomEvent" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L211" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create new instance of CustomEvent of the specified name and using the
provided options.

**Kind**: instance method of [<code>Window</code>](#Window)  
**Returns**: <code>CustomEvent</code> - The created custom event.  
**See**: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Custom event's name (sometimes referred to as the        event's type). |
| options | <code>Object.&lt;string, \*&gt;</code> | The custom event's options. |


* * *

### window.bindEventListener(eventTarget, event, listener, [useCapture])&nbsp;<a name="Window+bindEventListener" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L231" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener to be executed when the specified
event occurs on the specified event target.

Registering the same event listener for the same event on the same event
target with the same <code>useCapture</code> flag value repeatedly has no
effect.

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventTarget | <code>EventTarget</code> |  | The event target. |
| event | <code>string</code> |  | The name of the event. |
| listener | <code>function</code> |  | The event listener. |
| [useCapture] | <code>boolean</code> | <code>false</code> | If true, the method initiates event        capture. After initiating capture, all events of the specified        type will be dispatched to the registered listener before being        dispatched to any EventTarget beneath it in the DOM tree. Events        which are bubbling upward through the tree will not trigger a        listener designated to use capture. |


* * *

### window.unbindEventListener(eventTarget, event, listener, [useCapture])&nbsp;<a name="Window+unbindEventListener" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/window/Window.js#L246" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deregisters the provided event listener, so it will no longer we
executed when the specified event occurs on the specified event target.

The method has no effect if the provided event listener is not
registered to be executed at the specified event.

**Kind**: instance method of [<code>Window</code>](#Window)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventTarget | <code>EventTarget</code> |  | The event target. |
| event | <code>string</code> |  | The name of the event. |
| listener | <code>function</code> |  | The event listener. |
| [useCapture] | <code>boolean</code> | <code>false</code> | The <code>useCapture</code> flag value        that was used when the listener was registered. |


* * *

