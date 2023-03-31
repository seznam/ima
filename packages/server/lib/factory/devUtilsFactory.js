const fs = require('fs');
const path = require('path');

module.exports = function devUtilsFactory() {
  function manifestRequire(module, options = {}) {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve('./build/manifest.json'))
    );
    const assets = manifest.assetsByCompiler.server;

    if (options?.optional && !assets[module]?.fileName) {
      return;
    }

    if (Array.isArray(options?.dependencies)) {
      options?.dependencies.forEach(dependency =>
        require(path.resolve(path.join('./build', assets[dependency].fileName)))
      );
    }

    return require(path.resolve(
      path.join('./build', assets[module]?.fileName)
    ));
  }

  return { manifestRequire };
};
