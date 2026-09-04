import { createIMAServer } from '@ima/server';

import { setImaTestingLibraryServerConfig } from '../server/configuration';
import { getIMAResponseContent } from '../server/content';

let mockImaEnvAtServerCreation: string | undefined;

jest.mock('@ima/server', () => ({
  createIMAServer: jest.fn(() => {
    mockImaEnvAtServerCreation = process.env.IMA_ENV;

    return {
      serverApp: {
        requestHandler: jest.fn(() =>
          Promise.resolve({ status: 200, content: '<main></main>' })
        ),
      },
    };
  }),
}));

describe('getIMAResponseContent', () => {
  const originalImaEnv = process.env.IMA_ENV;

  afterEach(() => {
    if (originalImaEnv === undefined) {
      delete process.env.IMA_ENV;
    } else {
      process.env.IMA_ENV = originalImaEnv;
    }

    mockImaEnvAtServerCreation = undefined;
    jest.clearAllMocks();
  });

  it('applies the configured environment while the IMA server is created', async () => {
    process.env.IMA_ENV = 'prod';
    setImaTestingLibraryServerConfig({ environment: 'test' });

    await expect(getIMAResponseContent()).resolves.toBe('<main></main>');

    expect(createIMAServer).toHaveBeenCalledTimes(1);
    expect(mockImaEnvAtServerCreation).toBe('test');
    expect(process.env.IMA_ENV).toBe('prod');
  });
});
