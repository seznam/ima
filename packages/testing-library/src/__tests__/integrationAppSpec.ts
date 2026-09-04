import {
  getImaTestingLibraryClientConfig,
  setImaTestingLibraryClientConfig,
} from '../client/configuration';
import { clearImaApp, initImaApp } from '../integration';

const clientConfig = getImaTestingLibraryClientConfig();
const defaultIntegrationConfig = { ...clientConfig.integration };

describe('integration initImaApp', () => {
  const originalDocument = (globalThis as any).document;
  const originalWindow = (globalThis as any).window;
  const originalSetInterval = global.setInterval;
  const originalSetTimeout = global.setTimeout;
  const originalSetImmediate = global.setImmediate;
  const originalConsoleAssert = global.console.assert;

  beforeEach(() => {
    (globalThis as any).document = {};
    (globalThis as any).window = {};
  });

  afterEach(() => {
    // Replaced instead of merged so boot config overrides cannot leak into the next test.
    clientConfig.integration = { ...defaultIntegrationConfig };

    if (originalDocument === undefined) {
      delete (globalThis as any).document;
    } else {
      (globalThis as any).document = originalDocument;
    }

    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }

    global.setInterval = originalSetInterval;
    global.setTimeout = originalSetTimeout;
    global.setImmediate = originalSetImmediate;
    global.console.assert = originalConsoleAssert;
    jest.restoreAllMocks();
  });

  it('restores global hooks and clears collected timers when initialization fails', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const scrollTo = jest.fn();
    (globalThis as any).window.scrollTo = scrollTo;

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: async () => {
          setTimeout(() => {}, 1000);
          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');

    expect(global.setInterval).toBe(originalSetInterval);
    expect(global.setTimeout).toBe(originalSetTimeout);
    expect(global.setImmediate).toBe(originalSetImmediate);
    expect(global.console.assert).toBe(originalConsoleAssert);
    expect((globalThis as any).window.scrollTo).toBe(scrollTo);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  });

  it('removes event listeners registered during initialization', async () => {
    const windowAddEventListener = jest.fn();
    const windowRemoveEventListener = jest.fn();
    const documentAddEventListener = jest.fn();
    const documentRemoveEventListener = jest.fn();
    const preexistingListener = jest.fn();
    const windowListener = jest.fn();
    const documentListener = jest.fn();

    (globalThis as any).window = {
      addEventListener: windowAddEventListener,
      removeEventListener: windowRemoveEventListener,
      scrollTo: jest.fn(),
    };
    (globalThis as any).document = {
      addEventListener: documentAddEventListener,
      removeEventListener: documentRemoveEventListener,
    };

    window.addEventListener('preexisting', preexistingListener);

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: async () => {
          window.addEventListener('resize', windowListener);
          document.addEventListener('visibilitychange', documentListener);
          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');

    expect(windowRemoveEventListener).toHaveBeenCalledWith(
      'resize',
      windowListener
    );
    expect(windowRemoveEventListener).not.toHaveBeenCalledWith(
      'preexisting',
      preexistingListener
    );
    expect(documentRemoveEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      documentListener
    );
    expect(window.addEventListener).toBe(windowAddEventListener);
    expect(document.addEventListener).toBe(documentAddEventListener);
  });

  it('rejects an overlapping initialization instead of clobbering the shimmed globals', async () => {
    let failPreboot = (_error: Error) => {};
    const prebootScript = jest.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          failPreboot = reject;
        })
    );

    (globalThis as any).window.scrollTo = jest.fn();

    setImaTestingLibraryClientConfig({
      integration: { prebootScript },
    });

    const initialization = initImaApp();

    await new Promise<void>(resolve => originalSetImmediate(resolve));

    await expect(initImaApp()).rejects.toThrow(
      'Another integration application is already booting'
    );

    failPreboot(new Error('preboot failed'));

    await expect(initialization).rejects.toThrow('preboot failed');
    expect(prebootScript).toHaveBeenCalledTimes(1);
    expect(global.setTimeout).toBe(originalSetTimeout);
  });

  it('tears down application services before clearing the object container', async () => {
    const router = { unlistenAll: jest.fn() };
    const pageRenderer = { unmount: jest.fn() };
    const pageManager = { destroy: jest.fn(() => Promise.resolve()) };
    const oc = {
      clear: jest.fn(),
      get: jest.fn((alias: string) => {
        if (alias === '$Router') {
          return router;
        }

        if (alias === '$PageRenderer') {
          return pageRenderer;
        }

        return pageManager;
      }),
    };

    await clearImaApp({ oc } as any);

    expect(router.unlistenAll).toHaveBeenCalledTimes(1);
    expect(pageRenderer.unmount).toHaveBeenCalledTimes(1);
    expect(pageManager.destroy).toHaveBeenCalledTimes(1);
    expect(oc.clear).toHaveBeenCalledTimes(1);
  });

  it('finishes a not awaited cleanup before the next application boots', async () => {
    let resolveDestroy = () => {};
    const destroyed = jest.fn();
    const oc = {
      clear: jest.fn(),
      get: jest.fn(() => ({
        unlistenAll: () => {},
        unmount: () => {},
        destroy: () =>
          new Promise<void>(resolve => {
            resolveDestroy = () => {
              destroyed();
              resolve();
            };
          }),
      })),
    };

    clearImaApp({ oc } as any);

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: () => {
          throw new Error('preboot failed');
        },
      },
    });

    const initialization = initImaApp();
    resolveDestroy();

    await expect(initialization).rejects.toThrow('preboot failed');
    expect(destroyed).toHaveBeenCalledTimes(1);
  });

  it('waits for every overlapping cleanup before booting another application', async () => {
    let resolveFirstDestroy = () => {};
    let resolveSecondDestroy = () => {};
    const createApp = (setResolver: (resolver: () => void) => void) => ({
      oc: {
        clear: jest.fn(),
        get: jest.fn((alias: string) => {
          if (alias === '$Router') {
            return { unlistenAll: () => {} };
          }

          if (alias === '$PageRenderer') {
            return { unmount: () => {} };
          }

          return {
            destroy: () =>
              new Promise<void>(resolve => {
                setResolver(resolve);
              }),
          };
        }),
      },
    });
    const prebootScript = jest.fn(() => {
      throw new Error('preboot failed');
    });

    const firstCleanup = clearImaApp(
      createApp(resolver => {
        resolveFirstDestroy = resolver;
      }) as any
    );
    const secondCleanup = clearImaApp(
      createApp(resolver => {
        resolveSecondDestroy = resolver;
      }) as any
    );

    resolveFirstDestroy();
    await firstCleanup;
    await new Promise<void>(resolve => originalSetImmediate(resolve));

    setImaTestingLibraryClientConfig({
      integration: { prebootScript },
    });
    const initialization = initImaApp();

    await new Promise<void>(resolve => originalSetImmediate(resolve));
    expect(prebootScript).not.toHaveBeenCalled();

    resolveSecondDestroy();
    await secondCleanup;

    await expect(initialization).rejects.toThrow('preboot failed');
    expect(prebootScript).toHaveBeenCalledTimes(1);
  });
});
