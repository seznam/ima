---
category: "dictionary"
title: "Dictionary"
---

## Dictionary&nbsp;<a name="Dictionary" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/Dictionary.js#L8" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Dictionary](#Dictionary)
    * [.init(config)](#Dictionary+init)
    * [.getLanguage()](#Dictionary+getLanguage) ⇒ <code>string</code>
    * [.get(key, [parameters])](#Dictionary+get) ⇒ <code>string</code>
    * [.has(key)](#Dictionary+has) ⇒ <code>boolean</code>


* * *

### dictionary.init(config)&nbsp;<a name="Dictionary+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/Dictionary.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes this dictionary with the provided language and localization
phrases.

**Kind**: instance method of [<code>Dictionary</code>](#Dictionary)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object.&lt;string, \*&gt;</code> | The dictionary configuration. |
| config.language | <code>string</code> | The language property is an ISO 639-1        language code specifying the language of the provided phrases. |
| config.dictionary | <code>\*</code> | The dictionary property contains the        localization phrases organized in an implementation-specific way. |


* * *

### dictionary.getLanguage() ⇒ <code>string</code>&nbsp;<a name="Dictionary+getLanguage" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/Dictionary.js#L28" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the ISO 639-1 language code of the language this dictionary was
initialized with.

**Kind**: instance method of [<code>Dictionary</code>](#Dictionary)  
**Returns**: <code>string</code> - The language code representing the language of the
        localization phrases in this dictionary.  

* * *

### dictionary.get(key, [parameters]) ⇒ <code>string</code>&nbsp;<a name="Dictionary+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/Dictionary.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the localization phrase identified by the specified key,
evaluates the phrase's placeholder expressions using the provided
parameters and returns the result.

**Kind**: instance method of [<code>Dictionary</code>](#Dictionary)  
**Returns**: <code>string</code> - The specified localization phrase with its placeholders
        evaluated using the provided parameters.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key identifying the localization phrase. |
| [parameters] | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The        map of parameter names to the parameter values to use.        Defaults to an empty plain object. |


* * *

### dictionary.has(key) ⇒ <code>boolean</code>&nbsp;<a name="Dictionary+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/Dictionary.js#L52" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the specified localization phrase exists in the
dictionary.

**Kind**: instance method of [<code>Dictionary</code>](#Dictionary)  
**Returns**: <code>boolean</code> - `true` if the key exists and denotes a single
                  localization phrase, otherwise `false`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key identifying the localization phrase. |


* * *

