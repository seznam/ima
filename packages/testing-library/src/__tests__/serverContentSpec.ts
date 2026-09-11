import type { ParsedEnvironment } from '@ima/core';
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
  const originalConfiguration = { ...getImaTestingLibraryServerConfig() };

  afterEach(() => {
    if (originalImaEnv === undefined) {
      delete process.env.IMA_ENV;
    } else {
      process.env.IMA_ENV = originalImaEnv;
    }

    setImaTestingLibraryServerConfig(originalConfiguration);
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

  it('preserves normalized degradation settings when forcing SPA mode', async () => {
    const degradation = {
      isSPA: () => false,
      isSPAPrefetch: () => true,
      isOverloaded: () => false,
      isStatic: () => false,
    };
    const environment: ParsedEnvironment = {
      $Env: 'test',
      $Debug: false,
      $Version: 'test',
      $App: {},
      $Resources: (_response, _manifest, defaultResources) => defaultResources,
      $Language: { '//*:*': 'en' },
      $Server: {
        protocol: 'https:',
        host: 'imajs.io',
        port: 3001,
        staticPath: '/static',
        concurrency: 5,
        clusters: null,
        cache: {
          enabled: true,
          cacheKeyGenerator: () => 'test',
          entryTtl: 15000,
          unusedEntryTtl: 10000,
          maxEntries: 200,
        },
        loggerFactory: () => console,
        degradation,
      },
    };
    const processEnvironment = jest.fn(
      (currentEnvironment: ParsedEnvironment) => currentEnvironment
    );
    setImaTestingLibraryServerConfig({ processEnvironment });

    await getIMAResponseContent();

    const result = jest
      .mocked(createIMAServer)
      .mock.calls[0]?.[0].processEnvironment?.(environment);

    expect(result).toEqual({
      ...environment,
      $Debug: true,
      $Server: {
        ...environment.$Server,
        concurrency: 0,
        degradation: { ...degradation, isSPA: expect.any(Function) },
      },
    });
    expect(result?.$Server.degradation.isSPA({})).toBe(true);
    expect(processEnvironment).toHaveBeenCalledWith(result);
    expect(environment.$Server.degradation.isSPA({})).toBe(false);
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
