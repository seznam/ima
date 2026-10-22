const {
  getImaTestingLibraryClientConfig,
} = require('./src/client/configuration');

const clientConfig = getImaTestingLibraryClientConfig();
const defaultClientConfig = {
  ...clientConfig,
  integration: { ...clientConfig.integration },
};

afterEach(() => {
  // Replaced instead of merged so overrides cannot leak into the next test.
  Object.assign(clientConfig, defaultClientConfig, {
    integration: { ...defaultClientConfig.integration },
  });
});
