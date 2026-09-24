const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  setupFilesAfterEnv: ['<rootDir>/setupJestAfterEnv.js'],
  testRegex: '(/__tests__/).*Spec\\.[jt]s$',
};
