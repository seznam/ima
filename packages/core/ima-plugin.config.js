const {
  clientServerConfig,
  typescriptDeclarationsPlugin,
} = require('@ima/plugin-cli');

/**
 * @type import('@ima/plugin-cli').ImaPluginConfig
 */
module.exports = {
  ...clientServerConfig,
  plugins: [
    typescriptDeclarationsPlugin({
      // Use different config for build, so it does not include spec file declarations
      additionalArgs: ['--skipLibCheck', '--project', 'tsconfig.build.json'],
    }),
  ],
};
