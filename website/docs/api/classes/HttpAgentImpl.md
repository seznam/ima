---
id: "HttpAgentImpl"
title: "Class: HttpAgentImpl"
sidebar_label: "HttpAgentImpl"
sidebar_position: 0
custom_edit_url: null
---

Implementation of the [HttpAgent](HttpAgent.md) interface with internal caching
of completed and ongoing HTTP requests and cookie storage.

## Hierarchy

- [`HttpAgent`](HttpAgent.md)

  ↳ **`HttpAgentImpl`**

## Constructors

### constructor

• **new HttpAgentImpl**(`proxy`, `cache`, `cookie`, `Helper`, `config`)

Initializes the HTTP handler.

**`Example`**

```ts
http
         .get('url', { data: data }, {
             ttl: 2000,
             repeatRequest: 1,
             withCredentials: true,
             timeout: 2000,
             accept: 'application/json',
             language: 'en',
             listeners: { 'progress': callbackFunction }
         })
         .then((response) => {
             //resolve
         }
         .catch((error) => {
            //catch
         });
```

**`Example`**

```ts
http
         .setDefaultHeader('Accept-Language', 'en')
         .clearDefaultHeaders();
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proxy` | [`HttpProxy`](HttpProxy.md) | The low-level HTTP proxy for sending the HTTP        requests. |
| `cache` | [`Cache`](Cache.md) | Cache to use for caching ongoing and completed        requests. |
| `cookie` | [`CookieStorage`](CookieStorage.md) | The cookie storage to use internally. |
| `Helper` | `__module` | The IMA.js helper methods. |
| `config` | `Object` | Configuration of the HTTP handler for        the current application environment, specifying the various        default request option values and cache option values. |

#### Overrides

[HttpAgent](HttpAgent.md).[constructor](HttpAgent.md#constructor)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:59](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L59)

## Properties

### \_Helper

• `Protected` **\_Helper**: `__module`

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:22](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L22)

___

### \_cache

• `Protected` **\_cache**: [`Cache`](Cache.md)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:18](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L18)

___

### \_cacheOptions

• `Protected` **\_cacheOptions**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:20](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L20)

___

### \_cookie

• `Protected` **\_cookie**: [`CookieStorage`](CookieStorage.md)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:19](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L19)

___

### \_defaultRequestOptions

• `Protected` **\_defaultRequestOptions**: `HttpAgentRequestOptions`

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L21)

___

### \_internalCacheOfPromises

• `Protected` **\_internalCacheOfPromises**: `Map`<`any`, `any`\>

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:23](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L23)

___

### \_proxy

• `Protected` **\_proxy**: [`HttpProxy`](HttpProxy.md)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:17](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L17)

## Methods

### \_cleanCacheResponse

▸ **_cleanCacheResponse**(`response`): `HttpAgentResponse`

Cleans cache response from data (abort controller), that cannot be persisted,
before saving the data to the cache.

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `HttpAgentResponse` |

#### Returns

`HttpAgentResponse`

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:495](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L495)

___

### \_clone

▸ **_clone**(`value`): `unknown`

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

[packages/core/src/http/HttpAgentImpl.ts:205](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L205)

___

### \_getCacheKeySuffix

▸ **_getCacheKeySuffix**(`method`, `url`, `data`): `string`

Generates cache key suffix for an HTTP request to the specified URL with
the specified data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method used by the request. |
| `url` | `string` | The URL to which the request is sent. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data sent        with the request. |

#### Returns

`string`

The suffix of a cache key to use for a request to the
        specified URL, carrying the specified data.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:439](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L439)

___

### \_getCachedData

▸ **_getCachedData**(`method`, `url`, `data`): `any`

Tests whether an ongoing or completed HTTP request for the specified URL
and data is present in the internal cache and, if it is, the method
returns a promise that resolves to the response body parsed as JSON.

The method returns `null` if no such request is present in the
cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method used by the request. |
| `url` | `string` | The URL to which the request was made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data sent        to the server with the request. |

#### Returns

`any`

A promise that will resolve to the
        server response with the body parsed as JSON, or `null` if
        no such request is present in the cache.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:262](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L262)

___

### \_prepareOptions

▸ **_prepareOptions**(`options`): `HttpAgentRequestOptions`

Prepares the provided request options object by filling in missing
options with default values and addding extra options used internally.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`HttpAgentRequestOptions`

Request options with set filled-in
        default values for missing fields, and extra options used
        internally.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:407](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L407)

___

### \_proxyRejected

▸ **_proxyRejected**(`error`): `Promise`<`HttpAgentResponse`\>

Handles rejection of the HTTP request by the HTTP proxy. The method
tests whether there are any remaining tries for the request, and if
there are any, it attempts re-send the request.

The method rejects the internal request promise if there are no tries
left.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | [`GenericError`](GenericError.md) | The error provided by the HttpProxy,        carrying the error parameters, such as the request url, data,        method, options and other useful data. |

#### Returns

`Promise`<`HttpAgentResponse`\>

A promise that will either resolve to a
        server's response (with the body parsed as JSON) if there are
        any tries left and the re-tried request succeeds, or rejects
        with an error containing details of the cause of the request's
        failure.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:374](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L374)

___

### \_proxyResolved

▸ **_proxyResolved**(`response`): `HttpAgentResponse`

Handles successful completion of an HTTP request by the HTTP proxy.

The method also updates the internal cookie storage with the cookies
received from the server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | `HttpAgentResponse` | Server response. |

#### Returns

`HttpAgentResponse`

The post-processed server response.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:324](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L324)

___

### \_request

▸ **_request**(`method`, `url`, `data`, `options`): `Promise`<`HttpAgentResponse`\>

Sends a new HTTP request using the specified method to the specified
url. The request will carry the provided data as query parameters if the
HTTP method is GET, but the data will be sent as request body for any
other request method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | HTTP method to use. |
| `url` | `string` | The URL to which the request is sent. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data sent        with the request. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`Promise`<`HttpAgentResponse`\>

A promise that resolves to the response
        with the body parsed as JSON.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:294](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L294)

___

### \_requestWithCheckCache

▸ **_requestWithCheckCache**(`method`, `url`, `data`, `options`): `any`

Check cache and if data isnt available then make real request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method to use. |
| `url` | `string` | The URL to which the request should be sent. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send with the request. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`any`

A promise that resolves to the response
        with body parsed as JSON.

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:227](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L227)

___

### \_saveAgentResponseToCache

▸ **_saveAgentResponseToCache**(`agentResponse`): `void`

Saves the server response to the cache to be used as the result of the
next request of the same properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `agentResponse` | `HttpAgentResponse` | The response of the server. |

#### Returns

`void`

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:473](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L473)

___

### \_setCookiesFromResponse

▸ **_setCookiesFromResponse**(`agentResponse`): `void`

Sets all cookies from the `Set-Cookie` response header to the
cookie storage.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `agentResponse` | `HttpAgentResponse` | The response of the server. |

#### Returns

`void`

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:457](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L457)

___

### clearDefaultHeaders

▸ **clearDefaultHeaders**(): [`HttpAgentImpl`](HttpAgentImpl.md)

Clears all configured default headers.

#### Returns

[`HttpAgentImpl`](HttpAgentImpl.md)

This HTTP agent.

#### Overrides

[HttpAgent](HttpAgent.md).[clearDefaultHeaders](HttpAgent.md#cleardefaultheaders)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:191](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L191)

___

### delete

▸ **delete**(`url`, `data`, `options?`): `any`

Sends an HTTP DELETE request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send to the server        as the request body. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`any`

A promise that resolves to the
        response.

#### Overrides

[HttpAgent](HttpAgent.md).[delete](HttpAgent.md#delete)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:157](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L157)

___

### get

▸ **get**(`url`, `data`, `options?`): `any`

Sends an HTTP GET request to the specified URL, sending the provided
data as query parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send        to the server as query parameters. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`any`

A promise that resolves to the
        response.

#### Overrides

[HttpAgent](HttpAgent.md).[get](HttpAgent.md#get)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:98](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L98)

___

### getCacheKey

▸ **getCacheKey**(`method`, `url`, `data`): `string`

Generates a cache key to use for identifying a request to the specified
URL using the specified HTTP method, submitting the provided data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method used by the request. |
| `url` | `string` | The URL to which the request is sent. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data associated with the        request. These can be either the query parameters or request body        data. |

#### Returns

`string`

The key to use for identifying such a request in the
        cache.

#### Overrides

[HttpAgent](HttpAgent.md).[getCacheKey](HttpAgent.md#getcachekey)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:173](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L173)

___

### patch

▸ **patch**(`url`, `data`, `options?`): `any`

Sends an HTTP PATCH request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send to the server        as the request body. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`any`

A promise that resolves to the
        response.

#### Overrides

[HttpAgent](HttpAgent.md).[patch](HttpAgent.md#patch)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:141](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L141)

___

### post

▸ **post**(`url`, `data`, `options?`): `any`

Sends an HTTP POST request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send to the server        as the request body. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`any`

A promise that resolves to the
        response.

#### Overrides

[HttpAgent](HttpAgent.md).[post](HttpAgent.md#post)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:109](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L109)

___

### put

▸ **put**(`url`, `data`, `options?`): `any`

Sends an HTTP PUT request to the specified URL, sending the provided
data as the request body. If an object is provided as the request data,
the data will be JSON-encoded. Sending other primitive non-string values
as the request body is not supported.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send to the server        as the request body. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`any`

A promise that resolves to the
        response.

#### Overrides

[HttpAgent](HttpAgent.md).[put](HttpAgent.md#put)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:125](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L125)

___

### setDefaultHeader

▸ **setDefaultHeader**(`header`, `value`): [`HttpAgentImpl`](HttpAgentImpl.md)

Sets the specified header to be sent with every subsequent HTTP request,
unless explicitly overridden by request options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `string` | The name of the header. |
| `value` | `string` | The header value. To provide multiple values,        separate them with commas        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2). |

#### Returns

[`HttpAgentImpl`](HttpAgentImpl.md)

This HTTP agent.

#### Overrides

[HttpAgent](HttpAgent.md).[setDefaultHeader](HttpAgent.md#setdefaultheader)

#### Defined in

[packages/core/src/http/HttpAgentImpl.ts:182](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgentImpl.ts#L182)
