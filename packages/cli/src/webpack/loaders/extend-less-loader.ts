import { LoaderDefinitionFunction } from 'webpack';

export interface ExtendsLessLoaderOptions {
  globalsPath?: string;
}

const ExtendsLessLoader: LoaderDefinitionFunction<ExtendsLessLoaderOptions> =
  function (source) {
    this.cacheable();

    const { globalsPath } = this.getOptions();

    if (!globalsPath) {
      return source;
    }

    return `@import "${globalsPath}";\n\n${source}`;
  };

export default ExtendsLessLoader;
