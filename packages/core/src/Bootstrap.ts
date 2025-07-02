import { autoYield } from '@esmj/task';
import * as helpers from '@ima/helpers';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { PartialDeep } from 'type-fest';

import { DictionaryConfig } from '.';
import { AppSettings, Settings } from './boot';
import { Namespace, ns } from './Namespace';
import { BindingState } from './oc/BindingState';
import { ObjectContainer } from './oc/ObjectContainer';
import { Router } from './router/Router';
import { GlobalImaObject, UnknownParameters } from './types';

export type InitBindFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  config: Required<BootConfig>['bind'],
  state: BindingState
) => void;

export type InitRoutesFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  routes: UnknownParameters | undefined,
  router: Router
) => void;

export type InitServicesFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  config: BootConfig['services']
) => void;

export type InitSettingsFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  config: BootConfig['settings']
) => AppSettings;

export type PluginInitBindFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  config: Required<BootConfig>['bind'],
  isDynamicallyLoaded: boolean,
  name?: string
) => void;

export type PluginInitServicesFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  config: BootConfig['services'],
  isDynamicallyLoaded: boolean
) => void;

export type PluginInitSettingsFunction = (
  ns: Namespace,
  oc: ObjectContainer,
  config: BootConfig['settings'],
  isDynamicallyLoaded: boolean
) => PartialDeep<AppSettings>;

export interface InitPluginConfig {
  initServices?: PluginInitServicesFunction;
  initBind?: PluginInitBindFunction;
  initSettings?: PluginInitSettingsFunction;
}

export interface InitAppConfig {
  initBindApp: InitBindFunction;
  initRoutes: InitRoutesFunction;
  initServicesApp: InitServicesFunction;
  initSettings: InitSettingsFunction;
}

export interface InitImaConfig {
  initBindIma: InitBindFunction;
  initServicesIma: InitServicesFunction;
}

export type BootSettings = Pick<
  GlobalImaObject,
  | '$Version'
  | '$Debug'
  | '$Env'
  | '$Version'
  | '$App'
  | '$Protocol'
  | '$Language'
  | '$Host'
  | '$Root'
  | '$LanguagePartPath'
>;

export interface BootServices {
  response: ExpressResponse | null;
  request: ExpressRequest | null;
  $IMA: Window['$IMA'];
  dictionary: DictionaryConfig;
  router: {
    $Protocol: GlobalImaObject['$Protocol'];
    $Host: GlobalImaObject['$Host'];
    $Root: GlobalImaObject['$Root'];
    $LanguagePartPath: GlobalImaObject['$LanguagePartPath'];
  };
}

export interface BootConfig extends InitImaConfig, InitAppConfig {
  routes?: UnknownParameters;
  bind?: Settings & BootSettings;
  plugins: { name: string; plugin: InitPluginConfig }[];
  services: BootServices;
  settings: BootSettings;
}

/**
 * Application bootstrap used to initialize the environment and the application
 * itself.
 */
export class Bootstrap {
  protected _oc: ObjectContainer;
  protected _config!: BootConfig;

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
  async run(config: BootConfig) {
    this._config = config;

    this._initSettings();
    await autoYield();

    await this._bindDependencies();
    await autoYield();

    await this._initServices();
    await autoYield();

    this._initRoutes();
    await autoYield();
  }

  /**
   * Initializes dynamically loaded plugin. This is explicitly called from
   * within the Plugin Loader instance.
   *
   * @param name Plugin name.
   * @param plugin Plugin interface (object with init functions).
   */
  async initPlugin(name: string, plugin?: InitPluginConfig) {
    if (!plugin) {
      return;
    }

    this._initPluginSettings(name, plugin);
    await autoYield();

    this._bindPluginDependencies(name, plugin);
    await autoYield();

    this._initPluginServices(plugin);
    await autoYield();
  }

  /**
   * Initializes the application settings. The method loads the settings for
   * all environments and then picks the settings for the current environment.
   *
   * The method also handles using the values in the production environment
   * as default values for configuration items in other environments.
   */
  _initSettings() {
    const currentApplicationSettings: Settings = {} as Settings;
    const plugins = this._config.plugins.concat([
      {
        name: BindingState.App,
        plugin: this._config,
      },
    ]);

    plugins
      .filter(({ plugin }) => typeof plugin.initSettings === 'function')
      .forEach(({ name, plugin }) => {
        const allPluginSettings = plugin.initSettings!(
          ns,
          this._oc,
          this._config.settings,
          false
        );

        helpers.assignRecursivelyWithTracking(name)(
          currentApplicationSettings,
          helpers.resolveEnvironmentSetting(
            allPluginSettings,
            this._config.settings.$Env
          )
        );
      });

    this._config.bind = {
      ...this._config.bind,
      ...currentApplicationSettings,
      ...this._config.settings,
    };
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
  _initPluginSettings(name: string, plugin: InitPluginConfig) {
    if (typeof plugin?.initSettings !== 'function') {
      return;
    }

    const newApplicationSettings: Settings = {} as Settings;
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

    helpers.assignRecursivelyWithTracking(BindingState.App)(
      newApplicationSettings,
      this._config.bind
    );

    this._config.bind = {
      ...this._config.bind!,
      ...newApplicationSettings,
    };
  }

  /**
   * Binds the constants, service providers and class dependencies to the
   * object container.
   */
  async _bindDependencies() {
    this._oc.setBindingState(BindingState.IMA);
    this._config.initBindIma(
      ns,
      this._oc,
      this._config.bind!,
      BindingState.IMA
    );

    const filteredPlugins = this._config.plugins.filter(
      ({ plugin }) => typeof plugin.initBind === 'function'
    );

    for (const { name, plugin } of filteredPlugins) {
      this._oc.setBindingState(BindingState.Plugin, name);
      plugin.initBind!(ns, this._oc, this._config.bind!, false);
      await autoYield();
    }

    this._oc.setBindingState(BindingState.App);
    this._config.initBindApp(
      ns,
      this._oc,
      this._config.bind!,
      BindingState.App
    );
  }

  /**
   * Binds the constants, service providers and class dependencies to the
   * object container for dynamically imported plugins.
   *
   * @param name Plugin name.
   * @param plugin Plugin interface (object with init functions).
   */
  _bindPluginDependencies(name: string, plugin: InitPluginConfig) {
    if (typeof plugin.initBind !== 'function') {
      return;
    }

    this._oc.setBindingState(BindingState.Plugin, name);
    plugin.initBind(ns, this._oc, this._config.bind!, true, name);
    this._oc.setBindingState(BindingState.App);
  }

  /**
   * Initializes the routes.
   */
  _initRoutes() {
    const router = this._oc.get(Router);
    this._config.initRoutes(ns, this._oc, this._config.routes, router);
  }

  /**
   * Initializes the basic application services.
   */
  async _initServices() {
    this._config.initServicesIma(ns, this._oc, this._config.services);

    const filteredPlugins = this._config.plugins.filter(
      ({ plugin }) => typeof plugin.initServices === 'function'
    );

    for (const { plugin } of filteredPlugins) {
      plugin.initServices!(ns, this._oc, this._config.services, false);
      await autoYield();
    }

    this._config.initServicesApp(ns, this._oc, this._config.services);
  }

  /**
   * Service initialization for the dynamically loaded plugins.
   *
   * @param plugin Plugin interface (object with init functions).
   */
  _initPluginServices(plugin: InitPluginConfig) {
    if (typeof plugin.initServices !== 'function') {
      return;
    }

    plugin.initServices(ns, this._oc, this._config.services, true);
  }
}

ns.set('ns.ima.core.Bootstrap', Bootstrap);
