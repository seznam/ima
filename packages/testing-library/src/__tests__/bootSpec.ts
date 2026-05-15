import { bootImaApp } from '../boot';
import { generateDictionary } from '../localization';

jest.mock('../localization', () => ({
  generateDictionary: jest.fn(() => Promise.resolve()),
}));

describe('bootImaApp', () => {
  const originalWindow = (globalThis as any).window;
  const originalIma = globalThis.$IMA;

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }

    if (originalIma === undefined) {
      delete (globalThis as any).$IMA;
    } else {
      globalThis.$IMA = originalIma;
    }

    jest.clearAllMocks();
  });

  it('propagates environment override to both window and global $IMA objects before boot config is read', async () => {
    const windowIma = { $Env: 'prod' } as any;
    const globalIma = { $Env: 'prod' } as any;
    const app = { oc: { clear: jest.fn() }, bootstrap: {} } as any;
    const ima = {
      createImaApp: jest.fn(() => Promise.resolve(app)),
      getClientBootConfig: jest.fn(() => {
        expect(windowIma.$Env).toBe('dev');
        expect(globalIma.$Env).toBe('dev');

        return {};
      }),
      onLoad: jest.fn(() => Promise.resolve()),
      bootClientApp: jest.fn(() => Promise.resolve(app)),
    } as any;

    (globalThis as any).window = { $IMA: windowIma };
    globalThis.$IMA = globalIma;

    await bootImaApp({
      ima,
      appConfigFunctions: {} as any,
      environment: 'dev',
    });

    expect(generateDictionary).toHaveBeenCalledTimes(1);
    expect(ima.getClientBootConfig).toHaveBeenCalledTimes(1);
  });
});
