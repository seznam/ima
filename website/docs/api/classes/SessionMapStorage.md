---
id: "SessionMapStorage"
title: "Class: SessionMapStorage"
sidebar_label: "SessionMapStorage"
sidebar_position: 0
custom_edit_url: null
---

The `link SessionMap` storage is an implementation of the
`link Storage` interface acting as a synchronization proxy between
the underlying map storage and the `sessionStorage` DOM storage.

## Hierarchy

- [`Storage`](Storage.md)

  ↳ **`SessionMapStorage`**

## Constructors

### constructor

• **new SessionMapStorage**(`map`, `session`)

Initializes the storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `map` | [`MapStorage`](MapStorage.md) | The map storage to use. |
| `session` | [`SessionStorage`](SessionStorage.md) | The session storage to use. |

#### Overrides

[Storage](Storage.md).[constructor](Storage.md#constructor)

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:31](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L31)

## Properties

### \_map

• `Private` **\_map**: [`MapStorage`](MapStorage.md)

The map storage, synced with the session storage.

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L15)

___

### \_session

• `Private` **\_session**: [`SessionStorage`](SessionStorage.md)

The session storage, synced with the map storage.

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L19)

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): (typeof [`MapStorage`](MapStorage.md) \| typeof [`SessionStorage`](SessionStorage.md))[]

#### Returns

(typeof [`MapStorage`](MapStorage.md) \| typeof [`SessionStorage`](SessionStorage.md))[]

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L21)

## Methods

### clear

▸ **clear**(): [`SessionMapStorage`](SessionMapStorage.md)

Clears the storage of all entries.

#### Returns

[`SessionMapStorage`](SessionMapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[clear](Storage.md#clear)

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:94](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L94)

___

### delete

▸ **delete**(`key`): [`SessionMapStorage`](SessionMapStorage.md)

Deletes the entry identified by the specified key from this storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |

#### Returns

[`SessionMapStorage`](SessionMapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[delete](Storage.md#delete)

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:85](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L85)

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

[packages/core/src/storage/SessionMapStorage.ts:61](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L61)

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

[packages/core/src/storage/SessionMapStorage.ts:54](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L54)

___

### init

▸ **init**(): [`SessionMapStorage`](SessionMapStorage.md)

This method is used to finalize the initialization of the storage after
the dependencies provided through the constructor have been prepared for
use.

This method must be invoked only once and it must be the first method
invoked on this instance.

#### Returns

[`SessionMapStorage`](SessionMapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[init](Storage.md#init)

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:42](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L42)

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

[packages/core/src/storage/SessionMapStorage.ts:103](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L103)

___

### set

▸ **set**(`key`, `value`): [`SessionMapStorage`](SessionMapStorage.md)

Sets the storage entry identified by the specified key to the provided
value. The method creates the entry if it does not exist already.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key identifying the storage entry. |
| `value` | `unknown` | The storage entry value. |

#### Returns

[`SessionMapStorage`](SessionMapStorage.md)

This storage.

#### Overrides

[Storage](Storage.md).[set](Storage.md#set)

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:68](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L68)

___

### size

▸ **size**(): `number`

#### Returns

`number`

#### Overrides

[Storage](Storage.md).[size](Storage.md#size)

#### Defined in

[packages/core/src/storage/SessionMapStorage.ts:110](https://github.com/seznam/ima/blob/16487954/packages/core/src/storage/SessionMapStorage.ts#L110)
