const defaultConfig = require('../../jest.config.js');

module.exports = {
  ...defaultConfig,
  setupFiles: ['./setupFile.js'],
};
