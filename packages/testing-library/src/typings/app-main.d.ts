declare module 'app/main' {
  export const ima: typeof import('@ima/core');
  export const isFallbackApplication: boolean | undefined;
  export function getInitialAppConfigFunctions():
    | import('@ima/core').InitAppConfig
    | Promise<import('@ima/core').InitAppConfig>;

  const appMain: {
    ima?: typeof ima;
    isFallbackApplication?: boolean;
    getInitialAppConfigFunctions?: typeof getInitialAppConfigFunctions;
  };

  export default appMain;
}
