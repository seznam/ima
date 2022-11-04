---
id: "Execution"
title: "Class: Execution"
sidebar_label: "Execution"
sidebar_position: 0
custom_edit_url: null
---

Execution is an abstract class that defines a standard for executing jobs.
The execution can be either done in serial or in parallel way.

When executing jobs in parallel an option should define how to deal with
a result of each individual job execution. One option would be to return the
result of a job that completes first. Second option is to return result of
all jobs once they're all complete.

For serial execution you should define an option that affects how arguments
passed to the `execute` method are distributed. They could be either
supplied to each job individually (thus meaning one job's mutation won't
affect another job) or they could be supplied to the first job and then
piped through other jobs.

## Hierarchy

- **`Execution`**

  ↳ [`AbstractExecution`](AbstractExecution.md)

## Constructors

### constructor

• **new Execution**()

## Methods

### append

▸ **append**(`jobs`): `void`

Adds a new job to be executed. The job is appended at the end of the
list of current jobs therefore is executed last.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jobs` | `Job`[] | The jobs to be executed. |

#### Returns

`void`

#### Defined in

[packages/core/src/execution/Execution.ts:27](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/Execution.ts#L27)

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

#### Defined in

[packages/core/src/execution/Execution.ts:38](https://github.com/seznam/ima/blob/16487954/packages/core/src/execution/Execution.ts#L38)
