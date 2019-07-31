---
category: "general"
title: "Bootstrap"
---

## Classes

<dl>
<dt><a href="#Bootstrap">Bootstrap</a></dt>
<dd><p>Application bootstrap used to initialize the environment and the application
itself.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#PRODUCTION_ENVIRONMENT">PRODUCTION_ENVIRONMENT</a> : <code>string</code></dt>
<dd><p>Environment name value in the production environment.</p>
</dd>
</dl>

## Bootstrap&nbsp;<a name="Bootstrap" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L27" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application bootstrap used to initialize the environment and the application
itself.

**Kind**: global class  

* [Bootstrap](#Bootstrap)
    * [new Bootstrap(oc)](#new_Bootstrap_new)
    * [._oc](#Bootstrap+_oc) : <code>ObjectContainer</code>
    * [._config](#Bootstrap+_config) : <code>Object.&lt;string, \*&gt;</code>
    * [.run(config)](#Bootstrap+run)
    * [._initSettings()](#Bootstrap+_initSettings)
    * [._getEnvironmentSetting()](#Bootstrap+_getEnvironmentSetting) ⇒ <code>Object.&lt;string, \*&gt;</code>
    * [._bindDependencies()](#Bootstrap+_bindDependencies)
    * [._initRoutes()](#Bootstrap+_initRoutes)
    * [._initServices()](#Bootstrap+_initServices)


* * *

### new Bootstrap(oc)&nbsp;<a name="new_Bootstrap_new"></a>
Initializes the bootstrap.


| Param | Type | Description |
| --- | --- | --- |
| oc | <code>ObjectContainer</code> | The application's object container to use        for managing dependencies. |


* * *

### bootstrap.\_oc : <code>ObjectContainer</code>&nbsp;<a name="Bootstrap+_oc" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L33" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
The object container used to manage dependencies.

**Kind**: instance property of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_config : <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Bootstrap+_config" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L40" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Application configuration.

**Kind**: instance property of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.run(config)&nbsp;<a name="Bootstrap+run" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L56" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
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

### bootstrap.\_initSettings()&nbsp;<a name="Bootstrap+_initSettings" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L72" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the application settings. The method loads the settings for
all environments and then pics the settings for the current environment.

The method also handles using the values in the production environment
as default values for configuration items in other environments.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_getEnvironmentSetting() ⇒ <code>Object.&lt;string, \*&gt;</code>&nbsp;<a name="Bootstrap+_getEnvironmentSetting" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L109" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Returns setting for current environment where base values are from production
environment and other environments override base values.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_bindDependencies()&nbsp;<a name="Bootstrap+_bindDependencies" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L126" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Binds the constants, service providers and class dependencies to the
object container.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_initRoutes()&nbsp;<a name="Bootstrap+_initRoutes" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L144" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the routes.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

### bootstrap.\_initServices()&nbsp;<a name="Bootstrap+_initServices" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L152" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Initializes the basic application services.

**Kind**: instance method of [<code>Bootstrap</code>](#Bootstrap)  

* * *

## PRODUCTION\_ENVIRONMENT : <code>string</code>&nbsp;<a name="PRODUCTION_ENVIRONMENT" href="https://github.com/seznam/IMA.js-core/tree/0.16.9/Bootstrap.js#L14" target="_blank"><span class="icon"><i class="fas fa-external-link-alt fa-xs"></i></span></a>
Environment name value in the production environment.

**Kind**: global constant  

* * *

