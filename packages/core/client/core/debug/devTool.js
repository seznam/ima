import ns from 'imajs/client/core/namespace';

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
	 * @param {Core.Event.Dispatcher} dispatcher
	 */
	constructor(pageManager, stateManager, window, dispatcher) {

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


			this._window.bindEventListener(this._window.getWindow(), 'keydown', (e) => {
				if (e.altKey && e.keyCode === 83) {
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
}

ns.Core.Debug.DevTool = DevTool;
