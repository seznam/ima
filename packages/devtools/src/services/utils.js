/**
 * Set current icon in chrome extension toolbar either globally or for specific tab id.
 *
 * @param {string} type Either 'alive' or 'dead'.
 * @param {?number} [tabId=null] Optional tabId, if defined icon is set only in this tab.
 */
export function setIcon(type, tabId = null) {
  if (type !== 'alive' && type !== 'dead') {
    return;
  }

  const details = {
    path: {
      16: `images/icon-${type}-16.png`,
      32: `images/icon-${type}-32.png`,
      48: `images/icon-${type}-48.png`,
      128: `images/icon-${type}-128.png`
    }
  };

  if (tabId) {
    details.tabId = tabId;
  }

  chrome.browserAction.setIcon(details);
}

/**
 * Toggle class on given element based on active value.
 *
 * @param {HTMLElement} element Element to toggle class on.
 * @param {boolean} active If true, class name is added, if false, class name is removed.
 * @param {string} className Class name to toggle.
 */
export function toggleClass(element, active, className = 'active') {
  if (active) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

/**
 * Get's current tab info based on available API in the current environment.
 * Either from inspectedWindow or by calling quuery on active tabs on current window.
 *
 * @returns {Promise<{tabId: number}>} Tab details object.
 */
export function getCurrentTab() {
  return new Promise(resolve => {
    if (chrome.devtools && chrome.devtools.inspectedWindow) {
      resolve(chrome.devtools.inspectedWindow);
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        resolve(tabs[0]);
      });
    }
  });
}

/**
 * Extracts domain from url, removes schema and all data that are after first backslash.
 *
 * @param {string} url Url to parse domain from.
 * @returns {null|string} Parsed domain stripped from schema.
 */
export function extractDomainFromUrl(url) {
  if (!url) {
    return null;
  }

  return url
    .replace('http://', '')
    .replace('https://', '')
    .replace('www.', '')
    .split(/[/?#]/)[0];
}
