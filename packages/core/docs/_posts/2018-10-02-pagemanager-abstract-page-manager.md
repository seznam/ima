---
category: "page/manager"
title: "AbstractPageManager"
---

## AbstractPageManager&nbsp;<a name="AbstractPageManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L7" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Page manager for controller.

**Kind**: global class  

* [AbstractPageManager](#AbstractPageManager)
    * [new AbstractPageManager(pageFactory, pageRenderer, pageStateManager)](#new_AbstractPageManager_new)
    * [._pageFactory](#AbstractPageManager+_pageFactory) : <code>PageFactory</code>
    * [._pageRenderer](#AbstractPageManager+_pageRenderer) : <code>PageRenderer</code>
    * [._pageStateManager](#AbstractPageManager+_pageStateManager) : <code>PageStateManager</code>
    * [._managedPage](#AbstractPageManager+_managedPage) : <code>Object</code>
    * [.init()](#AbstractPageManager+init)
    * [.manage()](#AbstractPageManager+manage)
    * *[.scrollTo()](#AbstractPageManager+scrollTo)*
    * [.destroy()](#AbstractPageManager+destroy)
    * [._storeManagedPageValue(controller, view, options, params, controllerInstance, decoratedController, viewInstance)](#AbstractPageManager+_storeManagedPageValue)
    * [._clearManagedPageValue()](#AbstractPageManager+_clearManagedPageValue)
    * [._setRestrictedPageStateManager(extension, extensionState)](#AbstractPageManager+_setRestrictedPageStateManager)
    * [._initPageSource()](#AbstractPageManager+_initPageSource)
    * [._initController()](#AbstractPageManager+_initController)
    * [._initExtensions()](#AbstractPageManager+_initExtensions)
    * [._loadPageSource()](#AbstractPageManager+_loadPageSource) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._getLoadedControllerState()](#AbstractPageManager+_getLoadedControllerState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._getLoadedExtensionsState()](#AbstractPageManager+_getLoadedExtensionsState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._activatePageSource()](#AbstractPageManager+_activatePageSource)
    * [._activateController()](#AbstractPageManager+_activateController)
    * [._activateExtensions()](#AbstractPageManager+_activateExtensions)
    * [._updatePageSource()](#AbstractPageManager+_updatePageSource) ⇒ <code>Promise.&lt;{status: number, content: ?string}&gt;</code>
    * [._getUpdatedControllerState()](#AbstractPageManager+_getUpdatedControllerState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._getUpdatedExtensionsState()](#AbstractPageManager+_getUpdatedExtensionsState) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [._deactivatePageSource()](#AbstractPageManager+_deactivatePageSource)
    * [._deactivateController()](#AbstractPageManager+_deactivateController)
    * [._deactivateExtensions()](#AbstractPageManager+_deactivateExtensions)
    * [._destroyPageSource()](#AbstractPageManager+_destroyPageSource)
    * [._destroyController()](#AbstractPageManager+_destroyController)
    * [._destroyExtensions()](#AbstractPageManager+_destroyExtensions)
    * [._clearComponentState(options)](#AbstractPageManager+_clearComponentState)
    * [._onChangeStateHandler(state)](#AbstractPageManager+_onChangeStateHandler)
    * [._hasOnlyUpdate(controller, view, options)](#AbstractPageManager+_hasOnlyUpdate) ⇒ <code>boolean</code>
    * [._preManage(options)](#AbstractPageManager+_preManage)
    * [._postManage(options)](#AbstractPageManager+_postManage)


* * *

### new AbstractPageManager(pageFactory, pageRenderer, pageStateManager)&nbsp;<a name="new_AbstractPageManager_new"></a>
Initializes the page manager.


| Param | Type | Description |
| --- | --- | --- |
| pageFactory | <code>PageFactory</code> | Factory used by the page manager to        create instances of the controller for the current route, and        decorate the controllers and page state managers. |
| pageRenderer | <code>PageRenderer</code> | The current renderer of the page. |
| pageStateManager | <code>PageStateManager</code> | The current page state        manager. |


* * *

### abstractPageManager._pageFactory : <code>PageFactory</code>&nbsp;<a name="AbstractPageManager+_pageFactory" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory used by the page manager to create instances of the
controller for the current route, and decorate the controllers and
page state managers.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._pageRenderer : <code>PageRenderer</code>&nbsp;<a name="AbstractPageManager+_pageRenderer" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current renderer of the page.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._pageStateManager : <code>PageStateManager</code>&nbsp;<a name="AbstractPageManager+_pageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current page state manager.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._managedPage : <code>Object</code>&nbsp;<a name="AbstractPageManager+_managedPage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L80" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Details of the currently managed page.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager.init()&nbsp;<a name="AbstractPageManager+init" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### abstractPageManager.manage()&nbsp;<a name="AbstractPageManager+manage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L96" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### *abstractPageManager.scrollTo()*&nbsp;<a name="AbstractPageManager+scrollTo" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L138" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance abstract method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### abstractPageManager.destroy()&nbsp;<a name="AbstractPageManager+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L147" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### abstractPageManager._storeManagedPageValue(controller, view, options, params, controllerInstance, decoratedController, viewInstance)&nbsp;<a name="AbstractPageManager+_storeManagedPageValue" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L184" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>string</code> \| <code>function</code> |  |
| view | <code>string</code> \| <code>function</code> |  |
| options | <code>Object</code> |  |
| params | <code>Object.&lt;string, string&gt;</code> | The route parameters. |
| controllerInstance | <code>AbstractController</code> |  |
| decoratedController | <code>ControllerDecorator</code> |  |
| viewInstance | <code>React.Component</code> |  |


* * *

### abstractPageManager._clearManagedPageValue()&nbsp;<a name="AbstractPageManager+_clearManagedPageValue" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L212" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clear value from managed page.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._setRestrictedPageStateManager(extension, extensionState)&nbsp;<a name="AbstractPageManager+_setRestrictedPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L234" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Set page state manager to extension which has restricted rights to set
global state.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

| Param | Type |
| --- | --- |
| extension | <code>ima.extension.Extension</code> | 
| extensionState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### abstractPageManager._initPageSource()&nbsp;<a name="AbstractPageManager+_initPageSource" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L254" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initialize page source so call init method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._initController()&nbsp;<a name="AbstractPageManager+_initController" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L264" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes managed instance of controller with the provided parameters.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._initExtensions()&nbsp;<a name="AbstractPageManager+_initExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L277" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initialize extensions for managed instance of controller with the
provided parameters.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._loadPageSource() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_loadPageSource" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L293" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Load page source so call load method on controller and his extensions.
Merge loaded state and render it.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getLoadedControllerState() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getLoadedControllerState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L318" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Load controller state from managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getLoadedExtensionsState() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getLoadedExtensionsState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L333" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Load extensions state from managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._activatePageSource()&nbsp;<a name="AbstractPageManager+_activatePageSource" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L353" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Activate page source so call activate method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._activateController()&nbsp;<a name="AbstractPageManager+_activateController" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L369" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Activate managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._activateExtensions()&nbsp;<a name="AbstractPageManager+_activateExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L380" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Activate extensions for managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._updatePageSource() ⇒ <code>Promise.&lt;{status: number, content: ?string}&gt;</code>&nbsp;<a name="AbstractPageManager+_updatePageSource" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L395" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Update page source so call update method on controller and his
extensions. Merge updated state and render it.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getUpdatedControllerState() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getUpdatedControllerState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L419" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return updated controller state for current page controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getUpdatedExtensionsState() ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getUpdatedExtensionsState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L434" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return updated extensions state for current page controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._deactivatePageSource()&nbsp;<a name="AbstractPageManager+_deactivatePageSource" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L456" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deactivate page source so call deactivate method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._deactivateController()&nbsp;<a name="AbstractPageManager+_deactivateController" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L472" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deactivate last managed instance of controller only If controller was
activated.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._deactivateExtensions()&nbsp;<a name="AbstractPageManager+_deactivateExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L484" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deactivate extensions for last managed instance of controller only if
they were activated.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._destroyPageSource()&nbsp;<a name="AbstractPageManager+_destroyPageSource" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L498" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Destroy page source so call destroy method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._destroyController()&nbsp;<a name="AbstractPageManager+_destroyController" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L512" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Destroy last managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._destroyExtensions()&nbsp;<a name="AbstractPageManager+_destroyExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L524" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Destroy extensions for last managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._clearComponentState(options)&nbsp;<a name="AbstractPageManager+_clearComponentState" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L555" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The method clear state on current renderred component to DOM.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The current route options. |


* * *

### abstractPageManager._onChangeStateHandler(state)&nbsp;<a name="AbstractPageManager+_onChangeStateHandler" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L575" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
On change event handler set state to view.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

| Param | Type |
| --- | --- |
| state | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### abstractPageManager._hasOnlyUpdate(controller, view, options) ⇒ <code>boolean</code>&nbsp;<a name="AbstractPageManager+_hasOnlyUpdate" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L608" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return true if manager has to update last managed controller and view.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| controller | <code>string</code> \| <code>function</code> | 
| view | <code>string</code> \| <code>function</code> | 
| options | <code>Object</code> | 


* * *

### abstractPageManager._preManage(options)&nbsp;<a name="AbstractPageManager+_preManage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L646" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Make defined instruction as scroll for current page options before than
change page.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

### abstractPageManager._postManage(options)&nbsp;<a name="AbstractPageManager+_postManage" href="https://github.com/seznam/IMA.js-core/tree/0.15.12/page/manager/AbstractPageManager.js#L675" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Make defined instruction for current page options after that
changed page.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 


* * *

