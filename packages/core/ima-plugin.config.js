const { clientServerConfig } = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig
 */
module.exports = {
  ...clientServerConfig,
  additionalWatchPaths: ['./transform', './polyfill', './setupJest.js'],
};
