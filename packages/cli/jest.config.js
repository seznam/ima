const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  testRegex: '(/__tests__/).*Spec\\.[jt]s$',
};
