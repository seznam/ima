---
category: "page/renderer"
title: "PageRendererFactory"
---

## PageRendererFactory&nbsp;<a name="PageRendererFactory" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L6" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory for page render.

**Kind**: global class  

* [PageRendererFactory](#PageRendererFactory)
    * [new PageRendererFactory(oc, React)](#new_PageRendererFactory_new)
    * [._oc](#PageRendererFactory+_oc) : <code>ObjectContainer</code>
    * [._React](#PageRendererFactory+_React) : <code>React</code>
    * [.getUtils()](#PageRendererFactory+getUtils)
    * [.getDocumentView(documentView)](#PageRendererFactory+getDocumentView) ⇒ <code>function</code>
    * [.getManagedRootView(managedRootView)](#PageRendererFactory+getManagedRootView) ⇒ <code>function</code>
    * [._resolveClassConstructor(view)](#PageRendererFactory+_resolveClassConstructor) ⇒ <code>function</code>
    * [.wrapView(view, props)](#PageRendererFactory+wrapView) ⇒ <code>React.Element</code>
    * [.createReactElementFactory(view)](#PageRendererFactory+createReactElementFactory) ⇒ <code>function</code>


* * *

### new PageRendererFactory(oc, React)&nbsp;<a name="new_PageRendererFactory_new"></a>
Initializes the factory used by the page renderer.


| Param | Type | Description |
| --- | --- | --- |
| oc | <code>ObjectContainer</code> | The application's dependency injector - the        object container. |
| React | <code>React</code> | The React framework instance to use to render the        page. |


* * *

### pageRendererFactory.\_oc : <code>ObjectContainer</code>&nbsp;<a name="PageRendererFactory+_oc" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L21" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The application's dependency injector - the object container.

**Kind**: instance property of [<code>PageRendererFactory</code>](#PageRendererFactory)  

* * *

### pageRendererFactory.\_React : <code>React</code>&nbsp;<a name="PageRendererFactory+_React" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Rect framework instance, used to render the page.

**Kind**: instance property of [<code>PageRendererFactory</code>](#PageRendererFactory)  
**Access**: protected  

* * *

### pageRendererFactory.getUtils()&nbsp;<a name="PageRendererFactory+getUtils" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L35" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return object of services which are defined for alias $Utils.

**Kind**: instance method of [<code>PageRendererFactory</code>](#PageRendererFactory)  

* * *

### pageRendererFactory.getDocumentView(documentView) ⇒ <code>function</code>&nbsp;<a name="PageRendererFactory+getDocumentView" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the class constructor of the specified document view component.
Document view may be specified as a namespace path or as a class
constructor.

**Kind**: instance method of [<code>PageRendererFactory</code>](#PageRendererFactory)  
**Returns**: <code>function</code> - The constructor of the document
        view component.  

| Param | Type | Description |
| --- | --- | --- |
| documentView | <code>function</code> \| <code>string</code> | The        namespace path pointing to the document view component, or the        constructor of the document view component. |


* * *

### pageRendererFactory.getManagedRootView(managedRootView) ⇒ <code>function</code>&nbsp;<a name="PageRendererFactory+getManagedRootView" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L78" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the class constructor of the specified managed root view
component. Managed root view may be specified as a namespace
path or as a class constructor.

**Kind**: instance method of [<code>PageRendererFactory</code>](#PageRendererFactory)  
**Returns**: <code>function</code> - The constructor of the managed
        root view component.  

| Param | Type | Description |
| --- | --- | --- |
| managedRootView | <code>function</code> \| <code>string</code> | The        namespace path pointing to the managed root view component, or        the constructor of the React component. |


* * *

### pageRendererFactory.\_resolveClassConstructor(view) ⇒ <code>function</code>&nbsp;<a name="PageRendererFactory+_resolveClassConstructor" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L107" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the class constructor of the specified view component.
View may be specified as a namespace path or as a class
constructor.

**Kind**: instance method of [<code>PageRendererFactory</code>](#PageRendererFactory)  
**Returns**: <code>function</code> - The constructor of the view
        component.  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>function</code> | The namespace path        pointing to the view component, or the constructor        of the <code>React.Component</code>. |


* * *

### pageRendererFactory.wrapView(view, props) ⇒ <code>React.Element</code>&nbsp;<a name="PageRendererFactory+wrapView" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L134" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Wraps the provided view into the view adapter so it can access the state
passed from controller through the <code>props</code> property instead of the
<code>state</code> property.

**Kind**: instance method of [<code>PageRendererFactory</code>](#PageRendererFactory)  
**Returns**: <code>React.Element</code> - View adapter handling passing the controller's
        state to an instance of the specified page view through
        properties.  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>function</code> \| <code>string</code> | The namespace path        pointing to the view component, or the constructor        of the <code>React.Component</code>. |
| props | <code>Object</code> | The initial props to pass to the view. |


* * *

### pageRendererFactory.createReactElementFactory(view) ⇒ <code>function</code>&nbsp;<a name="PageRendererFactory+createReactElementFactory" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/page/renderer/PageRendererFactory.js#L152" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return a function that produces ReactElements of a given type.
Like React.createElement.

**Kind**: instance method of [<code>PageRendererFactory</code>](#PageRendererFactory)  
**Returns**: <code>function</code> - The created factory
        function. The factory accepts an object containing the
        component's properties as the argument and returns a rendered
        component.  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>string</code> \| <code>function</code> | The react        component for which a factory function should be created. |


* * *

