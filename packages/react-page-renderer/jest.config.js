const {
  setImaTestingLibraryServerConfig,
  FALLBACK_APPLICATION_FOLDER,
} = require('@ima/testing-library');

const defaultConfig = require('../../jest.config.base.js');

setImaTestingLibraryServerConfig({
  applicationFolder: FALLBACK_APPLICATION_FOLDER,
});

module.exports = {
  ...defaultConfig,
  preset: '@ima/testing-library',
  testRegex: '(/__tests__/).*Spec\\.[jt]s$',
};
