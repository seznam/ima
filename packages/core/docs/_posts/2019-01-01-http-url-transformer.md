---
category: "http"
title: "UrlTransformer"
---

## UrlTransformer&nbsp;<a name="UrlTransformer" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/http/UrlTransformer.js#L4" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Utility for transforming URLs according to the configured replacement rules.

**Kind**: global class  

* [UrlTransformer](#UrlTransformer)
    * [new UrlTransformer()](#new_UrlTransformer_new)
    * [._rules](#UrlTransformer+_rules) : <code>Object.&lt;string, string&gt;</code>
    * [.addRule(pattern, replacement)](#UrlTransformer+addRule) ⇒ [<code>UrlTransformer</code>](#UrlTransformer)
    * [.clear()](#UrlTransformer+clear) ⇒ [<code>UrlTransformer</code>](#UrlTransformer)
    * [.transform(str)](#UrlTransformer+transform) ⇒ <code>string</code>


* * *

### new UrlTransformer()&nbsp;<a name="new_UrlTransformer_new"></a>
Initializes the URL transformer.


* * *

### urlTransformer.\_rules : <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="UrlTransformer+_rules" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/http/UrlTransformer.js#L16" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>UrlTransformer</code>](#UrlTransformer)  

* * *

### urlTransformer.addRule(pattern, replacement) ⇒ [<code>UrlTransformer</code>](#UrlTransformer)&nbsp;<a name="UrlTransformer+addRule" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/http/UrlTransformer.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Adds the provided replacement rule to the rules used by this URL
transformer.

**Kind**: instance method of [<code>UrlTransformer</code>](#UrlTransformer)  
**Returns**: [<code>UrlTransformer</code>](#UrlTransformer) - This transformer.  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | Regexp patter to look for (must be escaped as if        for use in the {@linkcode Regexp} constructor). |
| replacement | <code>string</code> | The replacement of the matched patter in any        matched URL. |


* * *

### urlTransformer.clear() ⇒ [<code>UrlTransformer</code>](#UrlTransformer)&nbsp;<a name="UrlTransformer+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/http/UrlTransformer.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears all rules.

**Kind**: instance method of [<code>UrlTransformer</code>](#UrlTransformer)  
**Returns**: [<code>UrlTransformer</code>](#UrlTransformer) - This transformer.  

* * *

### urlTransformer.transform(str) ⇒ <code>string</code>&nbsp;<a name="UrlTransformer+transform" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/http/UrlTransformer.js#L54" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Applies all rules registered with this URL transformer to the provided
URL and returns the result. The rules will be applied in the order they
were registered.

**Kind**: instance method of [<code>UrlTransformer</code>](#UrlTransformer)  
**Returns**: <code>string</code> - Transformed URL.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The URL for transformation. |


* * *

