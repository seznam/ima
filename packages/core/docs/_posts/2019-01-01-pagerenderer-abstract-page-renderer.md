---
category: "page/renderer"
title: "AbstractPageRenderer"
---

## AbstractPageRenderer&nbsp;<a name="AbstractPageRenderer" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Base class for implementations of the {@linkcode PageRenderer} interface.

**Kind**: global class  

* [AbstractPageRenderer](#AbstractPageRenderer)
    * [new AbstractPageRenderer(factory, Helper, ReactDOM, settings)](#new_AbstractPageRenderer_new)
    * [._factory](#AbstractPageRenderer+_factory) : <code>PageRendererFactory</code>
    * [._Helper](#AbstractPageRenderer+_Helper) : <code>Vendor.$Helper</code>
    * [._ReactDOM](#AbstractPageRenderer+_ReactDOM) : <code>Vendor.ReactDOM</code>
    * [._settings](#AbstractPageRenderer+_settings) : <code>Object.&lt;string, \*&gt;</code>
    * [._reactiveView](#AbstractPageRenderer+_reactiveView) : <code>React.Component</code>
    * *[.mount()](#AbstractPageRenderer+mount)*
    * [.update()](#AbstractPageRenderer+update)
    * [.unmount()](#AbstractPageRenderer+unmount)
    * [.clearState()](#AbstractPageRenderer+clearState)
    * [.setState()](#AbstractPageRenderer+setState)
    * [._generateViewProps(view, [state])](#AbstractPageRenderer+_generateViewProps) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [._getWrappedPageView(controller, view, routeOptions)](#AbstractPageRenderer+_getWrappedPageView)
    * [._getDocumentView(documentView)](#AbstractPageRenderer+_getDocumentView) ⇒ <code>function</code>


* * *

### new AbstractPageRenderer(factory, Helper, ReactDOM, settings)&nbsp;<a name="new_AbstractPageRenderer_new"></a>
Initializes the abstract page renderer.


| Param | Type | Description |
| --- | --- | --- |
| factory | <code>PageRendererFactory</code> | Factory for receive $Utils to view. |
| Helper | <code>vendor.$Helper</code> | The IMA.js helper methods. |
| ReactDOM | <code>vendor.ReactDOM</code> | React framework instance, will be used        to render the page. |
| settings | <code>Object.&lt;string, \*&gt;</code> | Application settings for the current        application environment. |


* * *

### abstractPageRenderer.\_factory : <code>PageRendererFactory</code>&nbsp;<a name="AbstractPageRenderer+_factory" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory for receive $Utils to view.

**Kind**: instance property of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Access**: protected  

* * *

### abstractPageRenderer.\_Helper : <code>Vendor.$Helper</code>&nbsp;<a name="AbstractPageRenderer+_Helper" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The IMA.js helper methods.

**Kind**: instance property of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Access**: protected  

* * *

### abstractPageRenderer.\_ReactDOM : <code>Vendor.ReactDOM</code>&nbsp;<a name="AbstractPageRenderer+_ReactDOM" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Rect framework instance, used to render the page.

**Kind**: instance property of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Access**: protected  

* * *

### abstractPageRenderer.\_settings : <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="AbstractPageRenderer+_settings" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L53" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application setting for the current application environment.

**Kind**: instance property of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Access**: protected  

* * *

### abstractPageRenderer.\_reactiveView : <code>React.Component</code>&nbsp;<a name="AbstractPageRenderer+_reactiveView" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L59" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Access**: protected  

* * *

### *abstractPageRenderer.mount()*&nbsp;<a name="AbstractPageRenderer+mount" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  

* * *

### abstractPageRenderer.update()&nbsp;<a name="AbstractPageRenderer+update" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L75" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  

* * *

### abstractPageRenderer.unmount()&nbsp;<a name="AbstractPageRenderer+unmount" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L84" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  

* * *

### abstractPageRenderer.clearState()&nbsp;<a name="AbstractPageRenderer+clearState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L93" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  

* * *

### abstractPageRenderer.setState()&nbsp;<a name="AbstractPageRenderer+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L111" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  

* * *

### abstractPageRenderer.\_generateViewProps(view, [state]) ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="AbstractPageRenderer+_generateViewProps" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generate properties for view from state.

**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Access**: protected  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| view | <code>function</code> |  | The page        view React component to wrap. |
| [state] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> |  |


* * *

### abstractPageRenderer.\_getWrappedPageView(controller, view, routeOptions)&nbsp;<a name="AbstractPageRenderer+_getWrappedPageView" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L163" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns wrapped page view component with managed root view and view adapter.

**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>ControllerDecorator</code> |  |
| view | <code>function</code> |  |
| routeOptions | <code>Object</code> | The current route options. |


* * *

### abstractPageRenderer.\_getDocumentView(documentView) ⇒ <code>function</code>&nbsp;<a name="AbstractPageRenderer+_getDocumentView" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/renderer/AbstractPageRenderer.js#L191" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the class constructor of the specified document view component.

**Kind**: instance method of [<code>AbstractPageRenderer</code>](#AbstractPageRenderer)  
**Returns**: <code>function</code> - The constructor of the document
        view component.  

| Param | Type | Description |
| --- | --- | --- |
| documentView | <code>function</code> \| <code>string</code> | The        namespace path pointing to the document view component, or the        constructor of the document view component. |


* * *

