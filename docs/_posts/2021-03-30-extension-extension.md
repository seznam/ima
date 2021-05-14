---
category: "extension"
title: "API - Extension"
menuTitle: "Extension"
---

## Extension&nbsp;<a name="Extension" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L18" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
**Kind**: global interface  

* [Extension](#Extension)
    * [.init()](#Extension+init) ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>
    * [.destroy()](#Extension+destroy) ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>
    * [.activate()](#Extension+activate) ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>
    * [.deactivate()](#Extension+deactivate) ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>
    * [.load()](#Extension+load) ⇒ <code>Promise.&lt;Object.&lt;string, (Promise\|\*)&gt;&gt;</code> \| <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [.update([prevParams])](#Extension+update) ⇒ <code>Promise.&lt;Object.&lt;string, (Promise\|\*)&gt;&gt;</code> \| <code>Object.&lt;string, (Promise\|\*)&gt;</code>
    * [.setState(statePatch)](#Extension+setState)
    * [.getState()](#Extension+getState) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [.beginStateTransaction()](#Extension+beginStateTransaction)
    * [.commitStateTransaction()](#Extension+commitStateTransaction)
    * [.cancelStateTransaction()](#Extension+cancelStateTransaction)
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

### extension.init() ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>&nbsp;<a name="Extension+init" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for initializing the controller extension after the route
parameters have been set on this extension.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.destroy() ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>&nbsp;<a name="Extension+destroy" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L42" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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

### extension.activate() ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>&nbsp;<a name="Extension+activate" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for activating the extension in the UI. This is the last
method invoked during controller (and extensions) initialization, called
after all the promises returned from the [load](#Extension+load) method have
been resolved and the controller has configured the meta manager.

The extension may register any React and DOM event listeners in this
method. The extension may start receiving event bus event after this
method completes.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.deactivate() ⇒ <code>Promise.&lt;undefined&gt;</code> \| <code>undefined</code>&nbsp;<a name="Extension+deactivate" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L71" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Callback for deactivating the extension in the UI. This is the first
method invoked during extension deinitialization. This usually happens
when the user navigates to a different URL.

This method is the lifecycle counterpart of the [activate](#Extension+activate)
method.

The extension should deregister listeners registered and release all
resources obtained in the [activate](#Extension+activate) method.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.load() ⇒ <code>Promise.&lt;Object.&lt;string, (Promise\|\*)&gt;&gt;</code> \| <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="Extension+load" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L99" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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
**Returns**: <code>Promise.&lt;Object.&lt;string, (Promise\|\*)&gt;&gt;</code> \| <code>Object.&lt;string, (Promise\|\*)&gt;</code> - A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.  

* * *

### extension.update([prevParams]) ⇒ <code>Promise.&lt;Object.&lt;string, (Promise\|\*)&gt;&gt;</code> \| <code>Object.&lt;string, (Promise\|\*)&gt;</code>&nbsp;<a name="Extension+update" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L124" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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
**Returns**: <code>Promise.&lt;Object.&lt;string, (Promise\|\*)&gt;&gt;</code> \| <code>Object.&lt;string, (Promise\|\*)&gt;</code> - A map object of promises resolved when all resources the controller
        requires are ready. The resolved values will be pushed to the
        controller's state.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [prevParams] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | Previous route         parameters. |


* * *

### extension.setState(statePatch)&nbsp;<a name="Extension+setState" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L140" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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

### extension.getState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Extension+getState" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L147" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current state of the controller using this extension.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current state of the controller.  

* * *

### extension.beginStateTransaction()&nbsp;<a name="Extension+beginStateTransaction" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L156" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Starts queueing state patches off the controller state. While the transaction
is active every {@method setState} call has no effect on the current state.

Note that call to {@method getState} after the transaction has begun will
return state as it was before the transaction.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.commitStateTransaction()&nbsp;<a name="Extension+commitStateTransaction" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L162" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Applies queued state patches to the controller state. All patches are squashed
and applied with one {@method setState} call.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.cancelStateTransaction()&nbsp;<a name="Extension+cancelStateTransaction" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L167" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Cancels ongoing state transaction. Uncommited state changes are lost.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.setPartialState(partialStatePatch)&nbsp;<a name="Extension+setPartialState" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L177" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Patches the partial state of the extension. The extension is able
during its load and update phase receive state from active controller
using this extension and from previously loaded/updated extensions.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Description |
| --- | --- | --- |
| partialStatePatch | <code>Object.&lt;string, \*&gt;</code> | Patch of the controller's state to        apply. |


* * *

### extension.getPartialState() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Extension+getPartialState" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L184" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current partial state of the extension.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, \*&gt;</code> - The current partial state of the extension.  

* * *

### extension.clearPartialState()&nbsp;<a name="Extension+clearPartialState" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L189" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the current partial state of the extension and sets it value to empty object.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.setPageStateManager(pageStateManager)&nbsp;<a name="Extension+setPageStateManager" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L197" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the state manager used to manage the controller's state..

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Description |
| --- | --- | --- |
| pageStateManager | <code>PageStateManager</code> | The current state manager to        use. |


* * *

### extension.switchToStateManager()&nbsp;<a name="Extension+switchToStateManager" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L202" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Enables using PageStateManager for getting state.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.switchToPartialState()&nbsp;<a name="Extension+switchToPartialState" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L207" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Disables using PageStateManager for getting state.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

* * *

### extension.setRouteParams([params])&nbsp;<a name="Extension+setRouteParams" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L216" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the current route parameters. This method is invoked before the
[init](#Extension+init) method.

**Kind**: instance method of [<code>Extension</code>](#Extension)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [params] | <code>Object.&lt;string, string&gt;</code> | <code>{}</code> | The current route        parameters. |


* * *

### extension.getRouteParams() ⇒ <code>Object.&lt;string, string&gt;</code>&nbsp;<a name="Extension+getRouteParams" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L223" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the current route parameters.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Object.&lt;string, string&gt;</code> - The current route parameters.  

* * *

### extension.getAllowedStateKeys() ⇒ <code>Array.&lt;string&gt;</code>&nbsp;<a name="Extension+getAllowedStateKeys" href="https://github.com/seznam/ima/blob/v17.10.0/packages/core/src/extension/Extension.js#L232" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns the names of the state fields that may be manipulated by this
extension. Manipulations of other fields of the state will be ignored.

**Kind**: instance method of [<code>Extension</code>](#Extension)  
**Returns**: <code>Array.&lt;string&gt;</code> - The names of the state fields that may be manipulated
        by this extension.  

* * *

