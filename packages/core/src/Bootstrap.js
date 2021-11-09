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

    this._isBootstrapped = false;
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

    this._isBootstrapped = true;
  }

  getConfig() {
    return this._config;
  }

  isBootstrapped() {
    return this._isBootstrapped;
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
      { name: ObjectContainer.APP_BINDING_STATE, module: this._config }
    ]);

    plugins
      .filter(plugin => typeof plugin.module.initSettings === 'function')
      .forEach(plugin => {
        let allPluginSettings = plugin.module.initSettings(
          ns,
          this._oc,
          this._config.settings
        );
        let environmentPluginSetting = $Helper.resolveEnvironmentSetting(
          allPluginSettings,
          this._config.settings.$Env
        );

        $Helper.assignRecursivelyWithTracking(plugin.name)(
          currentApplicationSettings,
          environmentPluginSetting
        );
      });

    this._config.bind = Object.assign(
      this._config.bind || {},
      currentApplicationSettings,
      this._config.settings
    );
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
      .filter(plugin => typeof plugin.module.initBind === 'function')
      .forEach(plugin => {
        this._oc.setBindingState(
          ObjectContainer.PLUGIN_BINDING_STATE,
          plugin.name
        );
        plugin.module.initBind(ns, this._oc, this._config.bind, plugin.name);
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
      .filter(plugin => typeof plugin.module.initServices === 'function')
      .forEach(plugin => {
        plugin.module.initServices(ns, this._oc, this._config.services);
      });

    this._config.initServicesApp(ns, this._oc, this._config.services);
  }
}

ns.ima.core.Bootstrap = Bootstrap;
