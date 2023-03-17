import * as helpers from '@ima/helpers';

import { Namespace, ns } from './Namespace';
import { ObjectContainer } from './ObjectContainer';
import { Router } from './router/Router';
import { UnknownParameters } from './types';

ns.namespace('ima.core');

export type PluginConfigFunctions = {
  initServices?: (
    ns: Namespace,
    oc: ObjectContainer,
    settings: Config['services'],
    isDynamicallyLoaded: boolean
  ) => Config['settings'];
  initBind?: (
    ns: Namespace,
    oc: ObjectContainer,
    settings: Config['bind'],
    isDynamicallyLoaded: boolean,
    name?: string
  ) => void;
  initSettings?: (
    ns: Namespace,
    oc: ObjectContainer,
    settings: Config['settings'],
    isDynamicallyLoaded: boolean
  ) => void;
};

export type AppConfigFunctions = {
  initBindApp: (
    ns: Namespace,
    oc: ObjectContainer,
    bind: UnknownParameters,
    state: string
  ) => void;
  initRoutes: (
    ns: Namespace,
    oc: ObjectContainer,
    routes: UnknownParameters,
    router: Router
  ) => void;
  initServicesApp: (
    ns: Namespace,
    oc: ObjectContainer,
    services?: UnknownParameters
  ) => void;
};

export type Config = {
  initBindIma: (...args: unknown[]) => unknown;
  initServicesIma: (...args: unknown[]) => unknown;
  initSettings: (...args: unknown[]) => unknown;
  plugins: { name: string; plugin: PluginConfigFunctions }[];
  routes: UnknownParameters;
  services: UnknownParameters;
  settings: UnknownParameters;
  bind: UnknownParameters;
} & AppConfigFunctions;

/**
 * Application bootstrap used to initialize the environment and the application
 * itself.
 */
export class Bootstrap {
  protected _oc: ObjectContainer;
  protected _config: Config;
  /**
   * Initializes the bootstrap.
   *
   * @param oc The application's object container to use
   *        for managing dependencies.
   */
  constructor(oc: ObjectContainer) {
    /**
     * The object container used to manage dependencies.
     */
    this._oc = oc;

    /**
     * Application configuration.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
   * @param config The application environment
   *        configuration for the current environment.
   */
  run(config: Config) {
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
   * @param name Plugin name.
   * @param plugin Plugin interface (object with init functions).
   */
  initPlugin(name: string, plugin?: PluginConfigFunctions) {
    if (!plugin) {
      return;
    }

    this._initPluginSettings(name, plugin);
    this._bindPluginDependencies(name, plugin);
    this._initPluginServices(plugin);
  }

  /**
   * Initializes the application settings. The method loads the settings for
   * all environments and then picks the settings for the current environment.
   *
   * The method also handles using the values in the production environment
   * as default values for configuration items in other environments.
   */
  _initSettings() {
    const currentApplicationSettings = {};
    const plugins = this._config.plugins.concat([
      {
        name: ObjectContainer.APP_BINDING_STATE,
        plugin: this._config as unknown as PluginConfigFunctions,
      },
    ]);

    plugins
      .filter(({ plugin }) => typeof plugin.initSettings === 'function')
      .forEach(({ name, plugin }) => {
        const allPluginSettings = plugin.initSettings!(
          ns,
          this._oc,
          this._config.settings,
          false // Indicating static bootstraping
        );

        helpers.assignRecursivelyWithTracking(name)(
          currentApplicationSettings,
          helpers.resolveEnvironmentSetting(
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
   * @param name Plugin name.
   * @param plugin Plugin interface (object with init functions).
   */
  _initPluginSettings(name: string, plugin: PluginConfigFunctions) {
    if (typeof plugin?.initSettings !== 'function') {
      return;
    }

    const newApplicationSettings = {};
    const allPluginSettings = plugin.initSettings(
      ns,
      this._oc,
      this._config.settings,
      true // Indicating static dynamic bootstraping
    );

    helpers.assignRecursivelyWithTracking(name)(
      newApplicationSettings,
      helpers.resolveEnvironmentSetting(
        allPluginSettings,
        this._config.settings.$Env
      )
    );

    helpers.assignRecursivelyWithTracking(ObjectContainer.APP_BINDING_STATE)(
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
      .filter(({ plugin }) => typeof plugin.initBind === 'function')
      .forEach(({ name, plugin }) => {
        this._oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE, name);
        plugin.initBind!(ns, this._oc, this._config.bind, false);
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
   * @param name Plugin name.
   * @param plugin Plugin interface (object with init functions).
   */
  _bindPluginDependencies(name: string, plugin: PluginConfigFunctions) {
    if (typeof plugin.initBind !== 'function') {
      return;
    }

    this._oc.setBindingState(ObjectContainer.PLUGIN_BINDING_STATE, name);

    plugin.initBind(ns, this._oc, this._config.bind, true, name);

    this._oc.setBindingState(ObjectContainer.APP_BINDING_STATE);
  }

  /**
   * Initializes the routes.
   */
  _initRoutes() {
    const router = this._oc.get(Router) as Router;
    this._config.initRoutes(ns, this._oc, this._config.routes, router);
  }

  /**
   * Initializes the basic application services.
   */
  _initServices() {
    this._config.initServicesIma(ns, this._oc, this._config.services);

    this._config.plugins
      .filter(({ plugin }) => typeof plugin.initServices === 'function')
      .forEach(({ plugin }) => {
        plugin.initServices!(ns, this._oc, this._config.services, false);
      });

    this._config.initServicesApp(ns, this._oc, this._config.services);
  }

  /**
   * Service initialization for the dynamically loaded plugins.
   *
   * @param plugin Plugin interface (object with init functions).
   */
  _initPluginServices(plugin: PluginConfigFunctions) {
    if (typeof plugin.initServices !== 'function') {
      return;
    }

    plugin.initServices(ns, this._oc, this._config.services, true);
  }
}

ns.ima.core.Bootstrap = Bootstrap;
