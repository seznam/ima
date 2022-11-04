---
id: "HttpProxy"
title: "Class: HttpProxy"
sidebar_label: "HttpProxy"
sidebar_position: 0
custom_edit_url: null
---

Middleware proxy between [HttpAgent](HttpAgent.md) implementations and the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
providing a Promise-oriented API for sending requests.

## Constructors

### constructor

• **new HttpProxy**(`transformer`, `window`)

Initializes the HTTP proxy.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transformer` | [`UrlTransformer`](UrlTransformer.md) | A transformer of URLs to which        requests are made. |
| `window` | [`Window`](Window.md) | Helper for manipulating the global object `window`        regardless of the client/server-side environment. |

#### Defined in

[packages/core/src/http/HttpProxy.ts:72](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L72)

## Properties

### \_defaultHeaders

• `Protected` **\_defaultHeaders**: `Map`<`string`, `string`\>

#### Defined in

[packages/core/src/http/HttpProxy.ts:62](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L62)

___

### \_transformer

• `Protected` **\_transformer**: [`UrlTransformer`](UrlTransformer.md)

#### Defined in

[packages/core/src/http/HttpProxy.ts:60](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L60)

___

### \_window

• `Protected` **\_window**: [`Window`](Window.md)

#### Defined in

[packages/core/src/http/HttpProxy.ts:61](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L61)

## Methods

### \_composeRequestInit

▸ **_composeRequestInit**(`method`, `data`, `options`): `RequestInit`

Composes an init object, which can be used as a second argument of
`window.fetch` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method to use. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to        be send with a request. |
| `options` | `HttpAgentRequestOptions` | Options provided by the HTTP        agent. |

#### Returns

`RequestInit`

A `RequestInit` object of the Fetch API.

#### Defined in

[packages/core/src/http/HttpProxy.ts:420](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L420)

___

### \_composeRequestParams

▸ **_composeRequestParams**(`method`, `url`, `data`, `options`): `HttpProxyRequestParams`

Composes an object representing the HTTP request parameters from the
provided arguments.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method to use. |
| `url` | `string` | The URL to which the request should be sent. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to        send with the request. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`HttpProxyRequestParams`

An object representing the complete request parameters used to create and
        send the HTTP request.

#### Defined in

[packages/core/src/http/HttpProxy.ts:394](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L394)

___

### \_composeRequestUrl

▸ **_composeRequestUrl**(`url`, `data`): `string`

Transforms the provided URL using the current URL transformer and adds
the provided data to the URL's query string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to prepare for use with the fetch API. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to be atached to the query string. |

#### Returns

`string`

The transformed URL with the provided data attached to
        its query string.

#### Defined in

[packages/core/src/http/HttpProxy.ts:498](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L498)

___

### \_convertObjectToFormData

▸ `Private` **_convertObjectToFormData**(`object`): [`UnknownParameters`](../modules.md#unknownparameters) \| `FormData`

Converts given data to FormData object.
If FormData object is not supported by the browser the original object is returned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | [`UnknownParameters`](../modules.md#unknownparameters) | The object to be converted |

#### Returns

[`UnknownParameters`](../modules.md#unknownparameters) \| `FormData`

#### Defined in

[packages/core/src/http/HttpProxy.ts:580](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L580)

___

### \_convertObjectToQueryString

▸ `Private` **_convertObjectToQueryString**(`object`): `string`

Returns query string representation of the data parameter.
(Returned string does not contain ? at the beginning)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | [`UnknownParameters`](../modules.md#unknownparameters) | The object to be converted |

#### Returns

`string`

Query string representation of the given object

#### Defined in

[packages/core/src/http/HttpProxy.ts:560](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L560)

___

### \_createError

▸ **_createError**(`cause`, `requestParams`, `status`, `responseBody?`): [`GenericError`](GenericError.md)

Creates an error that represents a failed HTTP request.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cause` | `Error` \| [`GenericError`](GenericError.md) | `undefined` | The error's message. |
| `requestParams` | `HttpProxyRequestParams` | `undefined` | An object representing the        complete request parameters used to create and send the HTTP        request. |
| `status` | `number` | `undefined` | Server's response HTTP status code. |
| `responseBody` | `unknown` | `null` | The body of the server's response, if any. |

#### Returns

[`GenericError`](GenericError.md)

The error representing a failed HTTP request.

#### Defined in

[packages/core/src/http/HttpProxy.ts:362](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L362)

___

### \_getContentType

▸ **_getContentType**(`method`, `data`, `options`): ``null`` \| `string`

Gets a `Content-Type` header value for defined method, data and options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method to use. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to        be send with a request. |
| `options` | `HttpAgentRequestOptions` | Options provided by the HTTP        agent. |

#### Returns

``null`` \| `string`

A `Content-Type` header value, null for requests
       with no body.

#### Defined in

[packages/core/src/http/HttpProxy.ts:470](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L470)

___

### \_headersToPlainObject

▸ **_headersToPlainObject**(`headers`): `Object`

Converts the provided Fetch API's `Headers` object to a plain object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headers` | `Headers` | The headers to convert. |

#### Returns

`Object`

Converted headers.

#### Defined in

[packages/core/src/http/HttpProxy.ts:314](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L314)

___

### \_processError

▸ **_processError**(`fetchError`, `requestParams`): [`GenericError`](GenericError.md)

Processes the provided Fetch API or internal error and creates an error
to expose to the calling API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fetchError` | `Error` \| [`GenericError`](GenericError.md) | The internal error to process. |
| `requestParams` | `HttpProxyRequestParams` | An object representing the        complete request parameters used to create and send the HTTP        request. |

#### Returns

[`GenericError`](GenericError.md)

The error to provide to the calling API.

#### Defined in

[packages/core/src/http/HttpProxy.ts:336](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L336)

___

### \_processResponse

▸ **_processResponse**(`requestParams`, `response`, `responseBody`): `HttpAgentResponse`

Processes the response received from the server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requestParams` | `HttpProxyRequestParams` | The original request's        parameters. |
| `response` | `Response` | The Fetch API's `Response` object representing        the server's response. |
| `responseBody` | `unknown` | The server's response body. |

#### Returns

`HttpAgentResponse`

The server's response along with all related
        metadata.

#### Defined in

[packages/core/src/http/HttpProxy.ts:286](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L286)

___

### \_shouldRequestHaveBody

▸ **_shouldRequestHaveBody**(`method`, `data?`): `boolean`

Checks if a request should have a body (`GET` and `HEAD` requests don't
have a body).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method. |
| `data?` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to        be send with a request. |

#### Returns

`boolean`

`true` if a request has a body, otherwise `false`.

#### Defined in

[packages/core/src/http/HttpProxy.ts:519](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L519)

___

### \_transformRequestBody

▸ `Private` **_transformRequestBody**(`data`, `headers`): `string` \| [`UnknownParameters`](../modules.md#unknownparameters) \| `FormData`

Formats request body according to request headers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to        be send with a request. |
| `headers` | `Object` | Headers object from options provided by the HTTP        agent. |

#### Returns

`string` \| [`UnknownParameters`](../modules.md#unknownparameters) \| `FormData`

#### Defined in

[packages/core/src/http/HttpProxy.ts:536](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L536)

___

### clearDefaultHeaders

▸ **clearDefaultHeaders**(): `void`

Clears all defaults headers sent with all requests.

#### Returns

`void`

#### Defined in

[packages/core/src/http/HttpProxy.ts:190](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L190)

___

### getErrorParams

▸ **getErrorParams**(`method`, `url`, `data`, `options`, `status`, `body`, `cause`): `HttpProxyErrorParams`

Gets an object that describes a failed HTTP request, providing
information about both the failure reported by the server and how the
request has been sent to the server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method used to make the request. |
| `url` | `string` | The URL to which the request has been made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data sent        with the request. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |
| `status` | `number` | The HTTP response status code send by the server. |
| `body` | `unknown` | The body of HTTP error response (detailed        information). |
| `cause` | `Error` | The low-level cause error. |

#### Returns

`HttpProxyErrorParams`

An object containing both the details of
        the error and the request that lead to it.

#### Defined in

[packages/core/src/http/HttpProxy.ts:211](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L211)

___

### haveToSetCookiesManually

▸ **haveToSetCookiesManually**(): `boolean`

Returns `true` if cookies have to be processed manually by setting
`Cookie` HTTP header on requests and parsing the `Set-Cookie` HTTP
response header.

The result of this method depends on the current application
environment, the client-side usually handles cookie processing
automatically, leading this method returning `false`.

At the client-side, the method tests whether the client has cookies
enabled (which results in cookies being automatically processed by the
browser), and returns `true` or `false` accordingly.

`true` if cookies are not processed automatically by
        the environment and have to be handled manually by parsing
        response headers and setting request headers, otherwise `false`.

#### Returns

`boolean`

#### Defined in

[packages/core/src/http/HttpProxy.ts:271](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L271)

___

### request

▸ **request**(`method`, `url`, `data`, `options`): `Promise`<`unknown`\>

Executes a HTTP request to the specified URL using the specified HTTP
method, carrying the provided data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | The HTTP method to use. |
| `url` | `string` | The URL to which the request should be made. |
| `data` | [`UnknownParameters`](../modules.md#unknownparameters) | The data to        be send to the server. The data will be included as query        parameters if the request method is `GET` or `HEAD`, and as        a request body for any other request method. |
| `options` | `HttpAgentRequestOptions` | Optional request options. |

#### Returns

`Promise`<`unknown`\>

A promise that resolves to the server
        response.

#### Defined in

[packages/core/src/http/HttpProxy.ts:105](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L105)

___

### setDefaultHeader

▸ **setDefaultHeader**(`header`, `value`): `void`

Sets the specified default HTTP header. The header will be sent with all
subsequent HTTP requests unless reconfigured using this method,
overridden by request options, or cleared by
[clearDefaultHeaders](HttpProxy.md#cleardefaultheaders) method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `header` | `string` | A header name. |
| `value` | `string` | A header value. |

#### Returns

`void`

#### Defined in

[packages/core/src/http/HttpProxy.ts:183](https://github.com/seznam/ima/blob/16487954/packages/core/src/http/HttpProxy.ts#L183)
