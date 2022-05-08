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
      isEsVersion: false,
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
            return source
              .replace('{language}', root.$IMA.$Language)
              .replace('{version}', root.$IMA.$Version);
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
              runner.onLoad(source);
            };
          }

          scriptsRoot.appendChild(scriptEl);
        }

        runner.isEsVersion = runner.testScripts.every(testScript);

        /**
         * Sets concrete scripts to the runner based on the currently
         * supported ecma script version.
         */
        if (runner.isEsVersion) {
          runner.scripts = root.$IMA.$Source.esScripts;
        } else {
          runner.scripts = root.$IMA.$Source.scripts;
        }

        runner.scripts.forEach(createScript);
      },

      /**
       * Executes the appropriate runtime based on the current
       * es environment after all scripts are loaded. The {esRuntime} and
       * {runtime} placeholders are replaced with the actual runtime code
       * at the build time.
       */
      run: function () {
        var runner = root.$IMA.Runner;

        try {
          if (runner.isEsVersion) {
            /* {esRuntime} */
          } else {
            /* {runtime} */
          }
        } catch (error) {
          runner.onError(error);
        }
      },

      /**
       * This handler should be called for every script defined
       * in the scripts array, since only when all of the scripts are
       * loaded, the run callback is called.
       */
      onLoad: function (script) {
        var runner = root.$IMA.Runner;

        runner.loadedScripts.push(
          typeof script === 'string' ? script : script[0]
        );

        if (runner.scripts.length === runner.loadedScripts.length) {
          runner.run();
        }
      },

      /**
       * Optional onError handler. It is triggered in case the runtime
       * code fails to run the application.
       */
      onError: function (error) {
        console.error('IMA Runner ERROR:', error);
      },
    },
    root.$IMA.Runner || {}
  );

  root.$IMA.Runner.initScripts();
  Object.seal(root.$IMA.Runner);
})(typeof window !== 'undefined' && window !== null ? window : global);
