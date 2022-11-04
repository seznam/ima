---
id: "HttpAgent"
title: "Class: HttpAgent"
sidebar_label: "HttpAgent"
sidebar_position: 0
custom_edit_url: null
---

The [HttpAgent](HttpAgent.md) defines unifying API for sending HTTP requests at
both client-side and server-side.

## Hierarchy

- **`HttpAgent`**

  ↳ [`HttpAgentImpl`](HttpAgentImpl.md)

## Constructors

### constructor

• **new HttpAgent**()

## Methods

### clearDefaultHeaders

▸ **clearDefaultHeaders**(): [`HttpAgent`](HttpAgent.md)

Clears all configured default headers.

#### Returns

[`HttpAgent`](HttpAgent.md)

This HTTP agent.

#### Defined in

[packages/core/src/http/HttpAgent.ts:204](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L204)

___

### delete

▸ **delete**(`url`, `data`, `options`): `Promise`<`HttpAgentResponse`\>

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

`Promise`<`HttpAgentResponse`\>

A promise that resolves to the
        response.

#### Defined in

[packages/core/src/http/HttpAgent.ts:161](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L161)

___

### get

▸ **get**(`url`, `data`, `options`): `Promise`<`HttpAgentResponse`\>

Sends an HTTP GET request to the specified URL, sending the provided
data as query parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to send        to the server as query parameters. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`Promise`<`HttpAgentResponse`\>

A promise that resolves to the
        response.

#### Defined in

[packages/core/src/http/HttpAgent.ts:77](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L77)

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
| `data` | `Object` | The data associated with the        request. These can be either the query parameters or request body        data. |

#### Returns

`string`

The key to use for identifying such a request in the
        cache.

#### Defined in

[packages/core/src/http/HttpAgent.ts:181](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L181)

___

### patch

▸ **patch**(`url`, `data`, `options`): `Promise`<`HttpAgentResponse`\>

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

`Promise`<`HttpAgentResponse`\>

A promise that resolves to the
        response.

#### Defined in

[packages/core/src/http/HttpAgent.ts:140](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L140)

___

### post

▸ **post**(`url`, `data`, `options`): `Promise`<`HttpAgentResponse`\>

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

`Promise`<`HttpAgentResponse`\>

A promise that resolves to the
        response.

#### Defined in

[packages/core/src/http/HttpAgent.ts:98](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L98)

___

### put

▸ **put**(`url`, `data`, `options`): `Promise`<`HttpAgentResponse`\>

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

`Promise`<`HttpAgentResponse`\>

A promise that resolves to the
        response.

#### Defined in

[packages/core/src/http/HttpAgent.ts:119](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L119)

___

### setDefaultHeader

▸ **setDefaultHeader**(`header`, `value`): [`HttpAgent`](HttpAgent.md)

Sets the specified header to be sent with every subsequent HTTP request,
unless explicitly overridden by request options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `string` | The name of the header. |
| `value` | `string` | The header value. To provide multiple values,        separate them with commas        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2). |

#### Returns

[`HttpAgent`](HttpAgent.md)

This HTTP agent.

#### Defined in

[packages/core/src/http/HttpAgent.ts:195](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpAgent.ts#L195)
