import fs from 'fs';
import path from 'path';

import postcss from 'postcss';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import { Compilation, Compiler, sources } from 'webpack';

import PostCssScrambler from '../postCssScrambler';

import schema from './options.json';

const CSS_RE = /\.css$/;

export interface ScrambleCssMinimizerOptions {
  hashTableFilename?: string;
  mainAssetFilter?: (filename: string) => boolean;
}

export interface ScrambleCssMinimizerCacheEntry {
  source: sources.RawSource | sources.SourceMapSource;
  hashTableSource: string | null;
}

/**
 * ScrambleCssMinimizer plugin runs our own postcss scramble plugin
 * on the generated webpack css assets. Handles caching and hash table
 * generation only on the main files while others are simply hashed using
 * existing hash table.
 */
class ScrambleCssMinimizer {
  private _pluginName: string;
  private _options: Required<ScrambleCssMinimizerOptions>;
  private _hashTablePath?: string;

  constructor(options: ScrambleCssMinimizerOptions = {}) {
    this._pluginName = this.constructor.name;

    // Set defaults
    this._options = {
      hashTableFilename:
        options?.hashTableFilename ?? 'static/css/hashTable.json',
      mainAssetFilter:
        options?.mainAssetFilter ??
        // Filter main app.css file
        (filename => filename?.endsWith('app.css')),
    };

    // Validate options
    validate(schema as Schema, this._options, {
      name: this._pluginName,
      baseDataPath: 'options',
    });
  }

  /**
   * Add compilation hooks to the webpack compiler
   */
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this._pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this._pluginName,
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true,
        },
        (assets: Compilation['assets']) => this.optimize(assets, compilation)
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
   * Optimize css assets using postCss plugin. By default first file that
   * is returned from mainAssetFilter is used as base to generate hashMap,
   * other files are scrambled using existing map.
   */
  async optimize(
    assets: Compilation['assets'],
    compilation: Compilation
  ): Promise<void> {
    const [mainCssAsset, restCssAssets] = this._filterAssets(
      Object.keys(assets)
    );

    // Skip if there is no main asset in the processed assets
    if (!mainCssAsset) {
      return;
    }

    // Resolve absolute path for hash table filename
    this._hashTablePath = path.isAbsolute(this._options.hashTableFilename)
      ? this._options.hashTableFilename
      : path.join(
          compilation.outputOptions.path ?? process.cwd(),
          this._options.hashTableFilename
        );

    // First process main and generate hash table
    await this._process(mainCssAsset, compilation);

    // Process rest of the css assets with generated hash table
    await Promise.all(
      restCssAssets.map(cssAsset => this._process(cssAsset, compilation, false))
    );
  }

  /**
   * Process single css asset, while handling cache management
   */
  private async _process(
    filename: string,
    compilation: Compilation,
    generateHashTable = true
  ): Promise<void> {
    // Check cache
    const cache = compilation.getCache(this._pluginName);
    const { source } = compilation.getAsset(filename) || {};

    if (!source) {
      return;
    }

    const eTag = cache.getLazyHashedEtag(source);
    const cacheItem = cache.getItemCache(filename, eTag);
    const output =
      (await cacheItem.getPromise()) as ScrambleCssMinimizerCacheEntry;

    // Restore data from cache
    if (output) {
      compilation.updateAsset(filename, output.source);
      this._restoreHashTable(output.hashTableSource);
      return;
    }

    const prevMap = source.map();

    // Process css using postcss plugin
    const { css, map } = await postcss([
      PostCssScrambler({
        generateHashTable,
        hashTablePath: this._hashTablePath,
      }),
    ]).process(source.source(), {
      map: prevMap ? { prev: prevMap } : false,
      from: filename,
      to: filename,
    });

    // Create new source
    const newSource = map
      ? new sources.SourceMapSource(css, filename, map.toJSON())
      : new sources.RawSource(css);

    // Store cache
    await cacheItem.storePromise({
      source: newSource,
      hashTableSource: generateHashTable ? await this._loadHashTable() : null,
    } as ScrambleCssMinimizerCacheEntry);

    compilation.updateAsset(filename, newSource);
  }

  /**
   * Restore hashTable.json file from the target path.
   */
  private async _loadHashTable(): Promise<string | null> {
    if (this._hashTablePath) {
      return fs.promises.readFile(this._hashTablePath, 'utf8');
    }

    return null;
  }

  /**
   * Restore hashTable.json file to the target directory
   * from webpack cache.
   */
  private async _restoreHashTable(
    hashTableSource: string | null
  ): Promise<void> {
    if (!hashTableSource || !this._hashTablePath) {
      return;
    }

    if (!fs.existsSync(this._hashTablePath)) {
      await fs.promises.mkdir(path.dirname(this._hashTablePath), {
        recursive: true,
      });
    }

    return fs.promises.writeFile(this._hashTablePath, hashTableSource, {
      encoding: 'utf8',
    });
  }

  /**
   * Filter CSS assets and split them into two groups of main file and
   * other css files for additional processing using hash tabels.
   */
  private _filterAssets(assets: string[]): [string, string[]] {
    const cssAssets = assets.filter(asset => CSS_RE.test(asset));
    const [mainAsset] = cssAssets.splice(
      cssAssets.findIndex(asset => this._options.mainAssetFilter(asset)),
      1
    );

    return [mainAsset, cssAssets];
  }
}

export { ScrambleCssMinimizer };
