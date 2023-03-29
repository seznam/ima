import { InitSettingsFunction } from '@ima/core';
import { DocumentView } from 'app/document/DocumentView';

declare module '@ima/core' {
  interface Settings {
    links: Record<'documentation' | 'tutorial' | 'plugins' | 'api', string>;
  }
}

export const initSettings: InitSettingsFunction = (ns, oc, config) => {
  return {
    prod: {
      $Version: config.$Version,
      $Http: {
        defaultRequestOptions: {
          timeout: 7000, // Request timeout
          repeatRequest: 1, // Count of automatic repeated request after failing request.
          ttl: 60000, // Default time to live for cached request in ms.
          fetchOptions: {
            mode: 'cors',
            headers: {
              // Set default request headers
              Accept: 'application/json',
              'Accept-Language': config.$Language,
            },
          },
          cache: true, // if value exists in cache then returned it else make request to remote server.
        },
        cacheOptions: {
          prefix: 'http.', // Cache key prefix for response bodies (already parsed as JSON) of completed HTTP requests.
        },
      },
      $Router: {
        /**
         * Middleware execution timeout, see https://imajs.io/basic-features/routing/middlewares#execution-timeout
         * for more information.
         */
        middlewareTimeout: 30000,
      },
      $Cache: {
        enabled: true, //Turn on/off cache for all application.
        ttl: 60000, // Default time to live for cached value in ms.
      },
      $Page: {
        $Render: {
          documentView: DocumentView,
          masterElementId: 'page',
        },
      },
      links: {
        documentation: 'https://imajs.io/docs',
        tutorial: 'https://imajs.io/tutorial/introduction',
        plugins: 'https://github.com/seznam/IMA.js-plugins',
        api: 'https://imajs.io/api',
      },
    },

    dev: {
      $Http: {
        defaultRequestOptions: {
          timeout: 20000,
        },
      },
    },
  };
};
