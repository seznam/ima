import { Compiler } from 'webpack';

export interface RemoveEmptyAmpScriptsPluginOptions {
  entries: string[];
}

const CSS_RE = /\.css(\.(gz|br|map))?$/;

/**
 * Removes empty scripts generated from additional AMP entry points
 */
class RemoveEmptyAmpScriptsPlugin {
  private _pluginName: string;
  private _options: RemoveEmptyAmpScriptsPluginOptions;

  constructor(options: RemoveEmptyAmpScriptsPluginOptions) {
    this._pluginName = this.constructor.name;
    this._options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this._pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: this._pluginName,
          // run this process after all others
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        assets => {
          if (this._options.entries.length === 0) {
            return;
          }

          Object.keys(assets)
            .filter(
              filename =>
                !CSS_RE.test(filename) &&
                this._options.entries.find(entry => filename.includes(entry))
            )
            .forEach(filename => {
              compilation.deleteAsset(filename);
            });
        }
      );
    });
  }
}

export { RemoveEmptyAmpScriptsPlugin };
