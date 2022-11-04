---
id: "Dictionary"
title: "Class: Dictionary"
sidebar_label: "Dictionary"
sidebar_position: 0
custom_edit_url: null
---

The Dictionary is a manager and preprocessor of localization phrases for a
single language. The format of the localization phrases depends on the
implementation of this interface.

## Hierarchy

- **`Dictionary`**

  ↳ [`MessageFormatDictionary`](MessageFormatDictionary.md)

## Constructors

### constructor

• **new Dictionary**()

## Methods

### get

▸ **get**(`key`, `parameters`): `string`

Retrieves the localization phrase identified by the specified key,
evaluates the phrase's placeholder expressions using the provided
parameters and returns the result.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the localization phrase. |
| `parameters` | [`ObjectParameters`](../modules.md#objectparameters) | The        map of parameter names to the parameter values to use.        Defaults to an empty plain object. |

#### Returns

`string`

The specified localization phrase with its placeholders
        evaluated using the provided parameters.

#### Defined in

[packages/core/src/dictionary/Dictionary.ts:59](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/Dictionary.ts#L59)

___

### getLanguage

▸ **getLanguage**(): `string`

Returns the ISO 639-1 language code of the language this dictionary was
initialized with.

#### Returns

`string`

The language code representing the language of the
        localization phrases in this dictionary.

#### Defined in

[packages/core/src/dictionary/Dictionary.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/Dictionary.ts#L43)

___

### has

▸ **has**(`key`): `boolean`

Tests whether the specified localization phrase exists in the
dictionary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the localization phrase. @return`true` if the key exists and denotes a single         localization phrase, otherwise `false`. |

#### Returns

`boolean`

#### Defined in

[packages/core/src/dictionary/Dictionary.ts:71](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/Dictionary.ts#L71)

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

#### Defined in

[packages/core/src/dictionary/Dictionary.ts:32](https://github.com/seznam/ima/blob/16487954/packages/core/src/dictionary/Dictionary.ts#L32)
