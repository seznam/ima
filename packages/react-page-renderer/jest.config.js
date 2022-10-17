const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  setupFiles: [],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/).*Spec\\.ts$',
  transform: {
    '\\.[jt]sx?$': ['ts-jest'],
  },
};
