import ns from './namespace';

/**
 * Plugin loader utility used to register external IMA.js plugins. This
 * adds ability for external packages to automatically hook into several
 * IMA.js application parts and automatically bootstrap certain settings.
 */
class PluginLoader {
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
    this._plugins = [];
  }

  /**
   * Initializes the plugin loader with bootstrap instance. Which is later used
   * to handle dynamically loaded IMA.js plugins.
   *
   * @param {ima.core.Bootstrap} bootstrap App bootstrap instance.
   */
  init(bootstrap) {
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
  register(name, registerFn) {
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

    const module = registerFn(ns) || {};
    this._plugins.push({ name, module });

    // Bootstrap plugin if imported dynamically
    if (this._bootstrap) {
      this._bootstrap.initPlugin(name, module);
    }
  }

  /**
   * Returns array of registered IMA.js plugins.
   *
   * @returns {Array} Array of IMA.js plugins.
   */
  getPlugins() {
    return this._plugins;
  }
}

export default new PluginLoader();
