---
id: "SessionStorage"
title: "Class: SessionStorage"
sidebar_label: "SessionStorage"
sidebar_position: 0
custom_edit_url: null
---

Implementation of the `link Storage` interface that relies on the
native `sessionStorage` DOM storage for storing its entries.

## Hierarchy

- [`Storage`](Storage.md)

  ↳ **`SessionStorage`**

## Constructors

### constructor

• **new SessionStorage**(`window`)

Initializes the session storage.

#### Parameters

| Name | Type |
| :------ | :------ |
| `window` | [`ClientWindow`](ClientWindow.md) |

#### Overrides

[Storage](Storage.md).[constructor](Storage.md#constructor)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L23)

## Properties

### \_storage

• `Private` **\_storage**: `Storage`

The DOM storage providing the actual storage of the entries.

#### Defined in

[packages/core/src/storage/SessionStorage.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L14)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): typeof [`Window`](Window.md)[]

#### Returns

typeof [`Window`](Window.md)[]

#### Defined in

[packages/core/src/storage/SessionStorage.ts:16](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L16)

## Methods

### \_deleteOldestEntry

▸ **_deleteOldestEntry**(): `void`

Deletes the oldest entry in this storage.

#### Returns

`void`

#### Defined in

[packages/core/src/storage/SessionStorage.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L120)

___

### clear

▸ **clear**(): [`SessionStorage`](SessionStorage.md)

Clears the storage of all entries.

#### Returns

[`SessionStorage`](SessionStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[clear](Storage.md#clear)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:98](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L98)

___

### delete

▸ **delete**(`key`): [`SessionStorage`](SessionStorage.md)

Deletes the entry identified by the specified key from this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

[`SessionStorage`](SessionStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[delete](Storage.md#delete)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:90](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L90)

___

### get

▸ **get**(`key`): `any`

Retrieves the value of the entry identified by the specified . The
method returns `undefined` if the entry does not exists.

Entries set to the `undefined` value can be tested for existence
using the `link has` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

`any`

The value of the storage entry.

#### Overrides

[Storage](Storage.md).[get](Storage.md#get)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L46)

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

[packages/core/src/storage/SessionStorage.ts:39](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L39)

___

### init

▸ **init**(): [`SessionStorage`](SessionStorage.md)

This method is used to finalize the initialization of the storage after
the dependencies provided through the constructor have been prepared for
use.

This method must be invoked only once and it must be the first method
invoked on this instance.

#### Returns

[`SessionStorage`](SessionStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[init](Storage.md#init)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:32](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L32)

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

#### Overrides

[Storage](Storage.md).[keys](Storage.md#keys)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:106](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L106)

___

### set

▸ **set**(`key`, `value`): [`SessionStorage`](SessionStorage.md)

Sets the storage entry identified by the specified key to the provided
value. The method creates the entry if it does not exist already.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |
| `value` | `unknown` | The storage entry value. |

#### Returns

[`SessionStorage`](SessionStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[set](Storage.md#set)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:61](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L61)

___

### size

▸ **size**(): `number`

#### Returns

`number`

#### Overrides

[Storage](Storage.md).[size](Storage.md#size)

#### Defined in

[packages/core/src/storage/SessionStorage.ts:113](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionStorage.ts#L113)
