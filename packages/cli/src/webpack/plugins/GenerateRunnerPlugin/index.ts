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
const runtimeStorage: {
  runtimeCode?: string;
  esRuntimeCode?: string;
} = {};

/**
 * This plugin takes care of generating application runtime script
 * consisting of @ima/core runner polyfill implementation embedded
 * with the webpack runtime execution code.
 */
class GenerateRunnerPlugin {
  #pluginName: string;
  #options: GenerateRunnerPluginOptions;
  #runnerTemplate: ejs.TemplateFunction;

  constructor(options: GenerateRunnerPluginOptions) {
    this.#pluginName = this.constructor.name;
    this.#options = options;

    // Validate options
    validate(schema as Schema, this.#options, {
      name: this.#pluginName,
      baseDataPath: 'options',
    });

    // Pre-compile runner ejs template
    this.#runnerTemplate = ejs.compile(
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
    compiler.hooks.compilation.tap(this.#pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this.#pluginName,
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

    const { name, forceLegacy } = this.#options.context;

    // Save runtime code into storage
    runtimeStorage[name === 'client.es' ? 'esRuntimeCode' : 'runtimeCode'] =
      assets[runtimeAsset].source().toString();

    const { esRuntimeCode, runtimeCode } = runtimeStorage;

    // Delete runtime asset since we inline it in the IMA runner.
    compilation.deleteAsset(runtimeAsset);

    const generatedRunner = this.#runnerTemplate({
      forceLegacy,
      esRuntime: esRuntimeCode
        ? this.#addSlashes(esRuntimeCode)
        : '// es.runtime not generated',
      runtime: runtimeCode
        ? this.#addSlashes(runtimeCode)
        : '// runtime not generated',
    });

    // Emit compiled ima runner with embedded runtime codes
    return compilation.emitAsset(
      './server/runner.js',
      new sources.RawSource(generatedRunner)
    );
  }

  /**
   * Add slashes to the runtime code so it can be used
   * as a string argument in the Function constructor.
   */
  #addSlashes(code: string) {
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
