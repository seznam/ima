const fs = require('fs');
const path = require('path');

module.exports = function responseUtilsFactory() {
  let runner = '';

  const runnerPath = path.resolve('./build/static/public/runner.js');
  if (fs.existsSync(runnerPath)) {
    runner = fs.readFileSync(runnerPath, 'utf8');
  }

  function renderStyles(styles) {
    if (!Array.isArray(styles)) {
      return '';
    }

    return styles
      .map(style => {
        if (typeof style === 'string') {
          return `<link rel="stylesheet" href="${style}" />`;
        }

        const [href, { fallback = null, ...options }] = style;
        const linkTagParts = [`<link href="${href}"`];

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

  function getRevivalSettings({ bootConfig, response }) {
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

  function getRevivalCache({ response }) {
    return `(function (root) {
      root.$IMA = root.$IMA || {};
      $IMA.Cache = ${response?.cache?.serialize?.() ?? JSON.stringify({})};
    })(typeof window !== 'undefined' && window !== null ? window : global);
    `;
  }

  function renderScripts(scripts) {
    if (!Array.isArray(scripts)) {
      return '';
    }

    return scripts.map(renderScript).join('');
  }

  function renderScript(script) {
    return `<script>${script}</script>`;
  }

  // TODO IMA@18 add tests
  function processContent({ response, bootConfig }) {
    if (!response?.content || !bootConfig) {
      return response?.content;
    }

    const { settings } = bootConfig;
    const interpolateRe = /#{([\w\d\-._$]+)}/g;
    const extendedSettings = { ...settings };
    const interpolate = (match, envKey) => extendedSettings[envKey];
    const revivalSettings = getRevivalSettings({ response, bootConfig });
    const revivalCache = getRevivalCache({ response });

    // Preprocess source and styles
    const { styles, ...source } = settings.$Source(response);
    const $Styles = renderStyles(styles).replace(interpolateRe, interpolate);
    const $RevivalSettings = renderScript(revivalSettings).replace(
      interpolateRe,
      interpolate
    );
    const $RevivalCache = renderScript(revivalCache).replace(
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
    const $Runner = renderScript(runner).replace(interpolateRe, interpolate);
    extendedSettings.$Runner = $Runner;

    const $Scripts = renderScripts([
      revivalSettings,
      runner,
      revivalCache,
    ]).replace(interpolateRe, interpolate);
    extendedSettings.$Scripts = $Scripts;

    // Interpolate values in content
    return response.content.replace(interpolateRe, interpolate);
  }

  return { processContent, renderStyles };
};
