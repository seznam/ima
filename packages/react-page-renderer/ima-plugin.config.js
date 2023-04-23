const { clientServerConfig, nodeConfig } = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  clientServerConfig,
  {
    ...nodeConfig,
    inputDir: './hook',
    output: [
      {
        dir: './dist/hook',
        format: 'commonjs',
      },
    ],
    plugins: [],
  },
];
