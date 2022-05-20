const clone = require('clone');

function assign(target, source, parentField = null, ignoreMeta = true) {
  let fieldList = [];

  for (const field of Object.keys(source)) {
    if (ignoreMeta && field === '__meta__') {
      continue;
    }

    const value = source[field];
    const fieldPath = parentField ? parentField + '.' + field : field;
    fieldList.push(fieldPath);

    if (value instanceof Array) {
      target[field] = value.slice();
    } else if (
      value instanceof Object &&
      !(value instanceof Function) &&
      !(value instanceof RegExp)
    ) {
      if (!(target[field] instanceof Object)) {
        target[field] = {};
      }

      fieldList = fieldList.concat(assign(target[field], value, fieldPath));
    } else {
      target[field] = value;
    }
  }

  return fieldList;
}

function assignRecursively(target, ...sources) {
  for (let source of sources) {
    assign(target, source);
  }

  return target;
}

function assignRecursivelyWithTracking(referrer) {
  return function (target, ...sources) {
    let fieldsList = [];

    for (const source of sources) {
      fieldsList = fieldsList.concat(assign(target, source));
    }

    if (!(target.__meta__ instanceof Object)) {
      target.__meta__ = {};
    }

    for (const field of fieldsList) {
      target.__meta__[field] = referrer;
    }

    return target;
  };
}

function deepFreeze(object) {
  if (!(object instanceof Object)) {
    return object;
  }

  for (let property of Object.keys(object)) {
    deepFreeze(object[property]);
  }

  return Object.freeze(object);
}

const PRODUCTION_ENV_LONG = 'production';
const PRODUCTION_ENV_SHORT = 'prod';

function resolveEnvironmentSetting(
  settings = {},
  currentEnv = PRODUCTION_ENV_LONG
) {
  let baseSetting =
    settings[PRODUCTION_ENV_SHORT] || settings[PRODUCTION_ENV_LONG] || {};
  let currentSetting = settings[currentEnv];

  if (
    currentEnv !== PRODUCTION_ENV_SHORT &&
    currentEnv !== PRODUCTION_ENV_LONG &&
    currentSetting
  ) {
    assignRecursively(baseSetting, currentSetting);
  }

  return baseSetting;
}

function allPromiseHash(hash) {
  let keys = Object.keys(hash);
  let loadPromises = keys.map(key => Promise.resolve(hash[key]));

  return Promise.all(loadPromises).then(resolvedValues => {
    let result = {};

    for (let key of keys) {
      result[key] = resolvedValues.shift();
    }

    return result;
  });
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

/**
 * TODO IMA@18 - Move to server
 */
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

/**
 * TODO IMA@18 - Move to server (and probably make more inteligent)
 *
 * - Runner should not be passed as argument in server (is available globally)
 * - basically makes every value from settings available in content interpolation...
 */
function processContent({ content, runner, SPA, settings, pageState = {} }) {
  const interpolateRe = /#{([\w\d\-._$]+)}/g;
  const extendedSettings = { ...settings };
  const interpolate = (match, envKey) => extendedSettings[envKey];

  // Preprocess source and styles
  const { styles, ...source } = settings.$Source({ pageState, SPA });
  const $Styles = renderStyles(styles).replace(interpolateRe, interpolate);
  const $Source = JSON.stringify(source)
    .replace(interpolateRe, interpolate)
    .replace(/"/g, '\\"'); // Add slashes to "" to fix terser run on runner code.

  // Extends settings with source and styles
  extendedSettings.$Source = $Source;
  extendedSettings.$Styles = $Styles;

  // Preprocess $Runner (with $Source already processed)
  const $Runner = runner.replace(interpolateRe, interpolate);
  extendedSettings.$Runner = $Runner;

  // Interpolate values in content
  return content.replace(interpolateRe, interpolate);
}

module.exports = {
  assignRecursively,
  assignRecursivelyWithTracking,
  deepFreeze,
  allPromiseHash,
  escapeRegExp,
  resolveEnvironmentSetting,
  renderStyles,
  processContent,
  clone,
};
