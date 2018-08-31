---
category: "page/renderer"
title: "ViewAdapter"
---

## ViewAdapter&nbsp;<a name="ViewAdapter" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An adapter component providing the current page controller's state to the
page view component through its properties.

**Kind**: global class  

* [ViewAdapter](#ViewAdapter)
    * [new ViewAdapter(props)](#new_ViewAdapter_new)
    * _instance_
        * [.state](#ViewAdapter+state) : <code>Object.&lt;string, \*&gt;</code>
        * [._view](#ViewAdapter+_view) : <code>function</code>
        * [.componentWillReceiveProps()](#ViewAdapter+componentWillReceiveProps)
        * [.componentDidCatch()](#ViewAdapter+componentDidCatch)
        * [.render()](#ViewAdapter+render)
        * [.getChildContext()](#ViewAdapter+getChildContext)
    * _static_
        * [.childContextTypes](#ViewAdapter.childContextTypes) ⇒ <code>Object</code>


* * *

### new ViewAdapter(props)&nbsp;<a name="new_ViewAdapter_new"></a>
Initializes the adapter component.


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | Component properties, containing the actual page view        and the initial page state to pass to the view. |


* * *

### viewAdapter.state : <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="ViewAdapter+state" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current page state as provided by the controller.

**Kind**: instance property of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

### viewAdapter._view : <code>function</code>&nbsp;<a name="ViewAdapter+_view" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L44" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The actual page view to render.

**Kind**: instance property of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

### viewAdapter.componentWillReceiveProps()&nbsp;<a name="ViewAdapter+componentWillReceiveProps" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

### viewAdapter.componentDidCatch()&nbsp;<a name="ViewAdapter+componentDidCatch" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L61" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Fixes an issue where when there's an error in React component,
the defined ErrorPage may not get re-rendered and white
blank page appears instead.

**Kind**: instance method of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

### viewAdapter.render()&nbsp;<a name="ViewAdapter+render" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

### viewAdapter.getChildContext()&nbsp;<a name="ViewAdapter+getChildContext" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L77" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

### ViewAdapter.childContextTypes ⇒ <code>Object</code>&nbsp;<a name="ViewAdapter.childContextTypes" href="https://github.com/seznam/IMA.js-core/tree/stable/page/renderer/ViewAdapter.js#L14" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: static property of [<code>ViewAdapter</code>](#ViewAdapter)  

* * *

