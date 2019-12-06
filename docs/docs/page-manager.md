---
layout: "docs"
---

Page Manager is an essential part of IMA.js. It's something like a puppeteer that manipulates with pages and views. Once a router matches URL to one of route's path the page manager takes care of the rest.

<div class="image is-padded-with-shadow">
  <img src="{{ '/img/docs/diagram-page-manager.png?v=' | append: site.github.build_revision | relative_url }}" />
</div>

## Managing process

If the new matched route has [`onlyUpdate` option](/docs/routing#4-options) set to `true` and the controller and view hasn't changed the route transition is dispatched only through [`update` method](/docs/controller-lifecycle#update-client) of the controller.

In every other case the manager goes through it's full process:

1. **Unload previous controller and extensions** - To make room for the new, manager has to get rid of the old controller and extensions. First calls [`deactivate` method](/docs/controller-lifecycle#deactivate-client) on every extension registered in the old controller and then the same method on the controller itself.
Same process follows with [`destroy` method](/docs/controller-lifecycle#destroy-client).

2. **Clear state and unmount view** - After unloading controller and extensions the page state is cleared and view (starting from [ManagedRootView](/docs/rendering-process#managedrootview)) is unmounted. However if the [DocumentView](/docs/rendering-process#documentview), [ViewAdapter](/docs/rendering-process#viewadapter) and [ManagedRootView](/docs/rendering-process#managedrootview) are the same for the new route the view is cleared rather then unmounted. This way you can achieve component persistency.

3. **Loading new controller and extensions** - After the manager is done with clearing previous resource it initialises the new ones. First the [`init` method](/docs/controller-lifecycle#init-serverclient) is called on controller then on every extension (Extensions may [be initialised](/docs/extensions#how-to-use-extensions) during the controllers `init` method call).
When the initialisation is complete manager starts loading resources via `load` method of the controller and extensions. For detailed explanation see the [`load` method documentation](/docs/controller-lifecycle#load-serverclient).

4. **Rendering new view** - After the `load` method has been called a view for the controller is rendered. It doesn't matter if all promises returned by the `load` method have been resolved. The process of handling promises is described in the [`load` method documentation](/docs/controller-lifecycle#load-serverclient).  Following rendering process is described on a page [Rendering process](/docs/rendering-process) and [View & Components](/docs/views-and-components).

## Intervene into the process

It's possible for you to intervene into the process before it starts and after it finished. One way is to listen to [`BEFORE_HANDLE_ROUTE`](/docs/events#built-in-events) and [`AFTER_HANDLE_ROUTE`](/docs/events#built-in-events) dispatcher events. However from inside event listeners you cannot intercept or modify the process. For this purpose we've introduced PageManagerHandlers in [v16](/docs/migration-0.16.0)

### PageManagerHandlers

PageManagerHandler is a simple class that extends `ima/page/handler/PageHandler`. It can obtain dependencies through [dependency injection](/docs/object-container#1-dependency-injection). Each handler should contain 4 methods:

#### 1. `init()` method
For purpose of initialising.

#### 2. `handlePreManagedState()` method
This method is called before the page manager start taking any action. It receives 3 arguments `managedPage`, `nextManagedPage` and `action`. `managedPage` holds information about current page, `nextManagedPage` about following page. Each of the "managed page" arguments has following shape: 

```javascript
{
  controller: ?(string|function(new: Controller)), // controller class
  controllerInstance: ?Controller, // instantiated controller
  decoratedController: ?Controller, // controller decorator created from controller instance
  view: ?React.Component, // view class/component
  viewInstance: ?React.Element, // instantiated view
  route: ?Route, // matched route that leads to the controller
  options: ?RouteOptions, // route options
  params: ?Object<string, string>, // route parameters and their values 
  state: {
    activated: boolean // if the page has been activated
  }
}
```
and finally the `action` is an object describing what triggered the routing. If a `PopStateEvent` triggered the routing the action object will look like this: `{ type: 'popstate', event: PopStateEvent }` otherwise the `event` property will contain `MouseEvent` (e.g. clicked on a link) and `type` property will have value `'redirect'`, `'click'` or `'error'`.

#### 3. `handlePostManagedState()` method

This method is a counterpart to `handlePreManagedState()` method. It's called after page transition is finished. It receives similar arguments (`managedPage`, `previousManagedPage` and `action`). `previousManagedPage` holds information about previous page.

> **Note:** `handlePreManagedState()` and `handlePostManagedState()` methods can interrupt transition process by throwing an error. The thrown error should be instance of [`GenericError`](/docs/errors) with a status code specified. That way the router can handle thrown error accordingly.

#### 4. `destroy()` method
For purpose of destructing

## Registering PageManagerHandlers

PageManagerHandlers have their own registry **PageHandlerRegistry**. Every handler you create should be registered as a dependency of this registry. 

```javascript
// app/config/bind.js
import { PageHandlerRegistry, Window } from '@ima/core';
import MyOwnHandler from 'app/handler/MyOwnHandler';

export let init = (ns, oc, config) => {
  // ...

  if (oc.get(Window).isClient()) { // register different handlers for client and server
    oc.inject(PageHandlerRegistry, [MyOwnHandler]);
  } else {
    oc.inject(PageHandlerRegistry, []);
  }
};
```

> **Note:** Handlers are executed in series and each one waits for the previous one to complete its task.

## PageNavigationHandler

With introduction of PageManagerHandlers in [v16](/docs/migration-0.16.0) we've moved some functionality to predefined handler [**PageNavigationHandler**](https://github.com/seznam/ima/blob/master/packages/core/src/page/handler/PageNavigationHandler.js). This handler takes care of saving scroll position, restoring scroll position and settings browser's address bar URL. You're free to extend it, override it or whatever else you want.

PageNavigationHandler is registered by default, but when you register your own handlers you need to specify PageNavigationHandler as well.

```javascript
import { PageHandlerRegistry, PageNavigationHandler } from '@ima/core';
import MyOwnHandler from 'app/handler/MyOwnHandler';

export let init = (ns, oc, config) => {
  // ...
  oc.inject(PageHandlerRegistry, [PageNavigationHandler, MyOwnHandler]);
};
```




