import { beforeEach, describe, expect, it, vi } from 'vitest';

import defaultSettings from '../defaultSettings';
import { getSettings, setSettings } from '../settings';

let settingsStorage = {};

beforeEach(() => {
  globalThis.chrome = {
    storage: {
      local: {
        set: vi.fn().mockImplementation(value => {
          return (settingsStorage = {
            ...settingsStorage,
            ...value,
          });
        }),
        get: vi.fn().mockImplementation((key, callback) => {
          callback(settingsStorage);
        }),
      },
    },
    runtime: {
      lastError: 'runtime error',
    },
  };
});

describe('getSettings', () => {
  beforeEach(() => {
    settingsStorage = {};
  });

  it('should call chrome.storage.local.get', async () => {
    await getSettings();

    expect(chrome.storage.local.get.mock.calls).toHaveLength(1);
    expect(chrome.storage.local.get.mock.calls[0][0]).toBeNull();
  });

  it('should return default settings when nothing is set', async () => {
    await expect(getSettings('enabled')).resolves.toBe(true);
    await expect(getSettings('hooks')).resolves.toBe(defaultSettings.hooks);
  });

  it('should resolve with value when key provided', async () => {
    setSettings({ enabled: true });

    await expect(getSettings('enabled')).resolves.toBe(true);
  });

  it('should return whole storage.local if key not provided', async () => {
    setSettings({ enabled: true });

    await expect(getSettings()).resolves.toStrictEqual(
      Object.assign({}, defaultSettings, {
        enabled: true,
      })
    );
  });
});

describe('setSettings', () => {
  it('should call chrome.storage.local.set', () => {
    setSettings({ enabled: true });

    expect(chrome.storage.local.set.mock.calls).toHaveLength(1);
    expect(chrome.storage.local.set.mock.calls[0][0]).toStrictEqual({
      enabled: true,
    });

    expect(settingsStorage).toStrictEqual({ enabled: true });
  });
});
