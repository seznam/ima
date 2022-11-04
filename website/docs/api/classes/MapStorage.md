---
id: "MapStorage"
title: "Class: MapStorage"
sidebar_label: "MapStorage"
sidebar_position: 0
custom_edit_url: null
---

Implementation of the `link Storage` interface that relies on the
native `Map` for storage.

## Hierarchy

- [`Storage`](Storage.md)

  ↳ **`MapStorage`**

  ↳↳ [`CookieStorage`](CookieStorage.md)

  ↳↳ [`WeakMapStorage`](WeakMapStorage.md)

## Constructors

### constructor

• **new MapStorage**()

#### Inherited from

[Storage](Storage.md).[constructor](Storage.md#constructor)

## Properties

### \_storage

• `Private` **\_storage**: `Map`<`string`, `unknown`\>

The internal storage of entries.

#### Defined in

[packages/core/src/storage/MapStorage.ts:11](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L11)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `unknown`[]

#### Returns

`unknown`[]

#### Defined in

[packages/core/src/storage/MapStorage.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L13)

## Methods

### clear

▸ **clear**(): [`MapStorage`](MapStorage.md)

Clears the storage of all entries.

#### Returns

[`MapStorage`](MapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[clear](Storage.md#clear)

#### Defined in

[packages/core/src/storage/MapStorage.ts:57](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L57)

___

### delete

▸ **delete**(`key`): [`MapStorage`](MapStorage.md)

Deletes the entry identified by the specified key from this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

[`MapStorage`](MapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[delete](Storage.md#delete)

#### Defined in

[packages/core/src/storage/MapStorage.ts:49](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L49)

___

### get

▸ **get**(`key`): `unknown`

Retrieves the value of the entry identified by the specified . The
method returns `undefined` if the entry does not exists.

Entries set to the `undefined` value can be tested for existence
using the `link has` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

`unknown`

The value of the storage entry.

#### Overrides

[Storage](Storage.md).[get](Storage.md#get)

#### Defined in

[packages/core/src/storage/MapStorage.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L34)

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

[Storage](Storage.md).[has](Storage.md#has)

#### Defined in

[packages/core/src/storage/MapStorage.ts:27](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L27)

___

### init

▸ **init**(): [`MapStorage`](MapStorage.md)

This method is used to finalize the initialization of the storage after
the dependencies provided through the constructor have been prepared for
use.

This method must be invoked only once and it must be the first method
invoked on this instance.

#### Returns

[`MapStorage`](MapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[init](Storage.md#init)

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

[Storage](Storage.md).[keys](Storage.md#keys)

#### Defined in

[packages/core/src/storage/MapStorage.ts:65](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L65)

___

### set

▸ **set**(`key`, `value`): [`MapStorage`](MapStorage.md)

Sets the storage entry identified by the specified key to the provided
value. The method creates the entry if it does not exist already.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |
| `value` | `unknown` | The storage entry value. |

#### Returns

[`MapStorage`](MapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[set](Storage.md#set)

#### Defined in

[packages/core/src/storage/MapStorage.ts:41](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L41)

___

### size

▸ **size**(): `number`

#### Returns

`number`

#### Overrides

[Storage](Storage.md).[size](Storage.md#size)

#### Defined in

[packages/core/src/storage/MapStorage.ts:72](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/MapStorage.ts#L72)
