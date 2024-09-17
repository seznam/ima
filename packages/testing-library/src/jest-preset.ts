import fs from 'node:fs';
import path from 'node:path';

import type { Config } from 'jest';

import {
  getIMAResponseContent,
  getImaTestingLibraryServerConfig,
} from './server';

/**
 * Jest configuration for IMA testing library.
 * We are entering undocumented territory here, jestConfig is a promise, but documentation does not mention, if it is allowed.
 * It would be nice if there was a synchronous and more straightforward way of generating IMA SPA content.
 */
const jestConfig: Promise<Config> = (async () => {
  const serverConfig = getImaTestingLibraryServerConfig();

  let html;

  try {
    html = await getIMAResponseContent();
  } catch (error: any) {
    // Some async errors are swallowed by jest, so we need to log them manually and throw a safe error
    console.error(error.stack ?? error);

    throw new Error(
      'Failed to get IMA response content. Check the error above.'
    );
  }

  return {
    setupFiles: ['@ima/core/setupJest.js'],
    setupFilesAfterEnv: ['@ima/testing-library/jestSetupFileAfterEnv'],
    moduleNameMapper: {
      '^app/main$': fs.existsSync(path.resolve('./app/main.js'))
        ? '<rootDir>/app/main'
        : '@ima/testing-library/fallback/app/main',
    },
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
      html,
      url: `${serverConfig.protocol}//${serverConfig.host}/`,
    },
  };
})();

export default jestConfig;
