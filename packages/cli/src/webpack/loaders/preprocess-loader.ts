import { preprocess, PreprocessContext } from 'preprocess';
import { LoaderDefinitionFunction } from 'webpack';

export interface PreprocessLoaderOptions {
  context: PreprocessContext;
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
    const done = this.async();

    done(null, preprocess(source, context, 'js'));
  };

export default PreprocessLoader;
