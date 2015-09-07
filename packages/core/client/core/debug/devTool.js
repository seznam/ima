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
	 */
	constructor(pageManager, stateManager) {

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
	}
}

ns.Core.Debug.DevTool = DevTool;
