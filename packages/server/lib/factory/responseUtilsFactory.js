const fs = require('fs');
const path = require('path');

module.exports = function responseUtilsFactory() {
  let runner = '';

  const runnerPath = path.resolve('./build/server/runner.js');
  if (fs.existsSync(runnerPath)) {
    runner = fs.readFileSync(runnerPath, 'utf8');
  }

  function _renderStyles(styles) {
    if (!Array.isArray(styles)) {
      return '';
    }

    return styles
      .map(style => {
        if (typeof style === 'string') {
          return `<link rel="stylesheet" href="${style}" />`;
        }

        const [href, { fallback = null, rel = 'stylesheet', ...options }] =
          style;
        const linkTagParts = [`<link href="${href}" rel="${rel}"`];

        // Generate fallback handler
        if (fallback) {
          linkTagParts.push(
            `onerror="this.onerror=null;this.href='${fallback}';"`
          );
        }

        // Generate other attributes
        for (const [attr, value] of Object.entries(options)) {
          linkTagParts.push(`${attr}="${value}"`);
        }

        linkTagParts.push('/>');

        return linkTagParts.join(' ');
      })
      .join('');
  }

  function _getRevivalSettings({ bootConfig, response }) {
    const { settings } = bootConfig;

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

  function _renderScripts(scripts) {
    if (!Array.isArray(scripts)) {
      return '';
    }

    return scripts.map(_renderScript).join('');
  }

  function _renderScript(script) {
    return `<script>${script}</script>`;
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

  // TODO IMA@18 add tests
  function processContent({ response, bootConfig }) {
    if (!response?.content || !bootConfig) {
      return response?.content;
    }

    // Always reload runner script in watch mode
    if (process.env.IMA_CLI_WATCH && fs.existsSync(runnerPath)) {
      runner = fs.readFileSync(runnerPath, 'utf8');
    }

    const { settings } = bootConfig;
    const interpolateRe = /#{([\w\d\-._$]+)}/g;
    const extendedSettings = { ...settings };
    const interpolate = (match, envKey) => extendedSettings[envKey];
    const revivalSettings = _getRevivalSettings({ response, bootConfig });
    const revivalCache = _getRevivalCache({ response });

    // Preprocess source and styles
    const { styles, ...source } = settings.$Source(response);
    const $Styles = _renderStyles(styles).replace(interpolateRe, interpolate);
    const $RevivalSettings = _renderScript(revivalSettings).replace(
      interpolateRe,
      interpolate
    );
    const $RevivalCache = _renderScript(revivalCache).replace(
      interpolateRe,
      interpolate
    );
    const $Source = JSON.stringify(source)
      .replace(interpolateRe, interpolate)
      .replace(/"/g, '\\"'); // Add slashes to "" to fix terser run on runner code.

    // Extends settings with source and styles
    extendedSettings.$Source = $Source;
    extendedSettings.$Styles = $Styles;
    extendedSettings.$RevivalSettings = $RevivalSettings;
    extendedSettings.$RevivalCache = $RevivalCache;

    // Preprocess $Runner (with $Source already processed)
    const $Runner = _renderScript(runner).replace(interpolateRe, interpolate);
    extendedSettings.$Runner = $Runner;

    const $Scripts = _renderScripts([
      revivalSettings,
      runner,
      revivalCache,
    ]).replace(interpolateRe, interpolate);
    extendedSettings.$Scripts = $Scripts;

    // Interpolate values in content
    return response.content.replace(interpolateRe, interpolate);
  }

  return {
    processContent,
    sendResponseHeaders,
    _renderStyles,
    _prepareCookieOptionsForExpress,
  };
};
