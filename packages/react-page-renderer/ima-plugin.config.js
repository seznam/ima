const {
  clientServerConfig,
  nodeConfig,
  typescriptDeclarationsPlugin,
} = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig[]
 */
module.exports = [
  {
    ...clientServerConfig,
    plugins: [
      typescriptDeclarationsPlugin({
        additionalArgs: ['--skipLibCheck', '--project', 'tsconfig.build.json'],
      }),
    ],
  },
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
