import ns from './namespace';

class PluginLoader {
  init(oc, bootstrap) {
    this._oc = oc;
    this._bootstrap = bootstrap;
  }

  register(module, modulePath) {
    if (typeof module.$registerImaPlugin !== 'function') {
      throw new Error(
        'ima.core.pluginLoader:load module.$registerImaPlugin is not a function.'
      );
    }

    // Add plugin to namespace
    const pluginNs = { module, name: modulePath };

    ns.has('vendor.plugins')
      ? ns.namespace('vendor.plugins').push(pluginNs)
      : ns.set('vendor.plugins', [pluginNs]);

    // Plugin is loaded dynamically, we need to handle the initialization
    if (this._bootstrap && this._bootstrap.isBootstrapped()) {
      this._initSettings(module, modulePath);
      this._bindDependencies(module, modulePath);
      this._initServices(module);
    }
  }

  _initSettings(module, modulePath) {
    if (typeof module.initSettings !== 'function') {
      return;
    }

    const $Helper = this._oc.get('$Helper');
    const allPluginSettings = module.initSettings(
      ns,
      this._oc,
      this._bootstrap.getConfig().settings,
      true
    );

    $Helper.assignRecursivelyWithTracking(modulePath)(
      this._bootstrap.getConfig().bind,
      $Helper.resolveEnvironmentSetting(
        allPluginSettings,
        this._bootstrap.getConfig().settings.$Env
      )
    );
  }

  _bindDependencies(module, modulePath) {
    if (typeof module.initBind !== 'function') {
      return;
    }

    module.initBind(
      ns,
      this._oc,
      this._bootstrap.getConfig().bind,
      modulePath,
      true
    );
  }

  _initServices(module) {
    if (typeof module.initServices !== 'function') {
      return;
    }

    module.initServices(
      ns,
      this._oc,
      this._bootstrap.getConfig().services,
      true
    );
  }
}

export default new PluginLoader();
