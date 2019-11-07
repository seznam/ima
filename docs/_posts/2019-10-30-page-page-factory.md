---
category: "page"
title: "PageFactory"
---

## PageFactory&nbsp;<a name="PageFactory" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/PageFactory.js#L12" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory for page.

**Kind**: global class  

* [PageFactory](#PageFactory)
    * [new PageFactory(oc)](#new_PageFactory_new)
    * [._oc](#PageFactory+_oc) : <code>ObjectContainer</code>
    * [.createController(controller)](#PageFactory+createController) ⇒ <code>Controller</code>
    * [.createView(view)](#PageFactory+createView) ⇒ <code>function</code>
    * [.decorateController(controller)](#PageFactory+decorateController) ⇒ <code>Controller</code>
    * [.decoratePageStateManager(pageStateManager, allowedStateKeys)](#PageFactory+decoratePageStateManager) ⇒ <code>PageStateManager</code>


* * *

### new PageFactory(oc)&nbsp;<a name="new_PageFactory_new"></a>
Factory used by page management classes.


| Param | Type |
| --- | --- |
| oc | <code>ObjectContainer</code> | 


* * *

### pageFactory.\_oc : <code>ObjectContainer</code>&nbsp;<a name="PageFactory+_oc" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/PageFactory.js#L18" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current application object container.

**Kind**: instance property of [<code>PageFactory</code>](#PageFactory)  

* * *

### pageFactory.createController(controller) ⇒ <code>Controller</code>&nbsp;<a name="PageFactory+createController" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/PageFactory.js#L27" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Create new instance of {@linkcode Controller}.

**Kind**: instance method of [<code>PageFactory</code>](#PageFactory)  

| Param | Type |
| --- | --- |
| controller | <code>string</code> \| <code>function</code> | 


* * *

### pageFactory.createView(view) ⇒ <code>function</code>&nbsp;<a name="PageFactory+createView" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/PageFactory.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the specified react component class.

**Kind**: instance method of [<code>PageFactory</code>](#PageFactory)  
**Returns**: <code>function</code> - The react component class
        constructor.  

| Param | Type | Description |
| --- | --- | --- |
| view | <code>string</code> \| <code>function</code> | The namespace        referring to a react component class, or a react component class        constructor. |


* * *

### pageFactory.decorateController(controller) ⇒ <code>Controller</code>&nbsp;<a name="PageFactory+decorateController" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/PageFactory.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns decorated controller for ease setting seo params in controller.

**Kind**: instance method of [<code>PageFactory</code>](#PageFactory)  

| Param | Type |
| --- | --- |
| controller | <code>Controller</code> | 


* * *

### pageFactory.decoratePageStateManager(pageStateManager, allowedStateKeys) ⇒ <code>PageStateManager</code>&nbsp;<a name="PageFactory+decoratePageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/page/PageFactory.js#L87" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns decorated page state manager for extension.

**Kind**: instance method of [<code>PageFactory</code>](#PageFactory)  

| Param | Type |
| --- | --- |
| pageStateManager | <code>PageStateManager</code> | 
| allowedStateKeys | <code>Array.&lt;string&gt;</code> | 


* * *

