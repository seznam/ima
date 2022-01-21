import { LoaderDefinitionFunction } from 'webpack';

/**
 * Custom IMA.js plugin loader. Injects plugin initialization script
 * into ima plugin packages. Takes care of supporting legacy (pre IMA 18)
 * plugins with the older interface.
 *
 * @param {string} source Module source.
 * @returns {string}
 */
const ImaLegacyPluginLoader: LoaderDefinitionFunction<null> = function (
  source
) {
  const modulePath = this.resourcePath.replace(this.rootContext, '');

  // Skip ima core
  if (modulePath.includes('@ima/core')) {
    return source;
  }

  return source.includes('$registerImaPlugin') &&
    !source.includes('pluginLoader.register')
    ? source.concat(
        `
      const { pluginLoader } = require('@ima/core');

      if (pluginLoader) {
        pluginLoader.register('${modulePath}', ns => {
          $registerImaPlugin(ns);

          return {
            initBind: typeof initBind !== 'undefined' ? initBind : null,
            initSettings: typeof initSettings !== 'undefined' ? initSettings : null,
            initServices: typeof initServices !== 'undefined' ? initServices : null
          };
        });
      }
      `
      )
    : source;
};

export default ImaLegacyPluginLoader;
