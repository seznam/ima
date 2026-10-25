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

describe('getIMAResponseContent', () => {
  const originalConfiguration = { ...getImaTestingLibraryServerConfig() };

  afterEach(() => {
    setImaTestingLibraryServerConfig(originalConfiguration);
    jest.clearAllMocks();
  });

  it('leaves environment selection to @ima/server', async () => {
    await expect(getIMAResponseContent()).resolves.toBe('<main></main>');

    expect(originalConfiguration).not.toHaveProperty('environment');
    expect(jest.mocked(createIMAServer).mock.calls[0]?.[0]).not.toHaveProperty(
      'environment'
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
});
