---
category: "page/renderer"
title: "ClientPageRenderer"
---

## ClientPageRenderer&nbsp;<a name="ClientPageRenderer" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Client-side page renderer. The renderer attempts to reuse the markup sent by
server if possible.

**Kind**: global class  

* [ClientPageRenderer](#ClientPageRenderer)
    * [new ClientPageRenderer(factory, Helper, ReactDOM, settings, window)](#new_ClientPageRenderer_new)
    * [._firstTime](#ClientPageRenderer+_firstTime) : <code>boolean</code>
    * [._window](#ClientPageRenderer+_window) : <code>Window</code>
    * [._viewContainer](#ClientPageRenderer+_viewContainer) : <code>HTMLElement</code>
    * [.mount()](#ClientPageRenderer+mount)
    * [.update()](#ClientPageRenderer+update)
    * [.unmount()](#ClientPageRenderer+unmount)
    * [._handleError(error)](#ClientPageRenderer+_handleError)
    * [._patchPromisesToState(controller, patchedPromises)](#ClientPageRenderer+_patchPromisesToState)
    * [._renderToDOM(controller, view, routeOptions)](#ClientPageRenderer+_renderToDOM)
    * [._separatePromisesAndValues(dataMap)](#ClientPageRenderer+_separatePromisesAndValues) ⇒ <code>Object</code>
    * [._updateMetaAttributes(metaManager)](#ClientPageRenderer+_updateMetaAttributes)
    * [._updateMetaNameAttributes(metaManager)](#ClientPageRenderer+_updateMetaNameAttributes)
    * [._updateMetaPropertyAttributes(metaManager)](#ClientPageRenderer+_updateMetaPropertyAttributes)
    * [._updateMetaLinkAttributes(metaManager)](#ClientPageRenderer+_updateMetaLinkAttributes)


* * *

### new ClientPageRenderer(factory, Helper, ReactDOM, settings, window)&nbsp;<a name="new_ClientPageRenderer_new"></a>
Initializes the client-side page renderer.


| Param | Type | Description |
| --- | --- | --- |
| factory | <code>PageRendererFactory</code> | Factory for receive $Utils to view. |
| Helper | <code>vendor.$Helper</code> | The IMA.js helper methods. |
| ReactDOM | <code>vendor.ReactDOM</code> | React framework instance to use to        render the page on the client side. |
| settings | <code>Object.&lt;string, \*&gt;</code> | The application setting for the        current application environment. |
| window | <code>Window</code> | Helper for manipulating the global object        (<code>window</code>) regardless of the client/server-side        environment. |


* * *

### clientPageRenderer.\_firstTime : <code>boolean</code>&nbsp;<a name="ClientPageRenderer+_firstTime" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L31" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Flag signalling that the page is being rendered for the first time.

**Kind**: instance property of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.\_window : <code>Window</code>&nbsp;<a name="ClientPageRenderer+_window" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L39" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Helper for manipulating the global object (<code>window</code>)
regardless of the client/server-side environment.

**Kind**: instance property of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.\_viewContainer : <code>HTMLElement</code>&nbsp;<a name="ClientPageRenderer+_viewContainer" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L47" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The HTML element containing the current application view for the
current route.

**Kind**: instance property of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.mount()&nbsp;<a name="ClientPageRenderer+mount" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L53" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.update()&nbsp;<a name="ClientPageRenderer+update" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L90" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.unmount()&nbsp;<a name="ClientPageRenderer+unmount" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L116" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.\_handleError(error)&nbsp;<a name="ClientPageRenderer+_handleError" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L130" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Show error to console in $Debug mode and re-throw that error
for other error handler.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  
**Throws**:

- <code>Error</code> Re-throws the handled error.


| Param | Type |
| --- | --- |
| error | <code>Error</code> | 


* * *

### clientPageRenderer.\_patchPromisesToState(controller, patchedPromises)&nbsp;<a name="ClientPageRenderer+_patchPromisesToState" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L144" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Patch promise values to controller state.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type |
| --- | --- |
| controller | <code>ControllerDecorator</code> | 
| patchedPromises | <code>Object.&lt;string, Promise.&lt;\*&gt;&gt;</code> | 


* * *

### clientPageRenderer.\_renderToDOM(controller, view, routeOptions)&nbsp;<a name="ClientPageRenderer+_renderToDOM" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L182" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Renders the current route to DOM.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>ControllerDecorator</code> |  |
| view | <code>function</code> |  |
| routeOptions | <code>Object</code> | The current route options. |


* * *

### clientPageRenderer.\_separatePromisesAndValues(dataMap) ⇒ <code>Object</code>&nbsp;<a name="ClientPageRenderer+_separatePromisesAndValues" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L217" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Separate promises and values from provided data map. Values will be use
for default page state. Promises will be patched to state after their
resolve.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  
**Returns**: <code>Object</code> - Return separated promises and other values.  

| Param | Type | Description |
| --- | --- | --- |
| dataMap | <code>Object.&lt;string, \*&gt;</code> | A map of data. |


* * *

### clientPageRenderer.\_updateMetaAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaAttributes" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L240" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the title and the contents of the meta elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

### clientPageRenderer.\_updateMetaNameAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaNameAttributes" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L254" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the contents of the generic meta elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

### clientPageRenderer.\_updateMetaPropertyAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaPropertyAttributes" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L273" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the contents of the specialized meta elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

### clientPageRenderer.\_updateMetaLinkAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaLinkAttributes" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/page/renderer/ClientPageRenderer.js#L292" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the href of the specialized link elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

