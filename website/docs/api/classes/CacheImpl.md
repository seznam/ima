---
id: "CacheImpl"
title: "Class: CacheImpl"
sidebar_label: "CacheImpl"
sidebar_position: 0
custom_edit_url: null
---

Configurable generic implementation of the [Cache](Cache.md) interface.

**`Example`**

```ts
if (cache.has('model.articles')) {
  return cache.get('model.articles');
} else {
  let articles = getArticlesFromStorage();
  // cache for an hour
  cache.set('model.articles', articles, 60 * 60 * 1000);
}
```

## Hierarchy

- [`Cache`](Cache.md)

  ↳ **`CacheImpl`**

## Constructors

### constructor

• **new CacheImpl**(`cacheStorage`, `factory`, `Helper`, `config?`)

Initializes the cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheStorage` | [`Storage`](Storage.md) | The cache entry storage to use. |
| `factory` | [`CacheFactory`](CacheFactory.md) | Which create new instance of cache entry. |
| `Helper` | `__module` | The IMA.js helper methods. |
| `config` | `Object` | The cache configuration. |
| `config.enabled` | `boolean` | - |
| `config.ttl` | `number` | - |

#### Overrides

[Cache](Cache.md).[constructor](Cache.md#constructor)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:34](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L34)

## Properties

### \_Helper

• `Protected` **\_Helper**: `__module`

#### Defined in

[packages/core/src/cache/CacheImpl.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L23)

___

### \_cache

• `Protected` **\_cache**: [`Storage`](Storage.md)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L21)

___

### \_enabled

• `Protected` **\_enabled**: `boolean`

#### Defined in

[packages/core/src/cache/CacheImpl.ts:25](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L25)

___

### \_factory

• `Protected` **\_factory**: [`CacheFactory`](CacheFactory.md)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:22](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L22)

___

### \_ttl

• `Protected` **\_ttl**: `number`

#### Defined in

[packages/core/src/cache/CacheImpl.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L24)

## Methods

### \_canSerializeValue

▸ `Private` **_canSerializeValue**(`value`): `boolean`

Tests whether the provided value can be serialized into JSON.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | The value to test whether or not it can be serialized. |

#### Returns

`boolean`

`true` if the provided value can be serialized into JSON,
        `false` otherwise.

#### Defined in

[packages/core/src/cache/CacheImpl.ts:198](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L198)

___

### \_clone

▸ `Private` **_clone**(`value`): `unknown`

Attempts to clone the provided value, if possible. Values that cannot be
cloned (e.g. promises) will be simply returned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | The value to clone. |

#### Returns

`unknown`

The created clone, or the provided value if the value cannot be
        cloned.

#### Defined in

[packages/core/src/cache/CacheImpl.ts:252](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L252)

___

### clear

▸ **clear**(): `void`

Clears the cache by deleting all entries.

#### Returns

`void`

#### Overrides

[Cache](Cache.md).[clear](Cache.md#clear)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:65](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L65)

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

#### Overrides

[Cache](Cache.md).[delete](Cache.md#delete)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:120](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L120)

___

### deserialize

▸ **deserialize**(`serializedData`): `void`

Loads the provided serialized cache data into this cache. Entries
present in this cache but not specified in the provided data will remain
in this cache intact.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serializedData` | `Object` | An        object representing the state of the cache to load, obtained by        parsing the JSON string returned by the [serialize](Cache.md#serialize)        method. |

#### Returns

`void`

#### Overrides

[Cache](Cache.md).[deserialize](Cache.md#deserialize)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:179](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L179)

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

#### Overrides

[Cache](Cache.md).[disable](Cache.md#disable)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:127](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L127)

___

### enable

▸ **enable**(): `void`

Enables the cache, allowing the retrieval of cache entries.

The method has no effect if the cache is already enabled.

#### Returns

`void`

#### Overrides

[Cache](Cache.md).[enable](Cache.md#enable)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:135](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L135)

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

#### Overrides

[Cache](Cache.md).[get](Cache.md#get)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:90](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L90)

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

#### Overrides

[Cache](Cache.md).[has](Cache.md#has)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:72](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L72)

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

#### Overrides

[Cache](Cache.md).[serialize](Cache.md#serialize)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:142](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L142)

___

### set

▸ **set**(`key`, `value`, `ttl?`): `void`

Sets the cache entry identified by the specified key to the provided
value. The entry is created if it does not exist yet.

The method has no effect if the cache is currently disabled.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `key` | `string` | `undefined` | The identifier of the cache entry. |
| `value` | `unknown` | `undefined` | The cache entry value. |
| `ttl` | `string` \| `number` | `0` | Cache entry time to live in milliseconds. The        entry will expire after the specified amount of milliseconds. Use        `null` or omit the parameter to use the default TTL of this cache. |

#### Returns

`void`

#### Overrides

[Cache](Cache.md).[set](Cache.md#set)

#### Defined in

[packages/core/src/cache/CacheImpl.ts:104](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheImpl.ts#L104)
