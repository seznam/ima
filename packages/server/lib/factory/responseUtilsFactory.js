const fs = require('fs');
const path = require('path');

module.exports = function responseUtilsFactory() {
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
      sources: _prepareSources(manifest),
      runner: fs.existsSync(runnerPath)
        ? fs.readFileSync(runnerPath, 'utf8')
        : '',
    };
  }

  /**
   * Prepares default sources object structure assembled
   * from the built manifest.json file.
   */
  function _prepareSources({ assetsByCompiler: assets }) {
    const buildSource = (name, type, attr = {}) => {
      if (!assets?.[name]) {
        return [];
      }

      // Filter unwanted assets
      const assetsData = Object.values(assets[name]);
      const filteredAssets = assetsData.filter(
        ({ name }) => name.endsWith(type) && !name.includes('/locale/')
      );

      // Add locale placeholder
      if (type === 'js') {
        const locale = assetsData.find(({ name }) => name.includes('/locale/'));

        if (locale) {
          filteredAssets.push({
            name: locale.name.replace(/(\/)(\w+)(\.js)$/, '$1#{$Language}$3'),
          });
        }
      }

      return filteredAssets.map(asset => [asset.name, attr]);
    };

    return {
      styles: buildSource('client.es', 'css', {
        rel: 'stylesheet',
      }),
      scripts: buildSource('client', 'js', {
        async: true,
        crossorigin: 'anonymous',
      }),
      esScripts: buildSource('client.es', 'js', {
        async: true,
        crossorigin: 'anonymous',
      }),
    };
  }

  /**
   * Resolve sources placeholders with real paths and hashes.
   */
  function _resolveSources(sourceDefinition, { assets, publicPath }, language) {
    // Helper to resolve single sources object entry
    const resolveSourceEntry = sources =>
      sources
        .map(source => {
          const resolvedSource = Array.isArray(source)
            ? [...source]
            : [source, {}];
          const resolvedSrc = resolvedSource[0].replace(
            '#{$Language}',
            language
          );

          if (!assets[resolvedSrc]?.fileName) {
            return;
          }

          resolvedSource[0] = publicPath + assets[resolvedSrc].fileName;

          // Handle CDN fallback
          if (process.env.CDN_STATIC_ROOT_URL) {
            if (!resolvedSource[1]?.fallback) {
              resolvedSource[1].fallback = resolvedSource[0];
            }

            resolvedSource[0] = `${process.env.CDN_STATIC_ROOT_URL}${resolvedSource[0]}`;
          }

          return resolvedSource;
        })
        .filter(Boolean);

    return Object.keys(sourceDefinition).reduce((acc, cur) => {
      if (!sourceDefinition[cur].length) {
        return acc;
      }

      acc[cur] = resolveSourceEntry(sourceDefinition[cur]);

      return acc;
    }, {});
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

  // Preload resources
  let resources = _loadResources();

  function processContent({ response, bootConfig }) {
    if (!response?.content || !bootConfig) {
      return response?.content;
    }

    // Always reload resources in dev mode to have fresh copy
    if (process.env.IMA_CLI_WATCH) {
      resources = _loadResources();
    }

    const { settings } = bootConfig;
    const interpolateRe = /#{([\w\d\-._$]+)}/g;
    const extendedSettings = { ...settings };
    const interpolate = (match, envKey) => extendedSettings[envKey];
    const revivalSettings = _getRevivalSettings({ response, bootConfig });
    const revivalCache = _getRevivalCache({ response });

    // Get current file sources to load
    const sourcesDefinition =
      settings?.$Source?.(response, resources.manifest, resources.sources) ??
      resources.sources;

    // Resolve real files using manifest
    const { styles, ...source } = _resolveSources(
      sourcesDefinition,
      resources.manifest,
      extendedSettings.$Language
    );

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
    const $Runner = _renderScript(resources.runner).replace(
      interpolateRe,
      interpolate
    );
    extendedSettings.$Runner = $Runner;

    const $Scripts = _renderScripts([
      revivalSettings,
      resources.runner,
      revivalCache,
    ]).replace(interpolateRe, interpolate);
    extendedSettings.$Scripts = $Scripts;

    // Interpolate values in content
    return response.content.replace(interpolateRe, interpolate);
  }

  return {
    processContent,
    sendResponseHeaders,
    _resolveSources,
    _prepareSources,
    _renderStyles,
    _prepareCookieOptionsForExpress,
  };
};
