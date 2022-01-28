import { LoaderDefinitionFunction } from 'webpack';

export interface ExtendLessLoaderOptions {
  globalsPath?: string;
}

const ExtendLessLoader: LoaderDefinitionFunction<ExtendLessLoaderOptions> =
  function (source) {
    this.cacheable();

    const { globalsPath } = this.getOptions();

    if (!globalsPath) {
      return source;
    }

    return `@import "${globalsPath}";\n\n${source}`;
  };

export default ExtendLessLoader;
