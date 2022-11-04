---
id: "UrlTransformer"
title: "Class: UrlTransformer"
sidebar_label: "UrlTransformer"
sidebar_position: 0
custom_edit_url: null
---

Utility for transforming URLs according to the configured replacement rules.

## Constructors

### constructor

• **new UrlTransformer**()

Initializes the URL transformer.

#### Defined in

[packages/core/src/http/UrlTransformer.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/UrlTransformer.ts#L14)

## Properties

### \_rules

• `Protected` **\_rules**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/core/src/http/UrlTransformer.ts:5](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/UrlTransformer.ts#L5)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/http/UrlTransformer.ts:7](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/UrlTransformer.ts#L7)

## Methods

### addRule

▸ **addRule**(`pattern`, `replacement`): [`UrlTransformer`](UrlTransformer.md)

Adds the provided replacement rule to the rules used by this URL
transformer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pattern` | `string` | Regexp patter to look for (must be escaped as if        for use in the Regexp constructor). |
| `replacement` | `string` | The replacement of the matched patter in any        matched URL. |

#### Returns

[`UrlTransformer`](UrlTransformer.md)

This transformer.

#### Defined in

[packages/core/src/http/UrlTransformer.ts:28](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/UrlTransformer.ts#L28)

___

### clear

▸ **clear**(): [`UrlTransformer`](UrlTransformer.md)

Clears all rules.

#### Returns

[`UrlTransformer`](UrlTransformer.md)

#### Defined in

[packages/core/src/http/UrlTransformer.ts:37](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/UrlTransformer.ts#L37)

___

### transform

▸ **transform**(`url`): `string`

Applies all rules registered with this URL transformer to the provided
URL and returns the result. The rules will be applied in the order they
were registered.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL for transformation. |

#### Returns

`string`

Transformed URL.

#### Defined in

[packages/core/src/http/UrlTransformer.ts:51](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/UrlTransformer.ts#L51)
