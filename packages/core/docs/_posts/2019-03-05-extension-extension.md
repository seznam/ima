---
category: "extension"
title: "Extension"
---

## Extension&nbsp;<a name="Extension" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L18" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  
- [Why use extensions](#why-use-extensions)
- [How to use extensions](#how-to-use-extensions)

----

Extensions provide means of extending the page controllers with additional
managed state and logic. An extension has access to the current route 
parameters, can specify the resources to load when the page is loading or 
being updated, may intercept event bus events and modify the state of the 
page just like an ordinary controller, except that the modifications are 
restricted to the state fields which the extension explicitly specifies 
using its `getAllowedStateKeys()` method.

## Why use extensions

Best case to use extension is a component that 
requires interception of controller lifecycle events and/or loading external 
data.

Putting the component's logic inside the controller would be unwise for 3 
reasons:

1. Controller would contain code that is not as clear. For new-commers to 
your project it'd seem strange why you're mixing e.g. **HomeController** 
logic with **GalleryComponent** logic.
2. Component file and its extension file should be kept together because nothing is 
bigger pain than searching for related code in the whole project structure.
3. Component can be used in multiple Views. That means you'd have to 
copy & paste the same logic to multiple controllers.

## How to use extensions

As mentioned above, the extension file should be next to a file of the component
it's extending. For example:

```
app/
  ├─ ...
  ├─ component
  |   ├─ ...
  |   └─ gallery
  |   |   ├─ Gallery.jsx
  |   |   ├─ gallery.less
  |   |   └─ GalleryExtension.js
  |   └─ ...
  └─ ...
```

In the extension file should be plain `class` extending 
`ima/extension/AbstractExtension` with the same methods as you'd use in the controller. In addition you should implement `getAllowedStateKeys()` method which returns array of keys the extension is allowed to change in controller's state.

> **Note:** List and description of controller methods can be seen in [Controller lifecycle](Controller-lifecycle).

```javascript
// app/component/gallery/GalleryExtension.js
import AbstractExtension from 'ima/extension/AbstractExtension';

export default class GalleryExtension extends AbstractExtension {

  load() {
    // Where the magic happens...
  }
}
```

All extensions to be used on a page must be added to the current controller
via `addExtension()` method before the controller is initialized (Good 
place for that is the [`init()`](Controller-lifecycle#init--serverclient) method). After that, the extensions will go 
through the same lifecycle as the controller.

> **Note:** Controller and extension methods are called in a series but the controller methods are called first.

```javascript
import AbstractController from 'ima/controller/AbstractController';
import GalleryExtension from 'app/component/gallery/GalleryExtension';

export default class PostController extends AbstractController {
  
  init() {
    this.addExtension(GalleryExtension);
  }
}

```


* [Extension](#Extension)
    * [.init()](#Extension+init)
    * [.destroy()](#Extension+destroy)
    * [.activate()](#Extension+activate)
    * [.deactivate()](#Extension+deactivate)
    * [.load()](#Extension+load) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [.update([prevParams])](#Extension+update) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [.setState(statePatch)](#Extension+setState)
    * [.getState()](#Extension+getState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.setPartialState(partialStatePatch)](#Extension+setPartialState)
    * [.getPartialState()](#Extension+getPartialState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.clearPartialState()](#Extension+clearPartialState)
    * [.setPageStateManager(pageStateManager)](#Extension+setPageStateManager)
    * [.switchToStateManager()](#Extension+switchToStateManager)
    * [.switchToPartialState()](#Extension+switchToPartialState)
    * [.setRouteParams([params])](#Extension+setRouteParams)
    * [.getRouteParams()](#Extension+getRouteParams) ⇒ <code>Object.&lt;string, string&gt;</code>
    * [.getAllowedStateKeys()](#Extension+getAllowedStateKeys) ⇒ <code>Array.&lt;string&gt;</code>


* * *

### extension.init()&nbsp;<a name="Extension+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L23" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for initializing the controller extension after the route
parameters have been set on this extension.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.destroy()&nbsp;<a name="Extension+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L38" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Finalization callback, called when the controller is being discarded by
the application. This usually happens when the user navigates to a
different URL.

This method is the lifecycle counterpart of the [init](#Extension+init)
method.

The extension should release all resources obtained in the
[init](#Extension+init) method. The extension must release any resources
that might not be released automatically when the extensions's instance
is destroyed by the garbage collector.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.activate()&nbsp;<a name="Extension+activate" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L50" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for activating the extension in the UI. This is the last
method invoked during controller (and extensions) initialization, called
after all the promises returned from the [load](#Extension+load) method have
been resolved and the controller has configured the meta manager.

The extension may register any React and DOM event listeners in this
method. The extension may start receiving event bus event after this
method completes.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.deactivate()&nbsp;<a name="Extension+deactivate" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L63" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for deactivating the extension in the UI. This is the first
method invoked during extension deinitialization. This usually happens
when the user navigates to a different URL.

This method is the lifecycle counterpart of the [activate](#Extension+activate)
method.

The extension should deregister listeners registered and release all
resources obtained in the [activate](#Extension+activate) method.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.load() ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="Extension+load" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L90" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback the extension uses to request the resources it needs to render
its related parts of the view. This method is invoked after the
[init](#Extension+init) method.

The extension should request all resources it needs in this method, and
represent each resource request as a promise that will resolve once the
resource is ready for use (these can be data fetched over HTTP(S),
database connections, etc).

The method must return a plain flat object. The field names of the
object identify the resources being fetched and prepared, each value
must be either the resource (e.g. view configuration or a value
retrieved synchronously) or a Promise that will resolve to the resource.

The IMA will use the object to set the state of the controller.

Any returned promise that gets rejected will redirect the application to
the error page. The error page that will be used depends on the status
code of the error.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, (Promise\|\*)&gt;</code> - A map object of promises
        resolved when all resources the extension requires are ready.
        The resolved values will be pushed to the controller's state.  

* * *

### extension.update([prevParams]) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="Extension+update" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L114" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for updating the extension after a route update. This method
is invoked if the current route has the `onlyUpdate` flag set to `true` and
the current controller and view match those used by the previously active
route, or, the `onlyUpdate` option of the current route is a callback and
returned `true`.

The method must return an object with the same semantics as the result
of the [load](#Extension+load) method. The controller's state will then be
patched by the returned object.

The other extension lifecycle callbacks ([init](#Extension+init),
[load](#Extension+load), [activate](#Extension+activate),
[deactivate](#Extension+deactivate), [Extension#deinit](Extension#deinit)) are not call in
case this method is used.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, (Promise\|\*)&gt;</code> - A map object of promises
        resolved when all resources the extension requires are ready.
        The resolved values will be pushed to the controller's state.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [prevParams] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | Previous route        parameters. |


* * *

### extension.setState(statePatch)&nbsp;<a name="Extension+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L130" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Patches the state of the controller using this extension by using the
provided object by copying the provided patch object fields to the
controller's state object.

Note that the state is not patched recursively but by replacing the
values of the top-level fields of the state object.

Note that the extension may modify only the fields of the state that it
has specified by its [getAllowedStateKeys](#Extension+getAllowedStateKeys) method.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Description |
| --- | --- | --- |
| statePatch | <code>Object.&lt;string, \*&gt;</code> | Patch of the controller's state to        apply. |


* * *

### extension.getState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Extension+getState" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L137" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current state of the controller using this extension.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current state of the controller.  

* * *

### extension.setPartialState(partialStatePatch)&nbsp;<a name="Extension+setPartialState" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L147" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Patches the partial state of the extension. The extension is able
during its load and update phase receive state from active controller
using this extension and from previously loaded/updated extensions.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Description |
| --- | --- | --- |
| partialStatePatch | <code>Object.&lt;string, \*&gt;</code> | Patch of the controller's state to        apply. |


* * *

### extension.getPartialState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Extension+getPartialState" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L154" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current partial state of the extension.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current partial state of the extension.  

* * *

### extension.clearPartialState()&nbsp;<a name="Extension+clearPartialState" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L159" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the current partial state of the extension and sets it value to empty object.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.setPageStateManager(pageStateManager)&nbsp;<a name="Extension+setPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L167" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the state manager used to manage the controller's state..

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Description |
| --- | --- | --- |
| pageStateManager | <code>PageStateManager</code> | The current state manager to        use. |


* * *

### extension.switchToStateManager()&nbsp;<a name="Extension+switchToStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L172" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Enables using PageStateManager for getting state.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.switchToPartialState()&nbsp;<a name="Extension+switchToPartialState" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L177" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Disables using PageStateManager for getting state.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.setRouteParams([params])&nbsp;<a name="Extension+setRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L186" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the current route parameters. This method is invoked before the
[init](#Extension+init) method.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [params] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | The current route        parameters. |


* * *

### extension.getRouteParams() ⇒ <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="Extension+getRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L193" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current route parameters.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, string&gt;</code> - The current route parameters.  

* * *

### extension.getAllowedStateKeys() ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="Extension+getAllowedStateKeys" href="https://github.com/seznam/IMA.js-core/tree/0.16.4/extension/Extension.js#L202" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the names of the state fields that may be manipulated by this
extension. Manipulations of other fields of the state will be ignored.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Array.&lt;string&gt;</code> - The names of the state fields that may be manipulated
        by this extension.  

* * *

