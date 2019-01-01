---
category: "page/renderer"
title: "PageRenderer"
---

## PageRenderer&nbsp;<a name="PageRenderer" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/page/renderer/PageRenderer.js#L5" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The page renderer is a utility for rendering the page at either the
client-side or the server-side, handling the differences in the environment.

**Kind**: global class  

* [PageRenderer](#PageRenderer)
    * [.mount(controller, view, pageResources, routeOptions)](#PageRenderer+mount) ⇒ <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, ?&gt;}&gt;</code>
    * [.update(controller, resourcesUpdate)](#PageRenderer+update) ⇒ <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, \*&gt;}&gt;</code>
    * [.unmount()](#PageRenderer+unmount)
    * [.setState([state])](#PageRenderer+setState)
    * [.clearState()](#PageRenderer+clearState)


* * *

### pageRenderer.mount(controller, view, pageResources, routeOptions) ⇒ <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, ?&gt;}&gt;</code>&nbsp;<a name="PageRenderer+mount" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/page/renderer/PageRenderer.js#L60" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Renders the page using the provided controller and view. The actual
behavior of this method differs at the client-side and the at
server-side in the following way:

At the server, the method first waits for all the resources to load, and
then renders the page to a string containing HTML markup to send to the
client.

At the client, the method uses the already available resources to render
the page into DOM, re-using the DOM created from the HTML markup send by
the server if possible. After this the method will re-render the page
every time another resource being loaded finishes its loading and
becomes available.

Note that the method renders the page at the client-side only after all
resources have been loaded if this is the first time this method is
invoked at the client.

**Kind**: instance method of [<code>PageRenderer</code>](#PageRenderer)  
**Returns**: <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, ?&gt;}&gt;</code> - A promise that will resolve to information about the
        rendered page. The <code>status</code> will contain the HTTP status
        code to send to the client (at the server side) or determine the
        type of error page to navigate to (at the client side).
        The <code>content</code> field will contain the rendered markup of
        the page at the server-side, or <code>null</code> at the client-side.  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>Controller</code> | The current page controller. |
| view | <code>React.Component</code> | The page's view. |
| pageResources | <code>Object.&lt;string, (\*\|Promise.&lt;\*&gt;)&gt;</code> | The resources for        the view loaded by the controller. |
| routeOptions | <code>Object</code> | The current route options. |


* * *

### pageRenderer.update(controller, resourcesUpdate) ⇒ <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, \*&gt;}&gt;</code>&nbsp;<a name="PageRenderer+update" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/page/renderer/PageRenderer.js#L86" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Handles update of the current route that does not replace the current
controller and view.

The method will use the already available resource to update the
controller's state and the view immediately. After that, the method will
update the controller's state and view with every resource that becomes
resolved.

**Kind**: instance method of [<code>PageRenderer</code>](#PageRenderer)  
**Returns**: <code>Promise.&lt;{status: number, content: ?string, pageState: Object.&lt;string, \*&gt;}&gt;</code> - A promise that will resolve to information about the
        rendered page. The <code>status</code> will contain the HTTP status
        code to send to the client (at the server side) or determine the
        type of error page to navigate to (at the client side).
        The <code>content</code> field will contain the rendered markup of
        the page at the server-side, or <code>null</code> at the client-side.  

| Param | Type | Description |
| --- | --- | --- |
| controller | <code>Controller</code> | The current page controller. |
| resourcesUpdate | <code>Object.&lt;string, (\*\|Promise.&lt;\*&gt;)&gt;</code> | The resources        that represent the update the of current state according to the        current route and its parameters. |


* * *

### pageRenderer.unmount()&nbsp;<a name="PageRenderer+unmount" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/page/renderer/PageRenderer.js#L93" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Unmounts the view from the DOM.

This method has no effect at the server-side.

**Kind**: instance method of [<code>PageRenderer</code>](#PageRenderer)  

* * *

### pageRenderer.setState([state])&nbsp;<a name="PageRenderer+setState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/page/renderer/PageRenderer.js#L103" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Sets the provided state to the currently rendered view.

This method has no effect at the server-side.

**Kind**: instance method of [<code>PageRenderer</code>](#PageRenderer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [state] | <code>Object.&lt;string, \*&gt;</code> | <code>{}</code> | The state to set to the currently        rendered view. |


* * *

### pageRenderer.clearState()&nbsp;<a name="PageRenderer+clearState" href="https://github.com/seznam/IMA.js-core/tree/0.16.0-alpha.11/page/renderer/PageRenderer.js#L110" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Clears the state to the currently rendered view.

This method has no effect at the server-side.

**Kind**: instance method of [<code>PageRenderer</code>](#PageRenderer)  

* * *

