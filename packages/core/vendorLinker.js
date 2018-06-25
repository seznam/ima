'use strict';

/**
 * Utility for linking vendor node modules with the application by exporting
 * them to the IMA loader's modules.
 */
export class VendorLinker {
  /**
   * Initializes the vendor linker.
   */
  constructor() {
    /**
     * Internal storage of loaded modules.
     *
     * @type {Map<string, Object<string, *>>}
     */
    this._modules = new Map();

    /**
     * Internal storage of loaded IMA plugins.
     *
     * @type {Object<string, *>[]}
     */
    this._plugins = [];
  }

  /**
   * Sets the provided vendor node module to the internal registry of this
   * vendor linker, and registers an IMA loader module of the same name,
   * exporting the same values.
   *
   * @param {string} moduleName The name of the module.
   * @param {Object<string, *>} moduleValues Values exported from the module.
   */
  set(moduleName, moduleValues) {
    this._modules.set(moduleName, moduleValues);

    if (typeof moduleValues.$registerImaPlugin === 'function') {
      this._plugins.push(moduleValues);
    }

    $IMA.Loader.register(moduleName, [], exports => ({
      setters: [],
      execute: () => {
        // commonjs module compatibility
        exports('default', moduleValues);
        // ES2015 module compatibility
        for (let key of Object.keys(moduleValues)) {
          exports(key, moduleValues[key]);
        }
      }
    }));
  }

  /**
   * Returns the provided vendor node module from the internal registry of this
   * vendor linker.
   *
   * @param {string} moduleName The name of the module.
   * @param {?boolean} [imaInternalModule]
   * @return {Object<string, *>} moduleValues Values exported from the module.
   */
  get(moduleName, imaInternalModule) {
    if (!this._modules.has(moduleName) && !imaInternalModule) {
      throw new Error(
        `The module '${moduleName}' is not registered.` +
          `Add the module to vendors in build.js`
      );
    }

    return this._modules.get(moduleName);
  }

  /**
   * Clears all loaded modules and plugins from this vendor linker.
   *
   * @return {VendorLinker} This vendor linker.
   */
  clear() {
    this._modules.clear();
    this._plugins = [];

    return this;
  }

  /**
   * Binds the vendor modules loaded in this vendor linker to the
   * {@code Vendor} sub-namespace of the provided namespace.
   *
   * @param {Namespace} ns The namespace to which the vendor modules should
   *        be bound.
   */
  bindToNamespace(ns) {
    let nsVendor = ns.namespace('vendor');
    for (let name of this._modules.keys()) {
      let lib = this._modules.get(name);

      if (typeof lib.$registerImaPlugin === 'function') {
        lib.$registerImaPlugin(ns);
      }

      nsVendor[name] = lib;
    }
  }

  /**
   * Returns the loaded IMA plugins as an array of export objects.
   *
   * @return {Array<Object<string, *>>} The loaded IMA plugins.
   */
  getImaPlugins() {
    return this._plugins;
  }
}

export default new VendorLinker();
