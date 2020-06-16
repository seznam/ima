export default class DevManager {
  static get $dependencies() {
    return [
      '$PageManager',
      '$PageStateManager',
      '$Window',
      '$Dispatcher',
      '$EventBus',
      '$SessionMapStorage'
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
    this._window.bindEventListener(window, 'keydown', (e) => {
      if (e.altKey && e.keyCode === 83) {
        // Alt + S
        console.log('%cApp state:', 'color: blue'); //eslint-disable-line no-console
        console.log(this._stateManager.getState()); //eslint-disable-line no-console
      }

      if (e.altKey && e.keyCode === 67) {
        // Alt + C
        console.log('%cCache keys:', 'color:blue'); //eslint-disable-line no-console
        console.log(this._sessionMapStorage.keys()); //eslint-disable-line no-console
      }

      if (e.altKey && e.keyCode === 86) {
        // Alt + V
        console.log('%c$IMA.$Version:', 'color:blue'); //eslint-disable-line no-console
        console.log($IMA.$Version); //eslint-disable-line no-console
      }
    });
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
