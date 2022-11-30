import { Bootstrap } from '.';
import ns, { Namespace } from './Namespace';
import { Module } from './Bootstrap';

/**
 * Plugin loader utility used to register external IMA.js plugins. This
 * adds ability for external packages to automatically hook into several
 * IMA.js application parts and automatically bootstrap certain settings.
 */
class PluginLoader {
  protected _plugins: Record<string, { name: string; module: Module }>;
  protected _bootstrap?: Bootstrap;
  /**
   * Initializes the plugin loader.
   *
   * This is private constructor and should not be used outside of this file.
   * You should use the exported instance to register ima.js plugins.
   *
   * @example
   * import { pluginLoader } from '@ima/core';
   *
   * @private
   */
  constructor() {
    this._plugins = {};
  }

  /**
   * Initializes the plugin loader with bootstrap instance. Which is later used
   * to handle dynamically loaded IMA.js plugins.
   *
   * @param bootstrap App bootstrap instance.
   */
  init(bootstrap: Bootstrap) {
    this._bootstrap = bootstrap;
  }

  /**
   * Registers plugin into IMA.js bootstrap sequence.
   *
   * @example
   * pluginLoader.register('@ima/plugin-logger', ns => {
   *   ns.set('ima.plugin.logger', logger);
   *
   *   return {
   *     initSettings,
   *     initServices,
   *     initBind,
   *   };
   * });
   *
   * @param {string} name Plugin name.
   * @param {function} registerFn Plugin initialization function.
   */
  register(name: string, registerFn: (ns?: Namespace) => Module | undefined) {
    if (typeof name !== 'string') {
      throw new Error(
        `ima.core.pluginLoader:register moduleName is not a string, '${typeof name}' was given.`
      );
    }

    if (typeof registerFn !== 'function') {
      throw new Error(
        `ima.core.pluginLoader:register registerFn is not a function, '${typeof registerFn}' was given.`
      );
    }

    const module = registerFn(ns);

    // Bootstrap plugin if imported dynamically (only if it's not already loaded)
    if (this._bootstrap && !this._plugins[name]) {
      this._bootstrap.initPlugin(name, module);
    }

    this._plugins[name] = { name, module: module || {} };
  }

  /**
   * Returns array of registered IMA.js plugins.
   *
   * @returns {Array} Array of IMA.js plugins.
   */
  getPlugins() {
    return Object.values(this._plugins);
  }
}

export { PluginLoader };
export default new PluginLoader();
