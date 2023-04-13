export const imaLoader = async () => {
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
