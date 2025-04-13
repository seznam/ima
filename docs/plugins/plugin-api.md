---
title: Plugins API
description: Plugins > Plugins API
---

IMA.js development stack offers **built-in support for plugins**. Writing plugins for IMA.js is really
simple. It basically comes to creating an ordinary npm package and using `pluginLoader.register` method to hook into IMA.js application environment using certain functions.

:::info

In situations where you don't need to hook into IMA.js app environment from within your plugin (you're for example just exporting some interface), you don't need call this registration method as it servers no purpose.

:::

## Plugin registration

As mentioned above, the plugin registration is done from within your **npm package entry point** using `pluginLoader.register` method:

```javascript
import { pluginLoader } from '@ima/core';
import Service from './service';

pluginLoader.register('my-ima-plugin', ns => {
  ns.set('my.ima.plugin.Service', Service);
});
```

The `register` method expects 2 arguments, first is **name of your plugin** (this is used strictly for debugging purposes, however it is required) and **callback registration function** which receives [`Namespace`](../api/modules/ima_core.md#ns) as one and only argument, that you can use to specify to which namespace this plugin should be bound.

### Plugin bootstrap functions

The registration function can additionally **return an object with additional callback functions**. These allow you to further bootstrap your plugin. All are however optional, meaning you can define any combination of these or don't return anything.

```javascript
import { pluginLoader } from '@ima/core';

pluginLoader.register('my-ima-plugin', ns => {
  return {
    initBind: (ns, oc, config) => {},
    initServices: (ns, oc, config) => {},
    initSettings: (ns, oc, config) => {}
  }
});
```

#### initBind

> `initBind(ns: Namespace, oc: ObjectContainer, config: Config['bind'], isDynamicallyLoaded = false)`

This function has the same interface as a function exported in `bind.js` of your IMA.js application and also serves the same purpose. This is the place where you would want to initialize your custom constants and bindings and assign them to the [`ObjectContainer`](../basic-features/object-container.md).

#### initServices

> `initServices(ns: Namespace, oc: ObjectContainer, config: Config['services'], isDynamicallyLoaded = false)`

Similarly to `initBind`, this is equivalent to a function exported by `services.js` file in your application.

#### initSettings

> `initSettings(ns: Namespace, oc: ObjectContainer, config: Config['settings'], isDynamicallyLoaded = false)`

You can probably already see the pattern here. This function should return an object with settings, with the same structure as function in `settings.js` file does.

These settings are then **merged with your application settings** a possible conflicts are overridden with the application settings. This allows you to **define defaults for your plugin**, which can be easily overridden in your application.

### Settings merging

When instead of overriding, you want to transform the existing values of settings, you may use the helper ```assignTransformation()```.

It allows you to provide a custom transformation function that will replace the behaviour of the assign function that overrides the old values with new ones. It accepts a callback function that will be invoked as a transformation when merging settings.

```javascript
assignTransformation(callbackFunction: (value) => typeof value);
```

Example use case might be adding new values to an existing array: 

```javascript
return {
    enviroment: {
        ...
        entitiesWithContent: assignTransformation((value) => [...value, 'additional value']),
    }
}
```

### Examples

Putting it all together, your main file in your npm package could look something like this (borrowing contents of `main.js` from our [@ima/plugin-useragent](https://github.com/seznam/IMA.js-plugins/blob/master/packages/plugin-useragent/README.md):

```javascript
import { pluginLoader } from '@ima/core';
import PlatformJS from 'platform';

import UserAgent from './AbstractUserAgent.js';
import ClientUserAgent from './ClientUserAgent.js';
import ServerUserAgent from './ServerUserAgent.js';

pluginLoader.register('@ima/plugin-useragent', () => {
  return {
    initBind: (ns, oc) => {
      if (oc.get('$Window').isClient()) {
        oc.provide(UserAgent, ClientUserAgent, [PlatformJS, '$Window']);
      } else {
        oc.provide(UserAgent, ServerUserAgent, [PlatformJS, '$Request']);
      }
    },
    initServices: (ns, oc) => {
      oc.get(UserAgent).init();
    },
  };
});

export { ClientUserAgent, ServerUserAgent, UserAgent, PlatformJS };
```

## Dynamically imported plugins and tree shaking

When the plugin is imported dynamically and initialized lazily, you receive `isDynamicallyLoaded = true` as the last argument in the registration bootstrap functions. This can help you in certain situations where you need to know when the plugin was initialized.

The bootstrap process works the same way as with plugins initialized upon application startup, meaning all plugin settings are still overwritten with possible overrides in the application settings. There's however one caveat with the `ObjectContainer` that you need to pay attention to.

:::warning

When using **string syntax** to get certain settings in the `$dependencies` field:

```javascript
static get $dependencies() {
  return ['$Settings.myPlugin.repeatCount'];
};

constructor(repeatCount) {
  this.repeatCount = repeatCount;
}

fn() {
  this.repeatXTimes(this.repeatCount);
}
```

This w**on't be updated** with possible plugin defaults when it get's loaded. In order to prevent this issue, you need to access whole settings object which will get updated values:


```javascript
static get $dependencies() {
  return ['$Settings'];
};

myFUnction(settings) {
  this.settings = settings;
}

fn() {
  this.repeatXTimes(settings?.myPlugin?.repeatCount);
}
```

:::

## Conclusion

As you can see, creating IMA.js plugin is very easy. You can always check our
[IMA.js-plugins](https://github.com/seznam/IMA.js-plugins/tree/master) monorepo to take a look at many other already
existing plugins and how they're implemented, which we describe more in detail [in the documentation](./available-plugins).
