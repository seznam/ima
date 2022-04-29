(function (root) {
  root.$IMA = root.$IMA || {};
  root.$IMA.Runner = root.$IMA.Runner || {
    runtime: '',
    scripts: [],
    loadedScripts: [],
    load: function (script) {
      var runner = root.$IMA.Runner;
      runner.loadedScripts.push(
        typeof script === 'string' ? script : script[0]
      );

      if (runner.scripts.length === runner.loadedScripts.length) {
        runner.run();
      }
    },
    run: function () {},
  };
})(typeof window !== 'undefined' && window !== null ? window : global);
