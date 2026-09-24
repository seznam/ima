import path from 'node:path';

import type { Environment } from '@ima/core';
import { createIMAServer } from '@ima/server';

import { getImaTestingLibraryServerConfig } from './configuration';

type ProcessEnvironment = (environment: Environment) => Environment;
type EnvironmentFactory = (options: {
  applicationFolder: string;
  processEnvironment: ProcessEnvironment;
}) => Environment;

const serverConfig = getImaTestingLibraryServerConfig();

/**
 * Resolves the named environment through a freshly loaded environmentFactory,
 * because @ima/server reads IMA_ENV only once, when the factory module loads.
 * IMA_ENV and the module cache are restored afterwards.
 */
function createEnvironment(
  environmentName: string,
  applicationFolder: string,
  processEnvironment: ProcessEnvironment
): Environment {
  const factoryPath = require.resolve(
    '@ima/server/lib/factory/environmentFactory.js'
  );
  const cachedFactory = require.cache[factoryPath];
  const imaEnv = process.env.IMA_ENV;

  try {
    delete require.cache[factoryPath];
    process.env.IMA_ENV = environmentName;

    const environmentFactory = require(factoryPath) as EnvironmentFactory;

    return environmentFactory({ applicationFolder, processEnvironment });
  } finally {
    if (imaEnv === undefined) {
      delete process.env.IMA_ENV;
    } else {
      process.env.IMA_ENV = imaEnv;
    }

    if (cachedFactory) {
      require.cache[factoryPath] = cachedFactory;
    } else {
      delete require.cache[factoryPath];
    }
  }
}

/**
 * Get response content from @ima/server.
 */
export async function getIMAResponseContent(): Promise<string> {
  // Mock devUtils to override manifest loading
  const devUtils = {
    manifestRequire: () => ({}),
  };

  await serverConfig.beforeCreateIMAServer();

  const processEnvironment: ProcessEnvironment = currentEnvironment =>
    serverConfig.processEnvironment({
      ...currentEnvironment,
      $Server: {
        ...currentEnvironment.$Server,
        concurrency: 0,
        degradation: {
          ...currentEnvironment.$Server?.degradation,
          isSPA: () => true,
        },
      },
      $Debug: true,
    });

  // Prepare serverApp with environment override
  const imaServer = await createIMAServer({
    devUtils,
    applicationFolder: serverConfig.applicationFolder,
    environment: serverConfig.environment
      ? createEnvironment(
          serverConfig.environment,
          serverConfig.applicationFolder ?? path.resolve('.'),
          processEnvironment
        )
      : undefined,
    processEnvironment,
  });

  await serverConfig.afterCreateIMAServer(imaServer);

  // Generate request response
  const response = await imaServer.serverApp.requestHandler(
    {
      get: () => '',
      headers: () => '',
      originalUrl: serverConfig.host,
      protocol: serverConfig.protocol.replace(':', ''),
    },
    {
      status: () => 200,
      send: () => {},
      set: () => {},
      locals: {},
    }
  );

  if (response.status !== 200) {
    throw new Error(
      `Failed to generate HTML content for JSDOM template (status: ${response.status}).`,
      {
        cause:
          response.error ||
          new Error(
            `This should not happen, file an issue with @ima/testing-library if you are seeing this.`
          ),
      }
    );
  }

  return response.content;
}
