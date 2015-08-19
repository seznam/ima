(function() {
	var root = (typeof window !== 'undefined' && window !== null) ? window : GLOBAL;

	root.$IMA = root.$IMA || {};

	root.$IMA.Loader = {
		modules: {},
		register: function(moduleName, dependencies, makeModule) {
			var self = this;
			this.modules[moduleName] = {};

			var module = makeModule(function(key, value) {
				self.modules[moduleName][key] = value;
			});

			module.setters.map(function(setter, index) {
				if (!self.modules[dependencies[index]]) {
					throw new Error('$IMA.Loader.register: Dependency ' + dependencies[index] +
							' is not registered. Update your build.js');
				}

				setter(self.modules[dependencies[index]]);
			});

			module.execute();
		},
		import: function(moduleName) {
			if (!this.modules[moduleName]) {
				throw new Error('$IMA.Loader.import: Module name ' + moduleName +
						' is not registered. Update your build.js.');
			}

			return Promise.resolve(this.modules[moduleName]);
		}
	};
})();