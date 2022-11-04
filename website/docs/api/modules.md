---
id: "modules"
title: "@ima/core"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Enumerations

- [ActionTypes](enums/ActionTypes.md)
- [RendererEvents](enums/RendererEvents.md)
- [RendererTypes](enums/RendererTypes.md)
- [RouteNames](enums/RouteNames.md)
- [RouterEvents](enums/RouterEvents.md)
- [StateEvents](enums/StateEvents.md)
- [StatusCode](enums/StatusCode.md)

## Classes

- [AbstractController](classes/AbstractController.md)
- [AbstractExecution](classes/AbstractExecution.md)
- [AbstractExtension](classes/AbstractExtension.md)
- [AbstractPageManager](classes/AbstractPageManager.md)
- [AbstractRoute](classes/AbstractRoute.md)
- [AbstractRouter](classes/AbstractRouter.md)
- [Bootstrap](classes/Bootstrap.md)
- [Cache](classes/Cache.md)
- [CacheEntry](classes/CacheEntry.md)
- [CacheFactory](classes/CacheFactory.md)
- [CacheImpl](classes/CacheImpl.md)
- [ClientPageManager](classes/ClientPageManager.md)
- [ClientRouter](classes/ClientRouter.md)
- [ClientWindow](classes/ClientWindow.md)
- [ComponentUtils](classes/ComponentUtils.md)
- [Controller](classes/Controller.md)
- [ControllerDecorator](classes/ControllerDecorator.md)
- [CookieStorage](classes/CookieStorage.md)
- [Dictionary](classes/Dictionary.md)
- [Dispatcher](classes/Dispatcher.md)
- [DispatcherImpl](classes/DispatcherImpl.md)
- [DynamicRoute](classes/DynamicRoute.md)
- [Error](classes/Error.md)
- [EventBus](classes/EventBus.md)
- [EventBusImpl](classes/EventBusImpl.md)
- [Execution](classes/Execution.md)
- [ExtensibleError](classes/ExtensibleError.md)
- [Extension](classes/Extension.md)
- [GenericError](classes/GenericError.md)
- [HttpAgent](classes/HttpAgent.md)
- [HttpAgentImpl](classes/HttpAgentImpl.md)
- [HttpProxy](classes/HttpProxy.md)
- [MapStorage](classes/MapStorage.md)
- [MessageFormatDictionary](classes/MessageFormatDictionary.md)
- [MetaManager](classes/MetaManager.md)
- [MetaManagerImpl](classes/MetaManagerImpl.md)
- [ObjectContainer](classes/ObjectContainer.md)
- [PageFactory](classes/PageFactory.md)
- [PageHandler](classes/PageHandler.md)
- [PageHandlerRegistry](classes/PageHandlerRegistry.md)
- [PageManager](classes/PageManager.md)
- [PageNavigationHandler](classes/PageNavigationHandler.md)
- [PageRenderer](classes/PageRenderer.md)
- [PageStateManager](classes/PageStateManager.md)
- [PageStateManagerDecorator](classes/PageStateManagerDecorator.md)
- [PageStateManagerImpl](classes/PageStateManagerImpl.md)
- [Request](classes/Request.md)
- [Response](classes/Response.md)
- [RouteFactory](classes/RouteFactory.md)
- [Router](classes/Router.md)
- [SerialBatch](classes/SerialBatch.md)
- [ServerPageManager](classes/ServerPageManager.md)
- [ServerRouter](classes/ServerRouter.md)
- [ServerWindow](classes/ServerWindow.md)
- [SessionMapStorage](classes/SessionMapStorage.md)
- [SessionStorage](classes/SessionStorage.md)
- [StaticRoute](classes/StaticRoute.md)
- [Storage](classes/Storage.md)
- [UrlTransformer](classes/UrlTransformer.md)
- [WeakMapStorage](classes/WeakMapStorage.md)
- [Window](classes/Window.md)

## Interfaces

- [IController](interfaces/IController.md)
- [IExtension](interfaces/IExtension.md)

## References

### Route

Renames and re-exports [StaticRoute](classes/StaticRoute.md)

## Type Aliases

### ObjectParameters

Ƭ **ObjectParameters**: `Object`

#### Index signature

▪ [key: `string`]: `boolean` \| `number` \| `string` \| `Date`

#### Defined in

[packages/core/src/CommonTypes.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/CommonTypes.ts#L13)

___

### PageData

Ƭ **PageData**: { `status`: `number`  } & [`UnknownParameters`](modules.md#unknownparameters)

#### Defined in

[packages/core/src/page/PageTypes.ts:35](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageTypes.ts#L35)

___

### RouteOptions

Ƭ **RouteOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `autoScroll?` | `boolean` |
| `documentView?` | `unknown` |
| `extensions?` | [`IExtension`](interfaces/IExtension.md)[] |
| `headers?` | [`UnknownParameters`](modules.md#unknownparameters) |
| `httpStatus?` | `number` |
| `managedRootView?` | `unknown` |
| `middlewares?` | `Promise`<`RouterMiddleware`\>[] \| `RouterMiddleware`[] \| `MiddleWareFunction`[] |
| `onlyUpdate?` | `boolean` \| (`controller`: [`IController`](interfaces/IController.md), `view`: `unknown`) => `boolean` |
| `viewAdapter?` | `unknown` |

#### Defined in

[packages/core/src/router/Router.ts:10](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/Router.ts#L10)

___

### StringParameters

Ƭ **StringParameters**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/core/src/CommonTypes.ts:1](https://github.com/seznam/ima/blob/16487954/packages/core/src/CommonTypes.ts#L1)

___

### UnknownParameters

Ƭ **UnknownParameters**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[packages/core/src/CommonTypes.ts:5](https://github.com/seznam/ima/blob/16487954/packages/core/src/CommonTypes.ts#L5)

___

### UnknownPromiseParameters

Ƭ **UnknownPromiseParameters**: `Object`

#### Index signature

▪ [key: `string`]: `unknown` \| `Promise`<`unknown`\>

#### Defined in

[packages/core/src/CommonTypes.ts:9](https://github.com/seznam/ima/blob/16487954/packages/core/src/CommonTypes.ts#L9)

## Variables

### ns

• **ns**: `Namespace`

#### Defined in

[packages/core/src/Namespace.ts:128](https://github.com/seznam/ima/blob/16487954/packages/core/src/Namespace.ts#L128)

___

### pluginLoader

• **pluginLoader**: `PluginLoader`

#### Defined in

[packages/core/src/pluginLoader.ts:88](https://github.com/seznam/ima/blob/16487954/packages/core/src/pluginLoader.ts#L88)

## Functions

### bootClientApp

▸ **bootClientApp**(`app`, `bootConfig`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `Object` |
| `app.bootstrap` | [`Bootstrap`](classes/Bootstrap.md) |
| `app.oc` | [`ObjectContainer`](classes/ObjectContainer.md) |
| `bootConfig` | `Config` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `bootstrap` | [`Bootstrap`](classes/Bootstrap.md) |
| `oc` | [`ObjectContainer`](classes/ObjectContainer.md) |

#### Defined in

[packages/core/src/index.ts:193](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L193)

___

### createImaApp

▸ **createImaApp**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `bootstrap` | [`Bootstrap`](classes/Bootstrap.md) |
| `oc` | [`ObjectContainer`](classes/ObjectContainer.md) |

#### Defined in

[packages/core/src/index.ts:122](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L122)

___

### getClientBootConfig

▸ **getClientBootConfig**(`initialAppConfigFunctions`): `Config`

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialAppConfigFunctions` | `AppConfigFunctions` |

#### Returns

`Config`

#### Defined in

[packages/core/src/index.ts:130](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L130)

___

### getInitialImaConfigFunctions

▸ **getInitialImaConfigFunctions**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `initBindIma` | (`ns`: `any`, `oc`: `any`, `config`: `any`) => `void` |
| `initServicesIma` | (`ns`: `any`, `oc`: `any`, `config`: `any`) => `void` |

#### Defined in

[packages/core/src/index.ts:102](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L102)

___

### getInitialPluginConfig

▸ **getInitialPluginConfig**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `plugins` | `object`[] |

#### Defined in

[packages/core/src/index.ts:110](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L110)

___

### getNamespace

▸ **getNamespace**(): `Namespace`

#### Returns

`Namespace`

#### Defined in

[packages/core/src/index.ts:106](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L106)

___

### onLoad

▸ **onLoad**(): `Promise`<`unknown`\>

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/core/src/index.ts:243](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L243)

___

### reviveClientApp

▸ **reviveClientApp**(`initialAppConfigFunctions`): `Promise`<{ `[key: string]`: `unknown`;  } & { `app`: { `bootstrap`: [`Bootstrap`](classes/Bootstrap.md) ; `oc`: [`ObjectContainer`](classes/ObjectContainer.md)  } ; `bootConfig`: `Config`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialAppConfigFunctions` | `AppConfigFunctions` |

#### Returns

`Promise`<{ `[key: string]`: `unknown`;  } & { `app`: { `bootstrap`: [`Bootstrap`](classes/Bootstrap.md) ; `oc`: [`ObjectContainer`](classes/ObjectContainer.md)  } ; `bootConfig`: `Config`  }\>

#### Defined in

[packages/core/src/index.ts:228](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L228)

___

### routeClientApp

▸ **routeClientApp**(`app`): `Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `Object` |
| `app.bootstrap` | [`Bootstrap`](classes/Bootstrap.md) |
| `app.oc` | [`ObjectContainer`](classes/ObjectContainer.md) |

#### Returns

`Promise`<`void` \| { `[key: string]`: `unknown`;  }\>

#### Defined in

[packages/core/src/index.ts:211](https://github.com/seznam/ima/blob/16487954/packages/core/src/index.ts#L211)
