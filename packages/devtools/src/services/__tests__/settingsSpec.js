import { getSettings, setSettings } from '../settings';
import defaultSettings from '../defaultSettings';

let settingsStorage = {};
beforeEach(() => {
  global.chrome = {
    storage: {
      local: {
        set: jest.fn().mockImplementation(value => {
          return (settingsStorage = {
            ...settingsStorage,
            ...value
          });
        }),
        get: jest.fn().mockImplementation((key, callback) => {
          callback(settingsStorage);
        })
      }
    },
    runtime: {
      lastError: 'runtime error'
    }
  };
});

describe('defaultSettings', () => {
  it('should match snapshot', () => {
    expect(defaultSettings).toMatchSnapshot();
  });
});

describe('getSettings', () => {
  beforeEach(() => {
    settingsStorage = {};
  });

  it('should call chrome.storage.local.get', async () => {
    await getSettings();

    expect(chrome.storage.local.get.mock.calls.length).toBe(1);
    expect(chrome.storage.local.get.mock.calls[0][0]).toEqual(null);
  });

  it('should return default settings when nothing is set', async () => {
    expect(await getSettings('enabled')).toBe(true);
    expect(await getSettings('hooks')).toBe(defaultSettings.hooks);
  });

  it('should resolve with value when key provided', async () => {
    setSettings({ enabled: true });

    expect(await getSettings('enabled')).toBe(true);
  });

  it('should return whole storage.local if key not provided', async () => {
    setSettings({ enabled: true });

    expect(await getSettings()).toEqual(
      Object.assign({}, defaultSettings, {
        enabled: true
      })
    );
  });
});

describe('setSettings', () => {
  it('should call chrome.storage.local.set', () => {
    setSettings({ enabled: true });

    expect(chrome.storage.local.set.mock.calls.length).toBe(1);
    expect(chrome.storage.local.set.mock.calls[0][0]).toEqual({
      enabled: true
    });

    expect(settingsStorage).toEqual({ enabled: true });
  });
});
