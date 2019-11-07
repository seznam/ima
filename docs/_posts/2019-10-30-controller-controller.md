---
category: "controller"
title: "Controller"
---

## Controller&nbsp;<a name="Controller" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L9" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Controller](#Controller)
    * [.init()](#Controller+init)
    * [.destroy()](#Controller+destroy)
    * [.activate()](#Controller+activate)
    * [.deactivate()](#Controller+deactivate)
    * [.load()](#Controller+load) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [.update([prevParams])](#Controller+update) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [.setState(statePatch)](#Controller+setState)
    * [.getState()](#Controller+getState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.addExtension(extension)](#Controller+addExtension) ⇒ [<code>Controller</code>](#Controller)
    * [.getExtensions()](#Controller+getExtensions) ⇒ <code>Array.&lt;Extension&gt;</code>
    * [.setMetaParams(loadedResources, metaManager, router, dictionary, settings)](#Controller+setMetaParams)
    * [.setRouteParams([params])](#Controller+setRouteParams)
    * [.getRouteParams()](#Controller+getRouteParams) ⇒ <code>Object.&lt;string, string&gt;</code>
    * [.setPageStateManager(pageStateManager)](#Controller+setPageStateManager)
    * [.getHttpStatus()](#Controller+getHttpStatus) ⇒ <code>number</code>


* * *

### controller.init()&nbsp;<a name="Controller+init" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L14" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for initializing the controller after the route parameters have
been set on this controller.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

* * *

### controller.destroy()&nbsp;<a name="Controller+destroy" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L29" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Finalization callback, called when the controller is being discarded by
the application. This usually happens when the user navigates to a
different URL.

This method is the lifecycle counterpart of the [init](#Controller+init)
method.

The controller should release all resources obtained in the
[init](#Controller+init) method. The controller must release any resources
that might not be released automatically when the controller's instance
is destroyed by the garbage collector.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

* * *

### controller.activate()&nbsp;<a name="Controller+activate" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L41" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for activating the controller in the UI. This is the last
method invoked during controller initialization, called after all the
promises returned from the [load](#Controller+load) method have been
resolved and the controller has configured the meta manager.

The controller may register any React and DOM event listeners in this
method. The controller may start receiving event bus event after this
method completes.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

* * *

### controller.deactivate()&nbsp;<a name="Controller+deactivate" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L54" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for deactivating the controller in the UI. This is the first
method invoked during controller deinitialization. This usually happens
when the user navigates to a different URL.

This method is the lifecycle counterpart of the
[activate](#Controller+activate) method.

The controller should deregister listeners registered and release all
resources obtained in the [activate](#Controller+activate) method.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

* * *

### controller.load() ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="Controller+load" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L91" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback the controller uses to request the resources it needs to render
its view. This method is invoked after the [init](#Controller+init)
method.

The controller should request all resources it needs in this method, and
represent each resource request as a promise that will resolve once the
resource is ready for use (these can be data fetched over HTTP(S),
database connections, etc).

The method must return a plain flat object. The field names of the
object identify the resources being fetched and prepared, each value
must be either the resource (e.g. view configuration or a value
retrieved synchronously) or a Promise that will resolve to the resource.

The IMA will use the object to set the state of the controller.

If at the server side, the IMA will wait for all the promises to
resolve, replaces the promises with the resolved values and sets the
resulting object as the controller's state.

If at the client side, the IMA will first set the controller's state to
an object containing only the fields of the returned object that were
not promises. IMA will then update the controller's state every time a
promise of the returned object resolves. IMA will update the state by
adding the resolved resource to the controller's state.

Any returned promise that gets rejected will redirect the application to
the error page. The error page that will be used depends on the status
code of the error.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: <code>Object.&lt;string, (Promise\|\*)&gt;</code> - A map object of promises
        resolved when all resources the controller requires are ready.
        The resolved values will be pushed to the controller's state.  

* * *

### controller.update([prevParams]) ⇒ <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="Controller+update" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L115" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for updating the controller after a route update. This method
is invoked if the current route has the `onlyUpdate` flag set to `true` and
the current controller and view match those used by the previously active
route, or, the `onlyUpdate` option of the current route is a callback and
returned `true`.

The method must return an object with the same semantics as the result
of the [load](#Controller+load) method. The controller's state will only
be patched by the returned object instead of replacing it completely.

The other controller lifecycle callbacks ([init](#Controller+init),
[load](#Controller+load), [activate](#Controller+activate),
[deactivate](#Controller+deactivate), [Controller#deinit](Controller#deinit)) are not call
in case this method is used.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: <code>Object.&lt;string, (Promise\|\*)&gt;</code> - A map object of promises
        resolved when all resources the controller requires are ready.
        The resolved values will be pushed to the controller's state.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [prevParams] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | Previous route        parameters. |


* * *

### controller.setState(statePatch)&nbsp;<a name="Controller+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L137" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Patches the state of this controller using the provided object by
copying the provided patch object fields to the controller's state
object.

You can use this method to modify the state partially or add new fields
to the state object.

Note that the state is not patched recursively but by replacing the
values of the top-level fields of the state object.

Once the promises returned by the [load](#Controller+load) method are
resolved, this method is called with the an object containing the
resolved values. The field names of the passed object will match the
field names in the object returned from the [load](#Controller+load)
method.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

| Param | Type | Description |
| --- | --- | --- |
| statePatch | <code>Object.&lt;string, \*&gt;</code> | Patch of the controller's state to        apply. |


* * *

### controller.getState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Controller+getState" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L144" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the controller's current state.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current state of this controller.  

* * *

### controller.addExtension(extension) ⇒ [<code>Controller</code>](#Controller)&nbsp;<a name="Controller+addExtension" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L154" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Adds the provided extension to this controller. All extensions should be
added to the controller before the [init](#Controller+init) method is
invoked.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: [<code>Controller</code>](#Controller) - This controller.  

| Param | Type | Description |
| --- | --- | --- |
| extension | <code>Extension</code> | The extension to add to this controller. |


* * *

### controller.getExtensions() ⇒ <code>Array.&lt;Extension&gt;</code>&nbsp;<a name="Controller+getExtensions" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L161" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the controller's extensions.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: <code>Array.&lt;Extension&gt;</code> - The extensions added to this controller.  

* * *

### controller.setMetaParams(loadedResources, metaManager, router, dictionary, settings)&nbsp;<a name="Controller+setMetaParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L178" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback used to configure the meta attribute manager. The method is
called after the the controller's state has been patched with the all
loaded resources and the view has been rendered.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

| Param | Type | Description |
| --- | --- | --- |
| loadedResources | <code>Object.&lt;string, \*&gt;</code> | A plain object representing a        map of resource names to resources loaded by the        [load](#Controller+load) method. This is the same object as the one        passed to the [setState](#Controller+setState) method. |
| metaManager | <code>MetaManager</code> | Meta attributes manager to configure. |
| router | <code>Router</code> | The current application router. |
| dictionary | <code>Dictionary</code> | The current localization dictionary. |
| settings | <code>Object.&lt;string, \*&gt;</code> | The application settings for the        current application environment. |


* * *

### controller.setRouteParams([params])&nbsp;<a name="Controller+setRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L186" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the current route parameters. This method is invoked before the
[init](#Controller+init) method.

**Kind**: instance method of [<code>Controller</code>](#Controller)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [params] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | The current route parameters. |


* * *

### controller.getRouteParams() ⇒ <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="Controller+getRouteParams" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L193" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current route parameters.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: <code>Object.&lt;string, string&gt;</code> - The current route parameters.  

* * *

### controller.setPageStateManager(pageStateManager)&nbsp;<a name="Controller+setPageStateManager" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L205" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the page state manager. The page state manager manages the
controller's state. The state manager can be set to `null` if this
controller loses the right to modify the state of the current page (e.g.
the user has navigated to a different route using a different
controller).

**Kind**: instance method of [<code>Controller</code>](#Controller)  

| Param | Type | Description |
| --- | --- | --- |
| pageStateManager | <code>PageStateManager</code> | The current state manager to        use. |


* * *

### controller.getHttpStatus() ⇒ <code>number</code>&nbsp;<a name="Controller+getHttpStatus" href="https://github.com/seznam/IMA.js-core/tree/0.16.11/controller/Controller.js#L213" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the HTTP status code to send to the client, should the
controller be used at the server-side.

**Kind**: instance method of [<code>Controller</code>](#Controller)  
**Returns**: <code>number</code> - The HTTP status code to send to the client.  

* * *

