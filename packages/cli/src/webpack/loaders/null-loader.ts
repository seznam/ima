import { LoaderDefinitionFunction } from 'webpack';

/**
 * Loader that returns empty module.
 */
const NullLoader: LoaderDefinitionFunction<null> = function () {
  return '';
};

export default NullLoader;
