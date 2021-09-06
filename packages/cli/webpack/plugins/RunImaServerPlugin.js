const path = require('path');
const childProcess = require('child_process');
const open = require('better-opn');

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
            path.join(this._options.rootDir, 'build/server'),
            [`--verbose=${this._options.verbose}`],
            {
              stdio: 'inherit'
            }
          );

          // TODO -> use on('spawn'), but it doesn't seems to work right now
          if (this._options.open) {
            try {
              open(`http://localhost:${this._options.port || 3001}`);
            } catch (error) {
              console.error(
                `Could not open http://localhost:${
                  this._options.port || 3001
                } inside a browser.`
              );
            }
          }

          this._serverStart = true;
        }

        callback();
      }
    );
  }
}

module.exports = RunImaServerPlugin;
