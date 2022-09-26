const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  setupFiles: ['./setupFile.js'],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/).*Spec\\.ts$',
  transform: {
    '\\.ts$': ['ts-jest'],
  },
};
