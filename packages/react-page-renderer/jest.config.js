const {
  setImaTestingLibraryServerConfig,
  FALLBACK_APP_MAIN_PATH,
  FALLBACK_APPLICATION_FOLDER,
} = require('@ima/testing-library/server');

const defaultConfig = require('../../jest.config.base.js');

setImaTestingLibraryServerConfig({
  applicationFolder: FALLBACK_APPLICATION_FOLDER,
});

module.exports = {
  ...defaultConfig,
  preset: '@ima/testing-library',
  moduleNameMapper: {
    'app/main': FALLBACK_APP_MAIN_PATH,
  },
  testRegex: '(/__tests__/).*Spec\\.[jt]s$',
};
