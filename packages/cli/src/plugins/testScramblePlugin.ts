import path from 'path';

import postcss from 'postcss';
import { Compilation, Compiler, sources } from 'webpack';

import postCssScrambler from './scramble-css/postCssScrambler';

class TestScramblePlugin {
  apply(compiler: Compiler) {
    const pluginName = this.constructor.name;

    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage:
            compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true,
        },
        (assets: Compilation['assets']) => this.optimize(assets, compilation)
      );
    });
  }

  async optimize(
    assets: Compilation['assets'],
    compilation: Compilation
  ): Promise<void> {
    const [cssFile] = Object.keys(assets).filter(
      asset => asset.endsWith('app.min.css') || asset.endsWith('app.css')
    );

    if (!cssFile) {
      return;
    }

    const { css, map } = await postcss([
      postCssScrambler({
        generateHashTable: true,
        hashTable: path.join(process.cwd(), './build/hashMap.json'),
      }),
    ]).process(assets[cssFile].source(), {
      map: assets[cssFile].map(),
      from: cssFile,
      to: cssFile,
    });

    compilation.updateAsset(
      cssFile,
      map
        ? new sources.SourceMapSource(css, cssFile, map)
        : new sources.RawSource(css)
    );
  }
}

export { TestScramblePlugin };
