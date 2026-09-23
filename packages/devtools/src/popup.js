import './assets/less/popup.module.less';
import { Actions, State } from '@/constants';
import { getSettings, setSettings, getCurrentTab, toggleClass } from '@/utils';

/**
 * Shows alert message based on passed state attribute and hides the others.
 *
 * @param {string} name Current state of detection.
 */
function toggleStateElements(name = '') {
  document.getElementById('alert-alive').style.display =
    name === State.ALIVE ? 'block' : 'none';
  document.getElementById('info-list').style.display =
    name === State.ALIVE ? 'block' : 'none';
  document.getElementById('alert-dead').style.display =
    name === State.DEAD ? 'block' : 'none';
  document.getElementById('alert-detecting').style.display =
    name === State.DETECTING ? 'block' : 'none';
  document.getElementById('alert-reload').style.display =
    name === State.RELOAD ? 'block' : 'none';
}

/**
 * Listens on popup action events and updates popup content accordingly.
 *
 * @param {string} action One of action types.
 * @param {Object} payload Data passed in received message.
 */
function onMessageListener({ action, payload }) {
  if (action === Actions.POPUP) {
    const { state, appData } = payload;
    toggleStateElements(state);

    // If state is alive, set app data
    if (state === State.ALIVE) {
      document.getElementById('info-list-env').innerText = appData.env;
      document.getElementById('info-list-version').innerText = appData.version;
      document.getElementById('info-list-language').innerText =
        appData.language;
    }
  }
}

/**
 * Sends information to background script about current state of enable/disable button.
 *
 * @param {chrome.runtime.Port} port Opened port with background script.
 * @param {boolean} enabled True/false if switch is enabled/disabled.
 */
function sendEnabled(port, enabled) {
  port.postMessage({
    action: Actions.SETTINGS,
    payload: {
      enabled: enabled,
    },
  });
}

/**
 * Popup always opens communication with background script whenever extension is disabled or not.
 * This is needed so it can show user information about current detection state and send background
 * script state of enable switch.
 */
(async () => {
  const enableSwitch = document.querySelector('input[name=enable-switch]');
  const popupBody = document.querySelector('.popup__body');

  // Initialize connection with background script
  const curTab = await getCurrentTab();
  const port = chrome.runtime.connect({
    name: `popup:${curTab.id}`,
  });

  // Handle popup state changes
  port.onMessage.addListener(onMessageListener);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(onMessageListener);
  });

  // Attach on change listener to switcher
  enableSwitch.addEventListener('change', ({ target }) => {
    setSettings({ enabled: target.checked });
    toggleClass(popupBody, target.checked);
    sendEnabled(port, target.checked);
  });

  // Init default state
  getSettings('enabled').then(enabled => {
    enableSwitch.checked = enabled;

    sendEnabled(port, enabled);
    toggleClass(popupBody, enabled);
  });
})();
