const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  resolver: '<rootDir>/resolver.js',
};
