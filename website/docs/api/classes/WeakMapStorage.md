---
id: "WeakMapStorage"
title: "Class: WeakMapStorage"
sidebar_label: "WeakMapStorage"
sidebar_position: 0
custom_edit_url: null
---

A specialization of the `link MapStorage` storage mimicking the native
`WeakMap` using its internal garbage collector used once the size of
the storage reaches the configured threshold.

## Hierarchy

- [`MapStorage`](MapStorage.md)

  ↳ **`WeakMapStorage`**

## Constructors

### constructor

• **new WeakMapStorage**(`config`)

Initializes the storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | Weak map storage configuration. The        fields have the following meaning:        - entryTtl The time-to-live of a storage entry in milliseconds. |
| `config.entryTtl` | `number` | - |

#### Overrides

[MapStorage](MapStorage.md).[constructor](MapStorage.md#constructor)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L21)

## Properties

### \_entryTtl

• `Private` **\_entryTtl**: `number`

The time-to-live of a storage entry in milliseconds.

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:12](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L12)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `unknown`[]

#### Returns

`unknown`[]

#### Inherited from

MapStorage.$dependencies

#### Defined in

[packages/core/src/storage/MapStorage.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L13)

## Methods

### \_discardExpiredEntries

▸ **_discardExpiredEntries**(): `void`

Deletes all expired entries from this storage.

#### Returns

`void`

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:88](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L88)

___

### clear

▸ **clear**(): [`WeakMapStorage`](WeakMapStorage.md)

Clears the storage of all entries.

#### Returns

[`WeakMapStorage`](WeakMapStorage.md)

This storage.

#### Inherited from

[MapStorage](MapStorage.md).[clear](MapStorage.md#clear)

#### Defined in

[packages/core/src/storage/MapStorage.ts:57](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L57)

___

### delete

▸ **delete**(`key`): [`WeakMapStorage`](WeakMapStorage.md)

Deletes the entry identified by the specified key from this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

[`WeakMapStorage`](WeakMapStorage.md)

This storage.

#### Overrides

[MapStorage](MapStorage.md).[delete](MapStorage.md#delete)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:61](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L61)

___

### get

▸ **get**(`key`): `undefined` \| ``null`` \| `object`

Retrieves the value of the entry identified by the specified . The
method returns `undefined` if the entry does not exists.

Entries set to the `undefined` value can be tested for existence
using the `link has` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

`undefined` \| ``null`` \| `object`

The value of the storage entry.

#### Overrides

[MapStorage](MapStorage.md).[get](MapStorage.md#get)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L39)

___

### has

▸ **has**(`key`): `boolean`

Returns `true` if the entry identified by the specified key exists
in this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

`boolean`

`true` if the storage entry exists.

#### Overrides

[MapStorage](MapStorage.md).[has](MapStorage.md#has)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:30](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L30)

___

### init

▸ **init**(): [`WeakMapStorage`](WeakMapStorage.md)

This method is used to finalize the initialization of the storage after
the dependencies provided through the constructor have been prepared for
use.

This method must be invoked only once and it must be the first method
invoked on this instance.

#### Returns

[`WeakMapStorage`](WeakMapStorage.md)

This storage.

#### Inherited from

[MapStorage](MapStorage.md).[init](MapStorage.md#init)

#### Defined in

[packages/core/src/storage/MapStorage.ts:20](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L20)

___

### keys

▸ **keys**(): `IterableIterator`<`string`\>

Returns an iterator for traversing the keys in this storage. The order
in which the keys are traversed is undefined.

#### Returns

`IterableIterator`<`string`\>

An iterator for traversing the keys in this
        storage. The iterator also implements the iterable protocol,
        returning itself as its own iterator, allowing it to be used in
        a `for..of` loop.

#### Overrides

[MapStorage](MapStorage.md).[keys](MapStorage.md#keys)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:70](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L70)

___

### set

▸ **set**(`key`, `value`): [`WeakMapStorage`](WeakMapStorage.md)

Sets the storage entry identified by the specified key to the provided
value. The method creates the entry if it does not exist already.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |
| `value` | `unknown` | The storage entry value. |

#### Returns

[`WeakMapStorage`](WeakMapStorage.md)

This storage.

#### Overrides

[MapStorage](MapStorage.md).[set](MapStorage.md#set)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L52)

___

### size

▸ **size**(): `number`

#### Returns

`number`

#### Overrides

[MapStorage](MapStorage.md).[size](MapStorage.md#size)

#### Defined in

[packages/core/src/storage/WeakMapStorage.ts:79](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/WeakMapStorage.ts#L79)
