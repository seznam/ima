/** @jest-environment jsdom */

import { waitFor } from '@testing-library/dom';

import { setImaTestingLibraryClientConfig } from '../client/configuration';
import { clearImaApp, initImaApp } from '../integration';

describe('integration timers', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('lets Testing Library advance Jest fake timers while an application boots', async () => {
    jest.useFakeTimers();

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: async () => {
          await expect(
            waitFor(
              () => {
                throw new Error('not ready');
              },
              { timeout: 50 }
            )
          ).rejects.toThrow('not ready');

          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');
  });

  it('does not restore fake timers over real timers installed after boot', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const app = await initImaApp({ initRoutes: () => {} });

    jest.useRealTimers();
    const realSetTimeout = global.setTimeout;

    await clearImaApp(app);

    expect(global.setTimeout).toBe(realSetTimeout);
  });
});
