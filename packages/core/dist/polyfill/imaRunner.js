(function(root) {
  root.$IMA = root.$IMA || {};
  root.$IMA.Runner = root.$IMA.Runner || {
    scripts: [],
    loadedScripts: [],
    load: function(script) {
      var runner = root.$IMA.Runner;
      runner.loadedScripts.push(script.src);
      if (runner.scripts.length === runner.loadedScripts.length) {
        if (typeof runner.onLoad === 'function') {
          runner.onLoad();
        }
        runner.run();
      }
    },
    run: function() {
      root.$IMA.Loader.initAllModules()
        .then(function() {
          return root.$IMA.Loader.import('app/main');
        })
        .catch(function(error) {
          var runner = root.$IMA.Runner;
          if (typeof runner.onError === 'function') {
            root.$IMA.Runner.onError(error);
          }
          console.error(error);
        });
    }
  };
})(typeof window !== 'undefined' && window !== null ? window : global);
