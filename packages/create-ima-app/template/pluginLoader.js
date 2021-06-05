module.exports = function (source) {
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
