import postcss from 'postcss';
import { validate } from 'schema-utils';
// eslint-disable-next-line import/no-unresolved
import { Schema } from 'schema-utils/declarations/validate';
import { Asset, Compilation, Compiler, sources } from 'webpack';

import schema from './options.json';

const CSS_RE = /\.css$/;

export interface PostCssPluginOptions {
  plugins: [];
  filter?: (name: string) => boolean;
}

export interface PostCssPluginCacheEntry {
  source: sources.RawSource | sources.SourceMapSource;
}

/**
 * Unlike postcss-loader this plugin runs on generated assets
 * (including ones generated from mini-css-extract-plugin) which
 * enables the use of postcss plugins on the whole bundled file.
 * Supports source map proxing and webpack cache.
 */
class PostCssPlugin {
  private _pluginName: string;
  private _options: PostCssPluginOptions;

  constructor(options: PostCssPluginOptions) {
    this._pluginName = this.constructor.name;

    // Set defaults
    this._options = {
      filter: options.filter,
      plugins: options.plugins ?? [],
    };

    // Validate options
    validate(schema as Schema, this._options, {
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
          .tap(this._pluginName, (minimized, { green, formatFlag }) =>
            minimized && green && formatFlag
              ? green(formatFlag('minimized'))
              : ''
          );
      });
    });
  }

  /**
   * Optimize assets wich cache management.
   */
  async optimize(
    assets: Compilation['assets'],
    compiler: Compiler,
    compilation: Compilation
  ): Promise<void> {
    // No point to continue without plugins
    if (this._options.plugins.length === 0) {
      return;
    }

    const cache = compilation.getCache(this._pluginName);
    const filteredAssets = await Promise.all(
      Object.keys(assets)
        .filter(name => {
          if (!CSS_RE.test(name)) {
            return false;
          }

          return this._options.filter ? this._options.filter(name) : true;
        })
        .map(async name => {
          // Cast to asset since it wont be undefined
          const { source } = compilation.getAsset(name) as Readonly<Asset>;

          const eTag = cache.getLazyHashedEtag(source);
          const cacheItem = cache.getItemCache(name, eTag);
          const output = (await cacheItem.getPromise()) as
            | PostCssPluginCacheEntry
            | undefined;

          return { name, inputSource: source, output, cacheItem };
        })
    );

    if (filteredAssets.length === 0) {
      return;
    }

    // Process sources
    await Promise.all(
      filteredAssets.map(async asset => {
        const { name, cacheItem, inputSource } = asset;
        let { output } = asset;

        // No cache, process asset
        if (!output) {
          const prevMap = inputSource.map();
          const { css, map } = await postcss(this._options.plugins).process(
            inputSource.source(),
            {
              map: prevMap ? { prev: prevMap } : {},
              from: name,
              to: name,
            }
          );

          // Create new source
          output = {
            source: map
              ? new sources.SourceMapSource(css, name, map.toJSON())
              : new sources.RawSource(css),
          };

          // Store cache
          await cacheItem.storePromise({
            source: output.source,
          } as PostCssPluginCacheEntry);
        }

        compilation.updateAsset(name, output.source);
      })
    );
  }
}

export { PostCssPlugin };
