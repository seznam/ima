import * as ima from '@ima/core';

import { initBindApp } from './config/bind';
import { initSettings } from './config/settings';

const getInitialAppConfigFunctions = () => {
  return {
    initBindApp,
    initRoutes: () => {},
    initServicesApp: () => {},
    initSettings,
  };
};

export { getInitialAppConfigFunctions, ima };
