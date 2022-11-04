---
id: "AbstractRoute"
title: "Class: AbstractRoute"
sidebar_label: "AbstractRoute"
sidebar_position: 0
custom_edit_url: null
---

Utility for representing and manipulating a single route in the router's
configuration.

## Hierarchy

- **`AbstractRoute`**

  ↳ [`StaticRoute`](StaticRoute.md)

  ↳ [`DynamicRoute`](DynamicRoute.md)

## Constructors

### constructor

• **new AbstractRoute**(`name`, `pathExpression`, `controller`, `view`, `options`)

Initializes the route.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The unique name of this route, identifying it among        the rest of the routes in the application. |
| `pathExpression` | `string` \| `RoutePathExpression` | Path expression used in route matching, to generate        valid path with provided params and parsing params from current path. |
| `controller` | `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md) | The full name of Object Container alias        identifying the controller associated with this route. |
| `view` | `unknown` | The full name or Object Container alias identifying        the view class associated with this route. |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | The route additional options. |

#### Defined in

[packages/core/src/router/AbstractRoute.ts:201](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L201)

## Properties

### \_cachedController

• `Protected` **\_cachedController**: `unknown`

#### Defined in

[packages/core/src/router/AbstractRoute.ts:53](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L53)

___

### \_cachedView

• `Protected` **\_cachedView**: `unknown`

#### Defined in

[packages/core/src/router/AbstractRoute.ts:54](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L54)

___

### \_controller

• `Protected` **\_controller**: `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md)

The full name of Object Container alias identifying the controller
associated with this route.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L43)

___

### \_name

• `Protected` **\_name**: `string`

The unique name of this route, identifying it among the rest of the
routes in the application.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L33)

___

### \_options

• `Protected` **\_options**: [`RouteOptions`](../modules.md#routeoptions)

The route additional options.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L52)

___

### \_pathExpression

• `Protected` **\_pathExpression**: `string` \| `RoutePathExpression`

Path expression used in route matching, to generate valid path with
provided params and parsing params from current path.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L38)

___

### \_view

• `Protected` **\_view**: `unknown`

The full name or Object Container alias identifying the view class
associated with this route.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:48](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L48)

## Methods

### \_getAsyncModule

▸ **_getAsyncModule**(`module`): `Promise`<`unknown`\>

Helper method to pre-process view and controller which can be
async functions in order to support dynamic async routing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `module` | `unknown` | The module class/alias/constant. |

#### Returns

`Promise`<`unknown`\>

Promise resolving to the actual view or controller
 constructor function/class.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:362](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L362)

___

### extractParameters

▸ **extractParameters**(`path?`): `RouteParams`

Extracts the parameter values from the provided path. The method
extracts both the in-path parameters and parses the query, allowing the
query parameters to override the in-path parameters.

The method returns an empty hash object if the path does not match this
route.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |

#### Returns

`RouteParams`

Map of parameter names to parameter
        values.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:347](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L347)

___

### getController

▸ **getController**(): `Promise`<`unknown`\>

Returns Controller class/alias/constant associated with this route.
Internally caches async calls for dynamically imported controllers,
meaning that once they're loaded, you get the same promise for
subsequent calls.

#### Returns

`Promise`<`unknown`\>

The Controller class/alias/constant.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:251](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L251)

___

### getName

▸ **getName**(): `string`

Returns the unique identifying name of this route.

#### Returns

`string`

The name of the route, identifying it.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:239](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L239)

___

### getOptions

▸ **getOptions**(): [`RouteOptions`](../modules.md#routeoptions)

Return route additional options.

#### Returns

[`RouteOptions`](../modules.md#routeoptions)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:278](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L278)

___

### getPathExpression

▸ **getPathExpression**(): `string` \| `RoutePathExpression`

Path expression used in route matching, to generate valid path with
provided params and parsing params from current path.

#### Returns

`string` \| `RoutePathExpression`

The path expression.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:288](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L288)

___

### getView

▸ **getView**(): `Promise`<`unknown`\>

Returns View class/alias/constant associated with this route.
Internally caches async calls for dynamically imported views,
meaning that once they're loaded, you get the same promise for
subsequent calls.

#### Returns

`Promise`<`unknown`\>

The View class/alias/constant.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:267](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L267)

___

### matches

▸ **matches**(`path`): `boolean`

Tests whether the provided URL path matches this route. The provided
path may contain the query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path. |

#### Returns

`boolean`

`true` if the provided path matches this route.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:328](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L328)

___

### preload

▸ **preload**(): `Promise`<[`unknown`, `unknown`]\>

Preloads dynamically imported view and controller.

#### Returns

`Promise`<[`unknown`, `unknown`]\>

Promise.All resolving to [view, controller] tuple.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:297](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L297)

___

### toPath

▸ **toPath**(`params`): `string`

Creates the URL and query parts of a URL by substituting the route's
parameter placeholders by the provided parameter value.

The extraneous parameters that do not match any of the route's
placeholders will be appended as the query string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `RouteParams` | The route        parameter values. |

#### Returns

`string`

Path and, if necessary, query parts of the URL
        representing this route with its parameters replaced by the
        provided parameter values.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:314](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L314)

___

### decodeURIParameter

▸ `Static` **decodeURIParameter**(`parameterValue`): `string`

TODO IMA@18 remove static method

Decoding parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameterValue` | `string` |

#### Returns

`string`

decodedValue

#### Defined in

[packages/core/src/router/AbstractRoute.ts:168](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L168)

___

### getQuery

▸ `Static` **getQuery**(`path`): `RouteParams`

TODO IMA@18 remove static method

Extracts and decodes the query parameters from the provided URL path and
query.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path, including the optional query string        (if any). |

#### Returns

`RouteParams`

Parsed query parameters.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:123](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L123)

___

### getTrimmedPath

▸ `Static` **getTrimmedPath**(`path`): `string`

TODO IMA@18 remove static method

Trims the trailing forward slash from the provided URL path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The path to trim. |

#### Returns

`string`

Trimmed path.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:184](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L184)

___

### pairsToQuery

▸ `Static` **pairsToQuery**(`pairs?`): `string`

TODO IMA@18 remove static method

Converts array of pairs (tuples) into valid URI query component.
Filters out invalid inputs (undefined, null, object, array, non-pair).

**`Example`**

```ts
let pairs = [['a', true], ['hello world', 123]];
pairsToQuery(pairs); // => "?a=true&hello%20world=123"
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pairs?` | `unknown`[][] | `[]` | Array of arrays where the first         element must be string\|number and the second element can be any. |

#### Returns

`string`

Valid URI query component or empty string if
        there are no valid pairs provided.

#### Defined in

[packages/core/src/router/AbstractRoute.ts:71](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L71)

___

### paramsToQuery

▸ `Static` **paramsToQuery**(`params?`): `string`

TODO IMA@18 remove static method

Converts object of key/value pairs to URI query,
which can be appended to url.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `RouteParams` |

#### Returns

`string`

#### Defined in

[packages/core/src/router/AbstractRoute.ts:99](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L99)
