import fs from 'fs';
import path from 'path';

import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { Compilation, Compiler, sources } from 'webpack';

import { ImaConfigurationContext } from '../../../types';

import schema from './options.json';

export interface GenerateRunnerPluginOptions {
  context: ImaConfigurationContext;
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
  private _runner: string;

  constructor(options: GenerateRunnerPluginOptions) {
    this._pluginName = this.constructor.name;
    this._options = options;

    // Validate options
    validate(schema as Schema, this._options, {
      name: this._pluginName,
      baseDataPath: 'options',
    });

    // Cache runner source
    this._runner = fs.readFileSync(
      path.resolve(
        path.dirname(require.resolve('@ima/core')),
        '../polyfill/runner.js'
      ),
      'utf8'
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

    // TODO cache?

    // Save runtime code into storage
    runtimeStorage[
      compilation.name === 'client.es' ? 'esRuntimeCode' : 'runtimeCode'
    ] = assets[runtimeAsset].source().toString();

    const { esRuntimeCode, runtimeCode } = runtimeStorage;
    const { legacy, command } = this._options.context;

    // Emit the runner only when we have all available runtime codes
    if (
      (command == 'build' && esRuntimeCode && runtimeCode) ||
      (command == 'dev' && legacy && esRuntimeCode && runtimeCode) ||
      (command == 'dev' && !legacy && esRuntimeCode)
    ) {
      const generatedRunner = this._runner
        .replace(/(\/\*|\/\/).*{esRuntime}.*(\*\/)?/, esRuntimeCode ?? '')
        .replace(/(\/\*|\/\/).*{runtime}.*(\*\/)?/, runtimeCode ?? '');

      // Clean storage
      runtimeStorage = {};

      // Emit compiled ima runner with embedded runtime codes
      return compilation.emitAsset(
        'static/public/runner.js',
        new sources.RawSource(generatedRunner)
      );
    }
  }
}

export { GenerateRunnerPlugin };
