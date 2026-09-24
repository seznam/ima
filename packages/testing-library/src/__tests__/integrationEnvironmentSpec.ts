import type { InitAppConfig, InitSettingsFunction } from '@ima/core';

import { setImaTestingLibraryClientConfig } from '../client/configuration';
import { clearImaApp, initImaApp } from '../integration';
import type { ImaApp } from '../types';

let mockAppMain: Record<PropertyKey, unknown> = {};

jest.mock(
  'app/main',
  () =>
    new Proxy(
      {},
      {
        get: (_target, property) =>
          property === '__esModule' ? true : Reflect.get(mockAppMain, property),
      }
    )
);

interface ApplicationServices {
  unlistenAll?: () => unknown;
  destroy?: () => unknown;
  unmount?: () => unknown;
}

function createApp({
  unlistenAll,
  destroy,
  unmount,
}: ApplicationServices = {}) {
  const router = { unlistenAll: jest.fn(unlistenAll) };
  const pageManager = { destroy: jest.fn(destroy) };
  const pageRenderer = { unmount: jest.fn(unmount) };
  const services: Record<string, unknown> = {
    $Router: router,
    $PageManager: pageManager,
    $PageRenderer: pageRenderer,
  };
  const oc = {
    clear: jest.fn(),
    get: jest.fn((alias: string) => services[alias]),
  };

  return {
    app: { oc, bootstrap: {} } as unknown as ImaApp,
    oc,
    pageManager,
    pageRenderer,
  };
}

function mockApplication(
  app: ImaApp,
  bootConfigMethods: Partial<InitAppConfig> = {}
) {
  const ima = {
    createImaApp: jest.fn(() => app),
    getClientBootConfig: jest.fn((config: InitAppConfig) => config),
    onLoad: jest.fn(() => Promise.resolve()),
    bootClientApp: jest.fn(() => Promise.resolve(app)),
  };

  mockAppMain = { ima, getInitialAppConfigFunctions: () => bootConfigMethods };

  return ima;
}

function createDeferred() {
  let resolve = () => {};
  const promise = new Promise<void>(resolvePromise => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

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
    jest.useRealTimers();
    mockAppMain = {};

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

  it('wraps Jest fake timers and keeps them detectable', async () => {
    jest.useFakeTimers();
    const fakeSetTimeout = global.setTimeout;
    const callback = jest.fn();
    let fakeTimersDetected: boolean | undefined;

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: () => {
          fakeTimersDetected = Object.hasOwn(setTimeout, 'clock');
          setTimeout(callback, 1000);
          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');
    jest.advanceTimersByTime(1000);

    expect(fakeTimersDetected).toBe(true);
    expect(callback).not.toHaveBeenCalled();
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
    const { app, oc } = createApp({
      unlistenAll: () => lifecycle.push('unlisten'),
      destroy: async () => {
        lifecycle.push('destroy');
        await Promise.resolve();
        lifecycle.push('destroyed');
      },
      unmount: () => lifecycle.push('unmount'),
    });
    oc.clear.mockImplementation(() => lifecycle.push('clear'));

    await clearImaApp(app);

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
    const { app, oc, pageRenderer } = createApp({
      destroy: () => Promise.reject(error),
    });

    await expect(clearImaApp(app)).rejects.toBe(error);

    expect(pageRenderer.unmount).toHaveBeenCalledTimes(1);
    expect(oc.clear).toHaveBeenCalledTimes(1);
  });

  it('continues the teardown when a step fails', async () => {
    const error = new Error('unlisten failed');
    const { app, oc, pageManager, pageRenderer } = createApp({
      unlistenAll: () => {
        throw error;
      },
    });

    await expect(clearImaApp(app)).rejects.toBe(error);

    expect(pageManager.destroy).toHaveBeenCalledTimes(1);
    expect(pageRenderer.unmount).toHaveBeenCalledTimes(1);
    expect(oc.clear).toHaveBeenCalledTimes(1);
  });

  it('reports every failed teardown step', async () => {
    const destroyError = new Error('destroy failed');
    const unmountError = new Error('unmount failed');
    const { app } = createApp({
      destroy: () => Promise.reject(destroyError),
      unmount: () => {
        throw unmountError;
      },
    });

    await expect(clearImaApp(app)).rejects.toMatchObject({
      errors: [destroyError, unmountError],
    });
  });

  it('ignores repeated cleanup of the same application', async () => {
    const { app, oc } = createApp();

    await clearImaApp(app);
    await clearImaApp(app);

    expect(oc.clear).toHaveBeenCalledTimes(1);
  });

  it('finishes a not awaited cleanup before the next application boots', async () => {
    const destruction = createDeferred();
    const destroyed = jest.fn();
    const { app } = createApp({
      destroy: () => destruction.promise.then(destroyed),
    });

    void clearImaApp(app);

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: () => {
          throw new Error('preboot failed');
        },
      },
    });

    const initialization = initImaApp();
    destruction.resolve();

    await expect(initialization).rejects.toThrow('preboot failed');
    expect(destroyed).toHaveBeenCalledTimes(1);
  });

  it('waits for every overlapping cleanup before booting another application', async () => {
    const firstDestruction = createDeferred();
    const secondDestruction = createDeferred();
    const prebootScript = jest.fn(() => {
      throw new Error('preboot failed');
    });

    const firstCleanup = clearImaApp(
      createApp({ destroy: () => firstDestruction.promise }).app
    );
    const secondCleanup = clearImaApp(
      createApp({ destroy: () => secondDestruction.promise }).app
    );

    firstDestruction.resolve();
    await firstCleanup;
    await new Promise<void>(resolve => originalSetImmediate(resolve));

    setImaTestingLibraryClientConfig({
      integration: { prebootScript },
    });
    const initialization = initImaApp();

    await new Promise<void>(resolve => originalSetImmediate(resolve));
    expect(prebootScript).not.toHaveBeenCalled();

    secondDestruction.resolve();
    await secondCleanup;

    await expect(initialization).rejects.toThrow('preboot failed');
    expect(prebootScript).toHaveBeenCalledTimes(1);
  });

  it('rejects booting another application before the active one is cleared', async () => {
    const { app } = createApp();
    mockApplication(app);

    await expect(initImaApp()).resolves.toBe(app);
    await expect(initImaApp()).rejects.toThrow(
      'Another integration application is still active'
    );

    await clearImaApp(app);

    expect(global.setTimeout).toBe(originalSetTimeout);
  });

  it('derives $Debug from $IMA.$Debug and restores it with the application', async () => {
    const { app } = createApp();
    const ima = mockApplication(app);
    const originalDebug = $Debug;
    const originalImaDebug = $IMA.$Debug;
    let debugDuringBoot: boolean | undefined;

    ima.createImaApp.mockImplementation(() => {
      debugDuringBoot = $Debug;

      return app;
    });
    $IMA.$Debug = false;

    try {
      await initImaApp();
      await clearImaApp(app);
    } finally {
      $IMA.$Debug = originalImaDebug;
    }

    expect(debugDuringBoot).toBe(false);
    expect($Debug).toBe(originalDebug);
  });

  it('merges initSettings of the application, the integration config and the call', async () => {
    const settings = (prod: Record<string, unknown>) =>
      (() => ({ prod })) as unknown as InitSettingsFunction;
    const { app } = createApp();
    const ima = mockApplication(app, {
      initSettings: settings({ source: 'application', application: true }),
    });

    setImaTestingLibraryClientConfig({
      integration: {
        initSettings: settings({ source: 'integration', integration: true }),
      },
    });

    await initImaApp({ initSettings: settings({ source: 'call' }) });
    await clearImaApp(app);

    const [config] = ima.getClientBootConfig.mock.calls[0];

    expect(config.initSettings({} as never, {} as never, {} as never)).toEqual({
      prod: { source: 'call', application: true, integration: true },
    });
  });

  it('rejects an app/main without getInitialAppConfigFunctions', async () => {
    await expect(initImaApp()).rejects.toThrow(
      'Cannot find getInitialAppConfigFunctions in app/main'
    );

    expect(global.setTimeout).toBe(originalSetTimeout);
  });

  it('boots the default export of app/main', async () => {
    const { app } = createApp();
    const ima = mockApplication(app);
    const getInitialAppConfigFunctions = jest.fn(() => ({}));

    mockAppMain = { default: { ima, getInitialAppConfigFunctions } };

    await expect(initImaApp()).resolves.toBe(app);
    await clearImaApp(app);

    expect(getInitialAppConfigFunctions).toHaveBeenCalledTimes(1);
    expect(ima.bootClientApp).toHaveBeenCalledTimes(1);
  });

  it('rejects booting the fallback application without initRoutes', async () => {
    const { app } = createApp();
    mockApplication(app);
    mockAppMain.isFallbackApplication = true;

    await expect(initImaApp()).rejects.toThrow('fallback application');
    await expect(initImaApp({ initRoutes: () => {} })).resolves.toBe(app);
    await clearImaApp(app);
  });

  it('clears the booted application when extending it fails', async () => {
    const { app, oc } = createApp();
    const error = new Error('extend failed');
    mockApplication(app);

    setImaTestingLibraryClientConfig({
      integration: {
        extendAppObject: () => {
          throw error;
        },
      },
    });

    await expect(initImaApp()).rejects.toBe(error);

    expect(oc.clear).toHaveBeenCalledTimes(1);
    expect(global.setTimeout).toBe(originalSetTimeout);
  });

  it('reports both errors when clearing an application that failed to initialize fails', async () => {
    const error = new Error('extend failed');
    const destroyError = new Error('destroy failed');
    const { app } = createApp({ destroy: () => Promise.reject(destroyError) });
    mockApplication(app);

    setImaTestingLibraryClientConfig({
      integration: {
        extendAppObject: () => {
          throw error;
        },
      },
    });

    await expect(initImaApp()).rejects.toMatchObject({
      errors: [error, destroyError],
    });
  });
});
