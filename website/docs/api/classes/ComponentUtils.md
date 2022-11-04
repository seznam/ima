---
id: "ComponentUtils"
title: "Class: ComponentUtils"
sidebar_label: "ComponentUtils"
sidebar_position: 0
custom_edit_url: null
---

## Constructors

### constructor

• **new ComponentUtils**(`oc`)

Initializes the registry used for managing component utils.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oc` | [`ObjectContainer`](ObjectContainer.md) | The application's dependency injector - the        object container. |

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L34)

## Properties

### \_oc

• `Private` **\_oc**: [`ObjectContainer`](ObjectContainer.md)

The application's dependency injector - the object container.

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:11](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L11)

___

### \_utilities

• `Private` `Optional` **\_utilities**: [`UnknownParameters`](../modules.md#unknownparameters)

Map of instantiated utilities

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L21)

___

### \_utilityClasses

• `Private` **\_utilityClasses**: `Object` = `{}`

Map of registered utilities.

#### Index signature

▪ [key: `string`]: `UnknownConstructable` \| `FactoryFunction`

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L15)

___

### \_utilityReferrers

• `Private` **\_utilityReferrers**: [`StringParameters`](../modules.md#stringparameters) = `{}`

Map of referrers to utilities

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L26)

## Methods

### \_createUtilityInstance

▸ **_createUtilityInstance**(`alias`, `utilityClass`): `unknown`

#### Parameters

| Name | Type |
| :------ | :------ |
| `alias` | `string` |
| `utilityClass` | `UnknownConstructable` \| `FactoryFunction` |

#### Returns

`unknown`

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:113](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L113)

___

### getReferrers

▸ **getReferrers**(): [`StringParameters`](../modules.md#stringparameters)

#### Returns

[`StringParameters`](../modules.md#stringparameters)

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:109](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L109)

___

### getUtils

▸ **getUtils**(): [`UnknownParameters`](../modules.md#unknownparameters)

Returns object containing all registered utilities

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters)

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:89](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L89)

___

### register

▸ **register**(`name`, `componentUtilityClass?`, `referrer?`): `void`

Registers single utility class or multiple classes in alias->class mapping.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` \| `UnknownConstructable` \| `FactoryFunction` \| { `[key: string]`: `string` \| `UnknownConstructable` \| `FactoryFunction`;  } |
| `componentUtilityClass?` | `UnknownConstructable` \| `FactoryFunction` |
| `referrer?` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/page/renderer/ComponentUtils.ts:41](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/renderer/ComponentUtils.ts#L41)
