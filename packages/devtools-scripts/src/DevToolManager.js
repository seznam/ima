export default class DevManager {
  static get $dependencies() {
    return [
      '$PageManager',
      '$PageStateManager',
      '$Window',
      '$Dispatcher',
      '$EventBus',
      '$SessionMapStorage',
    ];
  }

  constructor(
    pageManager,
    stateManager,
    window,
    dispatcher,
    eventBus,
    sessionMapStorage
  ) {
    this._pageManager = pageManager;
    this._stateManager = stateManager;
    this._window = window;
    this._dispatcher = dispatcher;
    this._eventBus = eventBus;
    this._sessionMapStorage = sessionMapStorage;
  }

  /**
   * Initializes the developer tools.
   */
  init() {
    let window = this._window.getWindow();
    this._window.bindEventListener(window, 'keydown', e => {
      // Alt + S
      if (e.altKey && e.keyCode === 83) {
        console.log('%cApp state:', 'color: blue'); //eslint-disable-line no-console
        console.log(this._stateManager.getState()); //eslint-disable-line no-console
      }

      // Alt + C
      if (e.altKey && e.keyCode === 67) {
        console.log('%cCache keys:', 'color:blue'); //eslint-disable-line no-console
        console.log(this._sessionMapStorage.keys()); //eslint-disable-line no-console
      }

      // Alt + V
      if (e.altKey && e.keyCode === 86) {
        console.log('%c$IMA.$Version:', 'color:blue'); //eslint-disable-line no-console
        console.log($IMA.$Version); //eslint-disable-line no-console
      }
    });

    // Print welcome message
    // eslint-disable-next-line no-console
    console.log(
      '%cIMA.js Devtools are initialized, you can use following keyboard shortcuts:%c' +
        '\\n%cAlt + S%c - App state' +
        '\\n%cAlt + C%c - Cache keys' +
        '\\n%cAlt + V%c - $IMA.$Version',
      'margin-top: 6px; background: #f03e3e; color: white; padding: 4px 8px; font-weight: bold;',
      'font-weight: bold;',
      'padding: 2px 4px; color: #c92a2a; background: #ffe3e3; border-radius: 3px; border: 1px solid #ffa8a8; margin: 10px 2px 2px 10px;',
      'font-weight: bold;',
      'padding: 2px 4px; color: #c92a2a; background: #ffe3e3; border-radius: 3px; border: 1px solid #ffa8a8; margin: 2px 2px 2px 10px;',
      'font-weight: bold;',
      'padding: 2px 4px; color: #c92a2a; background: #ffe3e3; border-radius: 3px; border: 1px solid #ffa8a8; margin: 2px 2px 2px 10px;',
      'font-weight: bold; margin-bottom: 10px;'
    );
  }

  /**
   * Sets the provided state to the state manager.
   *
   * @param {Object<string, *>} statePatch A patch of the current page state.
   */
  setState(statePatch) {
    this._stateManager.setState(statePatch);
  }

  /**
   * Returns the current page state.
   *
   * @return {Object<string, *>} The current page state.
   */
  getState() {
    return this._stateManager.getState();
  }

  /**
   * Clears the current application state.
   */
  clearAppSource() {
    this._pageManager.destroy();
    this._dispatcher.clear();
  }
}
