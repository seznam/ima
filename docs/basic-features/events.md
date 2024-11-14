---
title: Events
description: Basic features > EventBus and Dispatcher
---

Major part of development in JavaScript relies on **events**. It's easy solution to
notify distant instances or React elements scattered across the DOM tree.

To ease the pain that comes with events, I**MA.js provides a two utilities that
take care of firing and receiving events**. Each one with a different style.

## EventBus
The `ima/event/EventBus` allows your UI components to emit custom DOM events
that naturally propagate through the DOM tree representing the tree of your UI
components.

This is used to notify the parent components of user interaction with
custom controls in your UI, or to notify the page Controller/Extension itself.

The custom events may have any name and carry arbitrary data that are not
restricted to JSON-serializable values.

### Firing EventBus events

`EventBus` can be used in View and Components via `fire()` method that is
inherited from `ima/page/AbstractComponent`.

```jsx
// app/component/expandable/ExpandLink.jsx

onClick(event) {
  const { expandableId } = this.props;
  this.fire('expand', { expandableId }); // this will be stopped by ExpandableWrapper
}

render() {
  return (
  <button onClick = { event => this.onClick(event) }>
    { this.props.children }
  </button>
  );
}
```

### Listening to EventBus events

The opposite for the `fire()` method is `listen()` and `unlisten()`. First
argument for the `listen()` and `unlisten()` method is an element the listener
will be bound to. It can be either DOM element or a React Component that is
mounted in the DOM tree.

```jsx
// app/component/expandable/ExpandableWrapper.jsx

constructor() {
  this._expandListener = this._expandWrapper.bind(this);
}

componentDidMount() {
  this.listen(this, 'expand', this._expandListener);
}

componentWillUnmount() {
  this.unlisten(this, 'expand', this._expandListener);
}

_expandWrapper(event) {
  if (event.data.expandableId !== this.expandableId) {
  return; // this expand event is not meant for us.
  }

  // Do to propagate the event further.
  event.stopPropagation();

  // Do the expand!
}

render() {
  return (
  <div className = 'expandWrapper'>
    // ... ExpandLink can be nested any level deep. Otherwise we could use simple props callback
    <ExpandLink expandableId = { this.expandableId }>
    See more
    </ExpandLink>
  </div>
  );
}
```

Furthermore, the Controllers and Extensions can easily listen for the events dispatched using
the `EventBus` *(unless the propagation of the event is stopped by a component
half the way)* by declaring event listener methods.

An event listener method is a method of a controller/extension named by the **first-letter
capitalized event name with the `on` prefix**, for example the `formSubmitted`
event can be listened for by defining the `onFormSubmitted()` method on your
controller.

The first argument passed into the controller's or extension's event listener method will be
the event data, **not the event object itself**, as manipulating the event object
once it reaches the controller/extension is pointless.

```javascript
// app/page/article/ArticleController.js

onExpand({ expandableId }) {
  // Event never reaches this point because we issued
  // event.stopPropagation() in ExpandableWrapper.jsx
}
```

You can restrict the controller/extension to specific events by setting the `$name` static field
on the controller/extension class. Events with this specific prefix are then applied only to
this controller/extension.

```javascript
// app/page/article/ArticleController.js

static $name = 'ArticleController';

onExpand({ expandableId }) {
  // Event never reaches this point because we issued
  // event.stopPropagation() in ExpandableWrapper.jsx
}

// app/component/expandable/ExpandLink.jsx

onClick(event) {
  const { expandableId } = this.props;
  this.fire('ArticleController.expand', { expandableId });
}
```

## Dispatcher
The obvious limitation of the `ima/event/EventBus` API is that it only allows
to create events that propagate up the tree of the UI components. The common
way to propagate event in other directions, or to other parts of the UI, or
from the controller to the UI is using the `app/event/Dispatcher` API.

**Accessing Dispatcher in Controllers** is easy with [Dependency Injection](./object-container.md#1-dependency-injection).
**To access Dispatcher from Views and Components** you should register it in [ComponentUtils](./views-and-components.md#utilities-shared-across-views-and-components).

```javascript
// app/config/bind.js
import { Dispatcher } from '@ima/core';

export let init = (ns, oc, config) => {
  const ComponentUtils = oc.get('$ComponentUtils');

  ComponentUtils.register({
  $Dispatcher: Dispatcher
  });
}
```


### Firing and listening to Dispatcher events
The Dispatcher allows any UI component and controller to register and deregister
event listeners for arbitrarily named events using `listen()` and `unlisten()`
methods and fire these events with arbitrary data using `fire()` method.

Events propagate directly to the registered event listeners with no way to stop
their propagation.

```javascript
// app/component/image/Image.jsx

onImageClick(event) {
  event.preventDefault();

  const { image } = this.props;
  this.utils.$Dispatcher.fire('showLightbox', { image });
}
```

```javascript
// app/component/lightbox/Lightbox.jsx

componentDidMount() {
  this.utils.$Dispatcher.listen('showLightbox', this.onLightboxShow, this);
}

componentWillUnmount() {
  this.utils.$Dispatcher.unlisten('showLightbox', this.onLightboxShow, this);
}

onLightboxShow(data) {
  // ...
}
```

> **Note:** Lightbox component can be mounted anywhere in the DOM tree and it
will still receive the `showLightbox` event when it's fired.

> **Note:** A great place to
mount components like Lightbox is [ManagedRootView](./rendering-process.md#managedrootview).

### Listening to all Dispatcher events

You can listen to all events dispatched by the `Dispatcher` by using the `listenAll()`
and `unlistenAll()` methods.

```javascript
// app/component/eventLogger/EventLogger.jsx

componentDidMount() {
  this.utils.$Dispatcher.listenAll(this._onDispatcherEvent, this);
}

componentWillUnmount() {
  this.utils.$Dispatcher.unlistenAll(this._onDispatcherEvent, this);
}

_onDispatcherEvent(eventName, data) {
  // ...
}
```

## Observable

The `Observable` class allows you to subscribe to events dispatched by the
`Dispatcher`. Upon subscribing, subscribers will be notified of past and future
events.

### Initializing Observable

```javascript
// app/config/services.js

export const initServicesApp = (ns, oc, config) => {
  const Observable = oc.get('$Observable');

  Observable.init();
}
```

**Accessing Observable in Controllers** is easy with [Dependency Injection](./object-container.md#1-dependency-injection).  
**To access Observable from Views and Components** you should register it in [ComponentUtils](./views-and-components.md#utilities-shared-across-views-and-components).

```javascript
// app/config/bind.js
import { Observable } from '@ima/core';

export let init = (ns, oc, config) => {
  const ComponentUtils = oc.get('$ComponentUtils');

  ComponentUtils.register({
    $Observable: Observable
  });
}
```

### Subscribing and unsubscribing to events

You can subscribe to events dispatched by the `Dispatcher` using the `subscribe()`, and unsubscribe using the `unsubscribe()` method.

```javascript
// app/component/media/Media.jsx

componentDidMount() {
  this.utils.$Observable.subscribe('showLightbox', this._onShowLightbox, this);
}

componentWillUnmount() {
  this.utils.$Observable.unsubscribe('showLightbox', this._onShowLightbox, this);
}

_onShowLightbox(data) {
  // ...
}
```

> **Note:** If the `showLightbox` event was already dispatched before the `Media` component was mounted,
 the `_onShowLightbox` method will be called immediately upon subscribing with the data that was passed to the event.  
> **Note:** If the event was dispatched multiple times before the `Media` component was mounted,
 the `_onShowLightbox` method will be called for each event.

### Persistent events

The `Observable` class clears its history of dispatched events when the `RouterEvents.BEFORE_HANDLE_ROUTE` event is dispatched.
If you want to keep the history of dispatched events, you can use the `registerPersistentEvent()` method.

```javascript
// app/config/services.js

export const initServicesApp = (ns, oc, config) => {
  const Observable = oc.get('$Observable');

  Observable.init();
  Observable.registerPersistentEvent('scriptLoaded');
}
```

### Settings

By default, the `Observable` class holds the last 10 events dispatched by the `Dispatcher`.
You can change this by modifying the `$Observable.maxHistoryLength` setting.

```javascript
// app/config/settings.js

export default (ns, oc, config) => {
  return {
    prod: {
      // ...
      $Observable: {
        maxHistoryLength: 20
      }
    }
  };
}
```

## Built-in events

IMA.js fires a few events that let you know that something has happened under
the hood. You can listen to these events using **Dispatcher**'s listen method.

### RouterEvents.`BEFORE_HANDLE_ROUTE`

This event is fired after the router matches new url to a registered route and
before the page change starts. The data passed with the event look like this:
```javascript
{
  // the new Route instance
  route,
  // new URL parameters
  params,
  // the path portion of the new URL (a route definition is matched against this)
  path,
  // route options extended of options provided to the function
  // that triggered the routing
  options,
  // an action object describing what triggered the routing
  // if a PopStateEvent triggered the routing the action object will
  // look like this { type: 'popstate', event: PopStateEvent }
  // otherwise the event will be MouseEvent (e.g. clicked on a link)
  // and type will be either 'redirect', 'click' or 'error'.
  action
}
```

### RouterEvents.`AFTER_HANDLE_ROUTE`

This event is contrary to the `BEFORE_HANDLE_ROUTE`. It's fired with the same
data but after the page was changed.

> **Note:** The `AFTER_HANDLE_ROUTE` event will be fired regardless if promises
loaded be the new Controller are resolved.

### StateEvents.`BEFORE_CHANGE_STATE`

An event fired before the page state changes. The handler of this event receives
following data:

```javascript
{
  // The state object derived from the oldState and patchState
  newState,
  // The current state
  oldState,
  // The data that were passed to the `setState` method
  patchState
}
```

> **Note:** You can mutate the `newState` object if you wish. Mutating
`oldState` and `patchState` will have no effect.

### StateEvents.`AFTER_CHANGE_STATE`

An event fired after the page state changes. The data passed with this event
contain only the `newState` object.

### RendererEvents.`MOUNTED`

PageRenderer fires this event after current page view is mounted to the DOM. Event's data contain `{ type: String }` Where type can be one of constants located in `@ima/core/page/renderer/Types`.

### RendererEvents.`UPDATED`

PageRenderer fires this event after current state is updated in the DOM. Event's data contain `{ state: Object<string, *>}`.

### RendererEvents.`UNMOUNTED`

PageRenderer fires this event after current view is unmounted from the DOM. Event's data contain `{ type: String }` Where type can be one of constants located in `@ima/core/page/renderer/Types`.

### RendererEvents.`ERROR`

PageRenderer fires this event when there is no _viewContainer in _renderToDOM method. Event's data contain `{ message: string }`.
