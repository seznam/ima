import fs from 'node:fs';
import path from 'node:path';

import type { UserConfig } from 'vitest/config';

import {
  getIMAResponseContent,
  getImaTestingLibraryServerConfig,
} from './server';

/**
 * Returns a Vitest UserConfig pre-configured with the IMA.js jsdom environment.
 *
 * Consumers should merge this with their own config using mergeConfig():
 *
 * ```ts
 * // vitest.config.ts
 * import { defineConfig, mergeConfig } from 'vitest/config';
 * import { getVitestConfig } from '@ima/testing-library/vitest-preset';
 *
 * export default defineConfig(async () => {
 *   return mergeConfig(await getVitestConfig(), {
 *     test: {
 *       // project-specific overrides
 *     },
 *   });
 * });
 * ```
 */
export async function getVitestConfig(): Promise<UserConfig> {
  const serverConfig = getImaTestingLibraryServerConfig();

  let html: string;

  try {
    html = await getIMAResponseContent();
  } catch (error: any) {
    // Some async errors are swallowed by Vitest, so log them manually
    console.error(error.stack ?? error);

    if (error.cause) {
      console.error(error.cause.stack ?? error.cause);
    }

    throw new Error(
      'Failed to get IMA response content. Check the error above.'
    );
  }

  const appMainExists = fs.existsSync(path.resolve('./app/main.js'));

  return {
    test: {
      setupFiles: [
        '@ima/core/setupVitest.js',
        '@ima/testing-library/vitestSetupFileAfterEnv',
      ],
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          html,
          url: `${serverConfig.protocol}//${serverConfig.host}/`,
        },
      },
    },
    resolve: {
      alias: {
        'app/main': appMainExists
          ? path.resolve('./app/main.js')
          : '@ima/testing-library/fallback/app/main',
      },
    },
  };
}
