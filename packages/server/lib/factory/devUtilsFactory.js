const fs = require('fs');
const path = require('path');

module.exports = function devUtilsFactory({ applicationFolder }) {
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
        if (process.env.IMA_CLI_WATCH) {
          await global.$IMA_SERVER?.viteDevServer?.ssrLoadModule(
            assets[dependency].fileName
          );
        } else {
          require(
            path.resolve(
              path.join(
                applicationFolder,
                './build',
                assets[dependency].fileName
              )
            )
          );
        }
      }
    }

    if (process.env.IMA_CLI_WATCH) {
      return global.$IMA_SERVER?.viteDevServer?.ssrLoadModule(
        assets[module].fileName
      );
    }

    return require(
      path.resolve(
        path.join(applicationFolder, './build', assets[module]?.fileName)
      )
    );
  }

  return { manifestRequire };
};
