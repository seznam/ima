import { LoaderDefinitionFunction } from 'webpack';

/**
 * Loader that returns empty module.
 */
const NullLoader: LoaderDefinitionFunction<null> = function () {
  this.cacheable(true);

  return '';
};

export default NullLoader;
