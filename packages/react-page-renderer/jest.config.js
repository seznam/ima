const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  preset: '@ima/testing-library',
  testRegex: '(/__tests__/).*Spec\\.[jt]s$',
};
