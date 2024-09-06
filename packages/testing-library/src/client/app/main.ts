import * as ima from '@ima/core';

import { initBindApp } from './config/bind';
import { initSettings } from './config/settings';

const getInitialAppConfigFunctions = () => {
  return {
    initBindApp,
    initRoutes: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    initServicesApp: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    initSettings,
  };
};

export { getInitialAppConfigFunctions, ima };
