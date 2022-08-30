const path = require('path');

module.exports = function devUtilsFactory({ environment }) {
  const modulePathCache = new Map();

  function requireUncached(module, options = {}) {
    if (!modulePathCache.has(module)) {
      modulePathCache.set(module, path.resolve(module));
    }

    const modulePath = modulePathCache.get(module);

    const moduleName = require.resolve(modulePath);
    if (environment.$Env === 'dev') {
      if (!moduleName) {
        return;
      }

      searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
      });
    }

    if (!moduleName && options.optional) {
      return;
    }

    return require(modulePath);
  }

  function searchCache(moduleName, callback) {
    if (moduleName && require.cache[moduleName] !== undefined) {
      const module = require.cache[moduleName];

      traverse(module, callback);

      Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
        if (cacheKey.indexOf(moduleName) > -1) {
          delete module.constructor._pathCache[cacheKey];
        }
      });
    }
  }

  function traverse(module, callback) {
    (module?.children || []).forEach(function (child) {
      if (child && require.cache[child.id] !== undefined) {
        traverse(require.cache[child.id], callback);
      }
    });

    callback(module);
  }

  return requireUncached;
};
