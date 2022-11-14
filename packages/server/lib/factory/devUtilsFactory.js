const path = require('path');
const fs = require('fs');

module.exports = function devUtilsFactory() {
  const moduleCache = new Map();

  function getFileStats(modulePath) {
    return fs.statSync(modulePath, { throwIfNoEntry: false });
  }

  function deleteCache(modulePath, force = false) {
    if (!process.env.IMA_CLI_WATCH) {
      return;
    }

    const stats = getFileStats(modulePath) ?? { mtimeMs: -1 };

    if (!moduleCache.has(modulePath)) {
      moduleCache.set(modulePath, stats);
    }

    if (!modulePath) {
      return;
    }

    if (force || stats.mtimeMs > moduleCache.get(modulePath).mtimeMs) {
      moduleCache.set(modulePath, stats);

      searchCache(modulePath, function (mod) {
        delete require.cache[mod.id];
      });
    }
  }

  function requireUncached(module, options = {}) {
    const modulePath = path.resolve(module);

    if (options.optional && modulePath && !getFileStats(modulePath)) {
      return;
    }

    deleteCache(modulePath);

    // Force delete cache on all dependencies
    if (Array.isArray(options.dependencies)) {
      options.dependencies.forEach(dep => deleteCache(path.resolve(dep), true));
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
