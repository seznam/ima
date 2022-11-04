---
id: "AbstractExtension"
title: "Class: AbstractExtension"
sidebar_label: "AbstractExtension"
sidebar_position: 0
custom_edit_url: null
---

Abstract extension

## Implements

- [`Extension`](Extension.md)

## Indexable

▪ [key: `PropertyKey`]: `any` \| `EventHandler` \| [`UnknownParameters`](../modules.md#unknownparameters)

## Constructors

### constructor

• **new AbstractExtension**()

## Properties

### \_pageStateManager

• `Protected` `Optional` **\_pageStateManager**: [`PageStateManager`](PageStateManager.md)

State manager.

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L19)

___

### \_partialStateSymbol

• `Protected` **\_partialStateSymbol**: `symbol`

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L25)

___

### \_usingStateManager

• `Protected` **\_usingStateManager**: `boolean` = `false`

Flag indicating whether the PageStateManager should be used instead
of partial state.

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L24)

___

### params

• **params**: [`UnknownParameters`](../modules.md#unknownparameters) = `{}`

The route parameters extracted from the current route.

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L34)

___

### status

• **status**: `number` = `200`

The HTTP response code to send to the client.

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:30](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L30)

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

#### Implementation of

[Extension](Extension.md).[activate](Extension.md#activate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:51](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L51)

___

### beginStateTransaction

▸ **beginStateTransaction**(): `void`

Starts queueing state patches off the controller state. While the transaction
is active every `setState` call has no effect on the current state.

Note that call to `getState` after the transaction has begun will
return state as it was before the transaction.

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[beginStateTransaction](Extension.md#beginstatetransaction)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:102](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L102)

___

### cancelStateTransaction

▸ **cancelStateTransaction**(): `void`

Cancels ongoing state transaction. Uncommited state changes are lost.

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[cancelStateTransaction](Extension.md#cancelstatetransaction)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L120)

___

### clearPartialState

▸ **clearPartialState**(): `void`

Clears the current partial state of the extension and sets it value to empty object.

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[clearPartialState](Extension.md#clearpartialstate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:148](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L148)

___

### commitStateTransaction

▸ **commitStateTransaction**(): `void`

Applies queued state patches to the controller state. All patches are squashed
and applied with one `setState` call.

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[commitStateTransaction](Extension.md#commitstatetransaction)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:111](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L111)

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

#### Implementation of

[Extension](Extension.md).[deactivate](Extension.md#deactivate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:58](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L58)

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

#### Implementation of

[Extension](Extension.md).[destroy](Extension.md#destroy)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:44](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L44)

___

### getAllowedStateKeys

▸ **getAllowedStateKeys**(): `never`[]

Returns array of allowed state keys for extension.

#### Returns

`never`[]

#### Implementation of

[Extension](Extension.md).[getAllowedStateKeys](Extension.md#getallowedstatekeys)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:197](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L197)

___

### getHttpStatus

▸ **getHttpStatus**(): `number`

**`Inherit Doc`**

#### Returns

`number`

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:190](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L190)

___

### getPartialState

▸ **getPartialState**(): `any`

Returns the current partial state of the extension.

#### Returns

`any`

The current partial state of the extension.

#### Implementation of

[Extension](Extension.md).[getPartialState](Extension.md#getpartialstate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:141](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L141)

___

### getRouteParams

▸ **getRouteParams**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns the current route parameters.

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

The current route parameters.

#### Implementation of

[Extension](Extension.md).[getRouteParams](Extension.md#getrouteparams)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:162](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L162)

___

### getState

▸ **getState**(): `any`

Returns the current state of the controller using this extension.

#### Returns

`any`

The current state of the controller.

#### Implementation of

[Extension](Extension.md).[getState](Extension.md#getstate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:91](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L91)

___

### init

▸ **init**(): `void` \| `Promise`<`undefined`\>

Callback for initializing the controller extension after the route
parameters have been set on this extension.

#### Returns

`void` \| `Promise`<`undefined`\>

#### Implementation of

[Extension](Extension.md).[init](Extension.md#init)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L39)

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

#### Implementation of

[Extension](Extension.md).[load](Extension.md#load)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:65](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L65)

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

#### Implementation of

[Extension](Extension.md).[setPageStateManager](Extension.md#setpagestatemanager)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:169](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L169)

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

#### Implementation of

[Extension](Extension.md).[setPartialState](Extension.md#setpartialstate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:129](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L129)

___

### setRouteParams

▸ **setRouteParams**(`params?`): `void`

Sets the current route parameters. This method is invoked before the
[init](Extension.md#init) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The current route parameters. |

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[setRouteParams](Extension.md#setrouteparams)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:155](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L155)

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

#### Implementation of

[Extension](Extension.md).[setState](Extension.md#setstate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:82](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L82)

___

### switchToPartialState

▸ **switchToPartialState**(): `void`

Disables using PageStateManager for getting state.

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[switchToPartialState](Extension.md#switchtopartialstate)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:183](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L183)

___

### switchToStateManager

▸ **switchToStateManager**(): `void`

Enables using PageStateManager for getting state.

#### Returns

`void`

#### Implementation of

[Extension](Extension.md).[switchToStateManager](Extension.md#switchtostatemanager)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:176](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L176)

___

### update

▸ **update**(): `Object`

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

#### Returns

`Object`

A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.

#### Implementation of

[Extension](Extension.md).[update](Extension.md#update)

#### Defined in

[packages/core/src/extension/AbstractExtension.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/extension/AbstractExtension.ts#L75)
