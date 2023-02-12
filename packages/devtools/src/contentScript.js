// Injection scripts

import {
  InjectType,
  injectCode,
  getSettings,
  createEntry,
  SENTINEL_TO_EXTENSION,
  SENTINEL_TO_WEB,
} from '@/utils';
import imaDevtoolsCode from '@ima/devtools-scripts/dist/index.string.js';

import { Actions } from '@/constants';
import { detectImaAppCode, runImaAppCode } from '@/inject';

let port = null;

/**
 * Window listener, which forwards messages from content scripts into extension.
 *
 * @param {Event} event Window 'message' event.
 */
function windowListener(event) {
  const { data, source } = event;

  if (source !== window || !data) {
    return;
  }

  if (data.sentinel === SENTINEL_TO_EXTENSION) {
    port.postMessage(createEntry(data));
  }
}

/**
 * Window listener, which waits for alive event and injects additional ima
 * devtool scripts. This listener should be removed once it injects script
 * as it no longer servers any purpose after that.
 *
 * @param {Object} data Received message object.
 */
function aliveWindowListener({ data }) {
  if (data.action === Actions.ALIVE) {
    // Remove alive listener
    window.removeEventListener('message', aliveWindowListener);

    (async () => {
      try {
        const { enabled, presets, selectedPresetId } = await getSettings();

        if (enabled) {
          // Inject devtools code if extension is enabled
          await injectCode(
            imaDevtoolsCode(presets[selectedPresetId].hooks),
            InjectType.SCRIPT,
            true
          );
        } else {
          // Remove listeners and close port
          window.removeEventListener('message', windowListener);
          port.onMessage.removeListener(onMessageListener);
          port.disconnect();
        }
      } catch (error) {
        console.error('Failed to insert IMA devtool codes', error);
      } finally {
        // Restart runners
        await injectCode(runImaAppCode(), InjectType.SCRIPT, true);
      }
    })();
  }
}

/**
 * Port message listener, which forwards messages from extension to content scripts.
 *
 * @param {Object} data Received message object.
 */
function onMessageListener(data) {
  if (data.sentinel === SENTINEL_TO_WEB) {
    window.postMessage(createEntry(data), '*');
  }
}

(async () => {
  /**
   * Open port to background script, which creates communication bridge
   * between panel and content script after both are initialized
   */
  port = chrome.runtime.connect({
    name: 'contentScript',
  });

  // Define listener on window and port, so scripts can communicate with extension and web page
  port.onMessage.addListener(onMessageListener);
  window.addEventListener('message', aliveWindowListener);
  window.addEventListener('message', windowListener);

  // Remove all defined listeners on port disconnect (e.g. devtools were closed)
  port.onDisconnect.addListener(() => {
    window.removeEventListener('message', windowListener);
    window.removeEventListener('message', aliveWindowListener);
    port.onMessage.removeListener(onMessageListener);
  });

  /**
   * Inject IMA detection script, this needs to run as soon as possible, as it
   * overrides some $IMA.Runner API.
   */
  try {
    await injectCode(detectImaAppCode());
  } catch (error) {
    console.error('Failed to insert IMA detection code', error);
  }
})();
