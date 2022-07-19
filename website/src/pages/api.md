## Functions

<dl>
<dt><a href="#run">run(config)</a></dt>
<dd><p>Initializes the application by running the bootstrap sequence. The
sequence initializes the components of the application in the following
order:</p>
<ul>
<li>application settings</li>
<li>constants, service providers and class dependencies configuration</li>
<li>services</li>
<li>UI components</li>
<li>routing</li>
</ul>
</dd>
<dt><a href="#initPlugin">initPlugin(name, module)</a></dt>
<dd><p>Initializes dynamically loaded plugin. This is explicitly called from
within the Plugin Loader instance.</p>
</dd>
<dt><a href="#_initSettings">_initSettings()</a></dt>
<dd><p>Initializes the application settings. The method loads the settings for
all environments and then pics the settings for the current environment.</p>
<p>The method also handles using the values in the production environment
as default values for configuration items in other environments.</p>
</dd>
<dt><a href="#_initPluginSettings">_initPluginSettings(name, module)</a></dt>
<dd><p>Initializes dynamically loaded plugin settings (if the init
function is provided). The settings are merged into the application
the same way as with non-dynamic import, meaning the app setting overrides
are prioritized over the default plugin settings.</p>
</dd>
<dt><a href="#_bindDependencies">_bindDependencies()</a></dt>
<dd><p>Binds the constants, service providers and class dependencies to the
object container.</p>
</dd>
<dt><a href="#_bindPluginDependencies">_bindPluginDependencies(name, module)</a></dt>
<dd><p>Binds the constants, service providers and class dependencies to the
object container for dynamically imported plugins.</p>
</dd>
<dt><a href="#_initRoutes">_initRoutes()</a></dt>
<dd><p>Initializes the routes.</p>
</dd>
<dt><a href="#_initServices">_initServices()</a></dt>
<dd><p>Initializes the basic application services.</p>
</dd>
<dt><a href="#_initPluginServices">_initPluginServices(name, module)</a></dt>
<dd><p>Service initialization for the dynamically loaded plugins.</p>
</dd>
</dl>

<a name="run"></a>

## run(config)
Initializes the application by running the bootstrap sequence. The
sequence initializes the components of the application in the following
order:
- application settings
- constants, service providers and class dependencies configuration
- services
- UI components
- routing

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object.&lt;string, \*&gt;</code> | The application environment        configuration for the current environment. |

<a name="initPlugin"></a>

## initPlugin(name, module)
Initializes dynamically loaded plugin. This is explicitly called from
within the Plugin Loader instance.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |

<a name="_initSettings"></a>

## \_initSettings()
Initializes the application settings. The method loads the settings for
all environments and then pics the settings for the current environment.

The method also handles using the values in the production environment
as default values for configuration items in other environments.

**Kind**: global function  
<a name="_initPluginSettings"></a>

## \_initPluginSettings(name, module)
Initializes dynamically loaded plugin settings (if the init
function is provided). The settings are merged into the application
the same way as with non-dynamic import, meaning the app setting overrides
are prioritized over the default plugin settings.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |

<a name="_bindDependencies"></a>

## \_bindDependencies()
Binds the constants, service providers and class dependencies to the
object container.

**Kind**: global function  
<a name="_bindPluginDependencies"></a>

## \_bindPluginDependencies(name, module)
Binds the constants, service providers and class dependencies to the
object container for dynamically imported plugins.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |

<a name="_initRoutes"></a>

## \_initRoutes()
Initializes the routes.

**Kind**: global function  
<a name="_initServices"></a>

## \_initServices()
Initializes the basic application services.

**Kind**: global function  
<a name="_initPluginServices"></a>

## \_initPluginServices(name, module)
Service initialization for the dynamically loaded plugins.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Plugin name. |
| module | <code>module</code> | Plugin interface (object with init functions). |

