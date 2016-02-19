import ns from 'ima/core/namespace';

ns.namespace('Core.Debug');

/**
 * DevTool
 *
 * @class DevTool
 * @namespace Core.Debug
 * @module Core
 * @submodule Core.Debug
 */
export default class DevTool {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.PageManager} pageManager
	 * @param {Core.Interface.PageStateManager} stateManager
	 * @param {Core.Interface.Window} window
	 * @param {Core.Interface.Dispatcher} dispatcher
	 * @param {Core.Interface.EventBus} eventBus
	 */
	constructor(pageManager, stateManager, window, dispatcher, eventBus) {

		/**
		 * App page manager.
		 *
		 * @private
		 * @property _pageManager
		 * @type {Core.Interface.PageManager}
		 */
		this._pageManager = pageManager;

		/**
		 * App state manager.
		 *
		 * @private
		 * @property _stateManager
		 * @type {Core.Interface.PageStateManager}
		 */
		this._stateManager = stateManager;

		/**
		 * $IMA wrapper for window.
		 *
		 * @private
		 * @property _window
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * $IMA dispatcher.
		 *
		 * @private
		 * @property _dispatcher
		 * @type {Core.Interface.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * $IMA eventBus
		 *
		 * @property _eventBus
		 * @type {Core.Interface.EventBus}
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

ns.Core.Debug.DevTool = DevTool;
