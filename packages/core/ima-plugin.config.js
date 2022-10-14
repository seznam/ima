const { createClientServerConfig, createConfig } = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  ...createClientServerConfig(),
  { ...createConfig('commonjs'), output: './dist/cjs' },
];
