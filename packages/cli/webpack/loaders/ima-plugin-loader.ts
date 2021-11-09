import { LoaderDefinitionFunction } from 'webpack';

/**
 * Custom IMA.js plugin loader. Injects plugin initialization script
 * into ima plugin packages.
 *
 * @param {string} source Module source.
 * @returns {string}
 */
const imaPluginLoader: LoaderDefinitionFunction<null> = function (source) {
  const modulePath = this.resourcePath.replace(this.rootContext, '');

  return source.includes('$registerImaPlugin')
    ? source.concat(
        `require('@ima/core').pluginLoader.register(exports, '${modulePath}')`
      )
    : source;
};

export default imaPluginLoader;
