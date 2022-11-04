---
id: "ClientPageManager"
title: "Class: ClientPageManager"
sidebar_label: "ClientPageManager"
sidebar_position: 0
custom_edit_url: null
---

Page manager for controller on the client side.

## Hierarchy

- [`AbstractPageManager`](AbstractPageManager.md)

  ↳ **`ClientPageManager`**

## Constructors

### constructor

• **new ClientPageManager**(`pageFactory`, `pageRenderer`, `pageStateManager`, `handlerRegistry`, `window`, `eventBus`)

Initializes the client-side page manager.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pageFactory` | [`PageFactory`](PageFactory.md) | Factory used by the page manager to        create instances of the controller for the current route, and        decorate the controllers and page state managers. |
| `pageRenderer` | [`PageRenderer`](PageRenderer.md) | The current renderer of the page. |
| `pageStateManager` | [`PageStateManager`](PageStateManager.md) | - |
| `handlerRegistry` | [`PageHandlerRegistry`](PageHandlerRegistry.md) | Instance of HandlerRegistry that        holds a list of pre-manage and post-manage handlers. |
| `window` | [`Window`](Window.md) | The utility for manipulating the global context        and global client-side-specific APIs. |
| `eventBus` | [`EventBus`](EventBus.md) | The event bus for dispatching and listening        for custom IMA events propagated through the DOM. |

#### Overrides

[AbstractPageManager](AbstractPageManager.md).[constructor](AbstractPageManager.md#constructor)

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:64](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L64)

## Properties

### \_eventBus

• `Private` **\_eventBus**: [`EventBus`](EventBus.md)

The event bus for dispatching and listening for custom IMA events
propagated through the DOM.

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:29](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L29)

___

### \_managedPage

• `Protected` **\_managedPage**: `ManagedPage` = `{}`

Details of the currently managed page.

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_managedPage](AbstractPageManager.md#_managedpage)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L34)

___

### \_pageHandlerRegistry

• `Protected` **\_pageHandlerRegistry**: [`PageHandlerRegistry`](PageHandlerRegistry.md)

A registry that holds a list of pre-manage and post-manage handlers.

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_pageHandlerRegistry](AbstractPageManager.md#_pagehandlerregistry)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L46)

___

### \_pageRenderer

• `Protected` **\_pageRenderer**: [`PageRenderer`](PageRenderer.md)

The current renderer of the page.

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_pageRenderer](AbstractPageManager.md#_pagerenderer)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L38)

___

### \_pageStateManager

• `Protected` **\_pageStateManager**: [`PageStateManager`](PageStateManager.md)

The current page state manager.

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_pageStateManager](AbstractPageManager.md#_pagestatemanager)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:42](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L42)

___

### \_window

• `Private` **\_window**: [`Window`](Window.md)

The utility for manipulating the global context and global
client-side-specific APIs.

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L24)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): (`string` \| typeof [`PageStateManager`](PageStateManager.md) \| typeof [`EventBus`](EventBus.md) \| typeof [`Window`](Window.md) \| typeof [`PageFactory`](PageFactory.md) \| typeof [`PageRenderer`](PageRenderer.md))[]

#### Returns

(`string` \| typeof [`PageStateManager`](PageStateManager.md) \| typeof [`EventBus`](EventBus.md) \| typeof [`Window`](Window.md) \| typeof [`PageFactory`](PageFactory.md) \| typeof [`PageRenderer`](PageRenderer.md))[]

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L38)

## Methods

### \_activateController

▸ `Protected` **_activateController**(): `Promise`<`void`\>

Activate managed instance of controller.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_activateController](AbstractPageManager.md#_activatecontroller)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:394](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L394)

___

### \_activateExtensions

▸ `Protected` **_activateExtensions**(): `Promise`<`void`\>

Activate extensions for managed instance of controller.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_activateExtensions](AbstractPageManager.md#_activateextensions)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:403](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L403)

___

### \_activatePageSource

▸ `Protected` **_activatePageSource**(): `Promise`<`void`\>

Activate page source so call activate method on controller and his
extensions.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_activatePageSource](AbstractPageManager.md#_activatepagesource)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:379](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L379)

___

### \_boundOnCustomEventHandler

▸ `Private` **_boundOnCustomEventHandler**(`event`): `void`

Event listener for the custom DOM events used by the event bus,
bound to this instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L34)

___

### \_clearComponentState

▸ **_clearComponentState**(`options`): `void`

The method clear state on current renderred component to DOM.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | The current route options. |

#### Returns

`void`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_clearComponentState](AbstractPageManager.md#_clearcomponentstate)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:566](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L566)

___

### \_clearManagedPageValue

▸ `Protected` **_clearManagedPageValue**(): `void`

Clear value from managed page.

#### Returns

`void`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_clearManagedPageValue](AbstractPageManager.md#_clearmanagedpagevalue)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:205](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L205)

___

### \_constructManagedPageValue

▸ `Protected` **_constructManagedPageValue**(`controller`, `view`, `route`, `options`, `params`, `controllerInstance`, `decoratedController`, `viewInstance`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`IController`](../interfaces/IController.md) |
| `view` | `unknown` |
| `route` | [`AbstractRoute`](AbstractRoute.md) |
| `options` | [`RouteOptions`](../modules.md#routeoptions) |
| `params` | [`UnknownParameters`](../modules.md#unknownparameters) |
| `controllerInstance` | [`AbstractController`](AbstractController.md) |
| `decoratedController` | [`ControllerDecorator`](ControllerDecorator.md) |
| `viewInstance` | `unknown` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `controller` | [`IController`](../interfaces/IController.md) |
| `controllerInstance` | [`AbstractController`](AbstractController.md) |
| `decoratedController` | [`ControllerDecorator`](ControllerDecorator.md) |
| `options` | [`RouteOptions`](../modules.md#routeoptions) |
| `params` | [`UnknownParameters`](../modules.md#unknownparameters) |
| `route` | [`AbstractRoute`](AbstractRoute.md) |
| `state` | { `activated`: `boolean` = false } |
| `state.activated` | `boolean` |
| `view` | `unknown` |
| `viewInstance` | `unknown` |

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_constructManagedPageValue](AbstractPageManager.md#_constructmanagedpagevalue)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:165](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L165)

___

### \_deactivateController

▸ `Protected` **_deactivateController**(): `Promise`<`void`\>

Deactivate last managed instance of controller only If controller was
activated.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_deactivateController](AbstractPageManager.md#_deactivatecontroller)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:504](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L504)

___

### \_deactivateExtensions

▸ `Protected` **_deactivateExtensions**(): `Promise`<`void`\>

Deactivate extensions for last managed instance of controller only if
they were activated.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_deactivateExtensions](AbstractPageManager.md#_deactivateextensions)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:515](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L515)

___

### \_deactivatePageSource

▸ `Protected` **_deactivatePageSource**(): `Promise`<`void`\>

Deactivate page source so call deactivate method on controller and his
extensions.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_deactivatePageSource](AbstractPageManager.md#_deactivatepagesource)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:489](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L489)

___

### \_destroyController

▸ `Protected` **_destroyController**(): `Promise`<`void`\>

Destroy last managed instance of controller.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_destroyController](AbstractPageManager.md#_destroycontroller)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:539](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L539)

___

### \_destroyExtensions

▸ `Protected` **_destroyExtensions**(): `Promise`<`void`\>

Destroy extensions for last managed instance of controller.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_destroyExtensions](AbstractPageManager.md#_destroyextensions)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:552](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L552)

___

### \_destroyPageSource

▸ `Protected` **_destroyPageSource**(): `Promise`<`void`\>

Destroy page source so call destroy method on controller and his
extensions.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_destroyPageSource](AbstractPageManager.md#_destroypagesource)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:527](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L527)

___

### \_getLoadedControllerState

▸ `Protected` **_getLoadedControllerState**(): `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

Load controller state from managed instance of controller.

#### Returns

`Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_getLoadedControllerState](AbstractPageManager.md#_getloadedcontrollerstate)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:343](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L343)

___

### \_getLoadedExtensionsState

▸ `Protected` **_getLoadedExtensionsState**(`controllerState?`): `Promise`<[`UnknownParameters`](../modules.md#unknownparameters)\>

Load extensions state from managed instance of controller.

#### Parameters

| Name | Type |
| :------ | :------ |
| `controllerState?` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`Promise`<[`UnknownParameters`](../modules.md#unknownparameters)\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_getLoadedExtensionsState](AbstractPageManager.md#_getloadedextensionsstate)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:355](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L355)

___

### \_getUpdatedControllerState

▸ `Protected` **_getUpdatedControllerState**(): [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

Return updated controller state for current page controller.

#### Returns

[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_getUpdatedControllerState](AbstractPageManager.md#_getupdatedcontrollerstate)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:439](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L439)

___

### \_getUpdatedExtensionsState

▸ `Protected` **_getUpdatedExtensionsState**(`controllerState?`): `Promise`<[`UnknownParameters`](../modules.md#unknownparameters)\>

Return updated extensions state for current page controller.

#### Parameters

| Name | Type |
| :------ | :------ |
| `controllerState?` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`Promise`<[`UnknownParameters`](../modules.md#unknownparameters)\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_getUpdatedExtensionsState](AbstractPageManager.md#_getupdatedextensionsstate)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:453](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L453)

___

### \_handleEventWithController

▸ **_handleEventWithController**(`method`, `data`): `boolean`

Attempts to handle the currently processed event bus custom DOM event
using the current controller. The method returns `true` if the
event is handled by the controller.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The name of the method the current controller        should use to process the currently processed event bus custom        DOM event. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The custom event's data. |

#### Returns

`boolean`

`true` if the event has been handled by the
        controller, `false` if the controller does not have a
        method for processing the event.

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:204](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L204)

___

### \_handleEventWithExtensions

▸ **_handleEventWithExtensions**(`method`, `data`): `boolean`

Attempts to handle the currently processed event bus custom DOM event
using the registered extensions of the current controller. The method
returns `true` if the event is handled by the controller.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The name of the method the current controller        should use to process the currently processed event bus custom        DOM event. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The custom event's data. |

#### Returns

`boolean`

`true` if the event has been handled by one of
        the controller's extensions, `false` if none of the
        controller's extensions has a method for processing the event.

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:229](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L229)

___

### \_hasOnlyUpdate

▸ `Protected` **_hasOnlyUpdate**(`controller`, `view`, `options`): `boolean`

Return true if manager has to update last managed controller and view.

#### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`IController`](../interfaces/IController.md) |
| `view` | `unknown` |
| `options` | [`RouteOptions`](../modules.md#routeoptions) |

#### Returns

`boolean`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_hasOnlyUpdate](AbstractPageManager.md#_hasonlyupdate)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:582](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L582)

___

### \_initController

▸ `Protected` **_initController**(): `Promise`<`void`\>

Initializes managed instance of controller with the provided parameters.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_initController](AbstractPageManager.md#_initcontroller)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:285](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L285)

___

### \_initExtensions

▸ `Protected` **_initExtensions**(): `Promise`<`void`\>

Initialize extensions for managed instance of controller with the
provided parameters.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_initExtensions](AbstractPageManager.md#_initextensions)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:298](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L298)

___

### \_initPageSource

▸ `Protected` **_initPageSource**(): `Promise`<`void`\>

Initialize page source so call init method on controller and his
extensions.

#### Returns

`Promise`<`void`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_initPageSource](AbstractPageManager.md#_initpagesource)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:277](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L277)

___

### \_loadPageSource

▸ `Protected` **_loadPageSource**(): `Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

Load page source so call load method on controller and his extensions.
Merge loaded state and render it.

#### Returns

`Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_loadPageSource](AbstractPageManager.md#_loadpagesource)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:323](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L323)

___

### \_onChangeStateHandler

▸ **_onChangeStateHandler**(`state`): `void`

On change event handler set state to view.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`void`

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:247](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L247)

___

### \_onCustomEventHandler

▸ **_onCustomEventHandler**(`event`): `void`

Custom DOM event handler.

The handler invokes the event listener in the active controller, if such
listener is present. The name of the controller's listener method is
created by turning the first symbol of the event's name to upper case,
and then prefixing the result with the 'on' prefix.

For example: for an event named 'toggle' the controller's listener
would be named 'onToggle'.

The controller's listener will be invoked with the event's data as an
argument.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | The encountered event bus DOM event. |

#### Returns

`void`

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:145](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L145)

___

### \_parseCustomEvent

▸ **_parseCustomEvent**(`event`): `Object`

Extracts the details of the provided event bus custom DOM event, along
with the expected name of the current controller's method for
intercepting the event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | The encountered event bus custom DOM event. |

#### Returns

`Object`

The event's
        details.

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `eventName` | `string` |
| `method` | `string` |

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:182](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L182)

___

### \_runPostManageHandlers

▸ `Protected` **_runPostManageHandlers**(`previousManagedPage`, `action`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `previousManagedPage` | `ManagedPage` |
| `action` | `PageAction` |

#### Returns

`Promise`<`unknown`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_runPostManageHandlers](AbstractPageManager.md#_runpostmanagehandlers)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:614](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L614)

___

### \_runPreManageHandlers

▸ `Protected` **_runPreManageHandlers**(`nextManagedPage`, `action`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `nextManagedPage` | `ManagedPage` |
| `action` | `PageAction` |

#### Returns

`Promise`<`unknown`\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_runPreManageHandlers](AbstractPageManager.md#_runpremanagehandlers)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:601](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L601)

___

### \_setRestrictedPageStateManager

▸ **_setRestrictedPageStateManager**(`extension`, `extensionState`): `void`

Set page state manager to extension which has restricted rights to set
global state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extension` | [`Extension`](Extension.md) |
| `extensionState` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`void`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_setRestrictedPageStateManager](AbstractPageManager.md#_setrestrictedpagestatemanager)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:236](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L236)

___

### \_storeManagedPageSnapshot

▸ `Protected` **_storeManagedPageSnapshot**(): `ManagedPage`

Creates a cloned version of currently managed page and stores it in
a helper property.
Snapshot is used in manager handlers to easily determine differences
between the current and the previous state.

#### Returns

`ManagedPage`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_storeManagedPageSnapshot](AbstractPageManager.md#_storemanagedpagesnapshot)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:196](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L196)

___

### \_stripManagedPageValueForPublic

▸ `Protected` **_stripManagedPageValueForPublic**(`value`): `Object`

Removes properties we do not want to propagate outside of the page manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `ManagedPage` | The managed page object to strip down |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `controller` | `undefined` \| [`IController`](../interfaces/IController.md) |
| `options` | `undefined` \| [`RouteOptions`](../modules.md#routeoptions) |
| `params` | `undefined` \| [`UnknownParameters`](../modules.md#unknownparameters) |
| `route` | `undefined` \| [`AbstractRoute`](AbstractRoute.md) |
| `view` | `unknown` |

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_stripManagedPageValueForPublic](AbstractPageManager.md#_stripmanagedpagevalueforpublic)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:226](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L226)

___

### \_switchToPageStateManager

▸ `Protected` **_switchToPageStateManager**(): `void`

Iterates over extensions of current controller and switches each one to
pageStateManager and clears their partial state.

#### Returns

`void`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_switchToPageStateManager](AbstractPageManager.md#_switchtopagestatemanager)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:310](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L310)

___

### \_switchToPageStateManagerAfterLoaded

▸ **_switchToPageStateManagerAfterLoaded**(`extension`, `extensionState`): `void`

For defined extension switches to pageStageManager and clears partial state
after extension state is loaded.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extension` | [`Extension`](Extension.md) |
| `extensionState` | [`UnknownParameters`](../modules.md#unknownparameters) |

#### Returns

`void`

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_switchToPageStateManagerAfterLoaded](AbstractPageManager.md#_switchtopagestatemanagerafterloaded)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:257](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L257)

___

### \_updatePageSource

▸ `Protected` **_updatePageSource**(): `Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

Update page source so call update method on controller and his
extensions. Merge updated state and render it.

#### Returns

`Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

#### Inherited from

[AbstractPageManager](AbstractPageManager.md).[_updatePageSource](AbstractPageManager.md#_updatepagesource)

#### Defined in

[packages/core/src/page/manager/AbstractPageManager.ts:415](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/AbstractPageManager.ts#L415)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

Finalization callback, called when the page manager is being discarded.
This usually happens when the page is hot-reloaded at the client side.

#### Returns

`Promise`<`void`\>

#### Overrides

[AbstractPageManager](AbstractPageManager.md).[destroy](AbstractPageManager.md#destroy)

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L120)

___

### init

▸ **init**(): `void`

Initializes the page manager.

#### Returns

`void`

#### Overrides

[AbstractPageManager](AbstractPageManager.md).[init](AbstractPageManager.md#init)

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:82](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L82)

___

### manage

▸ **manage**(`__namedParameters`): `Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

Starts to manage the provided controller and its view. The manager
stops the management of any previously managed controller and view.

The controller and view will be initialized and rendered either into the
UI (at the client-side) or to the response to send to the client (at the
server-side).

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `ManageArgs` |

#### Returns

`Promise`<`void` \| [`PageData`](../modules.md#pagedata)\>

A promise that will resolve to information about the rendered page.
        The `status` will contain the HTTP status code to send to the
        client (at the server side) or determine the type of error page
        to navigate to (at the client side).

#### Overrides

[AbstractPageManager](AbstractPageManager.md).[manage](AbstractPageManager.md#manage)

#### Defined in

[packages/core/src/page/manager/ClientPageManager.ts:96](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/manager/ClientPageManager.ts#L96)
