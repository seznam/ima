---
id: "AbstractExecution"
title: "Class: AbstractExecution"
sidebar_label: "AbstractExecution"
sidebar_position: 0
custom_edit_url: null
---

Basic implementation of the [Execution](Execution.md) interface. Provides the basic
functionality for appending and validating jobs.

## Hierarchy

- [`Execution`](Execution.md)

  ↳ **`AbstractExecution`**

  ↳↳ [`SerialBatch`](SerialBatch.md)

## Constructors

### constructor

• **new AbstractExecution**(`jobs?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `jobs` | `Job`[] | `[]` |

#### Overrides

[Execution](Execution.md).[constructor](Execution.md#constructor)

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L15)

## Properties

### \_jobs

• `Protected` **\_jobs**: `Job`[]

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L13)

## Methods

### \_validateJob

▸ **_validateJob**(`job`): `boolean`

Return `true` if the given job can be executed

#### Parameters

| Name | Type |
| :------ | :------ |
| `job` | `Job` |

#### Returns

`boolean`

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:45](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L45)

___

### append

▸ **append**(`jobs`): `void`

Adds a new job to be executed. The job is appended at the end of the
list of current jobs therefore is executed last.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobs` | `Job` \| `Job`[] | The jobs to be executed. |

#### Returns

`void`

#### Overrides

[Execution](Execution.md).[append](Execution.md#append)

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L24)

___

### execute

▸ **execute**(...`args`): `Promise`<`unknown`\>

Start executing collected jobs. In the end a `Promise` is returned
with a resulting value. On the returned `Promise` a `catch`
method can be called to prevent any unwanted interruption.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...args` | `unknown`[] | Arguments to be passed when executing jobs |

#### Returns

`Promise`<`unknown`\>

#### Overrides

[Execution](Execution.md).[execute](Execution.md#execute)

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:35](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L35)
