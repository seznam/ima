---
id: "PageFactory"
title: "Class: PageFactory"
sidebar_label: "PageFactory"
sidebar_position: 0
custom_edit_url: null
---

Factory for page.

## Constructors

### constructor

• **new PageFactory**(`oc`)

Factory used by page management classes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `oc` | [`ObjectContainer`](ObjectContainer.md) |

#### Defined in

[packages/core/src/page/PageFactory.ts:26](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageFactory.ts#L26)

## Properties

### \_oc

• **\_oc**: [`ObjectContainer`](ObjectContainer.md)

The current application object container.

#### Defined in

[packages/core/src/page/PageFactory.ts:21](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageFactory.ts#L21)

## Methods

### createController

▸ **createController**(`controller`, `options?`): [`AbstractController`](AbstractController.md)

Create new instance of [Controller](Controller.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | `string` \| [`IController`](../interfaces/IController.md) |
| `options` | [`RouteOptions`](../modules.md#routeoptions) |

#### Returns

[`AbstractController`](AbstractController.md)

#### Defined in

[packages/core/src/page/PageFactory.ts:33](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageFactory.ts#L33)

___

### createView

▸ **createView**(`view`): `Function`

Retrieves the specified react component class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `view` | `unknown` | The namespace        referring to a react component class, or a react component class        constructor. |

#### Returns

`Function`

The react component class
        constructor.

#### Defined in

[packages/core/src/page/PageFactory.ts:85](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageFactory.ts#L85)

___

### decorateController

▸ **decorateController**(`controller`): [`ControllerDecorator`](ControllerDecorator.md)

Returns decorated controller for ease setting seo params in controller.

#### Parameters

| Name | Type |
| :------ | :------ |
| `controller` | [`IController`](../interfaces/IController.md) |

#### Returns

[`ControllerDecorator`](ControllerDecorator.md)

#### Defined in

[packages/core/src/page/PageFactory.ts:105](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageFactory.ts#L105)

___

### decoratePageStateManager

▸ **decoratePageStateManager**(`pageStateManager`, `allowedStateKeys`): [`PageStateManagerDecorator`](PageStateManagerDecorator.md)

Returns decorated page state manager for extension.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageStateManager` | [`PageStateManager`](PageStateManager.md) |
| `allowedStateKeys` | `string`[] |

#### Returns

[`PageStateManagerDecorator`](PageStateManagerDecorator.md)

#### Defined in

[packages/core/src/page/PageFactory.ts:125](https://github.com/seznam/ima/blob/16487954/packages/core/src/page/PageFactory.ts#L125)
