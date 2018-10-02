---
category: "page/renderer"
title: "ServerPageRenderer"
---

## ima ⇐ <code>AbstractPageRenderer</code>&nbsp;<a name="module_ima" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L20" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Server-side page renderer. The renderer renders the page into the HTML
markup and sends it to the client.

**Extends**: <code>AbstractPageRenderer</code>  
**Implements**: <code>PageRenderer</code>  
**Submodule**: ima.page  

* [ima](#module_ima) ⇐ <code>AbstractPageRenderer</code>
    * [~ServerPageRenderer](#module_ima..ServerPageRenderer)
        * [new ServerPageRenderer(factory, Helper, ReactDOMServer, settings, response, cache)](#new_module_ima..ServerPageRenderer_new)
        * [._response](#module_ima..ServerPageRenderer+_response) : <code>Response</code>
        * [._cache](#module_ima..ServerPageRenderer+_cache) : <code>Cache</code>
        * [._getRevivalSettings()](#module_ima..ServerPageRenderer+_getRevivalSettings) ⇒ <code>string</code>
        * [._wrapEachKeyToPromise([dataMap])](#module_ima..ServerPageRenderer+_wrapEachKeyToPromise) ⇒ <code>Object.&lt;string, Promise&gt;</code>
        * [._renderPage(controller, view, pageState, routeOptions)](#module_ima..ServerPageRenderer+_renderPage) ⇒ <code>Object</code>
        * [._renderPageContentToString(controller, view, routeOptions)](#module_ima..ServerPageRenderer+_renderPageContentToString) ⇒ <code>string</code>
    * *[~mount()](#module_ima..mount)*
    * [~update()](#module_ima..update)
    * [~unmount()](#module_ima..unmount)


* * *

### ima~ServerPageRenderer&nbsp;<a name="module_ima..ServerPageRenderer" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L46" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: inner class of [<code>ima</code>](#module_ima)  

* [~ServerPageRenderer](#module_ima..ServerPageRenderer)
    * [new ServerPageRenderer(factory, Helper, ReactDOMServer, settings, response, cache)](#new_module_ima..ServerPageRenderer_new)
    * [._response](#module_ima..ServerPageRenderer+_response) : <code>Response</code>
    * [._cache](#module_ima..ServerPageRenderer+_cache) : <code>Cache</code>
    * [._getRevivalSettings()](#module_ima..ServerPageRenderer+_getRevivalSettings) ⇒ <code>string</code>
    * [._wrapEachKeyToPromise([dataMap])](#module_ima..ServerPageRenderer+_wrapEachKeyToPromise) ⇒ <code>Object.&lt;string, Promise&gt;</code>
    * [._renderPage(controller, view, pageState, routeOptions)](#module_ima..ServerPageRenderer+_renderPage) ⇒ <code>Object</code>
    * [._renderPageContentToString(controller, view, routeOptions)](#module_ima..ServerPageRenderer+_renderPageContentToString) ⇒ <code>string</code>


* * *

#### new ServerPageRenderer(factory, Helper, ReactDOMServer, settings, response, cache)&nbsp;<a name="new_module_ima..ServerPageRenderer_new"></a>
Initializes the server-side page renderer.


| Param | Type | Description |
| --- | --- | --- |
| factory | <code>PageRendererFactory</code> | Factory for receive $Utils to view. |
| Helper | <code>vendor.$Helper</code> | The IMA.js helper methods. |
| ReactDOMServer | <code>vendor.ReactDOMServer</code> | React framework instance        to use to render the page on the server side. |
| settings | <code>Object.&lt;string, \*&gt;</code> | Application setting for the current        application environment. |
| response | <code>Response</code> | Utility for sending the page markup to the        client as a response to the current HTTP request. |
| cache | <code>Cache</code> | Resource cache caching the results of HTTP requests        made by services used by the rendered page. |


* * *

#### serverPageRenderer._response : <code>Response</code>&nbsp;<a name="module_ima..ServerPageRenderer+_response" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L55" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for sending the page markup to the client as a response to
the current HTTP request.

**Kind**: instance property of [<code>ServerPageRenderer</code>](#module_ima..ServerPageRenderer)  

* * *

#### serverPageRenderer._cache : <code>Cache</code>&nbsp;<a name="module_ima..ServerPageRenderer+_cache" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L65" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The resource cache, caching the results of all HTTP requests made by
the services using by the rendered page. The state of the cache will
then be serialized and sent to the client to re-initialize the page
at the client side.

**Kind**: instance property of [<code>ServerPageRenderer</code>](#module_ima..ServerPageRenderer)  

* * *

#### serverPageRenderer._getRevivalSettings() ⇒ <code>string</code>&nbsp;<a name="module_ima..ServerPageRenderer+_getRevivalSettings" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L110" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The javascript code will include a settings the "revival" data for the
application at the client-side.

**Kind**: instance method of [<code>ServerPageRenderer</code>](#module_ima..ServerPageRenderer)  
**Returns**: <code>string</code> - The javascript code to include into the
        rendered page.  

* * *

#### serverPageRenderer._wrapEachKeyToPromise([dataMap]) ⇒ <code>Object.&lt;string, Promise&gt;</code>&nbsp;<a name="module_ima..ServerPageRenderer+_wrapEachKeyToPromise" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L144" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates a copy of the provided data map object that has the values of
its fields wrapped into Promises.

The the values that are already Promises will referenced directly
without wrapping then into another Promise.

**Kind**: instance method of [<code>ServerPageRenderer</code>](#module_ima..ServerPageRenderer)  
**Returns**: <code>Object.&lt;string, Promise&gt;</code> - A copy of the provided data map that
        has all its values wrapped into promises.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dataMap] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> | A map of data that should have        its values wrapped into Promises. |


* * *

#### serverPageRenderer._renderPage(controller, view, pageState, routeOptions) ⇒ <code>Object</code>&nbsp;<a name="module_ima..ServerPageRenderer+_renderPage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L170" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Render page after all promises from loaded resources is resolved.

**Kind**: instance method of [<code>ServerPageRenderer</code>](#module_ima..ServerPageRenderer)  

| Param | Type |
| --- | --- |
| controller | <code>AbstractController</code> | 
| view | <code>React.Component</code> | 
| pageState | <code>Object.&lt;string, \*&gt;</code> | 
| routeOptions | <code>Object.&lt;string, \*&gt;</code> | 


* * *

#### serverPageRenderer._renderPageContentToString(controller, view, routeOptions) ⇒ <code>string</code>&nbsp;<a name="module_ima..ServerPageRenderer+_renderPageContentToString" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L192" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Render page content to a string containing HTML markup.

**Kind**: instance method of [<code>ServerPageRenderer</code>](#module_ima..ServerPageRenderer)  

| Param | Type |
| --- | --- |
| controller | <code>AbstractController</code> | 
| view | <code>function</code> | 
| routeOptions | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### *ima~mount()*&nbsp;<a name="module_ima..mount" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L68" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: inner abstract method of [<code>ima</code>](#module_ima)  

* * *

### ima~update()&nbsp;<a name="module_ima..update" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L85" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: inner method of [<code>ima</code>](#module_ima)  

* * *

### ima~unmount()&nbsp;<a name="module_ima..unmount" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/renderer/ServerPageRenderer.js#L95" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: inner method of [<code>ima</code>](#module_ima)  

* * *

