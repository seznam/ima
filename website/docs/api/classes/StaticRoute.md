---
id: "StaticRoute"
title: "Class: StaticRoute"
sidebar_label: "StaticRoute"
sidebar_position: 0
custom_edit_url: null
---

Utility for representing and manipulating a single static route in the
router's configuration using string representation of the path expression
with special param fields identified by `:paramName` prefix.

## Hierarchy

- [`AbstractRoute`](AbstractRoute.md)

  ↳ **`StaticRoute`**

## Constructors

### constructor

• **new StaticRoute**(`name`, `pathExpression`, `controller`, `view`, `options`)

**`Inherit Doc`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | - |
| `pathExpression` | `string` | A path expression specifying the URL path        part matching this route (must not contain a query string),        optionally containing named parameter placeholders specified as        `:parameterName`. |
| `controller` | `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md) | - |
| `view` | `unknown` | - |
| `options` | [`RouteOptions`](../modules.md#routeoptions) | - |

#### Overrides

[AbstractRoute](AbstractRoute.md).[constructor](AbstractRoute.md#constructor)

#### Defined in

[packages/core/src/router/StaticRoute.ts:95](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L95)

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

### \_hasParameters

• `Protected` **\_hasParameters**: `boolean`

#### Defined in

[packages/core/src/router/StaticRoute.ts:85](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L85)

___

### \_matcher

• `Protected` **\_matcher**: `RegExp`

#### Defined in

[packages/core/src/router/StaticRoute.ts:86](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L86)

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

### \_parameterNames

• `Protected` **\_parameterNames**: `string`[]

#### Defined in

[packages/core/src/router/StaticRoute.ts:84](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L84)

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

### \_trimmedPathExpression

• `Protected` **\_trimmedPathExpression**: `string`

#### Defined in

[packages/core/src/router/StaticRoute.ts:83](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L83)

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

### \_checkOptionalParamsOrder

▸ **_checkOptionalParamsOrder**(`allMainParams`): `boolean`

Check if all optional params are below required ones

#### Parameters

| Name | Type |
| :------ | :------ |
| `allMainParams` | `string`[] |

#### Returns

`boolean`

#### Defined in

[packages/core/src/router/StaticRoute.ts:266](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L266)

___

### \_checkParametersOrder

▸ **_checkParametersOrder**(`clearedPathExpr`): `boolean`

Check if main parametres have correct order.
It means that required param cannot follow optional one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clearedPathExpr` | `string` | The cleared URL path (removed first and last slash, ...). |

#### Returns

`boolean`

Returns TRUE if order is correct.

#### Defined in

[packages/core/src/router/StaticRoute.ts:292](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L292)

___

### \_cleanOptParamName

▸ **_cleanOptParamName**(`paramName`): `string`

Returns optional param name without "?"

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `paramName` | `string` | Full param name with "?" |

#### Returns

`string`

Strict param name without "?"

#### Defined in

[packages/core/src/router/StaticRoute.ts:521](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L521)

___

### \_cleanUnusedOptionalParams

▸ **_cleanUnusedOptionalParams**(`path`): `string`

Remove unused optional param placeholders in path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/router/StaticRoute.ts:210](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L210)

___

### \_compileToRegExp

▸ **_compileToRegExp**(`pathExpression`): `RegExp`

Compiles the path expression to a regular expression that can be used
for easier matching of URL paths against this route, and extracting the
path parameter values from the URL path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pathExpression` | `string` | The path expression to compile. |

#### Returns

`RegExp`

The compiled regular expression.

#### Defined in

[packages/core/src/router/StaticRoute.ts:407](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L407)

___

### \_extractParameters

▸ **_extractParameters**(`parameterValues`): `Object`

Extract parameters from given path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameterValues` | `string`[] |

#### Returns

`Object`

#### Defined in

[packages/core/src/router/StaticRoute.ts:493](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L493)

___

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

### \_getClearParamName

▸ **_getClearParamName**(`rawParam`): `string`

Extract clear parameter name, e.q. '?name' or 'name'

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawParam` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/router/StaticRoute.ts:246](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L246)

___

### \_getParameterNames

▸ **_getParameterNames**(`pathExpression`): `string`[]

Extracts the parameter names from the provided path expression.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pathExpression` | `string` | The path expression. |

#### Returns

`string`[]

The names of the parameters defined in the provided
        path expression.

#### Defined in

[packages/core/src/router/StaticRoute.ts:542](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L542)

___

### \_getParameters

▸ **_getParameters**(`path`): `Object`

Parses the provided path and extract the in-path parameters. The method
decodes the parameters and returns them in a hash object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Object`

#### Defined in

[packages/core/src/router/StaticRoute.ts:475](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L475)

___

### \_getSubparamPattern

▸ **_getSubparamPattern**(`delimeter`): `string`

Get pattern for subparameter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `delimeter` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/router/StaticRoute.ts:257](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L257)

___

### \_isOptionalParamInPath

▸ **_isOptionalParamInPath**(`path`, `paramName`): `boolean`

Returns true, if paramName is placed in path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `paramName` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/core/src/router/StaticRoute.ts:228](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L228)

___

### \_isParamOptional

▸ **_isParamOptional**(`paramName`): `boolean`

Checks if parameter is optional or not.

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramName` | `string` |

#### Returns

`boolean`

return true if is optional, otherwise false

#### Defined in

[packages/core/src/router/StaticRoute.ts:531](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L531)

___

### \_isRequiredParamInPath

▸ **_isRequiredParamInPath**(`path`, `paramName`): `boolean`

Returns true, if paramName is placed in path and it's required.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `paramName` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/core/src/router/StaticRoute.ts:237](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L237)

___

### \_replaceOptionalParametersInPath

▸ **_replaceOptionalParametersInPath**(`path`, `optionalParams`): `string`

Convert main optional parameters to capture sequences

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path. |
| `optionalParams` | `string`[] | List of main optimal parameter expressions |

#### Returns

`string`

RegExp pattern.

#### Defined in

[packages/core/src/router/StaticRoute.ts:310](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L310)

___

### \_replaceOptionalSubParametersInPath

▸ **_replaceOptionalSubParametersInPath**(`path`, `optionalSubparamsOthers`, `optionalSubparamsLast`): `string`

Convert optional subparameters to capture sequences

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path (route definition). |
| `optionalSubparamsOthers` | `string`[] | List of all subparam. expressions but last ones |
| `optionalSubparamsLast` | `string`[] | List of last subparam. expressions |

#### Returns

`string`

RegExp pattern.

#### Defined in

[packages/core/src/router/StaticRoute.ts:375](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L375)

___

### \_replaceRequiredSubParametersInPath

▸ **_replaceRequiredSubParametersInPath**(`path`, `clearedPathExpr`): `string`

Convert required subparameters to capture sequences

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The URL path (route definition). |
| `clearedPathExpr` | `string` | The original cleared URL path. |

#### Returns

`string`

RegExp pattern.

#### Defined in

[packages/core/src/router/StaticRoute.ts:342](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L342)

___

### \_substituteOptionalParamInPath

▸ **_substituteOptionalParamInPath**(`path`, `paramName`, `paramValue`): `string`

Replace optional param placeholder in path with parameter value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `paramName` | `string` |
| `paramValue` | `ParamValue` |

#### Returns

`string`

#### Defined in

[packages/core/src/router/StaticRoute.ts:195](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L195)

___

### \_substituteRequiredParamInPath

▸ **_substituteRequiredParamInPath**(`path`, `paramName`, `paramValue`): `string`

Replace required parameter placeholder in path with parameter value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `paramName` | `string` |
| `paramValue` | `ParamValue` |

#### Returns

`string`

#### Defined in

[packages/core/src/router/StaticRoute.ts:181](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L181)

___

### extractParameters

▸ **extractParameters**(`path`): { `[key: string]`: `string`;  } & `RouteParams`

Extracts the parameter values from the provided path. The method
extracts both the in-path parameters and parses the query, allowing the
query parameters to override the in-path parameters.

The method returns an empty hash object if the path does not match this
route.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

{ `[key: string]`: `string`;  } & `RouteParams`

Map of parameter names to parameter
        values.

#### Overrides

[AbstractRoute](AbstractRoute.md).[extractParameters](AbstractRoute.md#extractparameters)

#### Defined in

[packages/core/src/router/StaticRoute.ts:170](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L170)

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

[packages/core/src/router/StaticRoute.ts:161](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L161)

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
| `params` | `RouteParams` | The route        parameter values. |

#### Returns

`string`

Path and, if necessary, query parts of the URL
        representing this route with its parameters replaced by the
        provided parameter values.

#### Overrides

[AbstractRoute](AbstractRoute.md).[toPath](AbstractRoute.md#topath)

#### Defined in

[packages/core/src/router/StaticRoute.ts:130](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/StaticRoute.ts#L130)

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
