// @client-side

import ns from 'ima/namespace';

ns.namespace('ima.debug');

/**
 * DevTool
 *
 * @class DevTool
 * @namespace ima.debug
 * @module ima
 * @submodule ima.debug
 */
export default class DevTool {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.page.manager.PageManager} pageManager
	 * @param {ima.page.state.PageStateManager} stateManager
	 * @param {ima.window.Window} window
	 * @param {ima.event.Dispatcher} dispatcher
	 * @param {ima.event.EventBus} eventBus
	 */
	constructor(pageManager, stateManager, window, dispatcher, eventBus) {

		/**
		 * App page manager.
		 *
		 * @private
		 * @property _pageManager
		 * @type {ima.page.manager.PageManager}
		 */
		this._pageManager = pageManager;

		/**
		 * App state manager.
		 *
		 * @private
		 * @property _stateManager
		 * @type {ima.page.state.PageStateManager}
		 */
		this._stateManager = stateManager;

		/**
		 * $IMA wrapper for window.
		 *
		 * @private
		 * @property _window
		 * @type {ima.window.Window}
		 */
		this._window = window;

		/**
		 * $IMA dispatcher.
		 *
		 * @private
		 * @property _dispatcher
		 * @type {ima.event.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * $IMA eventBus
		 *
		 * @property _eventBus
		 * @type {ima.event.EventBus}
		 */
		this._eventBus = eventBus;
	}

	/**
	 * Initialization Dev tool
	 *
	 * @method init
	 *
	 */
	init() {
		if ($Debug) {
			if (this._window.isClient()) {
				this._window.getWindow().$IMA.$DevTool = this;
			}

			let window = this._window.getWindow();
			this._window.bindEventListener(window, 'keydown', (e) => {
				if (e.altKey && e.keyCode === 83) { // Alt + S
					console.log(this._stateManager.getState());
				}
			});
		}
	}

	/**
	 * Set state to state manager.
	 *
	 * @method setState
	 * @param {Object<string, *>} statePatch
	 */
	setState(statePatch) {
		this._stateManager.setState(statePatch);
	}

	/**
	 * Returns current state of page.
	 *
	 * @method getState
	 * @return {Object<string, *>}
	 */
	getState() {
		return this._stateManager.getState();
	}

	/**
	 * Clear app source from page.
	 *
	 * @method clearAppSource
	 */
	clearAppSource() {
		this._pageManager.destroy();

		this._dispatcher.clear();
	}
}

ns.ima.debug.DevTool = DevTool;
