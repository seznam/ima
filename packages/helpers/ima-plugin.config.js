const { createConfig } = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  { ...createConfig(), output: './dist/esm' },
  { ...createConfig('commonjs'), output: './dist/cjs' },
];
