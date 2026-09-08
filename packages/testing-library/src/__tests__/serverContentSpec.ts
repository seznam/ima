import { createIMAServer } from '@ima/server';

import {
  getImaTestingLibraryServerConfig,
  setImaTestingLibraryServerConfig,
} from '../server/configuration';
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
  const originalEnvironment = getImaTestingLibraryServerConfig().environment;

  afterEach(() => {
    if (originalImaEnv === undefined) {
      delete process.env.IMA_ENV;
    } else {
      process.env.IMA_ENV = originalImaEnv;
    }

    setImaTestingLibraryServerConfig({ environment: originalEnvironment });
    mockImaEnvAtServerCreation = undefined;
    jest.clearAllMocks();
  });

  it('passes the configured environment without changing process variables', async () => {
    process.env.IMA_ENV = 'prod';
    setImaTestingLibraryServerConfig({ environment: 'test' });

    await expect(getIMAResponseContent()).resolves.toBe('<main></main>');

    expect(createIMAServer).toHaveBeenCalledTimes(1);
    expect(createIMAServer).toHaveBeenCalledWith(
      expect.objectContaining({ environmentName: 'test' })
    );
    expect(mockImaEnvAtServerCreation).toBe('prod');
    expect(process.env.IMA_ENV).toBe('prod');
  });

  it('passes a new environment on each template generation', async () => {
    setImaTestingLibraryServerConfig({ environment: 'test' });
    await getIMAResponseContent();

    setImaTestingLibraryServerConfig({ environment: 'regression' });
    await getIMAResponseContent();

    expect(createIMAServer).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ environmentName: 'test' })
    );
    expect(createIMAServer).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ environmentName: 'regression' })
    );
  });
});
