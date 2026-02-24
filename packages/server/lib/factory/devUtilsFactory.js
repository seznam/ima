const fs = require('fs');
const path = require('path');

module.exports = function devUtilsFactory({ applicationFolder, vite }) {
  async function manifestRequire(module, options = {}) {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(applicationFolder, './build/manifest.json'))
    );
    const assets = manifest.assetsByCompiler.server;

    if (options?.optional && !assets[module]?.fileName) {
      return;
    }

    if (Array.isArray(options?.dependencies)) {
      for (const dependency of options.dependencies) {
        if (vite) {
          await vite.ssrLoadModule(assets[dependency].fileName);
        } else {
          require(
            path.resolve(
              path.join(applicationFolder, './build', assets[dependency].fileName)
            )
          )
        }
      }
    }

    if (vite) {
      return vite.ssrLoadModule(assets[module].fileName);
    }

    return require(
      path.resolve(
        path.join(applicationFolder, './build', assets[module]?.fileName)
      )
    );
  }

  return { manifestRequire };
};
