import { bootImaApp } from '../boot';
import { generateDictionary } from '../localization';

jest.mock('../localization', () => ({
  generateDictionary: jest.fn(() => Promise.resolve()),
}));

describe('bootImaApp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('boots the application with the generated JSDOM environment', async () => {
    const app = { oc: { clear: jest.fn() }, bootstrap: {} } as any;
    const ima = {
      createImaApp: jest.fn(() => Promise.resolve(app)),
      getClientBootConfig: jest.fn(() => ({})),
      onLoad: jest.fn(() => Promise.resolve()),
      bootClientApp: jest.fn(() => Promise.resolve(app)),
    } as any;

    await bootImaApp({
      ima,
      appConfigFunctions: {} as any,
      onLoad: true,
    });

    expect(generateDictionary).toHaveBeenCalledTimes(1);
    expect(ima.getClientBootConfig).toHaveBeenCalledTimes(1);
    expect(ima.onLoad).toHaveBeenCalledTimes(1);
    expect(ima.bootClientApp).toHaveBeenCalledTimes(1);
  });

  it('clears the object container when booting fails after app creation', async () => {
    const app = { oc: { clear: jest.fn() }, bootstrap: {} } as any;
    const ima = {
      createImaApp: jest.fn(() => Promise.resolve(app)),
      getClientBootConfig: jest.fn(() => ({})),
      onLoad: jest.fn(() => Promise.resolve()),
      bootClientApp: jest.fn(() => Promise.reject(new Error('boot failed'))),
    } as any;

    await expect(
      bootImaApp({
        ima,
        appConfigFunctions: {} as any,
      })
    ).rejects.toThrow('boot failed');

    expect(app.oc.clear).toHaveBeenCalledTimes(1);
  });
});
