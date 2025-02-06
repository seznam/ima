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

  static #generated: {
    [key in ImaConfigurationContext['name']]?: number;
  } = {};

  constructor(options: ManifestPluginOptions) {
    this.#pluginName = this.constructor.name;
    this.#options = options;

    // Track generated configurations status
    ManifestPlugin.#generated[options.context.name] = 0;

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
          this.#filter(assetName)
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

    // Mark this configuration as generated
    (ManifestPlugin.#generated[compilationName] as number)++;
    const generatedValues = Object.values(ManifestPlugin.#generated);

    // Once all configurations are generated the same amount of times then we can emit the manifest file
    // Beware! If you are changing this code, please note:
    // Using counter instead of boolean values prevents an issue, where configuration "A" is compiled multiple times
    // before configuration "B" is compiled even once.
    // With boolean values, we would emit the manifest file once configuration "B" is compiled for the first time.
    // Emitting the manifest file resets the `generated` values and after the second configuration "B" is generated
    // we get into inconsistent state, where we already consider configuration "B" to be ready for emitting,
    // but it is not. The next manifest re-build is then triggered too early and we are stuck in this inconsistent state.
    // From the user perspective, when we run `ima dev` and we change some file, the manifest file is always one version
    // behind for one of the configurations. It is very hard to debug this issue, because it is not deterministic
    // and it is hard to reproduce.
    if (generatedValues.every(v => v === generatedValues[0])) {
      // Reset tracking info
      Object.keys(ManifestPlugin.#generated).forEach(
        key =>
          (ManifestPlugin.#generated[key as ImaConfigurationContext['name']] =
            0)
      );

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
  #filter(assetName: string): boolean {
    const { outputFolders, processCss } = this.#options.context;

    // Include bundle-specific JS files
    if (/\.(js)$/.test(assetName) && assetName.startsWith(outputFolders.js)) {
      return true;
    }

    // Include CSS only from the root directory
    if (
      processCss &&
      new RegExp(`${outputFolders.css}/[\\w.\\-_]+\\.css$`).test(assetName)
    ) {
      return true;
    }

    return false;
  }
}

export { ManifestPlugin };
