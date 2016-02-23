// @client-side

import ns from 'ima/namespace';

ns.namespace('Ima.Debug');

/**
 * DevTool
 *
 * @class DevTool
 * @namespace Ima.Debug
 * @module Ima
 * @submodule Ima.Debug
 */
export default class DevTool {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Ima.Page.Manager.PageManager} pageManager
	 * @param {Ima.Page.State.PageStateManager} stateManager
	 * @param {Ima.Window.Window} window
	 * @param {Ima.Event.Dispatcher} dispatcher
	 * @param {Ima.Event.EventBus} eventBus
	 */
	constructor(pageManager, stateManager, window, dispatcher, eventBus) {

		/**
		 * App page manager.
		 *
		 * @private
		 * @property _pageManager
		 * @type {Ima.Page.Manager.PageManager}
		 */
		this._pageManager = pageManager;

		/**
		 * App state manager.
		 *
		 * @private
		 * @property _stateManager
		 * @type {Ima.Page.State.PageStateManager}
		 */
		this._stateManager = stateManager;

		/**
		 * $IMA wrapper for window.
		 *
		 * @private
		 * @property _window
		 * @type {Ima.Window.Window}
		 */
		this._window = window;

		/**
		 * $IMA dispatcher.
		 *
		 * @private
		 * @property _dispatcher
		 * @type {Ima.Event.Dispatcher}
		 */
		this._dispatcher = dispatcher;

		/**
		 * $IMA eventBus
		 *
		 * @property _eventBus
		 * @type {Ima.Event.EventBus}
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

ns.Ima.Debug.DevTool = DevTool;
