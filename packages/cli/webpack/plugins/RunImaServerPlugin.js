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
          childProcess.fork(path.join(this._options.rootDir, 'build/server'));

          // TODO -> use on('spawn'), but it doesn't seems to work right now
          if (this._options.open) {
            this._openBrowser(`http://localhost:${this._options.port || 3001}`);
          }

          this._serverStart = true;
        }

        callback();
      }
    );
  }

  _openBrowser(url) {
    const [command, args = []] = this._browserCommand();

    childProcess.execFile(command, [...args, encodeURI(url)]);
  }

  _browserCommand() {
    const { platform } = process;

    switch (platform) {
      case 'android':
      case 'linux':
        return ['xdg-open'];
      case 'darwin':
        return ['open'];
      case 'win32':
        return ['cmd', ['/c', 'start']];
      default:
        throw new Error(`Platform ${platform} isn't supported.`);
    }
  }
}

module.exports = RunImaServerPlugin;
