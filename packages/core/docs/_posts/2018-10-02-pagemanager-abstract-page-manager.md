---
category: "page/manager"
title: "AbstractPageManager"
---

## Classes

<dl>
<dt><a href="#AbstractPageManager">AbstractPageManager</a></dt>
<dd><p>Page manager for controller.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#RouteOptions">RouteOptions</a> : <code>Object</code></dt>
<dd><p>An Object used to configure a route</p>
</dd>
<dt><a href="#ManagedPage">ManagedPage</a> : <code>Object</code></dt>
<dd><p>An object representing a page that&#39;s currently managed by PageManager</p>
</dd>
</dl>

## AbstractPageManager&nbsp;<a name="AbstractPageManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L45" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Page manager for controller.

**Kind**: global class  

* [AbstractPageManager](#AbstractPageManager)
    * [new AbstractPageManager(pageFactory, pageRenderer, pageStateManager, pageHandlerRegistry)](#new_AbstractPageManager_new)
    * [._pageFactory](#AbstractPageManager+_pageFactory) : <code>PageFactory</code>
    * [._pageRenderer](#AbstractPageManager+_pageRenderer) : <code>PageRenderer</code>
    * [._pageStateManager](#AbstractPageManager+_pageStateManager) : <code>PageStateManager</code>
    * [._pageHandlerRegistry](#AbstractPageManager+_pageHandlerRegistry) : <code>PageHandlerRegistry</code>
    * [._managedPage](#AbstractPageManager+_managedPage) : [<code>ManagedPage</code>](#ManagedPage)
    * [._previousManagedPage](#AbstractPageManager+_previousManagedPage) : [<code>ManagedPage</code>](#ManagedPage)
    * [.init()](#AbstractPageManager+init)
    * [.manage()](#AbstractPageManager+manage)
    * [.destroy()](#AbstractPageManager+destroy)
    * [._constructManagedPageValue(controller, view, route, options, params, controllerInstance, decoratedController, viewInstance)](#AbstractPageManager+_constructManagedPageValue) ⇒ [<code>ManagedPage</code>](#ManagedPage)
    * [._storeManagedPageSnapshot()](#AbstractPageManager+_storeManagedPageSnapshot) ⇒ [<code>ManagedPage</code>](#ManagedPage)
    * [._clearManagedPageValue()](#AbstractPageManager+_clearManagedPageValue)
    * [._stripManagedPageValueForPublic(value)](#AbstractPageManager+_stripManagedPageValueForPublic) ⇒ <code>Object</code>
    * [._setRestrictedPageStateManager(extension, extensionState)](#AbstractPageManager+_setRestrictedPageStateManager)
    * [._initPageSource()](#AbstractPageManager+_initPageSource)
    * [._initController()](#AbstractPageManager+_initController)
    * [._initExtensions()](#AbstractPageManager+_initExtensions)
    * [._clearPartialState()](#AbstractPageManager+_clearPartialState)
    * [._loadPageSource()](#AbstractPageManager+_loadPageSource) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._getLoadedControllerState()](#AbstractPageManager+_getLoadedControllerState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._getLoadedExtensionsState(controllerState)](#AbstractPageManager+_getLoadedExtensionsState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._activatePageSource()](#AbstractPageManager+_activatePageSource)
    * [._activateController()](#AbstractPageManager+_activateController)
    * [._activateExtensions()](#AbstractPageManager+_activateExtensions)
    * [._updatePageSource()](#AbstractPageManager+_updatePageSource) ⇒ <code>Promise.&lt;{status: number, content: ?string}&gt;</code>
    * [._getUpdatedControllerState()](#AbstractPageManager+_getUpdatedControllerState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>
    * [._getUpdatedExtensionsState(controllerState)](#AbstractPageManager+_getUpdatedExtensionsState) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [._deactivatePageSource()](#AbstractPageManager+_deactivatePageSource)
    * [._deactivateController()](#AbstractPageManager+_deactivateController)
    * [._deactivateExtensions()](#AbstractPageManager+_deactivateExtensions)
    * [._destroyPageSource()](#AbstractPageManager+_destroyPageSource)
    * [._destroyController()](#AbstractPageManager+_destroyController)
    * [._destroyExtensions()](#AbstractPageManager+_destroyExtensions)
    * [._clearComponentState(options)](#AbstractPageManager+_clearComponentState)
    * [._onChangeStateHandler(state)](#AbstractPageManager+_onChangeStateHandler)
    * [._hasOnlyUpdate(controller, view, options)](#AbstractPageManager+_hasOnlyUpdate) ⇒ <code>boolean</code>
    * [._runPreManageHandlers(nextManagedPage, action)](#AbstractPageManager+_runPreManageHandlers) ⇒ <code>Promise.&lt;any&gt;</code>
    * [._runPostManageHandlers(previousManagedPage, action)](#AbstractPageManager+_runPostManageHandlers) ⇒ <code>Promise.&lt;any&gt;</code>


* * *

### new AbstractPageManager(pageFactory, pageRenderer, pageStateManager, pageHandlerRegistry)&nbsp;<a name="new_AbstractPageManager_new"></a>
Initializes the page manager.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pageFactory | <code>PageFactory</code> |  | Factory used by the page manager to        create instances of the controller for the current route, and        decorate the controllers and page state managers. |
| pageRenderer | <code>PageRenderer</code> |  | The current renderer of the page. |
| pageStateManager | <code>PageStateManager</code> |  | The current page state        manager. |
| pageHandlerRegistry | <code>HandlerRegistry</code> | <code></code> | Instance of HandlerRegistry that        holds a list of pre-manage and post-manage handlers. |


* * *

### abstractPageManager._pageFactory : <code>PageFactory</code>&nbsp;<a name="AbstractPageManager+_pageFactory" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L74" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Factory used by the page manager to create instances of the
controller for the current route, and decorate the controllers and
page state managers.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._pageRenderer : <code>PageRenderer</code>&nbsp;<a name="AbstractPageManager+_pageRenderer" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L82" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current renderer of the page.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._pageStateManager : <code>PageStateManager</code>&nbsp;<a name="AbstractPageManager+_pageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L90" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current page state manager.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._pageHandlerRegistry : <code>PageHandlerRegistry</code>&nbsp;<a name="AbstractPageManager+_pageHandlerRegistry" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L98" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
A registry that holds a list of pre-manage and post-manage handlers.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._managedPage : [<code>ManagedPage</code>](#ManagedPage)&nbsp;<a name="AbstractPageManager+_managedPage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L106" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Details of the currently managed page.

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._previousManagedPage : [<code>ManagedPage</code>](#ManagedPage)&nbsp;<a name="AbstractPageManager+_previousManagedPage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L115" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Snapshot of the previously managed page before it was replaced with
a new one

**Kind**: instance property of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager.init()&nbsp;<a name="AbstractPageManager+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L121" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### abstractPageManager.manage()&nbsp;<a name="AbstractPageManager+manage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L132" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### abstractPageManager.destroy()&nbsp;<a name="AbstractPageManager+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L191" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

* * *

### abstractPageManager._constructManagedPageValue(controller, view, route, options, params, controllerInstance, decoratedController, viewInstance) ⇒ [<code>ManagedPage</code>](#ManagedPage)&nbsp;<a name="AbstractPageManager+_constructManagedPageValue" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L215" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>string</code> \| <code>function</code> |  |
| view | <code>string</code> \| <code>function</code> |  |
| route | <code>Route</code> |  |
| options | [<code>RouteOptions</code>](#RouteOptions) |  |
| params | <code>Object.&lt;string, string&gt;</code> | The route parameters. |
| controllerInstance | <code>AbstractController</code> |  |
| decoratedController | <code>ControllerDecorator</code> |  |
| viewInstance | <code>React.Component</code> |  |


* * *

### abstractPageManager._storeManagedPageSnapshot() ⇒ [<code>ManagedPage</code>](#ManagedPage)&nbsp;<a name="AbstractPageManager+_storeManagedPageSnapshot" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L249" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates a cloned version of currently managed page and stores it in
a helper property.
Snapshot is used in manager handlers to easily determine differences
between the current and the previous state.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._clearManagedPageValue()&nbsp;<a name="AbstractPageManager+_clearManagedPageValue" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L260" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clear value from managed page.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._stripManagedPageValueForPublic(value) ⇒ <code>Object</code>&nbsp;<a name="AbstractPageManager+_stripManagedPageValueForPublic" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L289" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Removes properties we do not want to propagate outside of the page manager

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>ManagedPage</code>](#ManagedPage) | The managed page object to strip down |


* * *

### abstractPageManager._setRestrictedPageStateManager(extension, extensionState)&nbsp;<a name="AbstractPageManager+_setRestrictedPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L302" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Set page state manager to extension which has restricted rights to set
global state.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

| Param | Type |
| --- | --- |
| extension | <code>ima.extension.Extension</code> | 
| extensionState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### abstractPageManager._initPageSource()&nbsp;<a name="AbstractPageManager+_initPageSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L322" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initialize page source so call init method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._initController()&nbsp;<a name="AbstractPageManager+_initController" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L332" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes managed instance of controller with the provided parameters.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._initExtensions()&nbsp;<a name="AbstractPageManager+_initExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L345" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initialize extensions for managed instance of controller with the
provided parameters.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._clearPartialState()&nbsp;<a name="AbstractPageManager+_clearPartialState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L359" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears partialState of extensions for managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._loadPageSource() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_loadPageSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L374" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Load page source so call load method on controller and his extensions.
Merge loaded state and render it.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getLoadedControllerState() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getLoadedControllerState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L396" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Load controller state from managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getLoadedExtensionsState(controllerState) ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getLoadedExtensionsState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L412" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Load extensions state from managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| controllerState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### abstractPageManager._activatePageSource()&nbsp;<a name="AbstractPageManager+_activatePageSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L434" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Activate page source so call activate method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._activateController()&nbsp;<a name="AbstractPageManager+_activateController" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L450" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Activate managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._activateExtensions()&nbsp;<a name="AbstractPageManager+_activateExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L461" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Activate extensions for managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._updatePageSource() ⇒ <code>Promise.&lt;{status: number, content: ?string}&gt;</code>&nbsp;<a name="AbstractPageManager+_updatePageSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L476" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Update page source so call update method on controller and his
extensions. Merge updated state and render it.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getUpdatedControllerState() ⇒ <code>Object.&lt;string, (Promise.&lt;\*&gt;\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getUpdatedControllerState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L502" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return updated controller state for current page controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._getUpdatedExtensionsState(controllerState) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="AbstractPageManager+_getUpdatedExtensionsState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L518" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return updated extensions state for current page controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| controllerState | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### abstractPageManager._deactivatePageSource()&nbsp;<a name="AbstractPageManager+_deactivatePageSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L542" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deactivate page source so call deactivate method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._deactivateController()&nbsp;<a name="AbstractPageManager+_deactivateController" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L558" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deactivate last managed instance of controller only If controller was
activated.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._deactivateExtensions()&nbsp;<a name="AbstractPageManager+_deactivateExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L570" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deactivate extensions for last managed instance of controller only if
they were activated.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._destroyPageSource()&nbsp;<a name="AbstractPageManager+_destroyPageSource" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L584" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Destroy page source so call destroy method on controller and his
extensions.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._destroyController()&nbsp;<a name="AbstractPageManager+_destroyController" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L598" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Destroy last managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._destroyExtensions()&nbsp;<a name="AbstractPageManager+_destroyExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L610" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Destroy extensions for last managed instance of controller.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

* * *

### abstractPageManager._clearComponentState(options)&nbsp;<a name="AbstractPageManager+_clearComponentState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L624" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The method clear state on current renderred component to DOM.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>RouteOptions</code>](#RouteOptions) | The current route options. |


* * *

### abstractPageManager._onChangeStateHandler(state)&nbsp;<a name="AbstractPageManager+_onChangeStateHandler" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L644" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
On change event handler set state to view.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  

| Param | Type |
| --- | --- |
| state | <code>Object.&lt;string, \*&gt;</code> | 


* * *

### abstractPageManager._hasOnlyUpdate(controller, view, options) ⇒ <code>boolean</code>&nbsp;<a name="AbstractPageManager+_hasOnlyUpdate" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L661" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return true if manager has to update last managed controller and view.

**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| controller | <code>string</code> \| <code>function</code> | 
| view | <code>string</code> \| <code>function</code> | 
| options | [<code>RouteOptions</code>](#RouteOptions) | 


* * *

### abstractPageManager._runPreManageHandlers(nextManagedPage, action) ⇒ <code>Promise.&lt;any&gt;</code>&nbsp;<a name="AbstractPageManager+_runPreManageHandlers" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L684" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| nextManagedPage | [<code>ManagedPage</code>](#ManagedPage) | 
| action | <code>Object</code> | 


* * *

### abstractPageManager._runPostManageHandlers(previousManagedPage, action) ⇒ <code>Promise.&lt;any&gt;</code>&nbsp;<a name="AbstractPageManager+_runPostManageHandlers" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L702" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractPageManager</code>](#AbstractPageManager)  
**Access**: protected  

| Param | Type |
| --- | --- |
| previousManagedPage | [<code>ManagedPage</code>](#ManagedPage) | 
| action | <code>Object</code> | 


* * *

## RouteOptions : <code>Object</code>&nbsp;<a name="RouteOptions" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L3" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An Object used to configure a route

**Kind**: global typedef  

* * *

## ManagedPage : <code>Object</code>&nbsp;<a name="ManagedPage" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.4/page/manager/AbstractPageManager.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
An object representing a page that's currently managed by PageManager

**Kind**: global typedef  

* * *

