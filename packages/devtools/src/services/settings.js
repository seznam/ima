import defaultSettings from './defaultSettings';

/**
 * Saves object to chrome.storage.local. Existing settings with the same key
 * are overwritten.
 *
 * @param {object} settings key-value pair object.
 */
export function setSettings(settings) {
  chrome.storage.local.set(settings);
}

/**
 * Promisified call to chrome.storage.local.get for getting current settings.
 * Returned settings is merged with default settings json object.
 *
 * @param {?string} key Optional settings key, if null whole storage content is returned.
 * @returns {Promise<object>}
 */
export function getSettings(key = null) {
  return new Promise(resolve => {
    chrome.storage.local.get(key, result => {
      if (key) {
        resolve(result[key] !== undefined ? result[key] : defaultSettings[key]);
      } else {
        const { presets: defaultPresets, ...restSettings } = defaultSettings;
        const { presets: resultPresets, ...resultRest } = result;

        // Include default settings
        const settings = {
          ...restSettings,
          ...resultRest,
          presets: {
            ...resultPresets,
            ...defaultPresets
          }
        };

        resolve(settings);
      }
    });
  });
}
