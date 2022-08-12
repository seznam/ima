const defaultConfig = require('../../jest.config.js');

module.exports = {
  ...defaultConfig,
  resolver: '<rootDir>/resolver.js',
};
