import { DocumentView } from 'app/document/DocumentView';

/**
 * @type import('@ima/core').InitSettingsFunction
 */
export const initSettings = (ns, oc, config) => {
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
          timeout: 2000,
        },
      },
    },
  };
};
