(function(root) {
	root.$IMA = root.$IMA || {};
	root.$IMA.Runner = root.$IMA.Runner || {
		scripts: [],
		loadedScripts: [],
		load: function(script) {
			this.loadedScripts.push(script.src);
			if (this.scripts.length === this.loadedScripts.length) {
				this.run();
			}
		},
		run: function() {
			root.$IMA.Loader.initAllModules()
				.then(function() {
					return root.$IMA.Loader.import("app/main");
				})
				.catch(function(error) {
					console.error(error);
				});
		}
	};
})(typeof window !== 'undefined' && window !== null ? window : GLOBAL);
