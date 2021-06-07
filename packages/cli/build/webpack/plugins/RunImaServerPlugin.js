const path = require('path');
const childProcess = require('child_process');

class RunImaServerPlugin {
  constructor(options = {}) {
    this._options = options;
    this._serverStart = false;
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync(
      'RunImaServerPlugin',
      (compilation, callback) => {
        if (!this._serverStart && this._options.rootDir) {
          childProcess.fork(
            path.resolve(this._options.rootDir, './build/server')
          );

          this._serverStart = true;
        }

        callback();
      }
    );
  }
}

module.exports = RunImaServerPlugin;
