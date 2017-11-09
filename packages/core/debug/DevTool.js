// @client-side

import Dispatcher from '../event/Dispatcher';
import EventBus from '../event/EventBus';
import PageManager from '../page/manager/PageManager';
import PageStateManager from '../page/state/PageStateManager';
import Window from '../window/Window';

/**
 * Developer tools, used mostly for navigating the page state history.
 */
export default class DevTool {
  static get $dependencies() {
    return [PageManager, PageStateManager, Window, Dispatcher, EventBus];
  }

  /**
	 * Initializes the developer tools.
	 *
	 * @param {PageManager} pageManager Application page manager.
	 * @param {PageStateManager} stateManager Application state manager.
	 * @param {Window} window IMA window wrapper.
	 * @param {Dispatcher} dispatcher IMA event dispatcher.
	 * @param {EventBus} eventBus IMA DOM event bus.
	 */
  constructor(pageManager, stateManager, window, dispatcher, eventBus) {
    /**
		 * Application page manager.
		 *
		 * @type {PageManager}
		 */
    this._pageManager = pageManager;

    /**
		 * Application state manager.
		 *
		 * @type {PageStateManager}
		 */
    this._stateManager = stateManager;

    /**
		 * IMA window wrapper.
		 *
		 * @type {Window}
		 */
    this._window = window;

    /**
		 * IMA event dispatcher.
		 *
		 * @type {Dispatcher}
		 */
    this._dispatcher = dispatcher;

    /**
		 * IMA DOM event bus.
		 *
		 * @type {EventBus}
		 */
    this._eventBus = eventBus;
  }

  /**
	 * Initializes the developer tools.
	 */
  init() {
    if ($Debug) {
      if (this._window.isClient()) {
        this._window.getWindow().$IMA.$DevTool = this;
      }

      let window = this._window.getWindow();
      this._window.bindEventListener(window, 'keydown', e => {
        if (e.altKey && e.keyCode === 83) {
          // Alt + S
          console.log(this._stateManager.getState()); //eslint-disable-line no-console
        }
      });
    }
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
