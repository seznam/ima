---
category: "dictionary"
title: "MessageFormatDictionary"
---

## MessageFormatDictionary ⇐ <code>Dictionary</code>&nbsp;<a name="MessageFormatDictionary" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L10" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Implementation of the [Dictionary](Dictionary) interface that relies on
compiled MessageFormat localization messages for its dictionary.

**Kind**: global class  
**Extends**: <code>Dictionary</code>  

* [MessageFormatDictionary](#MessageFormatDictionary) ⇐ <code>Dictionary</code>
    * [new MessageFormatDictionary()](#new_MessageFormatDictionary_new)
    * [._language](#MessageFormatDictionary+_language) : <code>string</code>
    * [._dictionary](#MessageFormatDictionary+_dictionary) : <code>Object.&lt;string, Object.&lt;string, function(Object.&lt;string, (number\|string)&gt;): string&gt;&gt;</code>
    * [.init(config)](#MessageFormatDictionary+init)
    * [.getLanguage()](#MessageFormatDictionary+getLanguage)
    * [.get(key, [parameters])](#MessageFormatDictionary+get) ⇒ <code>string</code>
    * [.has(key)](#MessageFormatDictionary+has) ⇒ <code>boolean</code>


* * *

### new MessageFormatDictionary()&nbsp;<a name="new_MessageFormatDictionary_new"></a>
Initializes the dictionary.


* * *

### messageFormatDictionary.\_language : <code>string</code>&nbsp;<a name="MessageFormatDictionary+_language" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L30" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The language of the phrases in the dictionary, represented as a
ISO 639-1 language code.

**Kind**: instance property of [<code>MessageFormatDictionary</code>](#MessageFormatDictionary)  

* * *

### messageFormatDictionary.\_dictionary : <code>Object.&lt;string, Object.&lt;string, function(Object.&lt;string, (number\|string)&gt;): string&gt;&gt;</code>&nbsp;<a name="MessageFormatDictionary+_dictionary" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L43" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Stored dictionary.

**Kind**: instance property of [<code>MessageFormatDictionary</code>](#MessageFormatDictionary)  

* * *

### messageFormatDictionary.init(config)&nbsp;<a name="MessageFormatDictionary+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L64" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes this dictionary with the provided language and localization
phrases.

**Kind**: instance method of [<code>MessageFormatDictionary</code>](#MessageFormatDictionary)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object.&lt;string, \*&gt;</code> | The dictionary configuration. |
| config.language | <code>string</code> | The language property is an ISO 639-1        language code specifying the language of the provided phrases. |
| config.dictionary | <code>Object.&lt;string, Object.&lt;string, function(Object.&lt;string, (number\|string)&gt;): string&gt;&gt;</code> | The dictionary field contains the localization phrases organized        in a deep plain object map. The top-level key is the name of the        phrase group, the bottom-level key is the phrase key. The        bottom-level value is the localization phrase generator that        takes the phrase placeholder values map as an argument and        produces the localization phrase with its placeholders evaluated        using the provided placeholder values. |


* * *

### messageFormatDictionary.getLanguage()&nbsp;<a name="MessageFormatDictionary+getLanguage" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>MessageFormatDictionary</code>](#MessageFormatDictionary)  

* * *

### messageFormatDictionary.get(key, [parameters]) ⇒ <code>string</code>&nbsp;<a name="MessageFormatDictionary+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L92" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the localization phrase identified by the specified key,
evaluates the phrase's placeholder expressions using the provided
parameters and returns the result.

**Kind**: instance method of [<code>MessageFormatDictionary</code>](#MessageFormatDictionary)  
**Returns**: <code>string</code> - The specified localization phrase with its placeholders
        evaluated using the provided parameters.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key identifying the localization phrase. The key        consists of at least two parts separated by dots. The first part        denotes the name of the source JSON localization file, while the        rest denote a field path within the localization object within        the given localization file. |
| [parameters] | <code>Object.&lt;string, (boolean\|number\|string\|Date)&gt;</code> | The        map of parameter names to the parameter values to use.        Defaults to an empty plain object. |


* * *

### messageFormatDictionary.has(key) ⇒ <code>boolean</code>&nbsp;<a name="MessageFormatDictionary+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.5-0/dictionary/MessageFormatDictionary.js#L118" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Tests whether the specified localization phrase exists in the
dictionary.

**Kind**: instance method of [<code>MessageFormatDictionary</code>](#MessageFormatDictionary)  
**Returns**: <code>boolean</code> - `true` if the key exists and denotes a single
                  localization phrase, otherwise `false`.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key identifying the localization phrase. The key        consists of at least two parts separated by dots. The first part        denotes the name of the source JSON localization file, while the        rest denote a field path within the localization object within        the given localization file. |


* * *

