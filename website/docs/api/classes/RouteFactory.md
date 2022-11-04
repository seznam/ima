---
id: "RouteFactory"
title: "Class: RouteFactory"
sidebar_label: "RouteFactory"
sidebar_position: 0
custom_edit_url: null
---

Utility factory used by router to create routes.

## Constructors

### constructor

• **new RouteFactory**()

## Accessors

### $dependencies

• `Static` `get` **$dependencies**(): `never`[]

#### Returns

`never`[]

#### Defined in

[packages/core/src/router/RouteFactory.ts:11](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/RouteFactory.ts#L11)

## Methods

### createRoute

▸ **createRoute**(`name`, `pathExpression`, `controller`, `view`, `options?`): [`DynamicRoute`](DynamicRoute.md) \| [`StaticRoute`](StaticRoute.md)

Create new instance of ima.core.router.AbstractRoute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The unique name of this route, identifying it among        the rest of the routes in the application. |
| `pathExpression` | `string` \| `RoutePathExpression` | A path expression        specifying either the URL path part matching this route (must not\        contain a query string) with optionally containing named parameter        placeholders specified as `:parameterName`. Or object defining        matcher in form of regular expression and toPath and extractParameters        function overrides. |
| `controller` | `string` \| typeof [`Controller`](Controller.md) \| () => [`IController`](../interfaces/IController.md) | The full name of Object Container alias        identifying the controller associated with this route. |
| `view` | `unknown` | The full name or Object Container alias identifying        the view class associated with this route. |
| `options?` | [`RouteOptions`](../modules.md#routeoptions) | The route additional options. |

#### Returns

[`DynamicRoute`](DynamicRoute.md) \| [`StaticRoute`](StaticRoute.md)

The constructed route.

#### Defined in

[packages/core/src/router/RouteFactory.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/router/RouteFactory.ts#L33)
