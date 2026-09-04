import { getSettings, extractDomainFromUrl } from '@/utils';

import { TabConnection } from '@/models';

const PORT_NAMES = ['panel', 'contentScript', 'devtools', 'popup'];
const connections = {};

let enabled = false;

// Fetch enabled settings on initial load
(async () => {
  enabled = await getSettings('enabled');
})();

/**
 * Listener which is triggered, when all connections on current tab are closed.
 * In that case the tab connection record can be safely removed from connections object.
 *
 * @param {number} tabId Current tab id.
 */
function onEmptyListener(tabId) {
  delete connections[tabId];
}

/**
 * Listen on popup enable/disable toggle changes and cache settings value in background script.
 *
 * @param {boolean} isEnabled Enabled settings value.
 */
function onSettingsListener(isEnabled) {
  enabled = isEnabled;
}

/**
 * Listen on port connections, sort them and register them into connections container object.
 */
chrome.runtime.onConnect.addListener(port => {
  let name = '';
  let tabId = -1;

  /**
   * In case of panel, popup and devtools we send tab id in format '(devtools|panel|popup):ID`
   * since we can't get tab id from sender, we have to extract it from the name. If extension
   * is disabled, all incoming connections apart from the popup and devtools are automatically disconnected.
   * Popup has to be connected so background script can cache settings enabled value. Devtools
   * are connected so users don't have to close/open devtools panel if they enable extension
   * and reload the page.
   */
  PORT_NAMES.forEach(portType => {
    if (!enabled && (portType === 'panel' || portType === 'contentScript')) {
      return;
    }

    if (port.name.includes(portType)) {
      name = portType;
      tabId =
        portType === 'contentScript'
          ? port.sender.tab.id
          : +port.name.split(':')[1];
    }
  });

  // Init defaults for each new tab
  if (!connections[tabId]) {
    connections[tabId] = new TabConnection(tabId);
  }

  // Add new port if it was parsed correctly
  if (name && tabId !== -1) {
    connections[tabId].addPort(name, port);

    // Register listeners
    if (
      !connections[tabId].emptyListener &&
      !connections[tabId].settingsListener
    ) {
      connections[tabId].addOnEmptyListener(onEmptyListener);
      connections[tabId].addOnSettingsListener(onSettingsListener);
    }
  }
});

/**
 * Listen on page reload and re-init application on refresh.
 */
chrome.webNavigation.onCommitted.addListener(
  ({ transitionType, tabId, url }) => {
    if (transitionType === 'reload' && connections[tabId]) {
      connections[tabId].reload(extractDomainFromUrl(url));
    }
  }
);

/**
 * Listen on page reload and re-init application on domain change.
 */
chrome.webNavigation.onBeforeNavigate.addListener(({ tabId, url, frameId }) => {
  // Run only on main frame
  if (frameId === 0 && connections[tabId] && connections[tabId].domain) {
    const domain = extractDomainFromUrl(url);

    if (domain !== connections[tabId].domain) {
      connections[tabId].reload(domain);
    }
  }
});

/**
 * Disconnect and remove all opened connections on tab close.
 */
chrome.tabs.onRemoved.addListener(tabId => {
  if (connections[tabId]) {
    connections[tabId].disconnect();
    delete connections[tabId];
  }
});

/**
 * Save initial domain on tab loading. Changes are then tracked in chrome.webNavigation.onCommitted
 * and if the domain changes, event to reload devtools state is sent to panel.
 */
chrome.tabs.onUpdated.addListener(function (tabId, { status }) {
  if (
    status === 'loading' &&
    connections[tabId] &&
    !connections[tabId].domain
  ) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      connections[tabId].domain = extractDomainFromUrl(tabs[0].url);
    });
  }
});
