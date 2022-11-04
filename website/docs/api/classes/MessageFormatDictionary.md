---
id: "MessageFormatDictionary"
title: "Class: MessageFormatDictionary"
sidebar_label: "MessageFormatDictionary"
sidebar_position: 0
custom_edit_url: null
---

Implementation of the [Dictionary](Dictionary.md) interface that relies on
compiled MessageFormat localization messages for its dictionary.

## Hierarchy

- [`Dictionary`](Dictionary.md)

  ↳ **`MessageFormatDictionary`**

## Constructors

### constructor

• **new MessageFormatDictionary**()

Initializes the dictionary.

**`Example`**

```ts
dictionary.get('home.hello', {GENDER: 'UNSPECIFIED'});
```

#### Overrides

[Dictionary](Dictionary.md).[constructor](Dictionary.md#constructor)

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L25)

## Properties

### \_dictionary

• `Protected` **\_dictionary**: `Fields`

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L13)

___

### \_language

• `Protected` **\_language**: `string`

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:12](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L12)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L15)

## Methods

### \_getScope

▸ `Private` **_getScope**(`key`): ``null`` \| `LocalizationFunction`

Retrieves the localization scope denoted by the provided partial key.
This may be either an object representing a sub-group of location phrase
generators, or a single generator if the provided keys denotes a single
localization phrase

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the localization phrase. The key        consists of at least two parts separated by dots. The first part        denotes the name of the source JSON localization file, while the        rest denote a field path within the localization object within        the given localization file. |

#### Returns

``null`` \| `LocalizationFunction`

The requested localization scope, or `null` if the specified
        scope does not exist.

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:136](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L136)

___

### get

▸ **get**(`key`, `parameters?`): `string`

Retrieves the localization phrase identified by the specified key,
evaluates the phrase's placeholder expressions using the provided
parameters and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the localization phrase. The key        consists of at least two parts separated by dots. The first part        denotes the name of the source JSON localization file, while the        rest denote a field path within the localization object within        the given localization file. |
| `parameters` | [`ObjectParameters`](../modules.md#objectparameters) | The        map of parameter names to the parameter values to use.        Defaults to an empty plain object. |

#### Returns

`string`

The specified localization phrase with its placeholders
        evaluated using the provided parameters.

#### Overrides

[Dictionary](Dictionary.md).[get](Dictionary.md#get)

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:84](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L84)

___

### getLanguage

▸ **getLanguage**(): `string`

Returns the ISO 639-1 language code of the language this dictionary was
initialized with.

#### Returns

`string`

The language code representing the language of the
        localization phrases in this dictionary.

#### Overrides

[Dictionary](Dictionary.md).[getLanguage](Dictionary.md#getlanguage)

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:64](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L64)

___

### has

▸ **has**(`key`): `boolean`

Tests whether the specified localization phrase exists in the
dictionary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the localization phrase. The key        consists of at least two parts separated by dots. The first part        denotes the name of the source JSON localization file, while the        rest denote a field path within the localization object within        the given localization file. |

#### Returns

`boolean`

`true` if the key exists and denotes a single
                  localization phrase, otherwise `false`.

#### Overrides

[Dictionary](Dictionary.md).[has](Dictionary.md#has)

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:110](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L110)

___

### init

▸ **init**(`config`): `void`

Initializes this dictionary with the provided language and localization
phrases.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Config` | The dictionary configuration. |

#### Returns

`void`

#### Overrides

[Dictionary](Dictionary.md).[init](Dictionary.md#init)

#### Defined in

[packages/core/src/dictionary/MessageFormatDictionary.ts:56](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/MessageFormatDictionary.ts#L56)
