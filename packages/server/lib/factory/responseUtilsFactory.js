const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { renderMeta, encodeHTMLEntities } = require('./utils/metaUtils');
const {
  renderScript,
  renderStyles,
  prepareDefaultResources,
} = require('./utils/resourcesUtils');

module.exports = function responseUtilsFactory({ applicationFolder }) {
  const contentInterpolationRe = /#{([\w\d\-._$]+)}/g;
  const runnerPath = path.resolve(
    applicationFolder,
    './build/server/runner.js'
  );
  const manifestPath = path.resolve(applicationFolder, './build/manifest.json');
  const uuidPrefix = `${Date.now().toString(36)}-${(
    Math.random() * 2057
  ).toString(36)}`;

  /**
   * Load manifest, runner resources and prepare sources object.
   */
  function _loadTemplates() {
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

  function _getRevivalSettings({ res, settings, response }) {
    const requestID = `${uuidPrefix}-${crypto.randomUUID()}`;
    res.locals.requestID = requestID;

    return `(function (root) {
      root.$Debug = ${settings.$Debug};
      root.$IMA = root.$IMA || {};
      $IMA.SPA = ${response?.SPA ?? false};
      $IMA.SPAPrefetch = ${response?.spaPrefetch ?? false};
      $IMA.$PublicPath = "${process.env.IMA_PUBLIC_PATH ?? ''}";
      $IMA.$RequestID = "${requestID}";
      $IMA.$Language = "${
        settings.$Language && encodeHTMLEntities(settings.$Language)
      }";
      $IMA.$Env = "${settings.$Env}";
      $IMA.$Debug = ${settings.$Debug};
      $IMA.$Version = "${settings.$Version}";
      $IMA.$App = ${JSON.stringify(settings.$App)};
      $IMA.$Protocol = "${
        settings.$Protocol && encodeHTMLEntities(settings.$Protocol)
      }";
      $IMA.$Host = "${settings.$Host && encodeHTMLEntities(settings.$Host)}";
      $IMA.$Root = "${settings.$Root && encodeHTMLEntities(settings.$Root)}";
      $IMA.$LanguagePartPath = "${
        settings.$LanguagePartPath &&
        encodeHTMLEntities(settings.$LanguagePartPath)
      }";
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
    for (let [name, param] of context?.response?.page?.cookie ?? []) {
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

    res.set(context?.response?.page?.headers ?? {});
  }

  // Preload resources
  let templates = _loadTemplates();

  /**
   * Create base set of content variables, containing meta tags,
   * runner, revival settings, revival cache and JS and CSS source
   * tags generated from manifest.json in build folder.
   *
   * @param event IMA hooks server event.
   * @returns object Object with default set of content variables.
   */
  function createContentVariables({ res, context }) {
    const { response, bootConfig, app } = context;

    if (!bootConfig?.settings) {
      return {};
    }

    const metaManager = app?.oc?.get('$MetaManager');
    const { settings } = bootConfig;

    // Always reload resources in dev mode to have fresh copy
    if (process.env.IMA_CLI_WATCH) {
      templates = _loadTemplates();
    }

    const { manifest, runner } = templates;
    const defaultResources = prepareDefaultResources(
      manifest,
      settings.$Language
    );

    // Get current file sources to load
    const processedResources =
      settings?.$Resources?.(response, manifest, defaultResources) ??
      defaultResources;

    return {
      _: {
        manifest,
        resources: processedResources,
      },
      // Add slashes to "" to fix terser minification on runner code.
      scriptResources: JSON.stringify({
        scripts: processedResources.scripts,
        esScripts: processedResources.esScripts,
      }).replace(/"/g, '\\"'),
      revivalSettings: renderScript(
        'revival-settings',
        _getRevivalSettings({ response, settings, res })
      ),
      revivalCache: renderScript(
        'revival-cache',
        _getRevivalCache({ response })
      ),
      runner: renderScript('runner', runner),
      styles: renderStyles(
        processedResources.esStyles ?? processedResources.styles
      ),
      meta: renderMeta(metaManager),
    };
  }

  /**
   * Processes resposne content containing content variables #{...} placeholders,
   * which are replaced by the contents of the variables. The replacement
   * is done recursively, until there are no placeholders to interpolate.
   *
   * Additionally to content variables, you can use any value from bootConfig
   * which is included in the interpolation process.
   *
   * @param event IMA hooks server event.
   * @returns string Processed response content.
   */
  function processContent({ context }) {
    const { response, bootConfig } = context;

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
    encodeHTMLEntities,
    sendResponseHeaders,
    _prepareCookieOptionsForExpress,
  };
};
