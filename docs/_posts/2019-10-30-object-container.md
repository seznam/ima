---
category: "general"
title: "ObjectContainer"
---

## Classes

<dl>
<dt><a href="#ObjectContainer">ObjectContainer</a></dt>
<dd><p>The Object Container is an enhanced dependency injector with support for
aliases and constants, and allowing to reference classes in the application
namespace by specifying their fully qualified names.</p>
</dd>
<dt><a href="#Entry">Entry</a></dt>
<dd><p>Object container entry, representing either a class, interface, constant or
an alias.</p>
</dd>
</dl>

## ObjectContainer&nbsp;<a name="ObjectContainer" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L76" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The Object Container is an enhanced dependency injector with support for
aliases and constants, and allowing to reference classes in the application
namespace by specifying their fully qualified names.

**Kind**: global class  

* [ObjectContainer](#ObjectContainer)
    * [new ObjectContainer(namespace)](#new_ObjectContainer_new)
    * _instance_
        * [._namespace](#ObjectContainer+_namespace) : <code>ima.Namespace</code>
        * [._entries](#ObjectContainer+_entries) : <code>Map.&lt;(string\|function(new:\*, ...\*)\|function(...\*): \*), Entry.&lt;\*&gt;&gt;</code>
        * [._bindingState](#ObjectContainer+_bindingState) : <code>string</code>
        * [._bindingPlugin](#ObjectContainer+_bindingPlugin) : <code>string</code>
        * [.bind(name, classConstructor, [dependencies])](#ObjectContainer+bind) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)
        * [.constant(name, value)](#ObjectContainer+constant) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)
        * [.inject(classConstructor, dependencies)](#ObjectContainer+inject) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)
        * [.provide(interfaceConstructor, implementationConstructor, dependencies)](#ObjectContainer+provide) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)
        * [.get(name)](#ObjectContainer+get) ⇒ <code>T</code>
        * [.getConstructorOf(name)](#ObjectContainer+getConstructorOf) ⇒ <code>function</code>
        * [.has(name)](#ObjectContainer+has) ⇒ <code>boolean</code>
        * [.create(name, dependencies)](#ObjectContainer+create) ⇒ <code>T</code>
        * [.clear()](#ObjectContainer+clear) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)
        * [.setBindingState(bindingState, bindingPluginName)](#ObjectContainer+setBindingState)
        * [._getEntry(name)](#ObjectContainer+_getEntry) ⇒ <code>Entry.&lt;T&gt;</code>
        * [._updateEntryValues(classConstructor, entry, dependencies)](#ObjectContainer+_updateEntryValues)
        * [._createEntry(classConstructor, [dependencies], options)](#ObjectContainer+_createEntry) ⇒ <code>T</code>
        * [._createInstanceFromEntry(entry, [dependencies])](#ObjectContainer+_createInstanceFromEntry) ⇒ <code>T</code>
        * [._getEntryFromConstant(compositionName)](#ObjectContainer+_getEntryFromConstant) ⇒ <code>Entry.&lt;\*&gt;</code>
        * [._getEntryFromNamespace(path)](#ObjectContainer+_getEntryFromNamespace) ⇒ <code>Entry.&lt;T&gt;</code>
        * [._getEntryFromClassConstructor(classConstructor)](#ObjectContainer+_getEntryFromClassConstructor) ⇒ <code>Entry.&lt;T&gt;</code>
    * _static_
        * [.PLUGIN_BINDING_STATE](#ObjectContainer.PLUGIN_BINDING_STATE) ⇒ <code>string</code>
        * [.IMA_BINDING_STATE](#ObjectContainer.IMA_BINDING_STATE) ⇒ <code>string</code>
        * [.APP_BINDING_STATE](#ObjectContainer.APP_BINDING_STATE) ⇒ <code>string</code>


* * *

### new ObjectContainer(namespace)&nbsp;<a name="new_ObjectContainer_new"></a>
Initializes the object container.


| Param | Type | Description |
| --- | --- | --- |
| namespace | <code>ima.Namespace</code> | The namespace container, used to        access classes and values using their fully qualified names. |


* * *

### objectContainer.\_namespace : <code>ima.Namespace</code>&nbsp;<a name="ObjectContainer+_namespace" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L83" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The namespace container, used to access classes and values using
their fully qualified names.

**Kind**: instance property of [<code>ObjectContainer</code>](#ObjectContainer)  

* * *

### objectContainer.\_entries : <code>Map.&lt;(string\|function(new:\*, ...\*)\|function(...\*): \*), Entry.&lt;\*&gt;&gt;</code>&nbsp;<a name="ObjectContainer+_entries" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L89" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance property of [<code>ObjectContainer</code>](#ObjectContainer)  

* * *

### objectContainer.\_bindingState : <code>string</code>&nbsp;<a name="ObjectContainer+_bindingState" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L99" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current binding state.

The {@linkcode setBindingState()} method may be called for changing
object container binding state only by the bootstrap script.

**Kind**: instance property of [<code>ObjectContainer</code>](#ObjectContainer)  

* * *

### objectContainer.\_bindingPlugin : <code>string</code>&nbsp;<a name="ObjectContainer+_bindingPlugin" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The current plugin binding to OC.

The {@linkcode setBindingState()} method may be called for changing
object container binding state only by the bootstrap script.

**Kind**: instance property of [<code>ObjectContainer</code>](#ObjectContainer)  

* * *

### objectContainer.bind(name, classConstructor, [dependencies]) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)&nbsp;<a name="ObjectContainer+bind" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L133" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Binds the specified class or factory function and dependencies to the
specified alias. Binding a class or factory function to an alias allows
the class or function to be specied as a dependency by specifying the
alias and creating new instances by referring to the class or function
by the alias.

Also note that the same class or function may be bound to several
aliases and each may use different dependencies.

The alias will use the default dependencies bound for the class if no
dependencies are provided.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: [<code>ObjectContainer</code>](#ObjectContainer) - This object container.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Alias name. |
| classConstructor | <code>function</code> \| <code>function</code> | The        class constructor or a factory function. |
| [dependencies] | <code>Array.&lt;\*&gt;</code> | The dependencies to pass into the        constructor or factory function. |


* * *

### objectContainer.constant(name, value) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)&nbsp;<a name="ObjectContainer+constant" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L189" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Defines a new constant registered with this object container. Note that
this is the only way of passing <code>string</code> values to constructors
because the object container treats strings as class, interface, alias
or constant names.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: [<code>ObjectContainer</code>](#ObjectContainer) - This object container.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The constant name. |
| value | <code>\*</code> | The constant value. |


* * *

### objectContainer.inject(classConstructor, dependencies) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)&nbsp;<a name="ObjectContainer+inject" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L231" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Configures the object loader with the specified default dependencies for
the specified class.

New instances of the class created by this object container will receive
the provided dependencies into constructor unless custom dependencies
are provided.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: [<code>ObjectContainer</code>](#ObjectContainer) - This object container.  

| Param | Type | Description |
| --- | --- | --- |
| classConstructor | <code>function</code> | The class constructor. |
| dependencies | <code>Array.&lt;\*&gt;</code> | The dependencies to pass into the        constructor function. |


* * *

### objectContainer.provide(interfaceConstructor, implementationConstructor, dependencies) ⇒ [<code>ObjectContainer</code>](#ObjectContainer)&nbsp;<a name="ObjectContainer+provide" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L295" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Configures the default implementation of the specified interface to use
when an implementation provider of the specified interface is requested
from this object container.

The implementation constructor will obtain the provided default
dependencies or the dependencies provided to the <code>create()</code>
method.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: [<code>ObjectContainer</code>](#ObjectContainer) - This object container.  

| Param | Type | Description |
| --- | --- | --- |
| interfaceConstructor | <code>function</code> | The constructor        of the interface representing the service. |
| implementationConstructor | <code>function</code> | The constructor of the class implementing the service interface. |
| dependencies | <code>Array.&lt;\*&gt;</code> | The dependencies to pass into the        constructor function. |


* * *

### objectContainer.get(name) ⇒ <code>T</code>&nbsp;<a name="ObjectContainer+get" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L357" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the shared instance or value of the specified constant, alias,
class or factory function, interface, or fully qualified namespace path
(the method checks these in this order in case of a name clash).

The instance or value is created lazily the first time it is requested.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>T</code> - The shared instance or value.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>function</code> \| <code>function</code> | The name        of the alias, class, interface, or the class, interface or a        factory function. |


* * *

### objectContainer.getConstructorOf(name) ⇒ <code>function</code>&nbsp;<a name="ObjectContainer+getConstructorOf" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L375" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the class constructor function of the specified class.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>function</code> - The constructor function.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>function</code> | The name by which the class        is registered with this object container. |


* * *

### objectContainer.has(name) ⇒ <code>boolean</code>&nbsp;<a name="ObjectContainer+has" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L390" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns <code>true</code> if the specified object, class or resource is
registered with this object container.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>boolean</code> - <code>true</code> if the specified object, class or
        resource is registered with this object container.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>function</code> | The resource name. |


* * *

### objectContainer.create(name, dependencies) ⇒ <code>T</code>&nbsp;<a name="ObjectContainer+create" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L416" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates a new instance of the class or retrieves the value generated by
the factory function identified by the provided name, class, interface,
or factory function, passing in the provided dependencies.

The method uses the dependencies specified when the class, interface or
factory function has been registered with the object container if no
custom dependencies are provided.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>T</code> - Created instance or generated value.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>function</code> \| <code>function</code> | The name        of the alias, class, interface, or the class, interface or a        factory function to use. |
| dependencies | <code>Array.&lt;\*&gt;</code> | The dependencies to pass into the        constructor or factory function. |


* * *

### objectContainer.clear() ⇒ [<code>ObjectContainer</code>](#ObjectContainer)&nbsp;<a name="ObjectContainer+clear" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L428" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears all entries from this object container and resets the locking
mechanism of this object container.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: [<code>ObjectContainer</code>](#ObjectContainer) - This object container.  

* * *

### objectContainer.setBindingState(bindingState, bindingPluginName)&nbsp;<a name="ObjectContainer+setBindingState" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L441" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  

| Param | Type | Default |
| --- | --- | --- |
| bindingState | <code>string</code> |  | 
| bindingPluginName | <code>string</code> | <code>null</code> | 


* * *

### objectContainer.\_getEntry(name) ⇒ <code>Entry.&lt;T&gt;</code>&nbsp;<a name="ObjectContainer+_getEntry" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L479" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the entry for the specified constant, alias, class or factory
function, interface, or fully qualified namespace path (the method
checks these in this order in case of a name clash).

The method retrieves an existing entry even if a qualified namespace
path is provided (if the target class or interface has been configured
in this object container).

The method throws an <code>Error</code> if no such constant, alias,
registry, interface implementation is known to this object container and
the provided identifier is not a valid namespace path specifying an
existing class, interface or value.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>Entry.&lt;T&gt;</code> - The retrieved entry.  
**Throws**:

- <code>Error</code> If no such constant, alias, registry, interface
        implementation is known to this object container.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>function</code> | Name of a constant or alias,        factory function, class or interface constructor, or a fully        qualified namespace path. |


* * *

### objectContainer.\_updateEntryValues(classConstructor, entry, dependencies)&nbsp;<a name="ObjectContainer+_updateEntryValues" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L515" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The method update classConstructor and dependencies for defined entry.
The entry throw Error for constants and if you try override dependencies
more than once.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  

| Param | Type | Description |
| --- | --- | --- |
| classConstructor | <code>function</code> \| <code>function</code> | The        class constructor or factory function. |
| entry | [<code>Entry</code>](#Entry) | The entry representing the class that should        have its instance created or factory faction to use to create a        value. |
| dependencies | <code>Array.&lt;\*&gt;</code> | The dependencies to pass into the        constructor or factory function. |


* * *

### objectContainer.\_createEntry(classConstructor, [dependencies], options) ⇒ <code>T</code>&nbsp;<a name="ObjectContainer+_createEntry" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L532" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates a new entry for the provided class or factory function, the
provided dependencies and entry options.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>T</code> - Created instance or generated value.  

| Param | Type | Description |
| --- | --- | --- |
| classConstructor | <code>function</code> \| <code>function</code> | The        class constructor or factory function. |
| [dependencies] | <code>Array.&lt;\*&gt;</code> | The dependencies to pass into the        constructor or factory function. |
| options | <code>Object</code> |  |


* * *

### objectContainer.\_createInstanceFromEntry(entry, [dependencies]) ⇒ <code>T</code>&nbsp;<a name="ObjectContainer+_createInstanceFromEntry" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L565" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Creates a new instance of the class or retrieves the value generated by
the factory function represented by the provided entry, passing in the
provided dependencies.

The method uses the dependencies specified by the entry if no custom
dependencies are provided.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>T</code> - Created instance or generated value.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| entry | <code>Entry.&lt;T&gt;</code> |  | The entry representing the class that should        have its instance created or factory faction to use to create a        value. |
| [dependencies] | <code>Array.&lt;\*&gt;</code> | <code>[]</code> | The dependencies to pass into the        constructor or factory function. |


* * *

### objectContainer.\_getEntryFromConstant(compositionName) ⇒ <code>Entry.&lt;\*&gt;</code>&nbsp;<a name="ObjectContainer+_getEntryFromConstant" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L597" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the constant value denoted by the provided fully qualified
composition name.

The method returns the entry for the constant if the constant is registered
with this object container, otherwise return <code>null</code>.

Finally, if the constant composition name does not resolve to value,
the method return <code>null</code>.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>Entry.&lt;\*&gt;</code> - An entry representing the value at the specified
        composition name in the constants. The method returns <code>null</code>
        if the specified composition name does not exist in the constants.  

| Param | Type |
| --- | --- |
| compositionName | <code>string</code> | 


* * *

### objectContainer.\_getEntryFromNamespace(path) ⇒ <code>Entry.&lt;T&gt;</code>&nbsp;<a name="ObjectContainer+_getEntryFromNamespace" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L652" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the class denoted by the provided fully qualified name within
the application namespace.

The method then checks whether there are dependecies configured for the
class, no matter whether the class is an implementation class or an
"interface" class.

The method returns the entry for the class if the class is registered
with this object container, otherwise an unregistered entry is created
and returned.

Finally, if the namespace path does not resolve to a class, the method
return an unregistered entry resolved to the value denoted by the
namespace path.

Alternatively, if a constructor function is passed in instead of a
namespace path, the method returns <code>null</code>.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>Entry.&lt;T&gt;</code> - An entry representing the value or class at the
        specified path in the namespace. The method returns <code>null</code>
        if the specified path does not exist in the namespace.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> \| <code>function</code> | Namespace path pointing to        a class or a value in the application namespace, or a constructor        function. |


* * *

### objectContainer.\_getEntryFromClassConstructor(classConstructor) ⇒ <code>Entry.&lt;T&gt;</code>&nbsp;<a name="ObjectContainer+_getEntryFromClassConstructor" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L690" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Retrieves the class denoted by the provided class constructor.

The method then checks whether there are defined <code>$dependecies</code>
property for class. Then the class is registered to this object
container.

The method returns the entry for the class if the specified class
does not have defined <code>$dependencies</code> property return
<code>null</code>.

**Kind**: instance method of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>Entry.&lt;T&gt;</code> - An entry representing the value at the specified
        classConstructor. The method returns <code>null</code>
        if the specified classConstructor does not have defined
        <code>$dependencies</code>.  

| Param | Type |
| --- | --- |
| classConstructor | <code>function</code> | 


* * *

### ObjectContainer.PLUGIN\_BINDING\_STATE ⇒ <code>string</code>&nbsp;<a name="ObjectContainer.PLUGIN_BINDING_STATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns constant for plugin binding state.

When the object container is in plugin binding state, it is impossible
to register new aliases using the {@linkcode bind()} method and register
new constant using the {@linkcode constant()} method, or override the
default class dependencies of any already-configured class using the
{@linkcode inject()} method (classes that were not configured yet may be
configured using the {@linkcode inject()} method or {@linkcode provide()}
method).

This prevents the unpriviledged code (e.g. 3rd party plugins) from
overriding the default dependency configuration provided by ima, or
overriding the configuration of a 3rd party plugin by another 3rd party
plugin.

The application itself has always access to the unlocked object
container.

**Kind**: static property of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>string</code> - The plugin binding state.  

* * *

### ObjectContainer.IMA\_BINDING\_STATE ⇒ <code>string</code>&nbsp;<a name="ObjectContainer.IMA_BINDING_STATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L49" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns constant for IMA binding state.

When the object container is in ima binding state, it is possible
to register new aliases using the {@linkcode bind()} method and register
new constant using the {@linkcode constant()} method, or override the
default class dependencies of any already-configured class using the
{@linkcode inject()} method (classes that were not configured yet may be
configured using the {@linkcode inject()} method or {@linkcode provide()}
method).

**Kind**: static property of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>string</code> - The IMA binding state.  

* * *

### ObjectContainer.APP\_BINDING\_STATE ⇒ <code>string</code>&nbsp;<a name="ObjectContainer.APP_BINDING_STATE" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L66" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns constant for app binding state.

When the object container is in app binding state, it is possible
to register new aliases using the {@linkcode bind()} method and register
new constant using the {@linkcode constant()} method, or override the
default class dependencies of any already-configured class using the
{@linkcode inject()} method (classes that were not configured yet may be
configured using the {@linkcode inject()} method or {@linkcode provide()}
method).

**Kind**: static property of [<code>ObjectContainer</code>](#ObjectContainer)  
**Returns**: <code>string</code> - The app binding state.  

* * *

## Entry&nbsp;<a name="Entry" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L728" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Object container entry, representing either a class, interface, constant or
an alias.

**Kind**: global class  

* [Entry](#Entry)
    * [new Entry(classConstructor, [dependencies], referrer, [options])](#new_Entry_new)
    * [.classConstructor](#Entry+classConstructor) : <code>function</code> \| <code>function</code>
    * [.sharedInstance](#Entry+sharedInstance) : <code>T</code>
    * [._options](#Entry+_options) : <code>Object</code>
    * [._referrer](#Entry+_referrer) : <code>string</code>
    * [._dependencies](#Entry+_dependencies) : <code>Array.&lt;\*&gt;</code>
    * [._overrideCounter](#Entry+_overrideCounter) : <code>number</code>


* * *

### new Entry(classConstructor, [dependencies], referrer, [options])&nbsp;<a name="new_Entry_new"></a>
Initializes the entry.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| classConstructor | <code>function</code> \| <code>function</code> |  | The        class constructor or constant value getter. |
| [dependencies] | <code>Array.&lt;\*&gt;</code> | <code>[]</code> | The dependencies to pass into the        constructor function. |
| referrer | <code>string</code> |  | Reference to part of application that created        this entry. |
| [options] | <code>Object</code> |  | The Entry options. |


* * *

### entry.classConstructor : <code>function</code> \| <code>function</code>&nbsp;<a name="Entry+classConstructor" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L735" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The constructor of the class represented by this entry, or the
getter of the value of the constant represented by this entry.

**Kind**: instance property of [<code>Entry</code>](#Entry)  

* * *

### entry.sharedInstance : <code>T</code>&nbsp;<a name="Entry+sharedInstance" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L742" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The shared instance of the class represented by this entry.

**Kind**: instance property of [<code>Entry</code>](#Entry)  

* * *

### entry.\_options : <code>Object</code>&nbsp;<a name="Entry+_options" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L749" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The Entry options.

**Kind**: instance property of [<code>Entry</code>](#Entry)  

* * *

### entry.\_referrer : <code>string</code>&nbsp;<a name="Entry+_referrer" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L759" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Reference to part of application that created
this entry.

**Kind**: instance property of [<code>Entry</code>](#Entry)  

* * *

### entry.\_dependencies : <code>Array.&lt;\*&gt;</code>&nbsp;<a name="Entry+_dependencies" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L767" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Dependencies of the class constructor of the class represented by
this entry.

**Kind**: instance property of [<code>Entry</code>](#Entry)  

* * *

### entry.\_overrideCounter : <code>number</code>&nbsp;<a name="Entry+_overrideCounter" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/ObjectContainer.js#L774" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The override counter

**Kind**: instance property of [<code>Entry</code>](#Entry)  

* * *

