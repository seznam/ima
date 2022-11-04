---
id: "MetaManagerImpl"
title: "Class: MetaManagerImpl"
sidebar_label: "MetaManagerImpl"
sidebar_position: 0
custom_edit_url: null
---

Default implementation of the [MetaManager](MetaManager.md) interface.

## Hierarchy

- [`MetaManager`](MetaManager.md)

  ↳ **`MetaManagerImpl`**

## Constructors

### constructor

• **new MetaManagerImpl**()

Initializes the meta page attributes manager.

#### Overrides

[MetaManager](MetaManager.md).[constructor](MetaManager.md#constructor)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L19)

## Properties

### \_link

• `Protected` **\_link**: `Map`<`string`, `string`\>

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:10](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L10)

___

### \_metaName

• `Protected` **\_metaName**: `Map`<`string`, `string`\>

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:8](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L8)

___

### \_metaProperty

• `Protected` **\_metaProperty**: `Map`<`string`, `string`\>

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:9](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L9)

___

### \_title

• `Protected` **\_title**: `string`

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:7](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L7)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:12](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L12)

## Methods

### getLink

▸ **getLink**(`relation`): `string`

Return the reference to the specified related linked document. The
method returns an empty string for missing meta information (to make the
returned value React-friendly).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relation` | `string` | The relation of the link target to the current        page. |

#### Returns

`string`

The reference to the location of the related document,
        e.g. a URL.

#### Overrides

[MetaManager](MetaManager.md).[getLink](MetaManager.md#getlink)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:109](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L109)

___

### getLinks

▸ **getLinks**(): `string`[]

Returns the relations of the currently set related documents linked to
the current page.

#### Returns

`string`[]

#### Overrides

[MetaManager](MetaManager.md).[getLinks](MetaManager.md#getlinks)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:116](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L116)

___

### getMetaName

▸ **getMetaName**(`name`): `string`

Returns the value of the specified named meta information property. The
method returns an empty string for missing meta information (to make the
returned value React-friendly).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the named meta information property. |

#### Returns

`string`

The value of the generic meta information, or an empty string.

#### Overrides

[MetaManager](MetaManager.md).[getMetaName](MetaManager.md#getmetaname)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:67](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L67)

___

### getMetaNames

▸ **getMetaNames**(): `string`[]

Returns the names of the currently specified named meta information
properties.

#### Returns

`string`[]

The names of the currently specified named meta
        information properties.

#### Overrides

[MetaManager](MetaManager.md).[getMetaNames](MetaManager.md#getmetanames)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:74](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L74)

___

### getMetaProperties

▸ **getMetaProperties**(): `string`[]

Returns the names of the currently specified specialized meta
information properties.

#### Returns

`string`[]

The names of the currently specified specialized meta
        information properties.

#### Overrides

[MetaManager](MetaManager.md).[getMetaProperties](MetaManager.md#getmetaproperties)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:95](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L95)

___

### getMetaProperty

▸ **getMetaProperty**(`name`): `string`

Returns the value of the specified specialized meta information
property. The method returns an empty string for missing meta
information (to make the returned value React-friendly).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the specialized meta information        property. |

#### Returns

`string`

The value of the specified meta information, or an
        empty string.

#### Overrides

[MetaManager](MetaManager.md).[getMetaProperty](MetaManager.md#getmetaproperty)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:88](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L88)

___

### getTitle

▸ **getTitle**(): `string`

Returns the page title. The method returns an empty string if no page
title has been set yet.

Note that the page title is cached internally by the meta manager and
may therefore differ from the current document title if it has been
modified by a 3rd party code.

#### Returns

`string`

The current page title.

#### Overrides

[MetaManager](MetaManager.md).[getTitle](MetaManager.md#gettitle)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:53](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L53)

___

### setLink

▸ **setLink**(`relation`, `value`): `void`

Sets the specified specialized link information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relation` | `string` | The relation of the link target to the current        page. |
| `value` | `string` | The reference to the location of the related        document, e.g. a URL. |

#### Returns

`void`

#### Overrides

[MetaManager](MetaManager.md).[setLink](MetaManager.md#setlink)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:102](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L102)

___

### setMetaName

▸ **setMetaName**(`name`, `value`): `void`

Set the specified named meta information property.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Meta information property name, for example        `keywords`. |
| `value` | `string` | The meta information value. |

#### Returns

`void`

#### Overrides

[MetaManager](MetaManager.md).[setMetaName](MetaManager.md#setmetaname)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:60](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L60)

___

### setMetaProperty

▸ **setMetaProperty**(`name`, `value`): `void`

Sets the specified specialized meta information property.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the specialized meta information property. |
| `value` | `string` | The value of the meta information property. |

#### Returns

`void`

#### Overrides

[MetaManager](MetaManager.md).[setMetaProperty](MetaManager.md#setmetaproperty)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:81](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L81)

___

### setTitle

▸ **setTitle**(`title`): `void`

Sets the page title.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | The new page title. |

#### Returns

`void`

#### Overrides

[MetaManager](MetaManager.md).[setTitle](MetaManager.md#settitle)

#### Defined in

[packages/core/src/meta/MetaManagerImpl.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManagerImpl.ts#L46)
