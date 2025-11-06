const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  rootDir: '.',
  testRegex: '(/__tests__/).*Spec\\.[jt]s$',
};

