import postcss from 'postcss';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { Asset, Compilation, Compiler, sources } from 'webpack';

import schema from './options.json';

const CSS_RE = /\.css$/;

export interface PostCSSPluginOptions {
  plugins: [];
  filter?: (name: string) => boolean;
}

export interface PostCSSPluginCacheEntry {
  source: sources.RawSource | sources.SourceMapSource;
}

/**
 * Unlike postcss-loader this plugin runs on generated assets
 * (including ones generated from mini-css-extract-plugin) which
 * enables the use of postcss plugins on the whole bundled file.
 * Supports source map proxing and webpack cache.
 */
class PostCSSPlugin {
  private _pluginName: string;
  private options: PostCSSPluginOptions;

  constructor(options: PostCSSPluginOptions) {
    this._pluginName = this.constructor.name;

    // Set defaults
    this.options = {
      filter: options.filter,
      plugins: options.plugins ?? [],
    };

    // Validate options
    validate(schema as Schema, this.options, {
      name: this._pluginName,
      baseDataPath: 'options',
    });
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this._pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this._pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          additionalAssets: true,
        },
        (assets: Compilation['assets']) =>
          this.optimize(assets, compiler, compilation)
      );

      compilation.hooks.statsPrinter.tap(this._pluginName, stats => {
        stats.hooks.print
          .for('asset.info.minimized')
          .tap('post-css-plugin', (minimized, { green, formatFlag }) =>
            minimized && green && formatFlag
              ? green(formatFlag('minimized'))
              : ''
          );
      });
    });
  }

  /**
   * Optimize css assets using postCss plugin. By default first file that
   * is returned from mainAssetFilter is used as base to generate hashMap,
   * other files are scrambled using existing map.
   */
  async optimize(
    assets: Compilation['assets'],
    compiler: Compiler,
    compilation: Compilation
  ): Promise<void> {
    // No point to continue without plugins
    if (this.options.plugins.length === 0) {
      return;
    }

    const cache = compilation.getCache(this._pluginName);
    const filteredAssets = await Promise.all(
      Object.keys(assets)
        .filter(name => {
          if (!CSS_RE.test(name)) {
            return false;
          }

          return this.options.filter ? this.options.filter(name) : true;
        })
        .map(async name => {
          // Cast to asset since it wont be undefined
          const { source } = compilation.getAsset(name) as Readonly<Asset>;

          const eTag = cache.getLazyHashedEtag(source);
          const cacheItem = cache.getItemCache(name, eTag);
          const output = (await cacheItem.getPromise()) as
            | PostCSSPluginCacheEntry
            | undefined;

          return { name, inputSource: source, output, cacheItem };
        })
    );

    if (filteredAssets.length === 0) {
      return;
    }

    const { RawSource, SourceMapSource } = compiler.webpack.sources;

    // Process sources
    await Promise.all(
      filteredAssets.map(async asset => {
        const { name, cacheItem, inputSource } = asset;
        let { output } = asset;

        // No cache, process asset
        if (!output) {
          const { css, map } = await postcss(this.options.plugins).process(
            inputSource.source(),
            {
              map: inputSource.map(),
              from: name,
              to: name,
            }
          );

          // Create new source
          output = {
            source: map
              ? new SourceMapSource(css, name, map)
              : new RawSource(css),
          };

          // Store cache
          await cacheItem.storePromise({
            source: output.source,
          } as PostCSSPluginCacheEntry);
        }

        compilation.updateAsset(name, output.source);
      })
    );
  }
}

export { PostCSSPlugin };
