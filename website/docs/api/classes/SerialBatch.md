---
id: "SerialBatch"
title: "Class: SerialBatch"
sidebar_label: "SerialBatch"
sidebar_position: 0
custom_edit_url: null
---

Basic implementation of the [Execution](Execution.md) interface. Provides the basic
functionality for appending and validating jobs.

## Hierarchy

- [`AbstractExecution`](AbstractExecution.md)

  ↳ **`SerialBatch`**

## Constructors

### constructor

• **new SerialBatch**(`jobs?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `jobs` | `Job`[] | `[]` |

#### Inherited from

[AbstractExecution](AbstractExecution.md).[constructor](AbstractExecution.md#constructor)

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:15](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L15)

## Properties

### \_jobs

• `Protected` **\_jobs**: `Job`[]

#### Inherited from

[AbstractExecution](AbstractExecution.md).[_jobs](AbstractExecution.md#_jobs)

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:13](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L13)

## Methods

### \_executeJob

▸ **_executeJob**(`stage`, `args`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `stage` | `Job` |
| `args` | `unknown`[] |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/core/src/execution/SerialBatch.ts:22](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/SerialBatch.ts#L22)

___

### \_validateJob

▸ **_validateJob**(`job`): `boolean`

Return `true` if the given job can be executed

#### Parameters

| Name | Type |
| :------ | :------ |
| `job` | `Job` |

#### Returns

`boolean`

#### Inherited from

[AbstractExecution](AbstractExecution.md).[_validateJob](AbstractExecution.md#_validatejob)

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

#### Inherited from

[AbstractExecution](AbstractExecution.md).[append](AbstractExecution.md#append)

#### Defined in

[packages/core/src/execution/AbstractExecution.ts:24](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/AbstractExecution.ts#L24)

___

### execute

▸ **execute**(...`args`): `Promise`<`any`[]\>

Start executing collected jobs. In the end a `Promise` is returned
with a resulting value. On the returned `Promise` a `catch`
method can be called to prevent any unwanted interruption.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...args` | `unknown`[] | Arguments to be passed when executing jobs |

#### Returns

`Promise`<`any`[]\>

#### Overrides

[AbstractExecution](AbstractExecution.md).[execute](AbstractExecution.md#execute)

#### Defined in

[packages/core/src/execution/SerialBatch.ts:8](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/SerialBatch.ts#L8)
