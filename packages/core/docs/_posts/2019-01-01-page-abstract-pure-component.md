---
category: "page"
title: "AbstractPureComponent"
---

## *AbstractPureComponent*&nbsp;<a name="AbstractPureComponent" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L18" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The base class for all pure (state-less) view components.

Unlike the "regular" components, pure components do not have any external
state, and therefore are pure functions of their props and state. This
allows for some nice optimizations on react's part (see the link).

Because of this, this class does not provide all the APIs provided by the
{@linkcode AbstractComponent} class (e.g. <code>listen</code>) as there is next
to none use of them with pure components.

**Kind**: global abstract class  
**See**: https://facebook.github.io/react/docs/react-api.html#react.purecomponent  

* *[AbstractPureComponent](#AbstractPureComponent)*
    * *[new AbstractPureComponent(props, context)](#new_AbstractPureComponent_new)*
    * *[._utils](#AbstractPureComponent+_utils) : <code>Object.&lt;string, \*&gt;</code>*
    * *[.utils](#AbstractPureComponent+utils) ⇒ <code>Object.&lt;string, \*&gt;</code>*
    * *[.localize(key, [params])](#AbstractPureComponent+localize) ⇒ <code>string</code>*
    * *[.link(name, [params])](#AbstractPureComponent+link) ⇒ <code>string</code>*
    * *[.cssClasses(classRules, includeComponentClassName)](#AbstractPureComponent+cssClasses) ⇒ <code>string</code>*
    * *[.fire(eventName, [data])](#AbstractPureComponent+fire)*
    * *[.listen(eventTarget, eventName, listener)](#AbstractPureComponent+listen)*
    * *[.unlisten(eventTarget, eventName, listener)](#AbstractPureComponent+unlisten)*


* * *

### *new AbstractPureComponent(props, context)*&nbsp;<a name="new_AbstractPureComponent_new"></a>
Initializes the component.


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object.&lt;string, \*&gt;</code> | The component properties. |
| context | <code>Object.&lt;string, \*&gt;</code> | The component context. |


* * *

### *abstractPureComponent.\_utils : <code>Object.&lt;string, \*&gt;</code>*&nbsp;<a name="AbstractPureComponent+_utils" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The view utilities, initialized lazily upon first use from either
the context, or the component's props.

**Kind**: instance property of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  

* * *

### *abstractPureComponent.utils ⇒ <code>Object.&lt;string, \*&gt;</code>*&nbsp;<a name="AbstractPureComponent+utils" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L51" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the utilities for the view components. The returned value is the
value bound to the <code>$Utils</code> object container constant.

**Kind**: instance property of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The utilities for the view components.  

* * *

### *abstractPureComponent.localize(key, [params]) ⇒ <code>string</code>*&nbsp;<a name="AbstractPureComponent+localize" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L69" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the localized phrase identified by the specified key. The
placeholders in the localization phrase will be replaced by the provided
values.

**Kind**: instance method of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  
**Returns**: <code>string</code> - Localized phrase.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Localization key. |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | Values for replacing        the placeholders in the localization phrase. |


* * *

### *abstractPureComponent.link(name, [params]) ⇒ <code>string</code>*&nbsp;<a name="AbstractPureComponent+link" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L84" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates an absolute URL using the provided route name (see the
<code>app/config/routes.js</code> file). The provided parameters will
replace the placeholders in the route pattern, while the extraneous
parameters will be appended to the generated URL's query string.

**Kind**: instance method of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  
**Returns**: <code>string</code> - The generated URL.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The route name. |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | Router parameters and        extraneous parameters to add to the URL as a query string. |


* * *

### *abstractPureComponent.cssClasses(classRules, includeComponentClassName) ⇒ <code>string</code>*&nbsp;<a name="AbstractPureComponent+cssClasses" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L108" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generate a string of CSS classes from the properties of the passed-in
object that resolve to true.

**Kind**: instance method of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  
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

### *abstractPureComponent.fire(eventName, [data])*&nbsp;<a name="AbstractPureComponent+fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L118" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates and sends a new IMA.js DOM custom event from this component.

**Kind**: instance method of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| eventName | <code>string</code> |  | The name of the event. |
| [data] | <code>\*</code> | <code></code> | Data to send within the event. |


* * *

### *abstractPureComponent.listen(eventTarget, eventName, listener)*&nbsp;<a name="AbstractPureComponent+listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L132" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener for execution whenever an IMA.js
DOM custom event of the specified name occurs at the specified event
target.

**Kind**: instance method of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>React.Element</code> \| <code>EventTarget</code> | The react component or        event target at which the listener should listen for the event. |
| eventName | <code>string</code> | The name of the event for which to listen. |
| listener | <code>function</code> | The listener for event to register. |


* * *

### *abstractPureComponent.unlisten(eventTarget, eventName, listener)*&nbsp;<a name="AbstractPureComponent+unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.0/page/AbstractPureComponent.js#L145" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deregisters the provided event listener for an IMA.js DOM custom event
of the specified name at the specified event target.

**Kind**: instance method of [<code>AbstractPureComponent</code>](#AbstractPureComponent)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>React.Element</code> \| <code>EventTarget</code> | The react component or        event target at which the listener should listen for the event. |
| eventName | <code>string</code> | The name of the event for which to listen. |
| listener | <code>function</code> | The listener for event to register. |


* * *

