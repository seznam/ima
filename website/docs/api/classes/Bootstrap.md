---
id: "Bootstrap"
title: "Class: Bootstrap"
sidebar_label: "Bootstrap"
sidebar_position: 0
custom_edit_url: null
---

Application bootstrap used to initialize the environment and the application
itself.

## Constructors

### constructor

• **new Bootstrap**(`oc`)

Initializes the bootstrap.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oc` | [`ObjectContainer`](ObjectContainer.md) | The application's object container to use        for managing dependencies. |

#### Defined in

[packages/core/src/Bootstrap.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L75)

## Properties

### \_config

• `Protected` **\_config**: `Config`

#### Defined in

[packages/core/src/Bootstrap.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L68)

___

### \_oc

• `Protected` **\_oc**: [`ObjectContainer`](ObjectContainer.md)

#### Defined in

[packages/core/src/Bootstrap.ts:67](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L67)

## Methods

### \_bindDependencies

▸ **_bindDependencies**(): `void`

Binds the constants, service providers and class dependencies to the
object container.

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:208](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L208)

___

### \_bindPluginDependencies

▸ **_bindPluginDependencies**(`name`, `module`): `void`

Binds the constants, service providers and class dependencies to the
object container for dynamically imported plugins.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Plugin name. |
| `module` | `Module` | Plugin interface (object with init functions). |

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:240](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L240)

___

### \_initPluginServices

▸ **_initPluginServices**(`module`): `void`

Service initialization for the dynamically loaded plugins.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `module` | `Module` | Plugin interface (object with init functions). |

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:280](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L280)

___

### \_initPluginSettings

▸ **_initPluginSettings**(`name`, `module`): `void`

Initializes dynamically loaded plugin settings (if the init
function is provided). The settings are merged into the application
the same way as with non-dynamic import, meaning the app setting overrides
are prioritized over the default plugin settings.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Plugin name. |
| `module` | `Module` | Plugin interface (object with init functions). |

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:175](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L175)

___

### \_initRoutes

▸ **_initRoutes**(): `void`

Initializes the routes.

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:255](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L255)

___

### \_initServices

▸ **_initServices**(): `void`

Initializes the basic application services.

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:263](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L263)

___

### \_initSettings

▸ **_initSettings**(): `void`

Initializes the application settings. The method loads the settings for
all environments and then picks the settings for the current environment.

The method also handles using the values in the production environment
as default values for configuration items in other environments.

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:131](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L131)

___

### initPlugin

▸ **initPlugin**(`name`, `module`): `void`

Initializes dynamically loaded plugin. This is explicitly called from
within the Plugin Loader instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Plugin name. |
| `module` | `Module` | Plugin interface (object with init functions). |

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:118](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L118)

___

### run

▸ **run**(`config`): `void`

Initializes the application by running the bootstrap sequence. The
sequence initializes the components of the application in the following
order:
- application settings
- constants, service providers and class dependencies configuration
- services
- UI components
- routing

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Config` | The application environment        configuration for the current environment. |

#### Returns

`void`

#### Defined in

[packages/core/src/Bootstrap.ts:102](https://github.com/seznam/ima/blob/16487954/packages/core/src/Bootstrap.ts#L102)
