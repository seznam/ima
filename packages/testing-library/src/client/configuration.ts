import type {
  ContextValue,
  ImaApp,
  ImaRenderResult,
  ImaRenderHookResult,
} from '../types';

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
   * The function that will be called before the IMA application is initialized.
   */
  beforeInitImaApp: () => void | Promise<void>;
  /**
   * The function that will be called after the IMA application is initialized.
   */
  afterInitImaApp: (app: ImaApp) => void | Promise<void>;
  /**
   * The function that will be called after the context value is created.
   */
  getContextValue: (app: ImaApp) => ContextValue | Promise<ContextValue>;
  beforeRenderWithContext: ({
    app,
    contextValue,
  }: {
    app: ImaApp | null;
    contextValue: ContextValue;
  }) => void | Promise<void>;
  afterRenderWithContext: ({
    app,
    contextValue,
    ...result
  }: ImaRenderResult) => void | Promise<void>;
  beforeRenderHookWithContext: ({
    app,
    contextValue,
  }: {
    app: ImaApp | null;
    contextValue: ContextValue;
  }) => void | Promise<void>;
  afterRenderHookWithContext<TResult, TProps>({
    app,
    contextValue,
    ...result
  }: ImaRenderHookResult<TResult, TProps>): void | Promise<void>;
}

const clientConfiguration: ClientConfiguration = {
  useFakeDictionary: true,
  rootDir: process.cwd(),
  beforeInitImaApp: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  afterInitImaApp: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getContextValue: app => ({
    $Utils: app.oc.get('$ComponentUtils').getUtils(),
  }),
  beforeRenderWithContext: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  afterRenderWithContext: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  beforeRenderHookWithContext: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  afterRenderHookWithContext: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
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
