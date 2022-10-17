const { generateConfig, createBaseConfig } = require('@ima/plugin-cli');

const config = generateConfig(true);

const exclude = ['**/server.ts/**'];

config.forEach(_config => {
  if (_config.exclude) {
    _config.exclude.push(...exclude);
  } else {
    _config.exclude = exclude;
  }
});

const serverConfig = createBaseConfig('commonjs');

serverConfig.input = './hook';
serverConfig.output = './dist/hook';
serverConfig.plugins = [];

config.push(serverConfig);

module.exports = config;
