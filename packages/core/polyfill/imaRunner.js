(function (root) {
  root.$IMA = root.$IMA || {};
  root.$IMA.Runner = root.$IMA.Runner || {
    scripts: [],
    loadedScripts: [],
    testScripts: [
      'return (() => { const o = { t: { q: true } }; return o?.t?.q && (o?.a?.q ?? true); })()',
      'return typeof Promise.allSettled === "function"',
      'return typeof globalThis !== "undefined"',
      'return typeof 9007199254740991n === "bigint"',
    ],
    createScripts: function () {
      var runner = root.$IMA.Runner;
      var scriptsRoot = root.document.getElementById('scripts');

      if (!scriptsRoot) {
        scriptsRoot = root.document.createElement('div');
        scriptsRoot.id = 'scripts';
        root.document.body.appendChild(scriptsRoot);
      }

      function replaceValues(source) {
        var newSource = source.replace('{$Language}', $IMA.$Language);

        return newSource;
      }

      function testScript(snippet) {
        try {
          var fn = new Function(snippet);
          var result = fn();

          return !!result;
        } catch (e) {
          return false;
        }
      }

      function createScript(source) {
        var scriptEl = root.document.createElement('script');

        if (typeof source === 'string') {
          scriptEl.src = replaceValues(source);
        } else {
          var src = replaceValues(source[0]);
          var options = source[1];

          scriptEl.src = src;

          Object.keys(options).forEach(function (attr) {
            if (attr === 'fallback' && options.fallback) {
              scriptEl.onerror = function () {
                var optionsCopy = {};

                // Create options copy and skip fallback
                Object.keys(options).forEach(function (attr) {
                  if (attr !== 'fallback') {
                    optionsCopy[attr] = options[attr];
                  }
                });

                createScript([options.fallback, optionsCopy]);
              };
            } else {
              scriptEl.setAttribute(attr, options[attr]);
            }
          });

          scriptEl.onload = function () {
            runner.load(source);
          };
        }

        scriptsRoot.appendChild(scriptEl);
      }

      var isEsVersion = runner.testScripts.every(testScript);

      if (isEsVersion) {
        runner.runtime = root.$IMA.$Source.esRuntime;
        runner.scripts = root.$IMA.$Source.esScripts;
      } else {
        runner.runtime = root.$IMA.$Source.runtime;
        runner.scripts = root.$IMA.$Source.scripts;
      }

      runner.scripts.forEach(createScript);
      runner.run = function () {
        createScript(runner.runtime);
      };
    },
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

  root.$IMA.Runner.createScripts();
})(typeof window !== 'undefined' && window !== null ? window : global);
