---
id: "CacheFactory"
title: "Class: CacheFactory"
sidebar_label: "CacheFactory"
sidebar_position: 0
custom_edit_url: null
---

Factory for creating instances of [CacheEntry](CacheEntry.md).

## Constructors

### constructor

• **new CacheFactory**()

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/cache/CacheFactory.ts:7](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheFactory.ts#L7)

## Methods

### createCacheEntry

▸ **createCacheEntry**(`value`, `ttl`): [`CacheEntry`](CacheEntry.md)

Create a new instance of [CacheEntry](CacheEntry.md) with value and ttl.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | The cache entry value. |
| `ttl` | `string` \| `number` | Cache entry time to live in milliseconds. The        entry will expire after the specified amount of milliseconds. |

#### Returns

[`CacheEntry`](CacheEntry.md)

The created cache entry.

#### Defined in

[packages/core/src/cache/CacheFactory.ts:20](https://github.com/seznam/ima/blob/16487954/packages/core/src/cache/CacheFactory.ts#L20)
