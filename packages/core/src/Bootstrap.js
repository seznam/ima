import $Helper from '@ima/helpers';
import ns from './namespace';
import ObjectContainer from './ObjectContainer';
import Router from './router/Router';

ns.namespace('ima.core');

/**
 * Application bootstrap used to initialize the environment and the application
 * itself.
 */
export default class Bootstrap {
  /**
   * Initializes the bootstrap.
   *
   * @param {ObjectContainer} oc The application's object container to use
   *        for managing dependencies.
   */
  constructor(oc) {
    /**
     * The object container used to manage dependencies.
     *
     * @type {ObjectContainer}
     */
    this._oc = oc;

    /**
     * Application configuration.
     *
     * @type {Object<string, *>}
     */
    this._config = {};
  }

  /**
   * Initializes the application by running the bootstrap sequence. The
   * sequence initializes the components of the application in the following
   * order:
   * - application settings
   * - constants, service providers and class dependencies configuration
   * - services
   * - UI components
   * - routing
   *
   * @param {Object<string, *>} config The application environment
   *        configuration for the current environment.
   */
  run(config) {
    this._config = config;

    this._initSettings();
    this._bindDependencies();
    this._initServices();
    this._initRoutes();
  }

  /**
   * Initializes dynamically loaded plugin. This is explicitly called from
   * within the Plugin Loader instance.
   *
   * @param {string} name Plugin name.
   * @param {module} module Plugin interface (object with init functions).
   */
  initPlugin(name, module) {
    this._initPluginSettings(name, module);
    this._bindPluginDependencies(name, module);
    this._initPluginServices(module);
  }

  /**
   * Initializes the application settings. The method loads the settings for
   * all environments and then pics the settings for the current environment.
   *
   * The method also handles using the values in the production environment
   * as default values for configuration items in other environments.
   */
  _initSettings() {
    let currentApplicationSettings = {};
    let plugins = this._config.plugins.concat([
      { name: ObjectContainer.APP_BINDING_STATE, module: this._config },
    ]);

    plugins
      .filter(({ module }) => typeof module.initSettings === 'function')
      .forEach(({ name, module }) => {
        let allPluginSettings = module.initSettings(
          ns,
          this._oc,
          this._config.settings,
          false // Indicating static bootstraping
        );

        $Helper.assignRecursivelyWithTracking(name)(
          currentApplicationSettings,
          $Helper.resolveEnvironmentSetting(
            allPluginSettings,
            this._config.settings.$Env
          )
        );
      });

    this._config.bind = Object.assign(
      this._config.bind || {},
      currentApplicationSettings,
      this._config.settings
    );
  }

  /**
   * Initializes dynamically loaded plugin settings (if the init
   * function is provided). The settings are merged into the application
   * the same way as with non-dynamic import, meaning the app setting overrides
   * are prioritized over the default plugin settings.
   *
   * @param {string} name Plugin name.
   * @param {module} module Plugin interface (object with init functions).
   */
  _initPluginSettings(name, module) {
    if (typeof module?.initSettings !== 'function') {
      return;
    }

    let newApplicationSettings = {};
    let allPluginSettings = module.initSettings(
      ns,
      this._oc,
      this._config.settings,
      true // Indicating static dynamic bootstraping
    );

    $Helper.assignRecursivelyWithTracking(name)(
      newApplicationSettings,
      $Helper.resolveEnvironmentSetting(
        allPluginSettings,
        this._config.settings.$Env
      )
    );

    $Helper.assignRecursivelyWithTracking(ObjectContainer.APP_BINDING_STATE)(
      newApplicationSettings,
      this._config.bind
    );

    Object.assign(this._config.bind, newApplicationSettings);
  }

  /**
   * Binds the constants, service providers and class dependencies to the
   * object container.
   */
  _bindDependencies() {
    this._oc.setBindingState(ObjectContainer.IMA_BINDING_STATE);
    this._config.initBindIma(
      ns,
      this._oc,
      this._config.bind,
      ObjectContainer.IMA_BINDING_STATE
    );

    this._config.plugins
      .filter(({ module }) => typeof module.initBind === 'function')
      .forEach(({ name, module }) => {
        this._oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE, name);
        module.initBind(ns, this._oc, this._config.bind, false);
      });

    this._oc.setBindingState(ObjectContainer.APP_BINDING_STATE);
    this._config.initBindApp(
      ns,
      this._oc,
      this._config.bind,
      ObjectContainer.APP_BINDING_STATE
    );
  }

  /**
   * Binds the constants, service providers and class dependencies to the
   * object container for dynamically imported plugins.
   *
   * @param {string} name Plugin name.
   * @param {module} module Plugin interface (object with init functions).
   */
  _bindPluginDependencies(name, module) {
    if (typeof module.initBind !== 'function') {
      return;
    }

    this._oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE, name);

    module.initBind(ns, this._oc, this._config.bind, name, true);

    this._oc.setBindingState(ObjectContainer.APP_BINDING_STATE);
  }

  /**
   * Initializes the routes.
   */
  _initRoutes() {
    let router = this._oc.get(Router);
    this._config.initRoutes(ns, this._oc, this._config.routes, router);
  }

  /**
   * Initializes the basic application services.
   */
  _initServices() {
    this._config.initServicesIma(ns, this._oc, this._config.services);

    this._config.plugins
      .filter(({ module }) => typeof module.initServices === 'function')
      .forEach(({ module }) => {
        module.initServices(ns, this._oc, this._config.services, false);
      });

    this._config.initServicesApp(ns, this._oc, this._config.services);
  }

  /**
   * Service initialization for the dynamically loaded plugins.
   *
   * @param {string} name Plugin name.
   * @param {module} module Plugin interface (object with init functions).
   */
  _initPluginServices(module) {
    if (typeof module.initServices !== 'function') {
      return;
    }

    module.initServices(ns, this._oc, this._config.services, true);
  }
}

ns.ima.core.Bootstrap = Bootstrap;
