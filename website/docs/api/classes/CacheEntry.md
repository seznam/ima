---
id: "CacheEntry"
title: "Class: CacheEntry"
sidebar_label: "CacheEntry"
sidebar_position: 0
custom_edit_url: null
---

The cache entry is a typed container of cache data used to track the
creation and expiration of cache entries.

## Constructors

### constructor

• **new CacheEntry**(`value`, `ttl`)

Initializes the cache entry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | The cache entry value. |
| `ttl` | `string` \| `number` | The time to live in milliseconds. |

#### Defined in

[packages/core/src/cache/CacheEntry.ts:31](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L31)

## Properties

### \_created

• `Protected` **\_created**: `number`

The timestamp of creation of this cache entry.

#### Defined in

[packages/core/src/cache/CacheEntry.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L23)

___

### \_ttl

• `Protected` **\_ttl**: `string` \| `number`

The time to live in milliseconds. The cache entry is considered
expired after this time.

#### Defined in

[packages/core/src/cache/CacheEntry.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L19)

___

### \_value

• `Protected` **\_value**: `unknown`

Cache entry value.

#### Defined in

[packages/core/src/cache/CacheEntry.ts:14](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L14)

## Methods

### getValue

▸ **getValue**(): `unknown`

Returns the entry value.

#### Returns

`unknown`

#### Defined in

[packages/core/src/cache/CacheEntry.ts:60](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L60)

___

### isExpired

▸ **isExpired**(): `boolean`

Returns `true` if this entry has expired.

#### Returns

`boolean`

`true` if this entry has expired.

#### Defined in

[packages/core/src/cache/CacheEntry.ts:42](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L42)

___

### serialize

▸ **serialize**(): `SerializedCacheEntry`

Exports this cache entry into a JSON-serializable object.

This entry exported to a
        JSON-serializable object.

#### Returns

`SerializedCacheEntry`

#### Defined in

[packages/core/src/cache/CacheEntry.ts:53](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheEntry.ts#L53)
