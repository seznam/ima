import clone from 'clone';

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
      target[field] = clone(value);
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

export {
  assignRecursively,
  assignRecursivelyWithTracking,
  deepFreeze,
  allPromiseHash,
  escapeRegExp,
  resolveEnvironmentSetting,
  clone,
};
