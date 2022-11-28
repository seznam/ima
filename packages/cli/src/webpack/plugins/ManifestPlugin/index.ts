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

export type ManifestFile = Record<
  ImaConfigurationContext['name'],
  Record<string, Asset>
>;

const seed: ManifestFile = {} as ManifestFile;

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
          /\.(js|css)$/.test(assetName) &&
          !assetName.endsWith('runner.js') &&
          !assetName.includes('/hot/')
      )
      .forEach(assetName => {
        const asset = compilation.getAsset(assetName);

        if (!asset?.name) {
          return;
        }

        if (!seed[compilationName]) {
          seed[compilationName] = {};
        }

        const fileName = `/${asset.name}`;
        const name = `/${assetName.replace(
          `.${asset?.info?.contenthash as string}`,
          ''
        )}`;

        seed[compilationName][name] = {
          name,
          fileName,
          ...asset?.info,
        };
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
}

export { ManifestPlugin };
