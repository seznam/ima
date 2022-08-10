---
category: "window"
title: "API - ClientWindow"
menuTitle: "ClientWindow"
---

## ClientWindow&nbsp;<a name="ClientWindow" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Client-side implementation of the <code>Window</code> utility API.

**Kind**: global class  

* [ClientWindow](#ClientWindow)
    * [._scopedListeners](#ClientWindow+_scopedListeners) : <code>WeakMap.&lt;Object, Map.&lt;Array.&lt;string, function(\*), boolean, Object&gt;, function(\*)&gt;&gt;</code>
    * [.isClient()](#ClientWindow+isClient)
    * [.isCookieEnabled()](#ClientWindow+isCookieEnabled)
    * [.hasSessionStorage()](#ClientWindow+hasSessionStorage)
    * [.setTitle()](#ClientWindow+setTitle)
    * [.getWindow()](#ClientWindow+getWindow)
    * [.getDocument()](#ClientWindow+getDocument)
    * [.getScrollX()](#ClientWindow+getScrollX)
    * [.getScrollY()](#ClientWindow+getScrollY)
    * [.scrollTo()](#ClientWindow+scrollTo)
    * [.getDomain()](#ClientWindow+getDomain)
    * [.getHost()](#ClientWindow+getHost)
    * [.getPath()](#ClientWindow+getPath)
    * [.getUrl()](#ClientWindow+getUrl)
    * [.getBody()](#ClientWindow+getBody)
    * [.getElementById()](#ClientWindow+getElementById)
    * [.getHistoryState()](#ClientWindow+getHistoryState)
    * [.querySelector()](#ClientWindow+querySelector)
    * [.querySelectorAll()](#ClientWindow+querySelectorAll)
    * [.redirect()](#ClientWindow+redirect)
    * [.pushState()](#ClientWindow+pushState)
    * [.replaceState()](#ClientWindow+replaceState)
    * [.createCustomEvent()](#ClientWindow+createCustomEvent)
    * [.bindEventListener()](#ClientWindow+bindEventListener)
    * [.unbindEventListener()](#ClientWindow+unbindEventListener)


* * *

### clientWindow.\_scopedListeners : <code>WeakMap.&lt;Object, Map.&lt;Array.&lt;string, function(\*), boolean, Object&gt;, function(\*)&gt;&gt;</code>&nbsp;<a name="ClientWindow+_scopedListeners" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L21" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Map of event event identifiers to a bound listener.

**Kind**: instance property of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.isClient()&nbsp;<a name="ClientWindow+isClient" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L27" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.isCookieEnabled()&nbsp;<a name="ClientWindow+isCookieEnabled" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.hasSessionStorage()&nbsp;<a name="ClientWindow+hasSessionStorage" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.setTitle()&nbsp;<a name="ClientWindow+setTitle" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getWindow()&nbsp;<a name="ClientWindow+getWindow" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L70" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getDocument()&nbsp;<a name="ClientWindow+getDocument" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L77" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getScrollX()&nbsp;<a name="ClientWindow+getScrollX" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L84" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getScrollY()&nbsp;<a name="ClientWindow+getScrollY" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L99" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.scrollTo()&nbsp;<a name="ClientWindow+scrollTo" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L114" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getDomain()&nbsp;<a name="ClientWindow+getDomain" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L121" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getHost()&nbsp;<a name="ClientWindow+getHost" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L128" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getPath()&nbsp;<a name="ClientWindow+getPath" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L135" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getUrl()&nbsp;<a name="ClientWindow+getUrl" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L142" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getBody()&nbsp;<a name="ClientWindow+getBody" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L149" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getElementById()&nbsp;<a name="ClientWindow+getElementById" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L156" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.getHistoryState()&nbsp;<a name="ClientWindow+getHistoryState" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L163" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.querySelector()&nbsp;<a name="ClientWindow+querySelector" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L170" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.querySelectorAll()&nbsp;<a name="ClientWindow+querySelectorAll" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L177" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.redirect()&nbsp;<a name="ClientWindow+redirect" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L184" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.pushState()&nbsp;<a name="ClientWindow+pushState" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L191" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.replaceState()&nbsp;<a name="ClientWindow+replaceState" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L200" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.createCustomEvent()&nbsp;<a name="ClientWindow+createCustomEvent" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L209" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.bindEventListener()&nbsp;<a name="ClientWindow+bindEventListener" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L216" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

### clientWindow.unbindEventListener()&nbsp;<a name="ClientWindow+unbindEventListener" href="https://github.com/seznam/ima/blob/v17.15.2/packages/core/src/window/ClientWindow.js#L256" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientWindow</code>](#ClientWindow)  

* * *

