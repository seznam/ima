import fs from 'fs';
import path from 'path';

import ejs from 'ejs';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { Compilation, Compiler, sources } from 'webpack';

import { ImaConfig, ImaConfigurationContext } from '../../../types';

import schema from './options.json';

export interface GenerateRunnerPluginOptions {
  context: ImaConfigurationContext;
  imaConfig: ImaConfig;
  runnerTemplate?: string;
}

// Stores runtime code across multiple webpack compilers.
let runtimeStorage: {
  runtimeCode?: string;
  esRuntimeCode?: string;
} = {};

/**
 * This plugin takes care of generating application runtime script
 * consisting of @ima/core runner polyfill implementation embedded
 * with the webpack runtime execution code.
 */
class GenerateRunnerPlugin {
  private _pluginName: string;
  private _options: GenerateRunnerPluginOptions;
  private _runnerTemplate: ejs.TemplateFunction;

  constructor(options: GenerateRunnerPluginOptions) {
    this._pluginName = this.constructor.name;
    this._options = options;

    // Validate options
    validate(schema as Schema, this._options, {
      name: this._pluginName,
      baseDataPath: 'options',
    });

    // Pre-compile runner ejs template
    this._runnerTemplate = ejs.compile(
      options.runnerTemplate ??
        fs.readFileSync(
          path.resolve(
            path.dirname(require.resolve('@ima/core')),
            '../../polyfill/runner.ejs'
          ),
          'utf8'
        )
    );
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this._pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this._pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_DERIVED,
          additionalAssets: true,
        },
        (assets: Compilation['assets']) => this.generate(assets, compilation)
      );
    });
  }

  /**
   * Generate runner code from compiled assets.
   */
  async generate(
    assets: Compilation['assets'],
    compilation: Compilation
  ): Promise<void> {
    const runtimeAsset = Object.keys(assets).find(assetName =>
      assetName.endsWith('runtime.js')
    );

    if (!runtimeAsset) {
      return;
    }

    const { disableLegacyBuild } = this._options.imaConfig;
    const { legacy, command, name } = this._options.context;

    // Save runtime code into storage
    runtimeStorage[name === 'client.es' ? 'esRuntimeCode' : 'runtimeCode'] =
      assets[runtimeAsset].source().toString();

    const { esRuntimeCode, runtimeCode } = runtimeStorage;

    // Delete runtime asset since we inline it in the IMA runner.
    compilation.deleteAsset(runtimeAsset);

    // Emit the runner only when we have all available runtime codes
    if (
      (disableLegacyBuild && esRuntimeCode) ||
      (command == 'build' && esRuntimeCode && runtimeCode) ||
      (command == 'dev' && legacy && esRuntimeCode && runtimeCode) ||
      (command == 'dev' && !legacy && esRuntimeCode)
    ) {
      const generatedRunner = this._runnerTemplate({
        esRuntime: this._addSlashes(esRuntimeCode),
        runtime: runtimeCode
          ? this._addSlashes(runtimeCode)
          : '// runtime not generated',
      });

      // Clean storage
      runtimeStorage = {};

      // Emit compiled ima runner with embedded runtime codes
      return compilation.emitAsset(
        './server/runner.js',
        new sources.RawSource(generatedRunner)
      );
    }
  }

  /**
   * Add slashes to the runtime code so it can be used
   * as a string argument in the Function constructor.
   */
  private _addSlashes(code: string) {
    return code
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\f/g, '\\f')
      .replace(/\r/g, '\\r')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
  }
}

export { GenerateRunnerPlugin };
