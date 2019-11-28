---
layout: "docs"
---

IMA.js development stack offers **built-in support for plugins**. Writing plugins for IMA.js is really
simple. It basically comes to creating an ordinary npm package, which exports few special functions, that
allows it to hook into IMA.js application environment.

## Interface functions

There are total of **4 functions** that a plugin can export in it's main file:
- [`$registerImaPlugin(ns)`](https://github.com/seznam/ima/blob/master/packages/core/src/vendorLinker.js#L38)
**{namespace}** - main purpose of this function is to let IMA.js `VendorLinker`
know, that this is a plugin. Most of the time this function **will be empty**. Optionally as a first and the only argument
you get access to `namespace`, which let's you specify to which namespace this plugin should be bound.
- [`initBind(ns, oc, config)`](https://github.com/seznam/ima/blob/master/packages/core/src/Bootstrap.js#L144)
**{namespace, ObjectContainer, config.bind)** - This function has same interface as a function exported
in `bind.js` of your IMA.js application and also serves the same purpose. This is the place where you would want to initialize
your custom constants and bindings and assign them to the `ObjectContainer`.
- [`initServices(ns, oc, config)`](https://github.com/seznam/ima/blob/master/packages/core/src/Bootstrap.js#L171) -
**{namespace, ObjectContainer, config.services)** - Similarly to `initBind`, this function is equivalent to a
function exported by `services.js` file in your application.
- [`initSettings(ns, oc, config)`](https://github.com/seznam/ima/blob/master/packages/core/src/Bootstrap.js#L82) -
**{namespace, ObjectContainer, config.settings)** - You can probably already see the pattern here. This function should 
return an object with settings, with the same structure as function in `settings.js` file does. These settings are
then **merged with your application settings** a possible conflicts are overridden with the application settings.
This allows you to **define defaults for your plugin**, which can be easily overridden in your application.

Putting it all together, your main file in your npm package could look something like this (borrowing contents `main.js`
from our [ima-plugin-useragent](https://github.com/seznam/IMA.js-plugins/blob/ca0c3e53cb6a9f06b8888ebb69879086e724907d/packages/plugin-useragent/README.md):

```javascript
import UserAgent from './AbstractUserAgent.js';
import ClientUserAgent from './ClientUserAgent.js';
import ServerUserAgent from './ServerUserAgent.js';
import PlatformJS from 'platform';

var $registerImaPlugin = () => {};

let initBind = (ns, oc) => {
  if (oc.get('$Window').isClient()) {
    oc.provide(UserAgent, ClientUserAgent, [PlatformJS, '$Window']);
  } else {
    oc.provide(UserAgent, ServerUserAgent, [PlatformJS, '$Request']);
  }
};

let initServices = (ns, oc) => {
  oc.get(UserAgent).init();
};

let initSettings = () => {
  return {
    prod: {
      plugin: {
        userAgent: {
          legacyUserAgents: [
            'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'
          ]             
        }
      }
    }
  };
};

export {
  ClientUserAgent,
  ServerUserAgent,
  UserAgent,
  PlatformJS,
  $registerImaPlugin,
  initBind,
  initServices
};
```

### Updating build.js

One last thing when using a ima-plugin, or any other vendor library, is that you have to update your 
`build.js` file with the new dependency, otherwise it won't get built properly:

```javascript
var vendors = {
    common: [
        'ima-plugin-useragent'
    ]
};
``` 

## Conclusion

As you can see that creating IMA.js plugin is very easy. You can always check our 
[IMA.js-plugins](https://github.com/seznam/IMA.js-plugins/tree/ca0c3e53cb6a9f06b8888ebb69879086e724907d),
which we describe more in detail [here](/docs/available-plugins.html), monorepo to take a look at many other already
existing plugins and how they're implemented.
