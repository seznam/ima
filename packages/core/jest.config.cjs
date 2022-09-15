const defaultConfig = require('../../jest.config.base.js');

module.exports = {
  ...defaultConfig,
  setupFiles: ['./setupFile.js'],
};
