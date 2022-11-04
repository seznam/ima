---
id: "DynamicRoute"
title: "Class: DynamicRoute"
sidebar_label: "DynamicRoute"
sidebar_position: 0
custom_edit_url: null
---

Utility for representing and manipulating a single dynamic route in the
router's configuration. Dynamic route is defined by regExp used for route
matching and overrides for toPath and extractParameters functions to generate
and put together valid path.

## Hierarchy

- [`AbstractRoute`](AbstractRoute.md)

  ↳ **`DynamicRoute`**

## Constructors

### constructor

• **new DynamicRoute**(`name`, `pathExpression`, `controller`, `view`, `options`)

Initializes the route.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | - |
| `pathExpression` | `RoutePathExpression` | Path expression used in route matching,        to generate valid path with provided params and parsing params from current path. |
| `controller` | `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md) | - |
| `view` | `unknown` | - |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | - |

#### Overrides

[AbstractRoute](AbstractRoute.md).[constructor](AbstractRoute.md#constructor)

#### Defined in

[packages/core/src/router/DynamicRoute.ts:46](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L46)

## Properties

### \_cachedController

• `Protected` **\_cachedController**: `unknown`

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_cachedController](AbstractRoute.md#_cachedcontroller)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:53](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L53)

___

### \_cachedView

• `Protected` **\_cachedView**: `unknown`

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_cachedView](AbstractRoute.md#_cachedview)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:54](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L54)

___

### \_controller

• `Protected` **\_controller**: `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md)

The full name of Object Container alias identifying the controller
associated with this route.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_controller](AbstractRoute.md#_controller)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:43](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L43)

___

### \_extractParameters

• `Protected` **\_extractParameters**: (`path?`: `string`) => `RouteParams`

#### Type declaration

▸ (`path?`): `RouteParams`

##### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |

##### Returns

`RouteParams`

#### Defined in

[packages/core/src/router/DynamicRoute.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L38)

___

### \_matcher

• `Protected` **\_matcher**: `RegExp`

#### Defined in

[packages/core/src/router/DynamicRoute.ts:36](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L36)

___

### \_name

• `Protected` **\_name**: `string`

The unique name of this route, identifying it among the rest of the
routes in the application.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_name](AbstractRoute.md#_name)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L33)

___

### \_options

• `Protected` **\_options**: [`RouteOptions`](../modules.md#routeoptions)

The route additional options.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_options](AbstractRoute.md#_options)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:52](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L52)

___

### \_pathExpression

• `Protected` **\_pathExpression**: `string` \| `RoutePathExpression`

Path expression used in route matching, to generate valid path with
provided params and parsing params from current path.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_pathExpression](AbstractRoute.md#_pathexpression)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L38)

___

### \_toPath

• `Protected` **\_toPath**: (`params`: `RouteParams`) => `string`

#### Type declaration

▸ (`params`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `RouteParams` |

##### Returns

`string`

#### Defined in

[packages/core/src/router/DynamicRoute.ts:37](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L37)

___

### \_view

• `Protected` **\_view**: `unknown`

The full name or Object Container alias identifying the view class
associated with this route.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_view](AbstractRoute.md#_view)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[_getAsyncModule](AbstractRoute.md#_getasyncmodule)

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

#### Overrides

[AbstractRoute](AbstractRoute.md).[extractParameters](AbstractRoute.md#extractparameters)

#### Defined in

[packages/core/src/router/DynamicRoute.ts:116](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L116)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getController](AbstractRoute.md#getcontroller)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:251](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L251)

___

### getName

▸ **getName**(): `string`

Returns the unique identifying name of this route.

#### Returns

`string`

The name of the route, identifying it.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getName](AbstractRoute.md#getname)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:239](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L239)

___

### getOptions

▸ **getOptions**(): [`RouteOptions`](../modules.md#routeoptions)

Return route additional options.

#### Returns

[`RouteOptions`](../modules.md#routeoptions)

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getOptions](AbstractRoute.md#getoptions)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getPathExpression](AbstractRoute.md#getpathexpression)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getView](AbstractRoute.md#getview)

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

#### Overrides

[AbstractRoute](AbstractRoute.md).[matches](AbstractRoute.md#matches)

#### Defined in

[packages/core/src/router/DynamicRoute.ts:107](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L107)

___

### preload

▸ **preload**(): `Promise`<[`unknown`, `unknown`]\>

Preloads dynamically imported view and controller.

#### Returns

`Promise`<[`unknown`, `unknown`]\>

Promise.All resolving to [view, controller] tuple.

#### Inherited from

[AbstractRoute](AbstractRoute.md).[preload](AbstractRoute.md#preload)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:297](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L297)

___

### toPath

▸ **toPath**(`params?`): `string`

Creates the URL and query parts of a URL by substituting the route's
parameter placeholders by the provided parameter value.

The extraneous parameters that do not match any of the route's
placeholders will be appended as the query string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | The route        parameter values. |

#### Returns

`string`

Path and, if necessary, query parts of the URL
        representing this route with its parameters replaced by the
        provided parameter values.

#### Overrides

[AbstractRoute](AbstractRoute.md).[toPath](AbstractRoute.md#topath)

#### Defined in

[packages/core/src/router/DynamicRoute.ts:100](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/DynamicRoute.ts#L100)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[decodeURIParameter](AbstractRoute.md#decodeuriparameter)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getQuery](AbstractRoute.md#getquery)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[getTrimmedPath](AbstractRoute.md#gettrimmedpath)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[pairsToQuery](AbstractRoute.md#pairstoquery)

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

#### Inherited from

[AbstractRoute](AbstractRoute.md).[paramsToQuery](AbstractRoute.md#paramstoquery)

#### Defined in

[packages/core/src/router/AbstractRoute.ts:99](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/AbstractRoute.ts#L99)
