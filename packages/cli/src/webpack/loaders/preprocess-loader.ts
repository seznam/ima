import { preprocess } from 'preprocess';
import { LoaderDefinitionFunction } from 'webpack';

export interface PreprocessLoaderOptions {
  context: Record<string, boolean | number | string | undefined | null>;
}

/**
 * Runs source through https://www.npmjs.com/package/preprocess package.
 *
 * @param {string} source Module source.
 * @returns {string}
 */
const PreprocessLoader: LoaderDefinitionFunction<PreprocessLoaderOptions> =
  function (source) {
    const { context } = this.getOptions();

    return preprocess(source, context, 'js');
  };

export default PreprocessLoader;
