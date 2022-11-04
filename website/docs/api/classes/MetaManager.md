---
id: "MetaManager"
title: "Class: MetaManager"
sidebar_label: "MetaManager"
sidebar_position: 0
custom_edit_url: null
---

The Meta manager is a utility for managing various page attributes related
to the SEO (search engine optimization) and social network integration.

The Meta manager is used to manage the following:
- page title, set using the contents of the `&lt;title&gt;` element
- page links, linking related documents and meta-information, added to the
  using `&lt;link&gt;` elements
- page meta information:
  - the generic named meta information added to the page via
    `&lt;meta&gt;} elements with the `name` attribute, for
    example the `keywords`.
  - specialized meta information added to the page via `&lt;meta&gt;`
    elements with the `property` attribute, for example the OG meta
    tags (`og:type`, `og:image`, etc.).

## Hierarchy

- **`MetaManager`**

  ↳ [`MetaManagerImpl`](MetaManagerImpl.md)

## Constructors

### constructor

• **new MetaManager**()

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:134](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L134)

___

### getLinks

▸ **getLinks**(): `string`[]

Returns the relations of the currently set related documents linked to
the current page.

#### Returns

`string`[]

#### Defined in

[packages/core/src/meta/MetaManager.ts:142](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L142)

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:62](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L62)

___

### getMetaNames

▸ **getMetaNames**(): `string`[]

Returns the names of the currently specified named meta information
properties.

#### Returns

`string`[]

The names of the currently specified named meta
        information properties.

#### Defined in

[packages/core/src/meta/MetaManager.ts:73](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L73)

___

### getMetaProperties

▸ **getMetaProperties**(): `string`[]

Returns the names of the currently specified specialized meta
information properties.

#### Returns

`string`[]

The names of the currently specified specialized meta
        information properties.

#### Defined in

[packages/core/src/meta/MetaManager.ts:108](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L108)

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:97](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L97)

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L39)

___

### setLink

▸ **setLink**(`relation`, `reference`): `void`

Sets the specified specialized link information.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `relation` | `string` | The relation of the link target to the current        page. |
| `reference` | `string` | The reference to the location of the related        document, e.g. a URL. |

#### Returns

`void`

#### Defined in

[packages/core/src/meta/MetaManager.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L120)

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:50](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L50)

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:83](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L83)

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

#### Defined in

[packages/core/src/meta/MetaManager.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/meta/MetaManager.ts#L25)
