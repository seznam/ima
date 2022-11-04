---
id: "ControllerDecorator"
title: "Class: ControllerDecorator"
sidebar_label: "ControllerDecorator"
sidebar_position: 0
custom_edit_url: null
---

Decorator for page controllers. The decorator manages references to the meta
attributes manager and other utilities so these can be easily provided to
the decorated page controller when needed.

## Hierarchy

- [`Controller`](Controller.md)

  ↳ **`ControllerDecorator`**

## Constructors

### constructor

• **new ControllerDecorator**(`controller`, `metaManager`, `router`, `dictionary`, `settings`)

Initializes the controller decorator.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `controller` | [`Controller`](Controller.md) | The controller being decorated. |
| `metaManager` | [`MetaManager`](MetaManager.md) | The meta page attributes manager. |
| `router` | [`Router`](Router.md) | The application router. |
| `dictionary` | [`Dictionary`](Dictionary.md) | Localization phrases dictionary. |
| `settings` | [`UnknownParameters`](../modules.md#unknownparameters) | Application settings for the        current application environment. |

#### Overrides

[Controller](Controller.md).[constructor](Controller.md#constructor)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L46)

## Properties

### \_controller

• `Protected` **\_controller**: [`Controller`](Controller.md)

The controller being decorated.

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:18](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L18)

___

### \_dictionary

• `Protected` **\_dictionary**: [`Dictionary`](Dictionary.md)

Localization phrases dictionary.

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:30](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L30)

___

### \_metaManager

• `Protected` **\_metaManager**: [`MetaManager`](MetaManager.md)

The meta page attributes manager.

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:22](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L22)

___

### \_router

• `Protected` **\_router**: [`Router`](Router.md)

The application router.

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L26)

___

### \_settings

• `Protected` **\_settings**: [`UnknownParameters`](../modules.md#unknownparameters)

Application settings for the current application environment.

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L34)

## Methods

### activate

▸ **activate**(): `void`

Callback for activating the controller in the UI. This is the last
method invoked during controller initialization, called after all the
promises returned from the [load](Controller.md#load) method have been
resolved and the controller has configured the meta manager.

The controller may register any React and DOM event listeners in this
method. The controller may start receiving event bus event after this
method completes.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[activate](Controller.md#activate)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:83](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L83)

___

### addExtension

▸ **addExtension**(`extension`, `extensionInstance?`): [`ControllerDecorator`](ControllerDecorator.md)

Adds the provided extension to this controller. All extensions should be
added to the controller before the [init](Controller.md#init) method is
invoked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `extension` | [`Extension`](Extension.md) \| [`IExtension`](../interfaces/IExtension.md) |
| `extensionInstance?` | [`Extension`](Extension.md) |

#### Returns

[`ControllerDecorator`](ControllerDecorator.md)

#### Overrides

[Controller](Controller.md).[addExtension](Controller.md#addextension)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:146](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L146)

___

### beginStateTransaction

▸ **beginStateTransaction**(): `void`

Starts queueing state patches off the controller state. While the transaction
is active every `setState` call has no effect on the current state.

Note that call to `getState` after the transaction has begun will
return state as it was before the transaction.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[beginStateTransaction](Controller.md#beginstatetransaction)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:125](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L125)

___

### cancelStateTransaction

▸ **cancelStateTransaction**(): `void`

Cancels ongoing state transaction. Uncommited state changes are lost.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[cancelStateTransaction](Controller.md#cancelstatetransaction)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:139](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L139)

___

### commitStateTransaction

▸ **commitStateTransaction**(): `void`

Applies queued state patches to the controller state. All patches are squashed
and applied with one `setState` call.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[commitStateTransaction](Controller.md#commitstatetransaction)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:132](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L132)

___

### deactivate

▸ **deactivate**(): `void`

Callback for deactivating the controller in the UI. This is the first
method invoked during controller deinitialization. This usually happens
when the user navigates to a different URL.

This method is the lifecycle counterpart of the
[activate](Controller.md#activate) method.

The controller should deregister listeners registered and release all
resources obtained in the [activate](Controller.md#activate) method.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[deactivate](Controller.md#deactivate)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:90](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L90)

___

### destroy

▸ **destroy**(): `void`

Finalization callback, called when the controller is being discarded by
the application. This usually happens when the user navigates to a
different URL.

This method is the lifecycle counterpart of the [init](Controller.md#init)
method.

The controller should release all resources obtained in the
[init](Controller.md#init) method. The controller must release any resources
that might not be released automatically when the controller's instance
is destroyed by the garbage collector.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[destroy](Controller.md#destroy)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:76](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L76)

___

### getExtensions

▸ **getExtensions**(): [`Extension`](Extension.md)[]

Returns the controller's extensions.

#### Returns

[`Extension`](Extension.md)[]

The extensions added to this controller.

#### Overrides

[Controller](Controller.md).[getExtensions](Controller.md#getextensions)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:158](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L158)

___

### getHttpStatus

▸ **getHttpStatus**(): `number`

Returns the HTTP status code to send to the client, should the
controller be used at the server-side.

#### Returns

`number`

The HTTP status code to send to the client.

#### Overrides

[Controller](Controller.md).[getHttpStatus](Controller.md#gethttpstatus)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:199](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L199)

___

### getMetaManager

▸ **getMetaManager**(): [`MetaManager`](MetaManager.md)

Returns the meta attributes manager configured by the decorated
controller.

#### Returns

[`MetaManager`](MetaManager.md)

The Meta attributes manager configured by the
        decorated controller.

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:210](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L210)

___

### getRouteParams

▸ **getRouteParams**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current route parameters.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current route parameters.

#### Overrides

[Controller](Controller.md).[getRouteParams](Controller.md#getrouteparams)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:185](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L185)

___

### getState

▸ **getState**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the controller's current state.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current state of this controller.

#### Overrides

[Controller](Controller.md).[getState](Controller.md#getstate)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:118](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L118)

___

### init

▸ **init**(): `void`

Callback for initializing the controller after the route parameters have
been set on this controller.

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[init](Controller.md#init)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:69](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L69)

___

### load

▸ **load**(): [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

Callback the controller uses to request the resources it needs to render
its view. This method is invoked after the [init](Controller.md#init)
method.

The controller should request all resources it needs in this method, and
represent each resource request as a promise that will resolve once the
resource is ready for use (these can be data fetched over HTTP(S),
database connections, etc).

The method must return a plain flat object. The field names of the
object identify the resources being fetched and prepared, each value
must be either the resource (e.g. view configuration or a value
retrieved synchronously) or a Promise that will resolve to the resource.

The IMA will use the object to set the state of the controller.

If at the server side, the IMA will wait for all the promises to
resolve, replaces the promises with the resolved values and sets the
resulting object as the controller's state.

If at the client side, the IMA will first set the controller's state to
an object containing only the fields of the returned object that were
not promises. IMA will then update the controller's state every time a
promise of the returned object resolves. IMA will update the state by
adding the resolved resource to the controller's state.

Any returned promise that gets rejected will redirect the application to
the error page. The error page that will be used depends on the status
code of the error.

#### Returns

[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.

#### Overrides

[Controller](Controller.md).[load](Controller.md#load)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:97](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L97)

___

### setMetaParams

▸ **setMetaParams**(`loadedResources`): `void`

Callback used to configure the meta attribute manager. The method is
called after the the controller's state has been patched with the all
loaded resources and the view has been rendered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `loadedResources` | [`UnknownParameters`](../modules.md#unknownparameters) | A plain object representing a        map of resource names to resources loaded by the        [load](Controller.md#load) method. This is the same object as the one        passed to the [setState](Controller.md#setstate) method. |

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[setMetaParams](Controller.md#setmetaparams)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:165](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L165)

___

### setPageStateManager

▸ **setPageStateManager**(`pageStateManager`): `void`

Sets the page state manager. The page state manager manages the
controller's state. The state manager can be set to `null` if this
controller loses the right to modify the state of the current page (e.g.
the user has navigated to a different route using a different
controller).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pageStateManager` | [`PageStateManager`](PageStateManager.md) | The current state manager to        use. |

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[setPageStateManager](Controller.md#setpagestatemanager)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:192](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L192)

___

### setRouteParams

▸ **setRouteParams**(`params?`): `void`

Sets the current route parameters. This method is invoked before the
[init](Controller.md#init) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The current route parameters. |

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[setRouteParams](Controller.md#setrouteparams)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:178](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L178)

___

### setState

▸ **setState**(`statePatch`): `void`

Patches the state of this controller using the provided object by
copying the provided patch object fields to the controller's state
object.

You can use this method to modify the state partially or add new fields
to the state object.

Note that the state is not patched recursively but by replacing the
values of the top-level fields of the state object.

Once the promises returned by the [load](Controller.md#load) method are
resolved, this method is called with the an object containing the
resolved values. The field names of the passed object will match the
field names in the object returned from the [load](Controller.md#load)
method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `statePatch` | [`UnknownParameters`](../modules.md#unknownparameters) | Patch of the controller's state to        apply. |

#### Returns

`void`

#### Overrides

[Controller](Controller.md).[setState](Controller.md#setstate)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:111](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L111)

___

### update

▸ **update**(`params?`): [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

Callback for updating the controller after a route update. This method
is invoked if the current route has the `onlyUpdate` flag set to `true` and
the current controller and view match those used by the previously active
route, or, the `onlyUpdate` option of the current route is a callback and
returned `true`.

The method must return an object with the same semantics as the result
of the [load](Controller.md#load) method. The controller's state will only
be patched by the returned object instead of replacing it completely.

The other controller lifecycle callbacks ([init](Controller.md#init),
[load](Controller.md#load), [activate](Controller.md#activate),
[deactivate](Controller.md#deactivate), Controller#deinit) are not call
in case this method is used.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Previous route         parameters. |

#### Returns

[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.

#### Overrides

[Controller](Controller.md).[update](Controller.md#update)

#### Defined in

[packages/core/src/controller/ControllerDecorator.ts:104](https://github.com/seznam/ima/blob/16487954/packages/core/src/controller/ControllerDecorator.ts#L104)
