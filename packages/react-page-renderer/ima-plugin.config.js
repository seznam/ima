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

// const config = generateConfig(true);

// const exclude = ['**/server.ts/**'];

// config.forEach(_config => {
//   if (_config.exclude) {
//     _config.exclude.push(...exclude);
//   } else {
//     _config.exclude = exclude;
//   }
// });

// const serverConfig = createBaseConfig('commonjs');

// serverConfig.input = './hook';
// serverConfig.output = './dist/hook';
// serverConfig.plugins = [];

// config.push(serverConfig);
