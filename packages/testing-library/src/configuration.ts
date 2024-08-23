import type { ContextValue, ImaApp } from './types';

export interface ClientConfiguration {
  /**
   * If true, the fake dictionary will be used. The real dictionary degrades the performance of the tests so disable this with caution.
   */
  useFakeDictionary: boolean;
  /**
   * The path to the IMA configuration file. This can be only configured once before first `initImaApp` call and cannot be reconfigured later.
   */
  rootDir: string;
  /**
   * The function that will be called after the IMA application is initialized.
   */
  afterInitImaApp: (app: ImaApp) => void;
  /**
   * The function that will be called after the context value is created.
   */
  getContextValue: (app: ImaApp) => ContextValue;
}

const clientConfiguration: ClientConfiguration = {
  useFakeDictionary: true,
  rootDir: process.cwd(),
  afterInitImaApp: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getContextValue: app => ({
    $Utils: app.oc.get('$ComponentUtils').getUtils(),
  }),
};

/**
 * Get the current clientConfiguration.
 */
export function getImaTestingLibraryClientConfig() {
  return clientConfiguration;
}

/**
 * Modify the current clientConfiguration.
 */
export function setImaTestingLibraryClientConfig(
  config: Partial<ClientConfiguration>
) {
  Object.assign(clientConfiguration, config);
}
