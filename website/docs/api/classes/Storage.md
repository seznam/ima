---
id: "Storage"
title: "Class: Storage"
sidebar_label: "Storage"
sidebar_position: 0
custom_edit_url: null
---

The [Storage](Storage.md) is an unordered collection of named values of any
type. Values in the storage are named using `string` keys. The storage
can be therefore thought of as a `Map<string, *>`.....

## Hierarchy

- **`Storage`**

  ↳ [`MapStorage`](MapStorage.md)

  ↳ [`SessionMapStorage`](SessionMapStorage.md)

  ↳ [`SessionStorage`](SessionStorage.md)

## Constructors

### constructor

• **new Storage**()

## Methods

### clear

▸ **clear**(): [`Storage`](Storage.md)

Clears the storage of all entries.

#### Returns

[`Storage`](Storage.md)

This storage.

#### Defined in

[packages/core/src/storage/Storage.ts:75](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L75)

___

### delete

▸ **delete**(`key`): [`Storage`](Storage.md)

Deletes the entry identified by the specified key from this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

[`Storage`](Storage.md)

This storage.

#### Defined in

[packages/core/src/storage/Storage.ts:66](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L66)

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

#### Defined in

[packages/core/src/storage/Storage.ts:44](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L44)

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

#### Defined in

[packages/core/src/storage/Storage.ts:30](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L30)

___

### init

▸ **init**(): [`Storage`](Storage.md)

This method is used to finalize the initialization of the storage after
the dependencies provided through the constructor have been prepared for
use.

This method must be invoked only once and it must be the first method
invoked on this instance.

#### Returns

[`Storage`](Storage.md)

This storage.

#### Defined in

[packages/core/src/storage/Storage.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L19)

___

### keys

▸ **keys**(): `Iterable`<`string`\>

Returns an iterator for traversing the keys in this storage. The order
in which the keys are traversed is undefined.

#### Returns

`Iterable`<`string`\>

An iterator for traversing the keys in this
        storage. The iterator also implements the iterable protocol,
        returning itself as its own iterator, allowing it to be used in
        a `for..of` loop.

#### Defined in

[packages/core/src/storage/Storage.ts:88](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L88)

___

### set

▸ **set**(`key`, `value`): [`Storage`](Storage.md)

Sets the storage entry identified by the specified key to the provided
value. The method creates the entry if it does not exist already.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |
| `value` | `unknown` | The storage entry value. |

#### Returns

[`Storage`](Storage.md)

This storage.

#### Defined in

[packages/core/src/storage/Storage.ts:56](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L56)

___

### size

▸ **size**(): `number`

Returns the number of entries in this storage.

#### Returns

`number`

The number of entries in this storage.

#### Defined in

[packages/core/src/storage/Storage.ts:97](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/Storage.ts#L97)
