---
id: "ObjectContainer"
title: "Class: ObjectContainer"
sidebar_label: "ObjectContainer"
sidebar_position: 0
custom_edit_url: null
---

The Object Container is an enhanced dependency injector with support for
aliases and constants, and allowing to reference classes in the application
namespace by specifying their fully qualified names.

## Constructors

### constructor

• **new ObjectContainer**(`namespace`)

Initializes the object container.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `namespace` | `Namespace` | The namespace container, used to        access classes and values using their fully qualified names. |

#### Defined in

[packages/core/src/ObjectContainer.ts:135](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L135)

## Properties

### \_bindingPlugin

• `Private` `Optional` **\_bindingPlugin**: `string`

The current plugin binding to OC.

The [()](ObjectContainer.md#setbindingstate) method may be called for changing
object container binding state only by the bootstrap script.

#### Defined in

[packages/core/src/ObjectContainer.ts:62](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L62)

___

### \_bindingState

• `Private` `Optional` **\_bindingState**: `string`

The current binding state.

The [()](ObjectContainer.md#setbindingstate) method may be called for changing
object container binding state only by the bootstrap script.

#### Defined in

[packages/core/src/ObjectContainer.ts:55](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L55)

___

### \_entries

• `Private` **\_entries**: `Map`<`EntryName`, `Entry`\>

#### Defined in

[packages/core/src/ObjectContainer.ts:63](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L63)

___

### \_namespace

• `Private` **\_namespace**: `Namespace`

The namespace container, used to access classes and values using
their fully qualified names.

#### Defined in

[packages/core/src/ObjectContainer.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L68)

## Accessors

### APP\_BINDING\_STATE

• `Static` `get` **APP_BINDING_STATE**(): `string`

Returns constant for app binding state.

When the object container is in app binding state, it is possible
to register new aliases using the [()](ObjectContainer.md#bind) method and register
new constant using the [()](ObjectContainer.md#constant) method, or override the
default class dependencies of any already-configured class using the
[()](ObjectContainer.md#inject) method (classes that were not configured yet may be
configured using the [()](ObjectContainer.md#inject) method or [()](ObjectContainer.md#provide)
method).

#### Returns

`string`

The app binding state.

#### Defined in

[packages/core/src/ObjectContainer.ts:125](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L125)

___

### IMA\_BINDING\_STATE

• `Static` `get` **IMA_BINDING_STATE**(): `string`

Returns constant for IMA binding state.

When the object container is in ima binding state, it is possible
to register new aliases using the [()](ObjectContainer.md#bind) method and register
new constant using the [()](ObjectContainer.md#constant) method, or override the
default class dependencies of any already-configured class using the
[()](ObjectContainer.md#inject) method (classes that were not configured yet may be
configured using the [()](ObjectContainer.md#inject) method or [()](ObjectContainer.md#provide)
method).

#### Returns

`string`

The IMA binding state.

#### Defined in

[packages/core/src/ObjectContainer.ts:108](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L108)

___

### PLUGIN\_BINDING\_STATE

• `Static` `get` **PLUGIN_BINDING_STATE**(): `string`

Returns constant for plugin binding state.

When the object container is in plugin binding state, it is impossible
to register new aliases using the [()](ObjectContainer.md#bind) method and register
new constant using the [()](ObjectContainer.md#constant) method, or override the
default class dependencies of any already-configured class using the
[()](ObjectContainer.md#inject) method (classes that were not configured yet may be
configured using the [()](ObjectContainer.md#inject) method or [()](ObjectContainer.md#provide)
method).

This prevents the unprivileged code (e.g. 3rd party plugins) from
overriding the default dependency configuration provided by ima, or
overriding the configuration of a 3rd party plugin by another 3rd party
plugin.

The application itself has always access to the unlocked object
container.

#### Returns

`string`

The plugin binding state.

#### Defined in

[packages/core/src/ObjectContainer.ts:91](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L91)

## Methods

### \_createEntry

▸ **_createEntry**(`classConstructor`, `dependencies?`, `options?`): `Entry`

Creates a new entry for the provided class or factory function, the
provided dependencies and entry options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `classConstructor` | `UnknownConstructable` \| `UnknownNonConstructable` \| `FactoryFunction` | The        class constructor or factory function. |
| `dependencies?` | `Dependencies` | The dependencies to pass into the        constructor or factory function. |
| `options?` | `EntryOptions` |  |

#### Returns

`Entry`

Created instance or generated value.

#### Defined in

[packages/core/src/ObjectContainer.ts:637](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L637)

___

### \_createInstanceFromEntry

▸ **_createInstanceFromEntry**(`entry`, `dependencies?`): `unknown`

Creates a new instance of the class or retrieves the value generated by
the factory function represented by the provided entry, passing in the
provided dependencies.

The method uses the dependencies specified by the entry if no custom
dependencies are provided.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `entry` | `Entry` | `undefined` | The entry representing the class that should        have its instance created or factory faction to use to create a        value. |
| `dependencies` | `Dependencies` | `[]` | The dependencies to pass into the        constructor or factory function. |

#### Returns

`unknown`

Created instance or generated value.

#### Defined in

[packages/core/src/ObjectContainer.ts:676](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L676)

___

### \_getDebugName

▸ **_getDebugName**(`name`): `string`

Formats name, function, class constructor to more compact
name/message to allow for cleaner debug Error messages.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `EntryNameWithOptions` |

#### Returns

`string`

#### Defined in

[packages/core/src/ObjectContainer.ts:844](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L844)

___

### \_getEntry

▸ **_getEntry**(`name`): ``null`` \| `Entry`

Retrieves the entry for the specified constant, alias, class or factory
function, interface, or fully qualified namespace path (the method
checks these in this order in case of a name clash).

The method retrieves an existing entry even if a qualified namespace
path is provided (if the target class or interface has been configured
in this object container).

The method throws an [Error](Error.md) if no such constant, alias,
registry, interface implementation is known to this object container and
the provided identifier is not a valid namespace path specifying an
existing class, interface or value.

**`Throws`**

If no such constant, alias, registry, interface
        implementation is known to this object container.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `EntryNameWithOptions` | Name of a constant or alias,        factory function, class or interface constructor, or a fully        qualified namespace path. |

#### Returns

``null`` \| `Entry`

The retrieved entry.

#### Defined in

[packages/core/src/ObjectContainer.ts:521](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L521)

___

### \_getEntryFromClassConstructor

▸ **_getEntryFromClassConstructor**(`classConstructor`): ``null`` \| `Entry`

Retrieves the class denoted by the provided class constructor.

The method then checks whether there are defined `$dependencies`
property for class. Then the class is registered to this object
container.

The method returns the entry for the class if the specified class
does not have defined `$dependencies` property return
`null`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `classConstructor` | `EntryName` |

#### Returns

``null`` \| `Entry`

An entry representing the value at the specified
        classConstructor. The method returns `null`
        if the specified classConstructor does not have defined
        `$dependencies`.

#### Defined in

[packages/core/src/ObjectContainer.ts:813](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L813)

___

### \_getEntryFromConstant

▸ **_getEntryFromConstant**(`compositionName`): ``null`` \| `Entry`

Retrieves the constant value denoted by the provided fully qualified
composition name.

The method returns the entry for the constant if the constant is registered
with this object container, otherwise return `null`.

Finally, if the constant composition name does not resolve to value,
the method return `null`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `compositionName` | `EntryName` |

#### Returns

``null`` \| `Entry`

An entry representing the value at the specified
        composition name in the constants. The method returns `null`
        if the specified composition name does not exist in the constants.

#### Defined in

[packages/core/src/ObjectContainer.ts:721](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L721)

___

### \_getEntryFromNamespace

▸ **_getEntryFromNamespace**(`path`): `undefined` \| ``null`` \| `Entry`

Retrieves the class denoted by the provided fully qualified name within
the application namespace.

The method then checks whether there are dependecies configured for the
class, no matter whether the class is an implementation class or an
"interface" class.

The method returns the entry for the class if the class is registered
with this object container, otherwise an unregistered entry is created
and returned.

Finally, if the namespace path does not resolve to a class, the method
return an unregistered entry resolved to the value denoted by the
namespace path.

Alternatively, if a constructor function is passed in instead of a
namespace path, the method returns `null`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `EntryName` | Namespace path pointing to        a class or a value in the application namespace, or a constructor        function. |

#### Returns

`undefined` \| ``null`` \| `Entry`

An entry representing the value or class at the
        specified path in the namespace. The method returns `null`
        if the specified path does not exist in the namespace.

#### Defined in

[packages/core/src/ObjectContainer.ts:775](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L775)

___

### \_isOptional

▸ **_isOptional**(`name`): `boolean`

Checks whether the name is marked as optional.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `EntryNameWithOptions` | Name of a constant or alias,        factory function, class or interface constructor, or a fully        qualified namespace path. |

#### Returns

`boolean`

#### Defined in

[packages/core/src/ObjectContainer.ts:580](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L580)

___

### \_isSpread

▸ **_isSpread**(`name`): `boolean`

Checks whether the name is marked as spread.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `EntryNameWithOptions` | Name of a constant or alias,        factory function, class or interface constructor, or a fully        qualified namespace path. |

#### Returns

`boolean`

#### Defined in

[packages/core/src/ObjectContainer.ts:594](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L594)

___

### \_updateEntryValues

▸ **_updateEntryValues**(`entry`, `classConstructor`, `dependencies`): `void`

The method update classConstructor and dependencies for defined entry.
The entry throw Error for constants and if you try override dependencies
more than once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entry` | `Entry` | The entry representing the class that should        have its instance created or factory faction to use to create a        value. |
| `classConstructor` | `UnknownConstructable` \| `UnknownNonConstructable` \| `FactoryFunction` | The        class constructor or factory function. |
| `dependencies` | `Dependencies` | The dependencies to pass into the        constructor or factory function. |

#### Returns

`void`

#### Defined in

[packages/core/src/ObjectContainer.ts:613](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L613)

___

### bind

▸ **bind**(`name`, `classConstructor`, `dependencies?`): [`ObjectContainer`](ObjectContainer.md)

Binds the specified class or factory function and dependencies to the
specified alias. Binding a class or factory function to an alias allows
the class or function to be specied as a dependency by specifying the
alias and creating new instances by referring to the class or function
by the alias.

Also note that the same class or function may be bound to several
aliases and each may use different dependencies.

The alias will use the default dependencies bound for the class if no
dependencies are provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Alias name. |
| `classConstructor` | `UnknownConstructable` \| `UnknownNonConstructable` \| `FactoryFunction` | The        class constructor or a factory function. |
| `dependencies?` | `Dependencies` | The dependencies to pass into the        constructor or factory function. |

#### Returns

[`ObjectContainer`](ObjectContainer.md)

This object container.

#### Defined in

[packages/core/src/ObjectContainer.ts:159](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L159)

___

### clear

▸ **clear**(): [`ObjectContainer`](ObjectContainer.md)

Clears all entries from this object container and resets the locking
mechanism of this object container.

#### Returns

[`ObjectContainer`](ObjectContainer.md)

This object container.

#### Defined in

[packages/core/src/ObjectContainer.ts:473](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L473)

___

### constant

▸ **constant**(`name`, `value`): [`ObjectContainer`](ObjectContainer.md)

Defines a new constant registered with this object container. Note that
this is the only way of passing `string` values to constructors
because the object container treats strings as class, interface, alias
or constant names.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The constant name. |
| `value` | `unknown` | The constant value. |

#### Returns

[`ObjectContainer`](ObjectContainer.md)

This object container.

#### Defined in

[packages/core/src/ObjectContainer.ts:228](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L228)

___

### create

▸ **create**(`name`, `dependencies?`): `unknown`

Creates a new instance of the class or retrieves the value generated by
the factory function identified by the provided name, class, interface,
or factory function, passing in the provided dependencies.

The method uses the dependencies specified when the class, interface or
factory function has been registered with the object container if no
custom dependencies are provided.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `EntryNameWithOptions` | `undefined` | The name        of the alias, class, interface, or the class, interface or a        factory function to use. |
| `dependencies` | `Dependencies` | `[]` | The dependencies to pass into the        constructor or factory function. |

#### Returns

`unknown`

Created instance or generated value.

#### Defined in

[packages/core/src/ObjectContainer.ts:461](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L461)

___

### get

▸ **get**(`name`): `unknown`

Retrieves the shared instance or value of the specified constant, alias,
class or factory function, interface, or fully qualified namespace path
(the method checks these in this order in case of a name clash).

The instance or value is created lazily the first time it is requested.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `EntryNameWithOptions` | The name        of the alias, class, interface, or the class, interface or a        factory function. |

#### Returns

`unknown`

The shared instance or value.

#### Defined in

[packages/core/src/ObjectContainer.ts:404](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L404)

___

### getConstructorOf

▸ **getConstructorOf**(`name`): `UnknownConstructable` \| `UnknownNonConstructable` \| `FactoryFunction`

Returns the class constructor function of the specified class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` \| `UnknownConstructable` | The name by which the class        is registered with this object container. |

#### Returns

`UnknownConstructable` \| `UnknownNonConstructable` \| `FactoryFunction`

The constructor function.

#### Defined in

[packages/core/src/ObjectContainer.ts:422](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L422)

___

### has

▸ **has**(`name`): `boolean`

Returns `true` if the specified object, class or resource is
registered with this object container.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `EntryName` | The resource name. |

#### Returns

`boolean`

`true` if the specified object, class or
        resource is registered with this object container.

#### Defined in

[packages/core/src/ObjectContainer.ts:436](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L436)

___

### inject

▸ **inject**(`classConstructor`, `dependencies`): [`ObjectContainer`](ObjectContainer.md)

Configures the object loader with the specified default dependencies for
the specified class.

New instances of the class created by this object container will receive
the provided dependencies into constructor unless custom dependencies
are provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `classConstructor` | `UnknownConstructable` | The class constructor. |
| `dependencies` | `Dependencies` | The dependencies to pass into the        constructor function. |

#### Returns

[`ObjectContainer`](ObjectContainer.md)

This object container.

#### Defined in

[packages/core/src/ObjectContainer.ts:269](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L269)

___

### provide

▸ **provide**(`interfaceConstructor`, `implementationConstructor`, `dependencies?`): [`ObjectContainer`](ObjectContainer.md)

Configures the default implementation of the specified interface to use
when an implementation provider of the specified interface is requested
from this object container.

The implementation constructor will obtain the provided default
dependencies or the dependencies provided to the [()](ObjectContainer.md#create)
method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `interfaceConstructor` | `UnknownConstructable` \| `UnknownNonConstructable` | The constructor        of the interface representing the service. |
| `implementationConstructor` | `UnknownConstructable` | The constructor of the class implementing the service interface. |
| `dependencies?` | `Dependencies` | The dependencies to pass into the        constructor function. |

#### Returns

[`ObjectContainer`](ObjectContainer.md)

This object container.

#### Defined in

[packages/core/src/ObjectContainer.ts:335](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L335)

___

### setBindingState

▸ **setBindingState**(`bindingState`, `bindingPluginName?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bindingState` | `string` |
| `bindingPluginName?` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/ObjectContainer.ts:481](https://github.com/seznam/ima/blob/16487954/packages/core/src/ObjectContainer.ts#L481)
