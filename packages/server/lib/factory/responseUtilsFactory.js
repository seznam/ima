const fs = require('fs');
const path = require('path');

module.exports = function responseUtilsFactory() {
  let runner = '';
  let manifest = '';
  let sources = '';

  const runnerPath = path.join(process.cwd(), './build/server/runner.js');
  const manifestPath = path.join(process.cwd(), './build/manifest.json');

  /**
   * Prepares default $Source object structure.
   */
  function _prepareSources(manifest) {
    const buildSource = (key, type, attr = {}) => {
      if (!manifest?.[key]) {
        return [];
      }

      const manifestValues = Object.values(manifest[key]);
      const builtSources = manifestValues
        .filter(({ name }) => name.endsWith(type) && !name.includes('/locale/'))
        .map(asset => [asset.name, attr]);

      // Add locale placeholder
      if (type === 'js') {
        const locale = manifestValues.find(({ name }) =>
          name.includes('/locale/')
        );

        if (locale) {
          builtSources.push([
            locale.name.replace(/(\/)(\w+)(\.js)$/, '$1#{$Language}$3'),
            attr,
          ]);
        }
      }

      return builtSources;
    };

    const sources = {};
    const jsAttrs = { async: true, crossorigin: 'anonymous' };

    sources.esScripts = buildSource('client.es', 'js', jsAttrs);
    sources.scripts = buildSource('client', 'js', jsAttrs);
    sources.styles = buildSource('client.es', 'css', {
      rel: 'stylesheet',
    });

    return sources;
  }

  /**
   * Adds content hashes to filename sources.
   */
  function _resolveFileSources(source, manifest, language) {
    const resourceMap = Object.values(manifest).reduce(
      (acc, cur) => ({
        ...acc,
        ...cur,
      }),
      {}
    );

    for (const key of Object.keys(source)) {
      const keySources = source[key];

      if (!Array.isArray(keySources)) {
        continue;
      }

      keySources.forEach(keySource => {
        if (!Array.isArray(keySource)) {
          keySource = resourceMap[keySource].fileName.replace(
            '#{$Language}',
            language
          );
        } else {
          keySource[0] =
            resourceMap[
              keySource[0].replace('#{$Language}', language)
            ].fileName;
        }

        // Handle SDN fallback
        if (process.env.SDN_PUBLIC_PATH) {
          if (!Array.isArray(keySource)) {
            keySource = [
              `${process.env.SDN_PUBLIC_PATH}${keySource}`,
              { fallback: keySource },
            ];
          } else {
            if (!keySource[1]?.fallback) {
              keySource[1].fallback = keySource[0];
            }

            keySource[0] = `${process.env.SDN_PUBLIC_PATH}${keySource[0]}`;
          }
        }
      });
    }
  }

  /**
   * Load manifest, runner resources and prepare sources object.
   */
  function _loadResources() {
    if (fs.existsSync(runnerPath)) {
      runner = fs.readFileSync(runnerPath, 'utf8');
    }

    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }

    sources = _prepareSources(manifest);
  }

  _loadResources();

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

    // Always reload resources in dev mode to have fresh copy
    if (process.env.IMA_CLI_WATCH) {
      _loadResources();
    }

    const { settings } = bootConfig;
    const interpolateRe = /#{([\w\d\-._$]+)}/g;
    const extendedSettings = { ...settings };
    const interpolate = (match, envKey) => extendedSettings[envKey];
    const revivalSettings = _getRevivalSettings({ response, bootConfig });
    const revivalCache = _getRevivalCache({ response });

    // Preprocess source and styles
    const { styles, ...source } =
      settings?.$Source?.(response, manifest, sources) ?? sources;

    // Add content hashes to placeholder filenames
    _resolveFileSources({ styles }, manifest, extendedSettings.$Language);
    _resolveFileSources(source, manifest, extendedSettings.$Language);

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
