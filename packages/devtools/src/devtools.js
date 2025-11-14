import { Actions } from '@/constants';
import { getCurrentTab } from '@/utils';

let port = null;

/**
 * Creates new IMA.js panel in chrome devtools after receiving alive event. After that
 * currently opened port is disconnected and listeners removed, since after creating panel
 * they don't really serve any purpose.
 *
 * @param {string} action One of action types.
 */
function createPanel({ action }) {
  if (action === Actions.ALIVE) {
    chrome.devtools.panels.create('IMA.js', '', '/html/panel.html');
    port.onMessage.removeListener(createPanel);
    port.disconnect();
  }
}

/**
 * Creates port connection with background script and waits for alive event so
 * it can initialize devtool panel.
 */
(async () => {
  const { tabId } = await getCurrentTab();
  port = chrome.runtime.connect({
    name: `devtools:${tabId}`,
  });

  // We listen on alive event in order to know, when we want to create devtools panel
  port.onMessage.addListener(createPanel);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(createPanel);
  });
})();
