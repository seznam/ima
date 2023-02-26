const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  testEnvironment: 'jsdom',
};
