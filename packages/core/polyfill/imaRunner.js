(function (root) {
  /**
   * Simple es5-compatible Object.assign polyfill.
   * Credits goes to MDN.
   */
  function assign(target) {
    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  }

  /**
   * $IMA.Runner can be completely overridden, so we have to shallow merge
   * potential existing object with the default runner.
   */
  root.$IMA = root.$IMA || {};
  root.$IMA.Runner = assign(
    {
      scripts: [],
      loadedScripts: [],
      // es11 env test scripts
      testScripts: [
        'return (() => { const o = { t: { q: true } }; return o?.t?.q && (o?.a?.q ?? true); })()',
        'return typeof Promise.allSettled === "function"',
        'return typeof globalThis !== "undefined"',
        'return typeof 9007199254740991n === "bigint"',
      ],
      /**
       * Handles creation of script elements and their injection to the DOM.
       * It also takes care of testing the browser environment and determining
       * what version should be loaded.
       */
      initScripts: function () {
        var runner = root.$IMA.Runner;
        var scriptsRoot = root.document.getElementById('scripts');

        if (!scriptsRoot) {
          scriptsRoot = root.document.createElement('div');
          scriptsRoot.id = 'scripts';
          root.document.body.appendChild(scriptsRoot);
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

        /**
         * Handles script element creation and its insertion
         * to the dom (div#script element). Works with simple string
         * as src or ['src', { options }] format.
         */
        function createScript(source) {
          var scriptEl = root.document.createElement('script');

          function replaceValues(source) {
            var newSource = source.replace('{$Language}', root.$IMA.$Language);

            return newSource;
          }

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

        /**
         * Sets concrete scripts to the runner based on the currently
         * supported ecma script version.
         */
        if (runner.testScripts.every(testScript)) {
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
      run: function () {},
      load: function (script) {
        var runner = root.$IMA.Runner;

        runner.loadedScripts.push(
          typeof script === 'string' ? script : script[0]
        );

        if (runner.scripts.length === runner.loadedScripts.length) {
          runner.run();
        }
      },
    },
    root.$IMA.Runner || {}
  );

  root.$IMA.Runner.initScripts();
})(typeof window !== 'undefined' && window !== null ? window : global);
