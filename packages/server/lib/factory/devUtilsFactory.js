const path = require('path');
const fs = require('fs');

module.exports = function devUtilsFactory() {
  const moduleCache = new Map();

  function getFileStats(modulePath) {
    return fs.statSync(modulePath, { throwIfNoEntry: false });
  }

  function requireUncached(module, options = {}) {
    const modulePath = path.resolve(module);

    if (process.env.IMA_CLI_WATCH) {
      const stats = getFileStats(modulePath) ?? { mtimeMs: -1 };
      if (!moduleCache.has(modulePath)) {
        moduleCache.set(modulePath, stats);
      }

      if (!modulePath) {
        return;
      }

      if (stats.mtimeMs > moduleCache.get(modulePath).mtimeMs) {
        moduleCache.set(modulePath, stats);

        searchCache(modulePath, function (mod) {
          delete require.cache[mod.id];
        });
      }
    }

    if (options.optional && modulePath && !getFileStats(modulePath)) {
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
