import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { AssetInfo, Compilation, Compiler, sources } from 'webpack';

import { ImaConfig, ImaConfigurationContext } from '../../../types';

import schema from './options.json';

export interface ManifestPluginOptions {
  context: ImaConfigurationContext;
  imaConfig: ImaConfig;
}

export interface Asset extends AssetInfo {
  name: string;
}

export interface ManifestFile {
  assets: Record<string, Asset>;
  assetsByCompiler: Record<
    ImaConfigurationContext['name'],
    Record<string, Asset>
  >;
  publicPath: string;
}

// This seed is shared among instances of this plugin
const seed: ManifestFile = {
  assets: {},
  assetsByCompiler: {
    client: {},
    'client.es': {},
    server: {},
  },
} as ManifestFile;

/**
 * This plugin takes care of generating application runtime script
 * consisting of @ima/core runner polyfill implementation embedded
 * with the webpack runtime execution code.
 */
class ManifestPlugin {
  #pluginName: string;
  #options: ManifestPluginOptions;

  static #instances = 0;
  static #generated = 0;

  constructor(options: ManifestPluginOptions) {
    this.#pluginName = this.constructor.name;
    this.#options = options;
    ManifestPlugin.#instances++;

    // Validate options
    validate(schema as Schema, this.#options, {
      name: this.#pluginName,
      baseDataPath: 'options',
    });

    seed.publicPath = this.#options.imaConfig.publicPath;
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this.#pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: this.#pluginName,
          stage: Infinity,
        },
        (assets: Compilation['assets']) => this.generate(assets, compilation)
      );
    });
  }

  /**
   * Generate runner code from compiled assets.
   */
  generate(assets: Compilation['assets'], compilation: Compilation): void {
    ManifestPlugin.#generated++;
    const compilationName = compilation?.name as
      | ImaConfigurationContext['name']
      | undefined;

    if (!compilationName) {
      return;
    }

    Object.keys(assets)
      .filter(
        assetName =>
          !assetName.includes('/chunk.') &&
          !assetName.includes('runner.js') &&
          this.#filter(compilationName, assetName)
      )
      .forEach(assetName => {
        const asset = compilation.getAsset(assetName);

        if (!asset?.name) {
          return;
        }

        const fileName = `${asset.name}`;
        const name = `${assetName.replace(
          `.${asset?.info?.contenthash as string}`,
          ''
        )}`;

        const assetWithInfo = {
          name,
          fileName,
          ...asset?.info,
        };

        seed.assetsByCompiler[compilationName][name] = assetWithInfo;
        seed.assets[name] = assetWithInfo;
      });

    if (ManifestPlugin.#generated === ManifestPlugin.#instances) {
      ManifestPlugin.#generated = 0;

      // Emit compiled ima runner with embedded runtime codes
      return compilation.emitAsset(
        './manifest.json',
        new sources.RawSource(JSON.stringify(seed, null, 2))
      );
    }
  }

  /**
   * Filter for compilation specific assets
   */
  #filter(name: ImaConfigurationContext['name'], assetName: string): boolean {
    let result = /\.(js)$/.test(assetName);

    switch (name) {
      case 'server':
        result = result && assetName.startsWith('server/');
        break;

      case 'client':
        result = result && assetName.startsWith('static/js/');
        break;

      case 'client.es':
        result = result && assetName.startsWith('static/js.es/');
        break;
    }

    // Include CSS only from the root directory
    if (this.#options.context.processCss) {
      result = result || /static\/css\/[\w.\-_]+\.css$/.test(assetName);
    }

    return result;
  }
}

export { ManifestPlugin };
