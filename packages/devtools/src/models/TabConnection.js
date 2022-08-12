import { Actions, State } from '@/constants';
import { setIcon } from '@/utils';

const CACHE_SIZE = 2048;

class TabConnection {
  constructor(tabId) {
    // Init tab ports defaults
    this.ports = {
      devtools: null,
      contentScript: null,
      panel: null,
      popup: null,
      pipeCreated: false,
    };

    // Initial state
    this.tabId = tabId;
    this.cache = [];
    this.state = State.RELOAD;
    this.appData = null;
    this.domain = null;

    this._emptyListener = null;
    this._settingsListener = null;

    // Bind listeners
    this._aliveCallback = this._aliveCallback.bind(this);
    this._settingsCallback = this._settingsCallback.bind(this);
    this._cacheMessagesCallback = this._cacheMessagesCallback.bind(this);
    this._onDisconnect = this._onDisconnect.bind(this);
  }

  /**
   * Add port to this container. After port is added it runs through initialization process
   * and listener assignment based on it's type.
   *
   * @param {string} name Name of the port identifying it's location in this.ports object.
   * @param {chrome.runtime.Port} port Opened chrome runtime port.
   */
  addPort(name, port) {
    this.ports[name] = port;

    switch (name) {
      /**
       * Revive devtools on alive state so they can create devtools panel.
       */
      case 'devtools':
        this._reviveDevtools();
        break;

      /**
       * Assign cache listener for caching of messages incoming from content script and
       * alive listener, which takes care of initialization and sending app state to other
       * tool windows. There's no need to define onDisconnect callback for _cacheMessagesListener
       * since it is removed on tab close along with other opened ports anyway.
       */
      case 'contentScript':
        this.ports.contentScript.onMessage.addListener(this._aliveCallback);
        this.ports.contentScript.onMessage.addListener(
          this._cacheMessagesCallback
        );

        // Assign on disconnect listeners, in case contentScript is closed
        this.ports.contentScript.onDisconnect.addListener(() => {
          this._onDisconnect(
            'contentScript',
            this._aliveCallback,
            this._cacheMessagesCallback
          );
        });
        break;

      /**
       * Notify popup about current state on opening and assign on disconnect listener.
       * Also add listener on settings change to cache enabled value in background script.
       */
      case 'popup':
        this._notifyPopup();
        this.ports.popup.onMessage.addListener(this._settingsCallback);

        // Assign on disconnect listeners, in case popup is closed
        this.ports.popup.onDisconnect.addListener(() => {
          this._onDisconnect('popup', this._settingsCallback);
        });
        break;
    }

    /**
     * Create bi-directional communication bridge between content script
     * and panel if both are already connected.
     */
    if (
      this.ports.panel &&
      this.ports.contentScript &&
      !this.ports.pipeCreated
    ) {
      this._createPipe();
    }
  }

  /**
   * Send message to all opened ports at the same time. You can use this to let all opened
   * tool windows know about some action that happened. For example page reload.
   *
   * @param {Object} msg Message to sent to all opened ports.
   */
  notify(msg) {
    this.ports.panel &&
      this.ports.panel.onMessage.hasListeners() &&
      this.ports.panel.postMessage(msg);
    this.ports.devtools &&
      this.ports.devtools.onMessage.hasListeners() &&
      this.ports.devtools.postMessage(msg);
    this.ports.contentScript &&
      this.ports.contentScript.onMessage.hasListeners() &&
      this.ports.contentScript.postMessage(msg);
    this.ports.popup &&
      this.ports.popup.onMessage.hasListeners() &&
      this.ports.popup.postMessage(msg);
  }

  /**
   * Clear cache and notify all connected ports about reloading.
   *
   * @param {string} newDomain New domain extracted from url.
   */
  reload(newDomain) {
    if (newDomain) {
      this.domain = newDomain;
    }

    // Reset cache and notify ports about reloading
    this.cache = [];
    this.notify({ action: Actions.RELOADING });
  }

  /**
   * Calls disconnect() method on all opened ports.
   */
  disconnect() {
    this.ports.panel && this.ports.panel.disconnect();
    this.ports.devtools && this.ports.devtools.disconnect();
    this.ports.contentScript && this.ports.contentScript.disconnect();
    this.ports.popup && this.ports.popup.disconnect();
  }

  /**
   * Register listener, which is triggered after all ports that were opened
   * are now are closed. Be aware that this does not trigger BEFORE
   * any port is registered, which would result to call on init.
   *
   * @param {function} callback Callback function to execute when last opened port closes.
   */
  addOnEmptyListener(callback) {
    this._emptyListener = callback;
  }

  addOnSettingsListener(callback) {
    this._settingsListener = callback;
  }

  /**
   * Checks if all tool window ports are closed or not.
   *
   * @returns {boolean} True if none of the tool window ports are opened.
   */
  isEmpty() {
    return (
      this.ports.panel === null &&
      this.ports.devtools === null &&
      this.ports.contentScript === null &&
      this.ports.popup === null
    );
  }

  /**
   * Send current content of cache to devtools panel.
   */
  resendCache() {
    if (this.cache.length > 0) {
      this.cache.forEach(msg => {
        this.ports.panel.postMessage(msg);
      });
    }
  }

  /**
   * Notify popup about current state of the detection, so it can display
   * informative messages. In case of alive event we also display appData
   * extracted from contentScript.
   *
   * @private
   */
  _notifyPopup() {
    this.ports.popup.postMessage({
      action: Actions.POPUP,
      payload: { state: this.state, appData: this.appData },
    });
  }

  /**
   * Re-sends alive message to devtools, so they can create a devtool panel.
   * The devtools port is then closed, since after panel is created, it's
   * no longer needed for anything else.
   *
   * @private
   */
  _reviveDevtools() {
    if (this.state === State.ALIVE) {
      this.ports.devtools.postMessage({ action: Actions.ALIVE });
      this.ports.devtools.disconnect();
      this.ports.devtools = null;
    }
  }

  /**
   * Creates bi-directional bridge between contentScript and panel, so both can sent
   * messages directly to each other without any additional man in the middle.
   *
   * @private
   */
  _createPipe() {
    const resendContentScript = msg => {
      if (this.ports.panel !== null) {
        this.ports.panel.postMessage(msg);
      }
    };

    const resendPanel = msg => {
      this.ports.contentScript.postMessage(msg);
    };

    const shutdownContentScript = () => {
      this._onDisconnect('contentScript', resendContentScript);
      this.ports.pipeCreated = false;
    };

    const shutdownPanel = () => {
      this._onDisconnect('panel', resendPanel);
      this.ports.pipeCreated = false;
    };

    // Assign callback functions
    this.ports.contentScript.onMessage.addListener(resendContentScript);
    this.ports.panel.onMessage.addListener(resendPanel);

    this.ports.contentScript.onDisconnect.addListener(shutdownContentScript);
    this.ports.panel.onDisconnect.addListener(shutdownPanel);

    // Re-send all cached messages from content script to panel on initial creation of connection.
    this.resendCache();
    this.ports.pipeCreated = true;
  }

  /**
   * Disconnect utility function, which is usually defined on all onDisconnect callbacks.
   * It check is given port has any other listeners defined, if not it is closed. In case
   * all ports are closed it also calls all registered OnEmpty listeners.
   *
   * @param {string} name Name identifying port.
   * @param {function} listeners Additional array of listeners which are also removed.
   * @private
   */
  _onDisconnect(name, ...listeners) {
    if (!this.ports[name]) {
      return;
    }

    // Assign additional listeners to remove
    listeners.forEach(listener =>
      this.ports[name].onMessage.removeListener(listener)
    );

    // Check if given port has any other listeners, if not remove it completely
    if (!this.ports[name].onMessage.hasListeners()) {
      this.ports[name].disconnect();
      this.ports[name] = null;
    }

    // If all ports are empty, call onDestroy callbacks
    if (this.isEmpty()) {
      this.cache = [];

      if (this._emptyListener) {
        this._emptyListener(this.tabId);
      }
    }
  }

  _settingsCallback({ action, payload }) {
    if (action === Actions.SETTINGS && this._settingsListener) {
      this._settingsListener(payload.enabled);
    }
  }

  /**
   * Alive listener, which takes care of saving current ima detection states and
   * resending them to devtools and popup so they can react accordingly. After IMA
   * application is either detected or detection fails, this listener is removed.
   *
   * @param {string} action Name identifying message intention.
   * @param {Object} payload Data from received message.
   * @private
   */
  _aliveCallback({ action, payload }) {
    if (action === Actions.DETECTING) {
      this.state = State.DETECTING;
    } else if (action === Actions.DEAD) {
      this.state = State.DEAD;
    } else if (action === Actions.ALIVE) {
      this.state = State.ALIVE;
      this.appData = { ...payload };

      // Light up popup icon
      setIcon(State.ALIVE, this.tabId);

      // If devtools exist, let them know ima is alive
      if (this.ports.devtools) {
        this._reviveDevtools();
      }
    }

    // Notify popup about current state if it's opened
    if (this.ports.popup) {
      this._notifyPopup();
    }

    // Destroy this callback since it's no longer needed once app is alive or dead
    if (this.state === State.ALIVE || this.state === State.DEAD) {
      this.ports.contentScript.onMessage.removeListener(this._aliveCallback);
    }
  }

  /**
   * This listener caches all received messages from contentScript up to the
   * defined CACHE_SIZE. After that it works like queue, where the oldest message
   * is removed and new one is added, so the max CACHE_SIZE is maintained.
   *
   * @param {Object} msg Message to cache.
   * @private
   */
  _cacheMessagesCallback(msg) {
    if (this.cache.length >= CACHE_SIZE) {
      this.cache.shift();
    }

    this.cache.push(msg);
  }
}

export { TabConnection, CACHE_SIZE };
