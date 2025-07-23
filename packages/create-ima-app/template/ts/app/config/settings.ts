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
      $Page: {
        $Render: {
          documentView: DocumentView,
          masterElementId: 'page',
        },
      },
      links: {
        documentation: 'https://imajs.io/introduction/getting-started',
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
