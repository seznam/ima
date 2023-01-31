const fs = require('fs');
const path = require('path');
const memoizeOne = require('memoize-one');
const { _renderMetaTags } = require('./contentVariableHelpers/metaHelpers');
const {
  _prepareSource,
  _renderScript,
  _renderStyles,
} = require('./contentVariableHelpers/sourceHelpers');

module.exports = function responseUtilsFactory() {
  const contentInterpolationRe = /#{([\w\d\-._$]+)}/g;
  const runnerPath = path.resolve('./build/server/runner.js');
  const manifestPath = path.resolve('./build/manifest.json');

  /**
   * Load manifest, runner resources and prepare sources object.
   */
  function _loadResources() {
    const manifest = fs.existsSync(manifestPath)
      ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      : {};

    return {
      manifest,
      runner: fs.existsSync(runnerPath)
        ? fs.readFileSync(runnerPath, 'utf8')
        : '',
    };
  }

  function _getRevivalSettings({ settings, response }) {
    return `(function (root) {
      root.$Debug = ${settings.$Debug};
      root.$IMA = root.$IMA || {};
      $IMA.SPA = ${response?.SPA ?? false};
      $IMA.$Language = "${settings.$Language}";
      $IMA.$Env = "${settings.$Env}";
      $IMA.$Debug = ${settings.$Debug};
      $IMA.$Version = "${settings.$Version}";
      $IMA.$App = ${JSON.stringify(settings.$App)};
      $IMA.$Protocol = "${settings.$Protocol}";
      $IMA.$Host = "${settings.$Host}";
      $IMA.$Path = "${settings.$Path}";
      $IMA.$Root = "${settings.$Root}";
      $IMA.$LanguagePartPath = "${settings.$LanguagePartPath}";
    })(typeof window !== 'undefined' && window !== null ? window : global);
    `;
  }

  function _getRevivalCache({ response }) {
    return `(function (root) {
      root.$IMA = root.$IMA || {};
      $IMA.Cache = ${response?.page?.cache ?? JSON.stringify({})};
    })(typeof window !== 'undefined' && window !== null ? window : global);
    `;
  }

  function _setCookieHeaders({ res, context }) {
    for (let [name, param] of context?.page?.cookie ?? []) {
      const options = _prepareCookieOptionsForExpress(param.options);
      res.cookie(name, param.value, options);
    }
  }

  function _prepareCookieOptionsForExpress(options) {
    let expressOptions = Object.assign({}, options);

    if (typeof expressOptions.maxAge === 'number') {
      expressOptions.maxAge *= 1000;
    } else {
      delete expressOptions.maxAge;
    }

    return expressOptions;
  }

  function sendResponseHeaders({ context, res }) {
    _setCookieHeaders({ res, context });
    res.set(context?.page?.headers ?? {});
  }

  // Preload resources
  let resources = _loadResources();
  const memoPrepareSources = memoizeOne((manifest, language) =>
    _prepareSource(manifest, language)
  );

  function createContentVariables({ response, bootConfig }) {
    if (!bootConfig?.settings) {
      return {};
    }

    const { settings } = bootConfig;

    // Always reload resources in dev mode to have fresh copy
    if (process.env.IMA_CLI_WATCH) {
      resources = _loadResources();
    }

    // Generate default $Source structure
    const defaultSource = memoPrepareSources(
      resources.manifest,
      settings.$Language
    );

    // Get current file sources to load
    const { styles: sourceStyles, ...sourceScripts } =
      settings?.$Source?.(response, resources.manifest, defaultSource) ??
      defaultSource;

    // Add slashes to "" to fix terser run on runner code.
    const source = JSON.stringify(sourceScripts).replace(/"/g, '\\"');
    const revivalSettings = _renderScript(
      'revival-settings',
      _getRevivalSettings({ response, settings })
    );
    const revivalCache = _renderScript(
      'revival-cache',
      _getRevivalCache({ response })
    );
    const runner = _renderScript('runner', resources.runner);
    const styles = _renderStyles(sourceStyles);

    return {
      ...response.contentVariables,
      _: {
        manifest: resources.manifest,
        sourceStyles,
        sourceScripts,
      },
      source,
      revivalSettings,
      revivalCache,
      runner,
      styles,
      metaTags: _renderMetaTags({ response }),

      // Backwards compatibility, remove in IMA@19
      $Source: source,
      $RevivalSettings: revivalSettings,
      $RevivalCache: revivalCache,
      $Runner: runner,
      $Styles: styles,
      $Scripts: [revivalSettings, runner, revivalCache].join(''),
    };
  }

  function processContent({ response, bootConfig }) {
    if (!response?.content || !bootConfig) {
      return response?.content;
    }

    const { settings } = bootConfig;
    const extendedSettings = { ...settings, ...response.contentVariables };
    const interpolate = (_, envKey) => extendedSettings[envKey] ?? '';

    while (response.content.match(contentInterpolationRe)) {
      response.content = response.content.replace(
        contentInterpolationRe,
        interpolate
      );
    }

    return response.content;
  }

  return {
    createContentVariables,
    processContent,
    sendResponseHeaders,
    _renderStyles,
    _prepareCookieOptionsForExpress,
  };
};
