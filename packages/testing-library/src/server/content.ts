import { createIMAServer } from '@ima/server';

import { getImaTestingLibraryServerConfig } from './configuration';

const serverConfig = getImaTestingLibraryServerConfig();

/**
 * Get response content from @ima/server.
 */
export async function getIMAResponseContent(): Promise<string> {
  // Mock devUtils to override manifest loading
  const devUtils = {
    manifestRequire: () => ({}),
  };

  // Prepare serverApp with environment override
  const { serverApp } = await createIMAServer({
    devUtils,
    applicationFolder: serverConfig.applicationFolder,
    processEnvironment: currentEnvironment =>
      serverConfig.processEnvironment({
        ...currentEnvironment,
        $Server: {
          ...currentEnvironment.$Server,
          concurrency: 0,
          serveSPA: {
            allow: true,
          },
        },
        $Debug: true,
      }),
  });

  // Generate request response
  const response = await serverApp.requestHandler(
    {
      get: () => '',
      headers: () => '',
      originalUrl: serverConfig.host,
      protocol: serverConfig.protocol.replace(':', ''),
    },
    {
      status: () => 200,
      send: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
      set: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
      locals: {},
    }
  );

  return response.content;
}
