import fs from 'node:fs';
import path from 'node:path';

import type { ViteUserConfig } from 'vitest/config';

import {
  resolveDefaultServerConfiguration,
  type ServerConfiguration,
} from './server/configuration';
import { getIMAResponseContent } from './server/content';

/**
 * Options for configuring the IMA.js testing environment.
 * Passed directly to `defineImaConfig()` in your `vitest.config.ts`.
 */
export type ImaTestingConfig = ServerConfiguration;

/**
 * Returns a Vitest UserConfig pre-configured with the IMA.js jsdom environment.
 */
export async function defineImaConfig(
  imaConfig?: Partial<ImaTestingConfig>
): Promise<ViteUserConfig> {
  const config: ServerConfiguration = {
    ...resolveDefaultServerConfiguration(),
    ...imaConfig,
  };

  let html: string;

  try {
    html = await getIMAResponseContent(config);
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
          url: `${config.protocol}//${config.host}/`,
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
