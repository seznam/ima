const defaultConfig = require('../../jest.conf.js');

module.exports = {
  ...defaultConfig,
  setupFiles: [
    './test.js',
    './polyfill/imaLoader.js',
    './polyfill/imaRunner.js',
  ],
};
