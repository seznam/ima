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
