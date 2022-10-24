import fs from 'fs';

import { LoaderDefinitionFunction } from 'webpack';

export interface ExtendLessLoaderOptions {
  globalsPath?: string;
}

/**
 * This loader extends less functionality in ima.js applications by enabling
 * glob imports in the @import ""; less expression and preppending import
 * to global.less file if it exist into every process less file (so globals
 * are available without additional imports).
 *
 * @param {string} source Module source.
 * @returns {string}
 */
const ExtendLessLoader: LoaderDefinitionFunction<ExtendLessLoaderOptions> =
  function (source) {
    this.cacheable(true);

    const { globalsPath } = this.getOptions();

    return globalsPath &&
      fs.existsSync(globalsPath) &&
      this.resourcePath !== globalsPath
      ? `@import "${globalsPath}";\n\n${source}`
      : source;
  };

export default ExtendLessLoader;
