---
category: "page/renderer"
title: "API - ClientPageRenderer"
menuTitle: "ClientPageRenderer"
---

## ClientPageRenderer&nbsp;<a name="ClientPageRenderer" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L11" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Client-side page renderer. The renderer attempts to reuse the markup sent by
server if possible.

**Kind**: global class  

* [ClientPageRenderer](#ClientPageRenderer)
    * [new ClientPageRenderer(factory, Helper, ReactDOM, dispatcher, settings, window)](#new_ClientPageRenderer_new)
    * [._firstTime](#ClientPageRenderer+_firstTime) : <code>boolean</code>
    * [._window](#ClientPageRenderer+_window) : <code>Window</code>
    * [._viewContainer](#ClientPageRenderer+_viewContainer) : <code>HTMLElement</code>
    * [.mount()](#ClientPageRenderer+mount)
    * [.update()](#ClientPageRenderer+update)
    * [.unmount()](#ClientPageRenderer+unmount)
    * [._handleError(error)](#ClientPageRenderer+_handleError)
    * [._patchPromisesToState(controller, patchedPromises)](#ClientPageRenderer+_patchPromisesToState)
    * [._startBatchTransactions(controller, patchedPromises)](#ClientPageRenderer+_startBatchTransactions)
    * [._setStateWithoutRendering(controller, defaultPageState)](#ClientPageRenderer+_setStateWithoutRendering)
    * [._patchStateToClearPreviousState(state)](#ClientPageRenderer+_patchStateToClearPreviousState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [._renderToDOM(controller, view, routeOptions)](#ClientPageRenderer+_renderToDOM) ⇒ <code>Promise.&lt;undefined&gt;</code>
    * [._separatePromisesAndValues(dataMap)](#ClientPageRenderer+_separatePromisesAndValues) ⇒ <code>Object</code>
    * [._updateMetaAttributes(metaManager)](#ClientPageRenderer+_updateMetaAttributes)
    * [._updateMetaNameAttributes(metaManager)](#ClientPageRenderer+_updateMetaNameAttributes)
    * [._updateMetaPropertyAttributes(metaManager)](#ClientPageRenderer+_updateMetaPropertyAttributes)
    * [._updateMetaLinkAttributes(metaManager)](#ClientPageRenderer+_updateMetaLinkAttributes)


* * *

### new ClientPageRenderer(factory, Helper, ReactDOM, dispatcher, settings, window)&nbsp;<a name="new_ClientPageRenderer_new"></a>
Initializes the client-side page renderer.


| Param | Type | Description |
| --- | --- | --- |
| factory | <code>PageRendererFactory</code> | Factory for receive $Utils to view. |
| Helper | <code>vendor.$Helper</code> | The IMA.js helper methods. |
| ReactDOM | <code>vendor.ReactDOM</code> | React framework instance to use to        render the page on the client side. |
| dispatcher | <code>Dispatcher</code> | Dispatcher fires events to app. |
| settings | <code>Object.&lt;string, \*&gt;</code> | The application setting for the        current application environment. |
| window | <code>Window</code> | Helper for manipulating the global object        (<code>window</code>) regardless of the client/server-side        environment. |


* * *

### clientPageRenderer.\_firstTime : <code>boolean</code>&nbsp;<a name="ClientPageRenderer+_firstTime" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Flag signalling that the page is being rendered for the first time.

**Kind**: instance property of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.\_window : <code>Window</code>&nbsp;<a name="ClientPageRenderer+_window" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Helper for manipulating the global object (<code>window</code>)
regardless of the client/server-side environment.

**Kind**: instance property of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.\_viewContainer : <code>HTMLElement</code>&nbsp;<a name="ClientPageRenderer+_viewContainer" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The HTML element containing the current application view for the
current route.

**Kind**: instance property of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.mount()&nbsp;<a name="ClientPageRenderer+mount" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.update()&nbsp;<a name="ClientPageRenderer+update" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L104" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.unmount()&nbsp;<a name="ClientPageRenderer+unmount" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L140" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

* * *

### clientPageRenderer.\_handleError(error)&nbsp;<a name="ClientPageRenderer+_handleError" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L156" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Show error to console in $Debug mode and re-throw that error
for other error handler.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  
**Throws**:

- <code>Error</code> Re-throws the handled error.


| Param | Type |
| --- | --- |
| error | <code>Error</code> | 


* * *

### clientPageRenderer.\_patchPromisesToState(controller, patchedPromises)&nbsp;<a name="ClientPageRenderer+_patchPromisesToState" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L170" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Patch promise values to controller state.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type |
| --- | --- |
| controller | <code>ControllerDecorator</code> | 
| patchedPromises | <code>Object.&lt;string, Promise.&lt;\*&gt;&gt;</code> | 


* * *

### clientPageRenderer.\_startBatchTransactions(controller, patchedPromises)&nbsp;<a name="ClientPageRenderer+_startBatchTransactions" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L188" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Batch patch promise values to controller state.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type |
| --- | --- |
| controller | <code>ControllerDecorator</code> | 
| patchedPromises | <code>Object.&lt;string, Promise.&lt;\*&gt;&gt;</code> | 


* * *

### clientPageRenderer.\_setStateWithoutRendering(controller, defaultPageState)&nbsp;<a name="ClientPageRenderer+_setStateWithoutRendering" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L227" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The method is hacky for IMA@17 and we must rewrite logic for IMA@18.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type |
| --- | --- |
| controller | <code>Controller</code> | 
| defaultPageState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### clientPageRenderer.\_patchStateToClearPreviousState(state) ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="ClientPageRenderer+_patchStateToClearPreviousState" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L243" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type |
| --- | --- |
| state | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### clientPageRenderer.\_renderToDOM(controller, view, routeOptions) ⇒ <code>Promise.&lt;undefined&gt;</code>&nbsp;<a name="ClientPageRenderer+_renderToDOM" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L282" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Renders the current route to DOM.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>ControllerDecorator</code> |  |
| view | <code>function</code> |  |
| routeOptions | <code>Object</code> | The current route options. |


* * *

### clientPageRenderer.\_separatePromisesAndValues(dataMap) ⇒ <code>Object</code>&nbsp;<a name="ClientPageRenderer+_separatePromisesAndValues" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L345" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Separate promises and values from provided data map. Values will be use
for default page state. Promises will be patched to state after their
resolve.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  
**Returns**: <code>Object</code> - Return separated promises and other values.  

| Param | Type | Description |
| --- | --- | --- |
| dataMap | <code>Object.&lt;string, \*&gt;</code> | A map of data. |


* * *

### clientPageRenderer.\_updateMetaAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaAttributes" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L368" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the title and the contents of the meta elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

### clientPageRenderer.\_updateMetaNameAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaNameAttributes" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L382" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the contents of the generic meta elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

### clientPageRenderer.\_updateMetaPropertyAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaPropertyAttributes" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L401" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the contents of the specialized meta elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

### clientPageRenderer.\_updateMetaLinkAttributes(metaManager)&nbsp;<a name="ClientPageRenderer+_updateMetaLinkAttributes" href="https://github.com/seznam/ima/blob/v17.11.1/packages/core/src/page/renderer/ClientPageRenderer.js#L420" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Updates the href of the specialized link elements used for SEO.

**Kind**: instance method of [<code>ClientPageRenderer</code>](#ClientPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| metaManager | <code>MetaManager</code> | meta attributes storage providing the        new values for page meta elements and title. |


* * *

