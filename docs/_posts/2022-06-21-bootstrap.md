---
category: "general"
title: "API - Bootstrap"
menuTitle: "Bootstrap"
---

## Bootstrap&nbsp;<a name="Bootstrap" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L12" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application bootstrap used to initialize the environment and the application
itself.

**Kind**: global class  

* [Bootstrap](#Bootstrap)
    * [new Bootstrap(oc)](#new_Bootstrap_new)
    * [._oc](#Bootstrap+_oc) : <code>ObjectContainer</code>
    * [._config](#Bootstrap+_config) : <code>Object.&lt;string, \*&gt;</code>
    * [.run(config)](#Bootstrap+run)
    * [.initPlugin(name, module)](#Bootstrap+initPlugin)
    * [._initSettings()](#Bootstrap+_initSettings)
    * [._initPluginSettings(name, module)](#Bootstrap+_initPluginSettings)
    * [._bindDependencies()](#Bootstrap+_bindDependencies)
    * [._bindPluginDependencies(name, module)](#Bootstrap+_bindPluginDependencies)
    * [._initRoutes()](#Bootstrap+_initRoutes)
    * [._initServices()](#Bootstrap+_initServices)
    * [._initPluginServices(name, module)](#Bootstrap+_initPluginServices)


* * *

### new Bootstrap(oc)&nbsp;<a name="new_Bootstrap_new"></a>
Initializes the bootstrap.


| Param | Type | Description |
| --- | --- | --- |
| oc | <code>ObjectContainer</code> | The application's object container to use        for managing dependencies. |


* * *

### bootstrap.\_oc : <code>ObjectContainer</code>&nbsp;<a name="Bootstrap+_oc" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L25" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The object container used to manage dependencies.

**Kind**: instance property of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_config : <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Bootstrap+_config" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L32" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application configuration.

**Kind**: instance property of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.run(config)&nbsp;<a name="Bootstrap+run" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L48" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the application by running the bootstrap sequence. The
sequence initializes the components of the application in the following
order:
- application settings
- constants, service providers and class dependencies configuration
- services
- UI components
- routing

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object.&lt;string, \*&gt;</code> | The application environment        configuration for the current environment. |


* * *

### bootstrap.initPlugin(name, module)&nbsp;<a name="Bootstrap+initPlugin" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L64" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes dynamically loaded plugin. This is explicitly called from
within the Plugin Loader instance.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |


* * *

### bootstrap.\_initSettings()&nbsp;<a name="Bootstrap+_initSettings" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L77" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the application settings. The method loads the settings for
all environments and then pics the settings for the current environment.

The method also handles using the values in the production environment
as default values for configuration items in other environments.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_initPluginSettings(name, module)&nbsp;<a name="Bootstrap+_initPluginSettings" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L118" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes dynamically loaded plugin settings (if the init
function is provided). The settings are merged into the application
the same way as with non-dynamic import, meaning the app setting overrides
are prioritized over the default plugin settings.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |


* * *

### bootstrap.\_bindDependencies()&nbsp;<a name="Bootstrap+_bindDependencies" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L151" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Binds the constants, service providers and class dependencies to the
object container.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_bindPluginDependencies(name, module)&nbsp;<a name="Bootstrap+_bindPluginDependencies" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L183" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Binds the constants, service providers and class dependencies to the
object container for dynamically imported plugins.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |


* * *

### bootstrap.\_initRoutes()&nbsp;<a name="Bootstrap+_initRoutes" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L198" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the routes.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_initServices()&nbsp;<a name="Bootstrap+_initServices" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L206" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the basic application services.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_initPluginServices(name, module)&nbsp;<a name="Bootstrap+_initPluginServices" href="https://github.com/seznam/ima/blob/v18.0.0-rc.2/packages/core/src/Bootstrap.js#L224" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Service initialization for the dynamically loaded plugins.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |


* * *

