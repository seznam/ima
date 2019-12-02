---
layout: "docs"
---

As you may have noticed when a [route is registered](Routing#3-controller-and-view),
a constructor of **Controller** and **View** is given as a 3rd and 4th argument.
Controller takes care of loading and managing the data while View is a
presentation for the data loaded by the Controller.

<div class="image is-padded-with-shadow">
  <img src="{{ '/img/docs/diagram-view.png?v=' | append: site.github.build_revision | relative_url }}" />
</div>

## Organizing Views and Components

A good spot to place a view file is next to a controller file - that is:
```
app/page/<name-of-the-page>/
 ├─ SomeController.js
 ├─ SomeView.jsx
 └─ someView.less
```

To structure your views easily you can split your views into a smaller components
that can also be reused in other views. Those smaller component are then included
and used as any other react component. Components should be
placed into a `app/component/` directory.

```
app/page/component/
 ├─ document/
 |   └─ DocumentView.jsx
 ├─ header/
 |   ├─ Header.jsx
 |   └─ header.less
 └─ searchBar/
     ├─ SearchBar.jsx
     └─ searchBar.less
```

## Rendering Views

Views are just a React components that receive page state as props, that means you
can freely use internal component state and any React lifecycle methods as you
wish. 

An element that is returned from the `render` method is appended to the 
`ManagedRootView`, `ViewAdapter` and then `DocumentView` on the **server side**
and send as a plain HTML markup to the client where it's hydrated with it's
former state.

When a route change occurs on a **client side** and...
- ...only route parameters has changed, route was registered with the `onlyUpdate`
flag set to `true` and Controller has `update` method defined. In this case the
View receives new props (page state) and should react to them accordingly.
- ...the current view is different from the new one then the rendered view is
replaced with a newly rendered view.

### Route parameters in View

In ideal case Views should only display data loaded in Controller and not even
care about route parameters. But as nothing is ever ideal we've added [`params`
object](Routing#2-route-path-and-parameters) to the View props for you.

```
// app/config/routes.js
router.add('user-detail', '/user/:userId', UserController, UserView);
router.add('user-edit', '/user/:userId/edit', UserEditController, UserEditView);

// app/page/user-detail/UserView.jsx
const { userId } = this.props.params;

const userLink = this.link('user-edit', { userId });
<a href = { userLink }>
```

This example ensures that the link to `user-edit` page is functional 
immediately when a user navigates to `user-detail` page. Otherwise the link would
be functional only after the user-loading promise has been resolved.

## Communication between Views and Controllers

It's clear that data obtained in a Controller are passed down to a View and thus
affecting how the rendered View looks and what it displays. A problem arises when
a View wants to tell Controller to load or change something. The solution to this
are event handling utils [**EventBus**](Events#eventbus) and 
[**Dispatcher**](Events#dispatcher).

## Utilities shared across Views and Components

At some point you'll come to a situation when it'd be nice to have a function or set of functions shared between multiple components. Great example would be custom link generation, page elements manipulation (modal, lightbox) or adverts and analytics.

These cases are covered by **ComponentUtils** that allow you to register classes (utilities) that are then shared across every View and Component. Utilities are instantiated through [OC](Object-Container) therefore you can get access to other utilities or IMA.js components.

Example Utility class would look like this. Simple class with [dependency injection](Object-Container#1-dependency-injection).

```javascript
// app/helper/LightboxHelper.js
import { Router } from '@ima/core';

export default class LightboxHelper {
  static get $dependencies() {
    return [Router];
  }

  showLightbox(content) {
    ...
  }
}
```

Then to register the utility class:

```javascript
// app/config/bind.js
import { ComponentUtils } from '@ima/core';
import LightboxHelper from 'app/helper/LightboxHelper';
import AnalyticsUtils from 'app/helper/AnalyticsUtils';

export default (ns, oc, config) => {
  const ComponentUtils = oc.get(ComponentUtils); // or oc.get('$ComponentUtils');

  ComponentUtils.register('Lightbox', LightboxHelper);
  // OR to register multiple utilities at once
  ComponentUtils.register({
    Lightbox: LightboxHelper,
    AnalyticsUtils
  });
};
```

Finally, what'd be the point to register these classes if we were not to use them... All of the utilities are present in `utils` property on **AbstractComponent**.

```javascript
// app/component/gallery/Gallery.jsx
import { AbstractComponent } from '@ima/core';

export default class Gallery extends AbstractComponent {

  onPhotoClick(photoId) {
    const { Lightbox } = this.utils;

    Lightbox.showLightbox(...);
  }
}
```

For some heavy-used utilities we've created a shortcut methods in **AbstractComponent**.

- **`link`**`(name, params)` = [**Router.link()**](/docs/routing.html#linking-to-routes)
- **`localize`**`(key, params` = [**Dictionary.get()**](/docs/dictionary.html)
- **`fire`**`(eventName, data)` = [**EventBus.fire()**](Events#eventbus)
- **`listen`**`(eventTarget, eventName, listener)` = [**EventBus.listen()**](Events#eventbus)
- **`unlisten`**`(eventTarget, eventName, listener)` = [**EventBus.unlisten()**](Events#eventbus)

One special case would be `cssClasses` shortcut which is by default alias for [**classnames**](https://www.npmjs.com/package/classnames) package. You can overwrite this behaviour by registering you own helper in ComponentUtils under `$CssClasses` alias.
- **`cssClasses`**`(classRules, includeComponentClassName` = `this.utils.$CssClasses()`
