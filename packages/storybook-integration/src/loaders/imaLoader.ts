export const imaLoader = async () => {
  // Mock revival settings
  const globalIMAMock = window.$IMA || {};
  globalIMAMock.Test = true;
  globalIMAMock.SPA = false;
  globalIMAMock.$PublicPath = '';
  globalIMAMock.$RequestID = '';
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

  // Get ima from app/main
  // @ts-expect-error resolved in storybook context with app aliases
  // eslint-disable-next-line import/no-unresolved
  const { ima, getInitialAppConfigFunctions } = await import('app/main');
  const app = ima.createImaApp();
  const bootConfig = ima.getClientBootConfig(getInitialAppConfigFunctions());

  // Init app
  ima.bootClientApp(app, bootConfig);

  return {
    app,
    bootConfig,
  };
};
