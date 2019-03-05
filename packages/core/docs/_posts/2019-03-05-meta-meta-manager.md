---
category: "meta"
title: "MetaManager"
---

## MetaManager&nbsp;<a name="MetaManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L19" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [MetaManager](#MetaManager)
    * [.setTitle(title)](#MetaManager+setTitle)
    * [.getTitle()](#MetaManager+getTitle) ⇒ <code>string</code>
    * [.setMetaName(name, value)](#MetaManager+setMetaName)
    * [.getMetaName(name)](#MetaManager+getMetaName) ⇒ <code>string</code>
    * [.getMetaNames()](#MetaManager+getMetaNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.setMetaProperty(name, value)](#MetaManager+setMetaProperty)
    * [.getMetaProperty(name)](#MetaManager+getMetaProperty) ⇒ <code>string</code>
    * [.getMetaProperties()](#MetaManager+getMetaProperties) ⇒ <code>Array.&lt;string&gt;</code>
    * [.setLink(relation, reference)](#MetaManager+setLink)
    * [.getLink(relation)](#MetaManager+getLink) ⇒ <code>string</code>
    * [.getLinks()](#MetaManager+getLinks) ⇒ <code>Array.&lt;string&gt;</code>


* * *

### metaManager.setTitle(title)&nbsp;<a name="MetaManager+setTitle" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the page title.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The new page title. |


* * *

### metaManager.getTitle() ⇒ <code>string</code>&nbsp;<a name="MetaManager+getTitle" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L37" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the page title. The method returns an empty string if no page
title has been set yet.

Note that the page title is cached internally by the meta manager and
may therefore differ from the current document title if it has been
modified by a 3rd party code.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  
**Returns**: <code>string</code> - The current page title.  

* * *

### metaManager.setMetaName(name, value)&nbsp;<a name="MetaManager+setMetaName" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L46" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Set the specified named meta information property.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Meta information property name, for example        <code>keywords</code>. |
| value | <code>string</code> | The meta information value. |


* * *

### metaManager.getMetaName(name) ⇒ <code>string</code>&nbsp;<a name="MetaManager+getMetaName" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L57" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the value of the specified named meta information property. The
method returns an empty string for missing meta information (to make the
returned value React-friendly).

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  
**Returns**: <code>string</code> - The value of the generic meta information, or an empty
        string.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the named meta information property. |


* * *

### metaManager.getMetaNames() ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="MetaManager+getMetaNames" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the names of the currently specified named meta information
properties.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  
**Returns**: <code>Array.&lt;string&gt;</code> - The names of the currently specified named meta
        information properties.  

* * *

### metaManager.setMetaProperty(name, value)&nbsp;<a name="MetaManager+setMetaProperty" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L74" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the specified specialized meta information property.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the specialized meta information property. |
| value | <code>string</code> | The value of the meta information property. |


* * *

### metaManager.getMetaProperty(name) ⇒ <code>string</code>&nbsp;<a name="MetaManager+getMetaProperty" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the value of the specified specialized meta information
property. The method returns an empty string for missing meta
information (to make the returned value React-friendly).

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  
**Returns**: <code>string</code> - The value of the specified meta information, or an
        empty string.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the specialized meta information        property. |


* * *

### metaManager.getMetaProperties() ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="MetaManager+getMetaProperties" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L95" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the names of the currently specified specialized meta
information properties.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  
**Returns**: <code>Array.&lt;string&gt;</code> - The names of the currently specified specialized meta
        information properties.  

* * *

### metaManager.setLink(relation, reference)&nbsp;<a name="MetaManager+setLink" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L105" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the specified specialized link information.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  

| Param | Type | Description |
| --- | --- | --- |
| relation | <code>string</code> | The relation of the link target to the current        page. |
| reference | <code>string</code> | The reference to the location of the related        document, e.g. a URL. |


* * *

### metaManager.getLink(relation) ⇒ <code>string</code>&nbsp;<a name="MetaManager+getLink" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L117" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Return the reference to the specified related linked document. The
method returns an empty string for missing meta information (to make the
returned value React-friendly).

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  
**Returns**: <code>string</code> - The reference to the location of the related document,
        e.g. a URL.  

| Param | Type | Description |
| --- | --- | --- |
| relation | <code>string</code> | The relation of the link target to the current        page. |


* * *

### metaManager.getLinks() ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="MetaManager+getLinks" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/meta/MetaManager.js#L125" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the relations of the currently set related documents linked to
the current page.

**Kind**: instance method of [<code>MetaManager</code>](#MetaManager)  

* * *

