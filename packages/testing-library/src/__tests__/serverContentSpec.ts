import type { Environment, ParsedEnvironment } from '@ima/core';
import { createIMAServer } from '@ima/server';

import {
  getImaTestingLibraryServerConfig,
  setImaTestingLibraryServerConfig,
} from '../server/configuration';
import { getIMAResponseContent } from '../server/content';

jest.mock('@ima/server', () => ({
  createIMAServer: jest.fn(() => ({
    serverApp: {
      requestHandler: jest.fn(() =>
        Promise.resolve({ status: 200, content: '<main></main>' })
      ),
    },
  })),
}));

// Reports the IMA_ENV visible to the factory module, like the real factory captures it.
jest.mock('@ima/server/lib/factory/environmentFactory.js', () =>
  jest.fn(
    ({
      processEnvironment,
    }: {
      processEnvironment: (environment: Environment) => Environment;
    }) => processEnvironment({ $Env: process.env.IMA_ENV, $Version: 'test' })
  )
);

const environmentFactory = jest.requireMock<jest.Mock>(
  '@ima/server/lib/factory/environmentFactory.js'
);

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
    jest.clearAllMocks();
  });

  it('resolves the configured environment regardless of IMA_ENV and restores it', async () => {
    process.env.IMA_ENV = 'prod';
    setImaTestingLibraryServerConfig({ environment: 'test' });

    await expect(getIMAResponseContent()).resolves.toBe('<main></main>');

    expect(environmentFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationFolder: originalConfiguration.applicationFolder,
      })
    );
    expect(createIMAServer).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: expect.objectContaining({ $Env: 'test' }),
      })
    );
    expect(process.env.IMA_ENV).toBe('prod');
  });

  it('restores an unset IMA_ENV when resolving the environment fails', async () => {
    delete process.env.IMA_ENV;
    environmentFactory.mockImplementationOnce(() => {
      throw new Error('resolution failed');
    });

    await expect(getIMAResponseContent()).rejects.toThrow('resolution failed');

    expect(process.env.IMA_ENV).toBeUndefined();
  });

  it('keeps the @ima/server resolution without a configured environment', async () => {
    setImaTestingLibraryServerConfig({ environment: undefined });

    await getIMAResponseContent();

    expect(environmentFactory).not.toHaveBeenCalled();
    expect(createIMAServer).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: undefined,
        processEnvironment: expect.any(Function),
      })
    );
  });

  it('preserves the other degradation callbacks when forcing SPA mode', async () => {
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
      (currentEnvironment: Environment) => currentEnvironment
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
    expect(result?.$Server?.degradation?.isSPA?.({})).toBe(true);
    expect(processEnvironment).toHaveBeenCalledWith(result);
    expect(environment.$Server.degradation.isSPA({})).toBe(false);
  });

  it('resolves a new environment on each template generation', async () => {
    setImaTestingLibraryServerConfig({ environment: 'test' });
    await getIMAResponseContent();

    setImaTestingLibraryServerConfig({ environment: 'regression' });
    await getIMAResponseContent();

    expect(createIMAServer).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        environment: expect.objectContaining({ $Env: 'test' }),
      })
    );
    expect(createIMAServer).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        environment: expect.objectContaining({ $Env: 'regression' }),
      })
    );
  });
});
