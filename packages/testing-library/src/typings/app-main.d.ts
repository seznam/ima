declare module 'app/main' {
  export const ima: typeof import('@ima/core');
  export function getInitialAppConfigFunctions():
    | import('@ima/core').InitAppConfig
    | Promise<import('@ima/core').InitAppConfig>;

  const appMain: {
    ima?: typeof ima;
    getInitialAppConfigFunctions?: typeof getInitialAppConfigFunctions;
  };

  export default appMain;
}
