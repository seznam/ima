import { InitSettingsFunction } from '@ima/core';

export const initSettings: InitSettingsFunction = (ns, oc, config) => {
  return {
    prod: {
      $Version: config.$Version,
      $Page: {
        $Render: {
          documentView: () => {},
          masterElementId: 'page',
        },
      },
    },
  };
};
