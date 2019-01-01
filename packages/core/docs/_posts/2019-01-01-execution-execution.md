---
category: "execution"
title: "Execution"
---

## Execution&nbsp;<a name="Execution" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/execution/Execution.js#L18" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Execution](#Execution)
    * [.append(jobs)](#Execution+append)
    * [.execute(...args)](#Execution+execute) ⇒ <code>Promise</code>


* * *

### execution.append(jobs)&nbsp;<a name="Execution+append" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/execution/Execution.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Adds a new job to be executed. The job is appended at the end of the
list of current jobs therefore is executed last.

**Kind**: instance method of [<code>Execution</code>](#Execution)  

| Param | Type | Description |
| --- | --- | --- |
| jobs | <code>Array.&lt;function(): Promise&gt;</code> | The jobs to be executed. |


* * *

### execution.execute(...args) ⇒ <code>Promise</code>&nbsp;<a name="Execution+execute" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/execution/Execution.js#L35" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Start executing collected jobs. In the end a <code>Promise</code> is returned
with a resulting value. On the returned <code>Promise</code> a <code>catch</code>
method can be called to prevent any unwanted interruption.

**Kind**: instance method of [<code>Execution</code>](#Execution)  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | Arguments to be passed when executing jobs |


* * *

