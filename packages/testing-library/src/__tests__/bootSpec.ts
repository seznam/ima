import { bootImaApp } from '../boot';
import { generateDictionary } from '../localization';

jest.mock('../localization', () => ({
  generateDictionary: jest.fn(() => Promise.resolve()),
}));

describe('bootImaApp', () => {
  const calls: string[] = [];

  function createIma({
    bootError,
    cleanupError,
  }: { bootError?: Error; cleanupError?: Error } = {}) {
    const app = {
      oc: {
        clear: jest.fn(() => {
          if (cleanupError) {
            throw cleanupError;
          }
        }),
      },
      bootstrap: {},
    };
    const record =
      <T>(name: string, result: () => T) =>
      () => {
        calls.push(name);

        return result();
      };
    const ima = {
      createImaApp: jest.fn(record('createImaApp', () => app)),
      getClientBootConfig: jest.fn(record('getClientBootConfig', () => ({}))),
      onLoad: jest.fn(record('onLoad', () => Promise.resolve())),
      bootClientApp: jest.fn(
        record('bootClientApp', () =>
          bootError ? Promise.reject(bootError) : Promise.resolve(app)
        )
      ),
    };

    return { app, ima: ima as any };
  }

  beforeEach(() => {
    calls.length = 0;
    jest.mocked(generateDictionary).mockImplementation(async () => {
      calls.push('generateDictionary');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generates the dictionary and waits for onLoad before creating the application', async () => {
    const { app, ima } = createIma();

    await expect(
      bootImaApp({
        ima,
        appConfigFunctions: {} as any,
        onLoad: true,
      })
    ).resolves.toBe(app);

    expect(calls).toEqual([
      'generateDictionary',
      'onLoad',
      'createImaApp',
      'getClientBootConfig',
      'bootClientApp',
    ]);
  });

  it('does not wait for onLoad by default', async () => {
    const { ima } = createIma();

    await bootImaApp({ ima, appConfigFunctions: {} as any });

    expect(ima.onLoad).not.toHaveBeenCalled();
  });

  it('clears the object container when booting fails after app creation', async () => {
    const { app, ima } = createIma({ bootError: new Error('boot failed') });

    await expect(
      bootImaApp({
        ima,
        appConfigFunctions: {} as any,
      })
    ).rejects.toThrow('boot failed');

    expect(app.oc.clear).toHaveBeenCalledTimes(1);
  });

  it('preserves boot and cleanup errors when both operations fail', async () => {
    const bootError = new Error('boot failed');
    const cleanupError = new Error('cleanup failed');
    const { ima } = createIma({ bootError, cleanupError });

    await expect(
      bootImaApp({
        ima,
        appConfigFunctions: {} as any,
      })
    ).rejects.toMatchObject({ errors: [bootError, cleanupError] });
  });
});
