const defaultConfig = require('../../jest.conf.js');

module.exports = {
  ...defaultConfig,
  transform: {
    ...defaultConfig.transform,
    '^.+\\.tsx?$': 'ts-jest',
    '\\.[jt]sx?$': 'babel-jest',
  },
  setupFiles: [
    './test.js',
    './polyfill/imaLoader.js',
    './polyfill/imaRunner.js',
  ],
};
