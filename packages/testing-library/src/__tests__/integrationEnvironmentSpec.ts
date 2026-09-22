import {
  getImaTestingLibraryClientConfig,
  setImaTestingLibraryClientConfig,
} from '../client/configuration';
import { clearImaApp, initImaApp } from '../integration';

const clientConfig = getImaTestingLibraryClientConfig();
const defaultIntegrationConfig = { ...clientConfig.integration };

describe('integration environment', () => {
  const originalDocument = (globalThis as any).document;
  const originalWindow = (globalThis as any).window;
  const originalSetInterval = global.setInterval;
  const originalSetTimeout = global.setTimeout;
  const originalSetImmediate = global.setImmediate;
  const originalClearImmediate = global.clearImmediate;
  const originalMessageChannel = global.MessageChannel;
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
    global.clearImmediate = originalClearImmediate;
    global.MessageChannel = originalMessageChannel;
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

  it('provides and cleans up immediate timers in jsdom', async () => {
    delete (globalThis as any).setImmediate;
    delete (globalThis as any).clearImmediate;
    delete (globalThis as any).MessageChannel;
    const pendingCallback = jest.fn();
    const prebootScript = jest.fn(async () => {
      await new Promise<void>(resolve => global.setImmediate(resolve));
      global.setImmediate(pendingCallback);
      throw new Error('preboot failed');
    });

    setImaTestingLibraryClientConfig({ integration: { prebootScript } });

    await expect(initImaApp()).rejects.toThrow('preboot failed');

    expect(prebootScript).toHaveBeenCalledTimes(1);
    expect(global.setImmediate).toBeUndefined();
    expect(global.clearImmediate).toBeUndefined();

    await new Promise<void>(resolve => originalSetImmediate(resolve));
    expect(pendingCallback).not.toHaveBeenCalled();
  });

  it('wraps the timers installed by the test instead of the real ones', async () => {
    const fakeSetTimeout = jest.fn(originalSetTimeout);
    global.setTimeout = fakeSetTimeout as unknown as typeof setTimeout;

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: () => {
          setTimeout(() => {}, 1000);
          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');

    expect(fakeSetTimeout).toHaveBeenCalledTimes(1);
    expect(global.setTimeout).toBe(fakeSetTimeout);
  });

  it('cancels the animation frames scheduled during the test', async () => {
    const requestAnimationFrame = jest.fn(() => 42);
    const cancelAnimationFrame = jest.fn();
    (globalThis as any).window.requestAnimationFrame = requestAnimationFrame;
    (globalThis as any).window.cancelAnimationFrame = cancelAnimationFrame;

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: () => {
          window.requestAnimationFrame(() => {});
          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(window.requestAnimationFrame).toBe(requestAnimationFrame);
  });

  it('leaves native event listeners under their owners control', async () => {
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

    expect(windowRemoveEventListener).not.toHaveBeenCalled();
    expect(documentRemoveEventListener).not.toHaveBeenCalled();
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

  it('destroys the page manager before unmounting and clearing the object container', async () => {
    const lifecycle: string[] = [];
    const router = {
      unlistenAll: jest.fn(() => lifecycle.push('unlisten')),
    };
    const pageRenderer = {
      unmount: jest.fn(() => lifecycle.push('unmount')),
    };
    const pageManager = {
      destroy: jest.fn(async () => {
        lifecycle.push('destroy');
        await Promise.resolve();
        lifecycle.push('destroyed');
      }),
    };
    const oc = {
      clear: jest.fn(() => lifecycle.push('clear')),
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
    expect(lifecycle).toEqual([
      'unlisten',
      'destroy',
      'destroyed',
      'unmount',
      'clear',
    ]);
  });

  it('unmounts and clears the object container when page manager destruction fails', async () => {
    const error = new Error('destroy failed');
    const services = {
      unlistenAll: jest.fn(),
      unmount: jest.fn(),
      destroy: jest.fn().mockRejectedValue(error),
    };
    const oc = {
      clear: jest.fn(),
      get: jest.fn(() => services),
    };

    await expect(clearImaApp({ oc } as any)).rejects.toBe(error);

    expect(services.unmount).toHaveBeenCalledTimes(1);
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
