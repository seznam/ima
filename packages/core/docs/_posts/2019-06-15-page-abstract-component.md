---
category: "page"
title: "AbstractComponent"
---

## *AbstractComponent*&nbsp;<a name="AbstractComponent" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L24" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The base class for all view components.

**Kind**: global abstract class  

* *[AbstractComponent](#AbstractComponent)*
    * *[new AbstractComponent(props, context)](#new_AbstractComponent_new)*
    * *[._utils](#AbstractComponent+_utils) : <code>Object.&lt;string, \*&gt;</code>*
    * *[.utils](#AbstractComponent+utils) ⇒ <code>Object.&lt;string, \*&gt;</code>*
    * *[.localize(key, [params])](#AbstractComponent+localize) ⇒ <code>string</code>*
    * *[.link(name, [params])](#AbstractComponent+link) ⇒ <code>string</code>*
    * *[.cssClasses(classRules, includeComponentClassName)](#AbstractComponent+cssClasses) ⇒ <code>string</code>*
    * *[.fire(eventName, [data])](#AbstractComponent+fire)*
    * *[.listen(eventTarget, eventName, listener)](#AbstractComponent+listen)*
    * *[.unlisten(eventTarget, eventName, listener)](#AbstractComponent+unlisten)*


* * *

### *new AbstractComponent(props, context)*&nbsp;<a name="new_AbstractComponent_new"></a>
Initializes the component.


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object.&lt;string, \*&gt;</code> | The component properties. |
| context | <code>Object.&lt;string, \*&gt;</code> | The component context. |


* * *

### *abstractComponent.\_utils : <code>Object.&lt;string, \*&gt;</code>*&nbsp;<a name="AbstractComponent+_utils" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L33" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The view utilities, initialized lazily upon first use from either
the context, or the component's props.

**Kind**: instance property of [<code>AbstractComponent</code>](#AbstractComponent)  

* * *

### *abstractComponent.utils ⇒ <code>Object.&lt;string, \*&gt;</code>*&nbsp;<a name="AbstractComponent+utils" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the utilities for the view components. The returned value is the
value bound to the <code>$Utils</code> object container constant.

**Kind**: instance property of [<code>AbstractComponent</code>](#AbstractComponent)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The utilities for the view components.  

* * *

### *abstractComponent.localize(key, [params]) ⇒ <code>string</code>*&nbsp;<a name="AbstractComponent+localize" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L60" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the localized phrase identified by the specified key. The
placeholders in the localization phrase will be replaced by the provided
values.

**Kind**: instance method of [<code>AbstractComponent</code>](#AbstractComponent)  
**Returns**: <code>string</code> - Localized phrase.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Localization key. |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | Values for replacing        the placeholders in the localization phrase. |


* * *

### *abstractComponent.link(name, [params]) ⇒ <code>string</code>*&nbsp;<a name="AbstractComponent+link" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L75" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates an absolute URL using the provided route name (see the
<code>app/config/routes.js</code> file). The provided parameters will
replace the placeholders in the route pattern, while the extraneous
parameters will be appended to the generated URL's query string.

**Kind**: instance method of [<code>AbstractComponent</code>](#AbstractComponent)  
**Returns**: <code>string</code> - The generated URL.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The route name. |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | Router parameters and        extraneous parameters to add to the URL as a query string. |


* * *

### *abstractComponent.cssClasses(classRules, includeComponentClassName) ⇒ <code>string</code>*&nbsp;<a name="AbstractComponent+cssClasses" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L99" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generate a string of CSS classes from the properties of the passed-in
object that resolve to true.

**Kind**: instance method of [<code>AbstractComponent</code>](#AbstractComponent)  
**Returns**: <code>string</code> - String of CSS classes that had their property resolved
        to <code>true</code>.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| classRules | <code>string</code> \| <code>Object.&lt;string, boolean&gt;</code> |  | CSS classes in a        string separated by whitespace, or a map of CSS class names to        boolean values. The CSS class name will be included in the result        only if the value is <code>true</code>. |
| includeComponentClassName | <code>boolean</code> | <code>false</code> |  |

**Example**  
```js
this.cssClasses('my-class my-class-modificator', true);
```
**Example**  
```js
this.cssClasses({
           'my-class': true,
           'my-class-modificator': this.props.modificator
       }, true);
```

* * *

### *abstractComponent.fire(eventName, [data])*&nbsp;<a name="AbstractComponent+fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates and sends a new IMA.js DOM custom event from this component.

**Kind**: instance method of [<code>AbstractComponent</code>](#AbstractComponent)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventName | <code>string</code> |  | The name of the event. |
| [data] | <code>\*</code> | <code></code> | Data to send within the event. |


* * *

### *abstractComponent.listen(eventTarget, eventName, listener)*&nbsp;<a name="AbstractComponent+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L123" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener for execution whenever an IMA.js
DOM custom event of the specified name occurs at the specified event
target.

**Kind**: instance method of [<code>AbstractComponent</code>](#AbstractComponent)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>React.Element</code> \| <code>EventTarget</code> | The react component or        event target at which the listener should listen for the event. |
| eventName | <code>string</code> | The name of the event for which to listen. |
| listener | <code>function</code> | The listener for event to register. |


* * *

### *abstractComponent.unlisten(eventTarget, eventName, listener)*&nbsp;<a name="AbstractComponent+unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.8/page/AbstractComponent.js#L136" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deregisters the provided event listener for an IMA.js DOM custom event
of the specified name at the specified event target.

**Kind**: instance method of [<code>AbstractComponent</code>](#AbstractComponent)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>React.Element</code> \| <code>EventTarget</code> | The react component or        event target at which the listener should listen for the event. |
| eventName | <code>string</code> | The name of the event for which to listen. |
| listener | <code>function</code> | The listener for event to register. |


* * *

