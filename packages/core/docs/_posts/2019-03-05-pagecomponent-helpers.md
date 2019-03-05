---
category: "page"
title: "componentHelpers"
---

## Functions

<dl>
<dt><a href="#getContextTypes">getContextTypes(classConstructor)</a> ⇒ <code>Object.&lt;string, function(...*): boolean&gt;</code></dt>
<dd><p>Retrieves the context type declarations for the specified component.</p>
</dd>
<dt><a href="#setContextTypes">setContextTypes(classConstructor, contextTypes)</a> ⇒ <code>Object.&lt;string, function(...*): boolean&gt;</code></dt>
<dd><p>Overrides the previously associated context type declarations for the
specified component to the provided ones.</p>
</dd>
<dt><a href="#getUtils">getUtils(props, context)</a> ⇒ <code>Object.&lt;string, *&gt;</code></dt>
<dd><p>Retrieves the view utilities from the component&#39;s current context or
properties (preferring the context).</p>
</dd>
<dt><a href="#localize">localize(component, key, [params])</a> ⇒ <code>string</code></dt>
<dd><p>Returns the localized phrase identified by the specified key. The
placeholders in the localization phrase will be replaced by the provided
values.</p>
</dd>
<dt><a href="#link">link(component, name, [params])</a> ⇒ <code>string</code></dt>
<dd><p>Generates an absolute URL using the provided route name (see the
<code>app/config/routes.js</code> file). The provided parameters will
replace the placeholders in the route pattern, while the extraneous
parameters will be appended to the generated URL&#39;s query string.</p>
</dd>
<dt><a href="#cssClasses">cssClasses(component, classRules, includeComponentClassName)</a> ⇒ <code>string</code></dt>
<dd><p>Generate a string of CSS classes from the properties of the passed-in
object that resolve to <code>true</code>.</p>
</dd>
<dt><a href="#defaultCssClasses">defaultCssClasses(classRules, component)</a> ⇒ <code>string</code></dt>
<dd><p>Generate a string of CSS classes from the properties of the passed-in
object that resolve to <code>true</code>.</p>
</dd>
<dt><a href="#fire">fire(component, eventName, [data])</a></dt>
<dd><p>Creates and sends a new IMA.js DOM custom event from the provided component.</p>
</dd>
<dt><a href="#listen">listen(component, eventTarget, eventName, listener)</a></dt>
<dd><p>Registers the provided event listener for execution whenever an IMA.js
DOM custom event of the specified name occurs at the specified event
target.</p>
</dd>
<dt><a href="#unlisten">unlisten(component, eventTarget, eventName, listener)</a></dt>
<dd><p>Deregisters the provided event listener for an IMA.js DOM custom event
of the specified name at the specified event target.</p>
</dd>
</dl>

## getContextTypes(classConstructor) ⇒ <code>Object.&lt;string, function(...\*): boolean&gt;</code>&nbsp;<a name="getContextTypes" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L21" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the context type declarations for the specified component.

**Kind**: global function  
**Returns**: <code>Object.&lt;string, function(...\*): boolean&gt;</code> - The context type
        declarations associated with the specified component.  

| Param | Type | Description |
| --- | --- | --- |
| classConstructor | <code>function</code> | The        constructor of the react component. |


* * *

## setContextTypes(classConstructor, contextTypes) ⇒ <code>Object.&lt;string, function(...\*): boolean&gt;</code>&nbsp;<a name="setContextTypes" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Overrides the previously associated context type declarations for the
specified component to the provided ones.

**Kind**: global function  
**Returns**: <code>Object.&lt;string, function(...\*): boolean&gt;</code> - The provided context type
        declarations.  

| Param | Type | Description |
| --- | --- | --- |
| classConstructor | <code>function</code> | The        constructor of the react component. |
| contextTypes | <code>Object.&lt;string, function(...\*): boolean&gt;</code> | The new        context type declarations to associate with the specified component. |


* * *

## getUtils(props, context) ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="getUtils" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the view utilities from the component's current context or
properties (preferring the context).

**Kind**: global function  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The retrieved view utilities.  
**Throws**:

- Error Throw if the view utils cannot be located in the provided
        properties nor context.


| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object.&lt;string, \*&gt;</code> | The component's current properties. |
| context | <code>Object.&lt;string, \*&gt;</code> | The component's current context. |


* * *

## localize(component, key, [params]) ⇒ <code>string</code>&nbsp;<a name="localize" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L81" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the localized phrase identified by the specified key. The
placeholders in the localization phrase will be replaced by the provided
values.

**Kind**: global function  
**Returns**: <code>string</code> - Localized phrase.  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> | The component        requiring the localization. |
| key | <code>string</code> | Localization key. |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | Values for replacing the        placeholders in the localization phrase. |


* * *

## link(component, name, [params]) ⇒ <code>string</code>&nbsp;<a name="link" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L98" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generates an absolute URL using the provided route name (see the
<code>app/config/routes.js</code> file). The provided parameters will
replace the placeholders in the route pattern, while the extraneous
parameters will be appended to the generated URL's query string.

**Kind**: global function  
**Returns**: <code>string</code> - The generated URL.  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> | The component        requiring the generating of the URL. |
| name | <code>string</code> | The route name. |
| [params] | <code>Object.&lt;string, (number\|string)&gt;</code> | Router parameters and        extraneous parameters to add to the URL as a query string. |


* * *

## cssClasses(component, classRules, includeComponentClassName) ⇒ <code>string</code>&nbsp;<a name="cssClasses" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L123" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generate a string of CSS classes from the properties of the passed-in
object that resolve to <code>true</code>.

**Kind**: global function  
**Returns**: <code>string</code> - String of CSS classes that had their property resolved
        to <code>true</code>.  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> | The component        requiring the composition of the CSS class names. |
| classRules | <code>string</code> \| <code>Object.&lt;string, boolean&gt;</code> | CSS classes in a        string separated by whitespace, or a map of CSS class names to        boolean values. The CSS class name will be included in the result        only if the value is <code>true</code>. |
| includeComponentClassName | <code>boolean</code> |  |

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

## defaultCssClasses(classRules, component) ⇒ <code>string</code>&nbsp;<a name="defaultCssClasses" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L144" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Generate a string of CSS classes from the properties of the passed-in
object that resolve to <code>true</code>.

**Kind**: global function  
**Returns**: <code>string</code> - String of CSS classes that had their property resolved
        to <code>true</code>.  

| Param | Type | Description |
| --- | --- | --- |
| classRules | <code>string</code> \| <code>Object.&lt;string, boolean&gt;</code> | CSS classes in a        string separated by whitespace, or a map of CSS class names to        boolean values. The CSS class name will be included in the result        only if the value is <code>true</code>. |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> \| <code>string</code> | The component        requiring the composition of the CSS class names, if it has the        <code>className</code> property set and requires its inclusion this time. |


* * *

## fire(component, eventName, [data])&nbsp;<a name="fire" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L166" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates and sends a new IMA.js DOM custom event from the provided component.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> | The component        at which's root element the event will originate. |
| eventName | <code>string</code> | The name of the event. |
| [data] | <code>\*</code> | Data to send within the event. |


* * *

## listen(component, eventTarget, eventName, listener)&nbsp;<a name="listen" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L186" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Registers the provided event listener for execution whenever an IMA.js
DOM custom event of the specified name occurs at the specified event
target.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> | The component        requesting the registration of the event listener. |
| eventTarget | <code>React.Element</code> \| <code>EventTarget</code> | The react component or        event target at which the listener should listen for the event. |
| eventName | <code>string</code> | The name of the event for which to listen. |
| listener | <code>function</code> | The listener for event to register. |


* * *

## unlisten(component, eventTarget, eventName, listener)&nbsp;<a name="unlisten" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/page/componentHelpers.js#L206" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Deregisters the provided event listener for an IMA.js DOM custom event
of the specified name at the specified event target.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>AbstractComponent</code> \| <code>AbstractPureComponent</code> | The component        that requested the registration of the event listener. |
| eventTarget | <code>React.Element</code> \| <code>EventTarget</code> | The react component or        event target at which the listener should listen for the event. |
| eventName | <code>string</code> | The name of the event for which to listen. |
| listener | <code>function</code> | The listener for event to register. |


* * *

