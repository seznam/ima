---
title: Extensions
description: Basic features > Extensions as a companion to Controllers
---

Extensions provide means of extending the page controllers with additional
managed state and logic.

An extension has access to the current route
parameters, can specify the resources to load when the page is loading or
being updated, may intercept event bus events and modify the state of the
page just like an ordinary controller, except that the modifications are
restricted to the state fields which the extension explicitly specifies
using its `getAllowedStateKeys()` method.

![](/img/docs/diagram-extensions.png)


## Why use extensions

Best case to use extension is a component that
requires interception of controller lifecycle events and/or loading external
data.

Putting the component's logic inside the controller would be unwise for 3
reasons:

1. Controller would contain code that is not as clear. For newcomers to
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
`ima/extension/AbstractExtension` with the same methods as you'd use in the controller. In addition you should implement `getAllowedStateKeys()` method which returns array of keys the extension is allowed to change in controller's state. (If the extension itself creates the state key, it does not have to be claimed this way - the extension has access to it automatically.)

> **Note:** List and description of controller methods can be seen in [Controller lifecycle](./controller-lifecycle).

```javascript
// app/component/gallery/GalleryExtension.js
import { AbstractExtension } from '@ima/core';

export default class GalleryExtension extends AbstractExtension {
  static get $dependencies() {
    return [];
  }

  load() {
    // Where the magic happens...
  }
}
```

All extensions to be used on a page must be added to the current controller
via `$extensions` getter. After that, the extensions will go
through the same lifecycle as the controller.

```javascript
import { AbstractController } from '@ima/core';
import GalleryExtension from 'app/component/gallery/GalleryExtension';

export default class PostController extends AbstractController {
  static get $dependencies() {
    return [];
  }

  static get $extensions() {
    return [GalleryExtension];
  }

  constructor() {
    //If needed, extension instance can be retrieved using getExtension();
    this._galleryExtension = this.getExtension(GalleryExtension);
  }

  ...
}
```

Extensions can be also defined within routes.

```javascript
//routes.js

import PostController from 'app/page/post/PostController';
import PostView from 'app/page/post/PostView';
import GalleryExtension from 'app/component/gallery/GalleryExtension';

export default (ns, oc, routesConfig, router) =>
  router
    .add('home', '/', PostController, PostView, {
      extensions: [GalleryExtension],
    });

```

Extensions can be defined in global array of extensions.
This array can be registered in the OC as constant:

```javascript

//bind.js
import Extension1 from 'app/component/gallery/GalleryExtension';
import Extension2 from 'app/component/gallery/GalleryExtension2';
...
export default (ns, oc, config) => {
  oc.constant('$galleryExtensions', [Extension, Extension2]);
}

//PostController.js
import { AbstractController } from '@ima/core';
import GalleryExtension from 'app/component/gallery/GalleryExtension';

export default class PostController extends AbstractController {

  ...

  static get $extensions() {
    return ['...$galleryExtensions'];
  }

  ...
}

//Or in routes.js
...
router
    .add('home', '/', PostController, PostView, {
      extensions: ['...$galleryExtensions'],
    });
...
```

Or just exported array:

```javascript

//GalleryExtensions.js
import Extension1 from 'app/component/gallery/GalleryExtension';
import Extension2 from 'app/component/gallery/GalleryExtension2';

export const GalleryExtensions = [Extension, Extension2];


//PostController.js
import { AbstractController } from '@ima/core';
import { GalleryExtensions } from 'app/component/gallery/GalleryExtensions';

export default class PostController extends AbstractController {

  ...

  static get $extensions() {
    return [...GalleryExtensions];
  }

  ...
}
```

## Passing partial state from controllers

During any lifecycle phase of the page the controller's lifecycle method is called first and then the same method is called on every extension registered in the controller. Order of the extensions is crucial and the same as in which the extensions were registered.

Since [v16](https://github.com/seznam/IMA.js-core/releases/tag/0.16.0) you can access the state loaded in controller and preceding extensions (hence the cruciality of extensions order). Bear in mind that the accessed state may contain unresolved promises that need to be treated differently.

Addition of `async/await` functionality in **v17** can lead to dramatic performance drop if not used well. Keep in mind that every `await` in Controller's or Extension's `load` method will delay execution of next `load` method until the asynchronous operation finishes.

```javascript
// app/component/gallery/GalleryExtension.js

load() {
  const {
    user: userPromise, // needs to be chained with .then()
    userGroupName,
  } = this.getState();

  const galleryPromise = userPromise.then(user => {
    // Calling this.getState() here would still give us unresolved promises.
    return this._galleryService.loadByUserName(user.name);
  });

  return {
    gallery: galleryPromise
  };
}
```
