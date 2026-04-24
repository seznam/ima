import type { Config } from 'jest';

import {
  getIMAResponseContent,
  getImaTestingLibraryServerConfig,
} from './server';

/**
 * Jest preset for IMA.js integration tests.
 *
 * Sets up jsdom with IMA's server-rendered HTML (same as jest-preset), but without
 * the app/main moduleNameMapper — the integration initImaApp loads the app
 * dynamically from the configurable appMainPath instead.
 *
 * Usage in jest.config.js:
 *   preset: '@ima/testing-library/jest-preset-integration'
 *
 * Configure the integration initImaApp via setIntegrationConfig() in a jest setup file.
 */
const jestConfig: Promise<Config> = (async () => {
  const serverConfig = getImaTestingLibraryServerConfig();

  let html;

  try {
    html = await getIMAResponseContent();
  } catch (error: any) {
    // Some async errors are swallowed by jest, so we need to log them manually
    console.error(error.stack ?? error);

    if (error.cause) {
      // eslint-disable-next-line no-console
      console.log();
      console.error(error.cause.stack ?? error.cause);
    }

    throw new Error(
      'Failed to get IMA response content. Check the error above.'
    );
  }

  return {
    setupFiles: ['@ima/core/setupJest.js'],
    setupFilesAfterEnv: ['@ima/testing-library/jestSetupFileAfterEnv'],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
      html,
      url: `${serverConfig.protocol}//${serverConfig.host}/`,
    },
  };
})();

export default jestConfig;
