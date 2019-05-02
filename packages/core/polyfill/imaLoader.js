(function() {
  var root;
  if (typeof window !== 'undefined' && window !== null) {
    root = window;
  } else {
    root = global;
  }

  root.$IMA = root.$IMA || {};
  var modules = {};

  root.$IMA.Loader = {
    modules: modules,
    register: function(moduleName, dependencies, moduleFactory) {
      this.modules[moduleName] = {
        dependencies: dependencies,
        dependencyOf: [],
        factory: moduleFactory,
        instance: null
      };
    },
    replaceModule: function(moduleName, dependencies, moduleFactory) {
      var moduleDescriptor = this.modules[moduleName];
      if (!moduleDescriptor) {
        throw new Error(
          'You must register module "' + moduleName + '" at first.'
        );
      }

      Object.keys(this.modules).forEach(function(modulePath) {
        var module = root.$IMA.Loader.modules[modulePath];
        module.dependencies.forEach(function(dependency) {
          if (resolveModuleName(modulePath, dependency) === moduleName) {
            module.instance = null;
          }
        });
      });

      moduleDescriptor.dependencies = dependencies;
      moduleDescriptor.factory = moduleFactory;
      moduleDescriptor.dependencyOf = [];
      moduleDescriptor.instance = null;

      return resolveModule(moduleName);
    },
    import: function(moduleName) {
      return Promise.resolve(this.importSync(moduleName));
    },
    importSync: function(moduleName) {
      if (!this.modules[moduleName]) {
        throw new Error(
          '$IMA.Loader.importSync: Module name ' +
            moduleName +
            ' is not registered. Update your build.js.'
        );
      }

      return resolveModule(moduleName);
    },
    initAllModules: function() {
      Object.keys(modules).forEach(function(moduleName) {
        resolveModule(moduleName);
      });

      return Promise.resolve();
    }
  };

  function resolveModule(moduleName, dependencyOf, parentDependencySetter) {
    if (!modules[moduleName]) {
      throw new Error(
        '$IMA.Loader.import: Module name ' +
          moduleName +
          (dependencyOf ? ' (dependency of ' + dependencyOf + ')' : '') +
          ' is not registered. Update your build.js.'
      );
    }

    var module = modules[moduleName];
    if (
      parentDependencySetter &&
      module.dependencyOf.indexOf(parentDependencySetter) === -1
    ) {
      // This is required for circular dependencies
      module.dependencyOf.push(parentDependencySetter);
    }
    if (module.instance) {
      return module.instance;
    }

    var moduleInstance = {};
    var moduleInitializer = module.factory(function _export(key, value) {
      // when exporting only functions, all of them are packed as object and sent as a key
      if (typeof key === 'object') {
        Object.keys(key).forEach(function(innerKey) {
          moduleInstance[innerKey] = key[innerKey];
        });
      } else {
        moduleInstance[key] = value;
      }
      // The exported values have been updated, notify the modules that
      // depend on this one - this is required for circular dependencies.
      module.dependencyOf.forEach(function(dependencySetter) {
        dependencySetter(moduleInstance);
      });
    });
    module.instance = moduleInstance; // allow lazy circular dependencies

    module.dependencies.forEach(function(dependencyName, index) {
      var resolvedName = resolveModuleName(moduleName, dependencyName);
      var setter = moduleInitializer.setters[index];
      var dependency = resolveModule(resolvedName, moduleName, setter);
      setter(dependency);
    });

    moduleInitializer.execute();

    return moduleInstance;
  }

  function resolveModuleName(currentModule, referencedModule) {
    var modulePath;
    if (referencedModule.substring(0, 2) === './') {
      if (currentModule.indexOf('/') > -1) {
        modulePath =
          currentModule.substring(0, currentModule.lastIndexOf('/')) +
          '/' +
          referencedModule.substring(2);
      } else {
        // the current module is in the application's root
        modulePath = referencedModule.substring(2);
      }
    } else if (referencedModule.substring(0, 3) === '../') {
      if (currentModule.indexOf('/') === -1) {
        throw new Error(
          'The ' +
            currentModule +
            ' module imports from the ' +
            'module ' +
            referencedModule +
            ' which may reside ' +
            'outside of the application directory'
        );
      }

      modulePath = currentModule.substring(0, currentModule.lastIndexOf('/'));
      modulePath =
        modulePath.substring(0, modulePath.lastIndexOf('/')) +
        '/' +
        referencedModule.substring(3);
    } else {
      return referencedModule;
    }

    modulePath = modulePath.replace(/\/\/+/g, '/');
    while (modulePath.indexOf('/./') > -1) {
      modulePath = modulePath.replace(/\/[.][/]/g, '/');
    }
    while (modulePath.indexOf('../') > -1) {
      if (modulePath.substring(0, 3) === '../') {
        throw new Error(
          'The ' +
            currentModule +
            ' module imports from the ' +
            'module ' +
            referencedModule +
            ' which may reside ' +
            'outside of the application directory'
        );
      }
      modulePath = modulePath.replace(/\/[^.][^/]*\/[.][.]\//g, '/');
      modulePath = modulePath.replace(/^[^.][^/]*\/[.][.]\//g, '');
    }
    modulePath = modulePath.replace(/^[.][/]/g, '');

    return modulePath;
  }
})();
