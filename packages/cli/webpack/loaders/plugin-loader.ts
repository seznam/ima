import { LoaderDefinitionFunction } from 'webpack';

/**
 * Custom IMA.js plugin loader. Checks imported file sources and makes sure
 * the plugins are correctly initialized.
 *
 * @param {string} source Module source.
 * @returns {string}
 */
const pluginLoader: LoaderDefinitionFunction<null> = function (source) {
  return source.includes('$registerImaPlugin')
    ? source.concat(
        `if (typeof exports.$registerImaPlugin === 'function') {
  const pluginNs = require('@ima/core').ns;
  const pluginToNs = {module: exports, name: '${this.resourcePath.replace(
    this.rootContext,
    ''
  )}'};
pluginNs.has('vendor.plugins') ? pluginNs.namespace('vendor.plugins').push(pluginToNs) : pluginNs.set('vendor.plugins',[pluginToNs]);
}`
      )
    : source;
};

export default pluginLoader;
