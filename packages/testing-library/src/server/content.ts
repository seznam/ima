import { createIMAServer } from '@ima/server';

import type { ServerConfiguration } from './configuration';

/**
 * Get response content from @ima/server.
 */
export async function getIMAResponseContent(
  config: ServerConfiguration
): Promise<string> {
  // Mock devUtils to override manifest loading
  const devUtils = {
    manifestRequire: () => ({}),
  };

  await config.beforeCreateIMAServer();

  // Prepare serverApp with environment override
  const imaServer = await createIMAServer({
    devUtils,
    applicationFolder: config.applicationFolder,
    processEnvironment: currentEnvironment =>
      config.processEnvironment({
        ...currentEnvironment,
        $Server: {
          ...currentEnvironment.$Server,
          concurrency: 0,
          degradation: {
            isSPA: () => true,
          },
        },
        $Debug: true,
      }),
  });

  await config.afterCreateIMAServer(imaServer);

  // Generate request response
  const response = await imaServer.serverApp.requestHandler(
    {
      get: () => '',
      headers: () => '',
      originalUrl: config.host,
      protocol: config.protocol.replace(':', ''),
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
