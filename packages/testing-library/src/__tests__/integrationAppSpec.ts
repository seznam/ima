import { initImaApp, setIntegrationConfig } from '../integration';

const defaultIntegrationConfig = {
  appMainPath: 'app/main.js',
  rootDir: process.cwd(),
  environment: 'test' as const,
  TestPageRenderer: null,
  initSettings: () => {},
  initBindApp: () => {},
  initServicesApp: () => {},
  initRoutes: () => {},
  extendAppObject: () => ({}),
  prebootScript: () => Promise.resolve(),
};

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
    setIntegrationConfig(defaultIntegrationConfig);

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

    setIntegrationConfig({
      prebootScript: async () => {
        setTimeout(() => {}, 1000);
        throw new Error('preboot failed');
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');

    expect(global.setInterval).toBe(originalSetInterval);
    expect(global.setTimeout).toBe(originalSetTimeout);
    expect(global.setImmediate).toBe(originalSetImmediate);
    expect(global.console.assert).toBe(originalConsoleAssert);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
  });
});
