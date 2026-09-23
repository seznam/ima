import * as ima from '@ima/core';

import { initBindApp } from './config/bind';
import { initSettings } from './config/settings';

// Lets the integration initImaApp detect that no application entry point was mapped.
const isFallbackApplication = true;

const getInitialAppConfigFunctions = () => {
  return {
    initBindApp,
    initRoutes: () => {},
    initServicesApp: () => {},
    initSettings,
  };
};

export { getInitialAppConfigFunctions, ima, isFallbackApplication };
