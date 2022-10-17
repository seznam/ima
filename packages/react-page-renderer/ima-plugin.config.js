const { createClientServerConfig, generateConfig } = require('@ima/plugin-cli');

const config = createClientServerConfig();

const exclude = ['**/server.ts/**'];

config.forEach(_config => {
  if (_config.exclude) {
    _config.exclude.push(...exclude);
  } else {
    _config.exclude = exclude;
  }
});

const serverConfig = generateConfig('commonjs');

serverConfig.input = './hook';
serverConfig.output = './dist/hook';
serverConfig.plugins = [];

config.push(serverConfig);

module.exports = config;
