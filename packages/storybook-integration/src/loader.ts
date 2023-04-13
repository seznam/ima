import { type AppConfigFunctions } from '@ima/core';

// Mock revival settings
const globalIMAMock = window.$IMA || {};
globalIMAMock.Test = true;
globalIMAMock.SPA = false;
globalIMAMock.$PublicPath = '';
globalIMAMock.$RequestID =
  'lgdvb8ia-pb.ha0jkbloa-144ba611-0888-4d27-acb2-13fd41ac84dc';
globalIMAMock.$Language = 'en';
globalIMAMock.$Env = 'dev';
globalIMAMock.$Debug = true;
globalIMAMock.$Version = '0.1.0';
globalIMAMock.$App = {};
globalIMAMock.$Protocol = 'http:';
globalIMAMock.$Host = 'localhost:3001';
globalIMAMock.$Path = '';
globalIMAMock.$Root = '';
globalIMAMock.$LanguagePartPath = '';

// Set $IMA mock to window
window.$Debug = true;
window.$IMA = globalIMAMock;

export const createIMALoader = (
  ima: typeof import('@ima/core'),
  initialAppConfigFunctions: () => AppConfigFunctions
) => {
  return async () => {
    await ima.onLoad();
    const app = ima.createImaApp();
    const bootConfig = ima.getClientBootConfig(initialAppConfigFunctions());

    ima.bootClientApp(app, bootConfig);

    return {
      app,
      bootConfig,
    };
  };
};
