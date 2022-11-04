---
id: "Cache"
title: "Class: Cache"
sidebar_label: "Cache"
sidebar_position: 0
custom_edit_url: null
---

The cache provides a temporary storage for expirable information. The
primary use of a cache is caching information obtained via costly means
(CPU-heavy computation or networking) to speed up the application's
performance when the same information needs to be retrieved multiple times.

## Hierarchy

- **`Cache`**

  ↳ [`CacheImpl`](CacheImpl.md)

## Constructors

### constructor

• **new Cache**()

## Methods

### clear

▸ **clear**(): `void`

Clears the cache by deleting all entries.

#### Returns

`void`

#### Defined in

[packages/core/src/cache/Cache.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L17)

___

### delete

▸ **delete**(`key`): `void`

Deletes the specified cache entry. The method has no effect if the entry
does not exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The identifier of the cache entry. |

#### Returns

`void`

#### Defined in

[packages/core/src/cache/Cache.ts:71](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L71)

___

### deserialize

▸ **deserialize**(`serializedData`): `void`

Loads the provided serialized cache data into this cache. Entries
present in this cache but not specified in the provided data will remain
in this cache intact.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serializedData` | `SerializedData` | An        object representing the state of the cache to load, obtained by        parsing the JSON string returned by the [serialize](Cache.md#serialize)        method. |

#### Returns

`void`

#### Defined in

[packages/core/src/cache/Cache.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L120)

___

### disable

▸ **disable**(): `void`

Disables the cache, preventing the retrieval of any cached entries and
reporting all cache entries as non-existing. Disabling the cache does
not however prevent modifying the existing or creating new cache
entries.

Disabling the cache also clears all of its current entries.

The method has no effect if the cache is already disabled.

#### Returns

`void`

#### Defined in

[packages/core/src/cache/Cache.ts:85](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L85)

___

### enable

▸ **enable**(): `void`

Enables the cache, allowing the retrieval of cache entries.

The method has no effect if the cache is already enabled.

#### Returns

`void`

#### Defined in

[packages/core/src/cache/Cache.ts:94](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L94)

___

### get

▸ **get**(`key`): `unknown`

Returns the value of the entry identified by the specified key.

The method returns `null` if the specified entry does not exist, has
already expired, or the cache is currently disabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The identifier of the cache entry. |

#### Returns

`unknown`

The value of the specified cache entry, or `null` if the entry
        is not available.

#### Defined in

[packages/core/src/cache/Cache.ts:45](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L45)

___

### has

▸ **has**(`key`): `boolean`

Tests whether the cache contains a fresh entry for the specified key. A
cache entry is fresh if the has not expired its TTL (time to live).

The method always returns `false` if the cache is currently disabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The identifier of the cache entry. |

#### Returns

`boolean`

`true` if the cache is enabled, the entry exists and has
        not expired yet.

#### Defined in

[packages/core/src/cache/Cache.ts:31](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L31)

___

### serialize

▸ **serialize**(): `string`

Exports the state of this cache to an HTML-safe JSON string. The data
obtained by parsing the result of this method are compatible with the
[deserialize](Cache.md#deserialize) method.

#### Returns

`string`

A JSON string containing an object representing of the
        current state of this cache.

#### Defined in

[packages/core/src/cache/Cache.ts:106](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L106)

___

### set

▸ **set**(`key`, `value`, `ttl?`): `void`

Sets the cache entry identified by the specified key to the provided
value. The entry is created if it does not exist yet.

The method has no effect if the cache is currently disabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The identifier of the cache entry. |
| `value` | `unknown` | The cache entry value. |
| `ttl?` | `string` \| `number` | Cache entry time to live in milliseconds. The        entry will expire after the specified amount of milliseconds. Use        `null` or omit the parameter to use the default TTL of this cache. |

#### Returns

`void`

#### Defined in

[packages/core/src/cache/Cache.ts:61](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/Cache.ts#L61)
