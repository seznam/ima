---
category: "execution"
title: "AbstractExecution"
---

## *AbstractExecution ⇐ <code>Execution</code>*&nbsp;<a name="AbstractExecution" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/execution/AbstractExecution.js#L13" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Basic implementation of the [Execution](Execution) interface. Provides the basic
functionality for appending and validating jobs.

**Kind**: global abstract class  
**Extends**: <code>Execution</code>  

* *[AbstractExecution](#AbstractExecution) ⇐ <code>Execution</code>*
    * *[.append()](#AbstractExecution+append)*
    * *[.execute()](#AbstractExecution+execute)*
    * *[._validateJob(job)](#AbstractExecution+_validateJob) ⇒ <code>boolean</code>*


* * *

### *abstractExecution.append()*&nbsp;<a name="AbstractExecution+append" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/execution/AbstractExecution.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExecution</code>](#AbstractExecution)  

* * *

### *abstractExecution.execute()*&nbsp;<a name="AbstractExecution+execute" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/execution/AbstractExecution.js#L34" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>AbstractExecution</code>](#AbstractExecution)  

* * *

### *abstractExecution.\_validateJob(job) ⇒ <code>boolean</code>*&nbsp;<a name="AbstractExecution+_validateJob" href="https://github.com/seznam/IMA.js-core/tree/0.16.2/execution/AbstractExecution.js#L48" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return <code>true</code> if the given job can be executed

**Kind**: instance method of [<code>AbstractExecution</code>](#AbstractExecution)  
**Access**: protected  

| Param | Type |
| --- | --- |
| job | <code>function</code> | 


* * *

