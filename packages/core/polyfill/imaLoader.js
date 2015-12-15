(function() {
	var root;
	if ((typeof window !== 'undefined') && (window !== null)) {
		root = window;
	} else {
		root = GLOBAL;
	}

	root.$IMA = root.$IMA || {};
	var modules = {};

	root.$IMA.Loader = {
		modules: modules,
		register: function (moduleName, dependencies, moduleFactory) {
			this.modules[moduleName] = {
				dependencies: dependencies,
				factory: moduleFactory,
				instance: null
			};
		},
		import: function (moduleName) {
			if (!this.modules[moduleName]) {
				throw new Error('$IMA.Loader.import: Module name ' +
						moduleName + ' is not registered. Update your ' +
						'build.js.');
			}

			return Promise.resolve(resolveModule(moduleName));
		},
		initAllModules: function () {
			Object.keys(modules).forEach(function (moduleName) {
				resolveModule(moduleName);
			});
		}
	};

	function resolveModule(moduleName, dependencyOf) {
		if (!modules[moduleName]) {
			throw new Error('$IMA.Loader.import: Module name ' +
				moduleName + (
					dependencyOf ?
						(' (dependency of ' + dependencyOf + ')') :
						''
				) + ' is not registered. Update your build.js.');
		}

		var module = modules[moduleName];
		if (module.instance) {
			return module.instance;
		}

		var moduleInstance = {};
		var moduleInitializer = module.factory(function _export(key, value) {
			moduleInstance[key] = value;
		});
		module.instance = moduleInstance; // allow lazy circular dependencies

		var dependencies = module.dependencies.map(function (dependencyName) {
			return resolveModule(dependencyName, moduleName);
		});
		dependencies.forEach(function (dependency, index) {
			moduleInitializer.setters[index](dependency);
		});

		moduleInitializer.execute();

		return moduleInstance;
	}
})();
