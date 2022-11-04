---
id: "Extension"
title: "Class: Extension"
sidebar_label: "Extension"
sidebar_position: 0
custom_edit_url: null
---

Extensions provide means of extending the page controllers with additional
managed state and logic.

An extension has access to the current route parameters, specify the
resources to load when the page is loading or being updated, may intercept
event bus events and modify the state of the page just like an ordinary
controller, except that the modifications are restricted to the state fields
which the extension explicitly specifies using its
[getAllowedStateKeys](Extension.md#getallowedstatekeys) method.

All extensions to be used on a page must be added to the current controller
before the controller is initialized. After that, the extensions will go
through the same lifecycle as the controller.

## Implements

- [`IExtension`](../interfaces/IExtension.md)

## Implemented by

- [`AbstractExtension`](AbstractExtension.md)

## Indexable

▪ [key: `PropertyKey`]: `any` \| `EventHandler`

## Constructors

### constructor

• **new Extension**()

## Methods

### activate

▸ **activate**(): `void` \| `Promise`<`undefined`\>

Callback for activating the extension in the UI. This is the last
method invoked during controller (and extensions) initialization, called
after all the promises returned from the [load](Extension.md#load) method have
been resolved and the controller has configured the meta manager.

The extension may register any React and DOM event listeners in this
method. The extension may start receiving event bus event after this
method completes.

#### Returns

`void` \| `Promise`<`undefined`\>

#### Defined in

[packages/core/src/extension/Extension.ts:64](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L64)

___

### beginStateTransaction

▸ **beginStateTransaction**(): `void`

Starts queueing state patches off the controller state. While the transaction
is active every `setState` call has no effect on the current state.

Note that call to `getState` after the transaction has begun will
return state as it was before the transaction.

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:173](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L173)

___

### cancelStateTransaction

▸ **cancelStateTransaction**(): `void`

Cancels ongoing state transaction. Uncommited state changes are lost.

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:188](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L188)

___

### clearPartialState

▸ **clearPartialState**(): `void`

Clears the current partial state of the extension and sets it value to empty object.

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:215](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L215)

___

### commitStateTransaction

▸ **commitStateTransaction**(): `void`

Applies queued state patches to the controller state. All patches are squashed
and applied with one `setState` call.

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:181](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L181)

___

### deactivate

▸ **deactivate**(): `void` \| `Promise`<`undefined`\>

Callback for deactivating the extension in the UI. This is the first
method invoked during extension deinitialization. This usually happens
when the user navigates to a different URL.

This method is the lifecycle counterpart of the [activate](Extension.md#activate)
method.

The extension should deregister listeners registered and release all
resources obtained in the [activate](Extension.md#activate) method.

#### Returns

`void` \| `Promise`<`undefined`\>

#### Defined in

[packages/core/src/extension/Extension.ts:79](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L79)

___

### destroy

▸ **destroy**(): `void` \| `Promise`<`undefined`\>

Finalization callback, called when the controller is being discarded by
the application. This usually happens when the user navigates to a
different URL.

This method is the lifecycle counterpart of the [init](Extension.md#init)
method.

The extension should release all resources obtained in the
[init](Extension.md#init) method. The extension must release any resources
that might not be released automatically when the extensions's instance
is destroyed by the garbage collector.

#### Returns

`void` \| `Promise`<`undefined`\>

#### Defined in

[packages/core/src/extension/Extension.ts:50](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L50)

___

### getAllowedStateKeys

▸ **getAllowedStateKeys**(): `string`[]

Returns the names of the state fields that may be manipulated by this
extension. Manipulations of other fields of the state will be ignored.

#### Returns

`string`[]

The names of the state fields that may be manipulated
        by this extension.

#### Defined in

[packages/core/src/extension/Extension.ts:269](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L269)

___

### getPartialState

▸ **getPartialState**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current partial state of the extension.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current partial state of the extension.

#### Defined in

[packages/core/src/extension/Extension.ts:208](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L208)

___

### getRouteParams

▸ **getRouteParams**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current route parameters.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current route parameters.

#### Defined in

[packages/core/src/extension/Extension.ts:258](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L258)

___

### getState

▸ **getState**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current state of the controller using this extension.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current state of the controller.

#### Defined in

[packages/core/src/extension/Extension.ts:162](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L162)

___

### init

▸ **init**(): `void` \| `Promise`<`undefined`\>

Callback for initializing the controller extension after the route
parameters have been set on this extension.

#### Returns

`void` \| `Promise`<`undefined`\>

#### Defined in

[packages/core/src/extension/Extension.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L33)

___

### load

▸ **load**(): [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

Callback the extension uses to request the resources it needs to render
its related parts of the view. This method is invoked after the
[init](Extension.md#init) method.

The extension should request all resources it needs in this method, and
represent each resource request as a promise that will resolve once the
resource is ready for use (these can be data fetched over HTTP(S),
database connections, etc).

The method must return a plain flat object. The field names of the
object identify the resources being fetched and prepared, each value
must be either the resource (e.g. view configuration or a value
retrieved synchronously) or a Promise that will resolve to the resource.

The IMA will use the object to set the state of the controller.

Any returned promise that gets rejected will redirect the application to
the error page. The error page that will be used depends on the status
code of the error.

#### Returns

[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.

#### Defined in

[packages/core/src/extension/Extension.ts:108](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L108)

___

### setPageStateManager

▸ **setPageStateManager**(`pageStateManager?`): `void`

Sets the state manager used to manage the controller's state..

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pageStateManager?` | [`PageStateManager`](PageStateManager.md) | The current state manager to        use. |

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:225](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L225)

___

### setPartialState

▸ **setPartialState**(`partialStatePatch`): `void`

Patches the partial state of the extension. The extension is able
during its load and update phase receive state from active controller
using this extension and from previously loaded/updated extensions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `partialStatePatch` | [`UnknownParameters`](../modules.md#unknownparameters) | Patch of the controller's state to apply. |

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:199](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L199)

___

### setRouteParams

▸ **setRouteParams**(`params`): `void`

Sets the current route parameters. This method is invoked before the
[init](Extension.md#init) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`UnknownParameters`](../modules.md#unknownparameters) | The current route parameters. |

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:249](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L249)

___

### setState

▸ **setState**(`statePatch`): `void`

Patches the state of the controller using this extension by using the
provided object by copying the provided patch object fields to the
controller's state object.

Note that the state is not patched recursively but by replacing the
values of the top-level fields of the state object.

Note that the extension may modify only the fields of the state that it
has specified by its [getAllowedStateKeys](Extension.md#getallowedstatekeys) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `statePatch` | [`UnknownParameters`](../modules.md#unknownparameters) | Patch of the controller's state to apply. |

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:153](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L153)

___

### switchToPartialState

▸ **switchToPartialState**(): `void`

Disables using PageStateManager for getting state.

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:239](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L239)

___

### switchToStateManager

▸ **switchToStateManager**(): `void`

Enables using PageStateManager for getting state.

#### Returns

`void`

#### Defined in

[packages/core/src/extension/Extension.ts:232](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L232)

___

### update

▸ **update**(`prevParams`): [`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

Callback for updating the extension after a route update. This method
is invoked if the current route has the `onlyUpdate` flag set to `true` and
the current controller and view match those used by the previously active
route, or, the `onlyUpdate` option of the current route is a callback and
returned `true`.

The method must return an object with the same semantics as the result
of the [load](Extension.md#load) method. The controller's state will then be
patched by the returned object.

The other extension lifecycle callbacks ([init](Extension.md#init),
[load](Extension.md#load), [activate](Extension.md#activate),
[deactivate](Extension.md#deactivate), Extension#deinit) are not call in
case this method is used.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prevParams` | [`UnknownParameters`](../modules.md#unknownparameters) | Previous route         parameters. |

#### Returns

[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters) \| `Promise`<[`UnknownPromiseParameters`](../modules.md#unknownpromiseparameters)\>

A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.

#### Defined in

[packages/core/src/extension/Extension.ts:134](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/Extension.ts#L134)
