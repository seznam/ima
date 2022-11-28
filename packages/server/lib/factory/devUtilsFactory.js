const fs = require('fs');
const path = require('path');

module.exports = function devUtilsFactory() {
  function manifestRequire(module, options = {}) {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve('./build/manifest.json'))
    );

    if (Array.isArray(options?.dependencies)) {
      options?.dependencies.forEach(dependency =>
        require(path.resolve(
          `./build/${manifest['server'][dependency].fileName}`
        ))
      );
    }

    return require(path.resolve(
      `./build/${manifest['server'][module].fileName}`
    ));
  }

  return manifestRequire;
};
